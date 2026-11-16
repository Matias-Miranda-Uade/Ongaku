import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.sql.*;
import java.util.*;

/** Importación manual e idempotente; nunca se ejecuta al iniciar la aplicación. */
class ImportCatalog {
    static long lookup(Connection c, String table, String column, String value) throws SQLException {
        try (var s = c.prepareStatement("select id from " + table + " where " + column + "=? order by id limit 1")) {
            s.setString(1, value);
            try (var r = s.executeQuery()) { if (r.next()) return r.getLong(1); }
        }
        try (var s = c.prepareStatement("insert into " + table + " (" + column + ") values (?)", Statement.RETURN_GENERATED_KEYS)) {
            s.setString(1, value); s.executeUpdate();
            try (var r = s.getGeneratedKeys()) { r.next(); return r.getLong(1); }
        }
    }

    static String literal(Object value) {
        if (value == null) return "NULL";
        if (value instanceof byte[] bytes) return "X'" + HexFormat.of().formatHex(bytes) + "'";
        return "'" + value.toString().replace("\\", "\\\\").replace("'", "''") + "'";
    }

    public static void main(String[] args) throws Exception {
        var settings = new Properties();
        try (var reader = Files.newBufferedReader(Path.of("src/main/resources/application.properties"))) { settings.load(reader); }
        try (var c = DriverManager.getConnection(settings.getProperty("spring.datasource.url"), settings.getProperty("spring.datasource.username"), settings.getProperty("spring.datasource.password"))) {
            Files.createDirectories(Path.of("backups"));
            var backup = Path.of("backups", "before-real-covers-" + System.currentTimeMillis() + ".sql");
            try (var writer = Files.newBufferedWriter(backup)) {
                writer.write("-- Respaldo previo a la importación. Datos originales; restauración manual.\n");
                for (String table : List.of("artist", "genre", "category", "vinyl")) {
                    try (var s = c.createStatement(); var r = s.executeQuery("select * from " + table)) {
                        var meta = r.getMetaData();
                        var columns = new ArrayList<String>();
                        for (int i=1; i<=meta.getColumnCount(); i++) columns.add("`" + meta.getColumnName(i) + "`");
                        while (r.next()) {
                            var values = new ArrayList<String>();
                            for (int i=1; i<=meta.getColumnCount(); i++) values.add(literal(r.getObject(i)));
                            writer.write("INSERT INTO `" + table + "` (" + String.join(",", columns) + ") VALUES (" + String.join(",", values) + ");\n");
                        }
                    }
                }
            }
            // Permite importar también antes de reiniciar el backend actualizado.
            try (var s = c.createStatement(); var r = s.executeQuery("select count(*) from information_schema.columns where table_schema=database() and table_name='vinyl' and column_name='album_url'")) {
                r.next();
                if (r.getInt(1) == 0) {
                    try (var ddl = c.createStatement()) { ddl.executeUpdate("alter table vinyl add column album_url varchar(2048) null"); }
                }
            }
            c.setAutoCommit(false);
            int created = 0, updated = 0;
            try {
                long category = lookup(c, "category", "description", "Álbumes de estudio");
                for (String row : Files.readAllLines(Path.of(args[0]))) {
                    String[] a = Arrays.stream(row.split("\t")).map(v -> new String(Base64.getDecoder().decode(v), StandardCharsets.UTF_8)).toArray(String[]::new);
                    long artist = lookup(c, "artist", "name", a[1]);
                    long genre = lookup(c, "genre", "name", a[2]);
                    Long id = null;
                    try (var s = c.prepareStatement("select id from vinyl where name=? and artist_id=? order by id limit 1")) {
                        s.setString(1, a[0]); s.setLong(2, artist);
                        try (var r = s.executeQuery()) { if (r.next()) id = r.getLong(1); }
                    }
                    if (id != null) {
                        try (var s = c.prepareStatement("update vinyl set image=?,description=?,year=?,genre_id=?,category_id=?,album_url=? where id=?")) {
                            s.setString(1,a[8]); s.setString(2,a[7]); s.setInt(3,Integer.parseInt(a[3])); s.setLong(4,genre); s.setLong(5,category); s.setString(6,a[9]); s.setLong(7,id); s.executeUpdate(); updated++;
                        }
                    } else {
                        try (var s = c.prepareStatement("insert into vinyl (name,description,price,discount_percentage,stock,enabled,image,year,artist_id,genre_id,category_id,album_url) values (?,?,?,?,?,true,?,?,?,?,?,?)")) {
                            s.setString(1,a[0]); s.setString(2,a[7]); s.setInt(3,Integer.parseInt(a[4])); s.setInt(4,Integer.parseInt(a[5])); s.setInt(5,Integer.parseInt(a[6]));
                            s.setString(6,a[8]); s.setInt(7,Integer.parseInt(a[3])); s.setLong(8,artist); s.setLong(9,genre); s.setLong(10,category); s.setString(11,a[9]); s.executeUpdate(); created++;
                        }
                    }
                }
                c.commit();
            } catch (Exception e) { c.rollback(); throw e; }
            System.out.println("Catálogo cargado: " + created + " nuevos, " + updated + " actualizados. Respaldo: " + backup);
        }
    }
}
