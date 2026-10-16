package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CoverStorageService {
    private final Path directory;

    public CoverStorageService(@Value("${app.covers.directory:uploads/covers}") String directory) {
        this.directory = Path.of(directory).toAbsolutePath().normalize();
    }

    public String save(MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getSize() > 5 * 1024 * 1024) {
            throw new InvalidFieldException("image", "elegí una imagen JPG o PNG de hasta 5 MB");
        }
        try (var source = file.getInputStream(); var input = ImageIO.createImageInputStream(source)) {
            var readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) throw invalidImage();
            var reader = readers.next();
            try {
                String format = reader.getFormatName().toLowerCase(java.util.Locale.ROOT);
                if (!Set.of("jpeg", "png").contains(format)) throw invalidImage();
                reader.setInput(input);
                int width = reader.getWidth(0), height = reader.getHeight(0);
                if (width < 1 || height < 1 || width > 4096 || height > 4096) {
                    throw new InvalidFieldException("image", "la imagen no puede superar 4096 × 4096 píxeles");
                }
                var image = reader.read(0);
                String filename = UUID.randomUUID() + (format.equals("png") ? ".png" : ".jpg");
                Files.createDirectories(directory);
                Path destination = directory.resolve(filename);
                try {
                    if (!ImageIO.write(image, format, destination.toFile())) throw invalidImage();
                } catch (IOException | RuntimeException error) {
                    Files.deleteIfExists(destination);
                    throw error;
                } finally { image.flush(); }
                return "/media/covers/" + filename;
            } catch (javax.imageio.IIOException error) {
                throw invalidImage();
            } finally { reader.dispose(); }
        }
    }

    private InvalidFieldException invalidImage() {
        return new InvalidFieldException("image", "el archivo no es una imagen JPG o PNG válida");
    }

    public Resource read(String filename) throws IOException {
        if (!filename.matches("[a-f0-9-]{36}\\.(jpg|png)")) throw new ResourceNotFoundException("Portada", filename);
        Path path = directory.resolve(filename).normalize();
        if (!path.startsWith(directory) || !Files.isRegularFile(path)) throw new ResourceNotFoundException("Portada", filename);
        return new UrlResource(path.toUri());
    }
}
