package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Artist;
import org.springframework.stereotype.Repository;

@Repository
public class ArtistRepository {
    public static ArrayList<Artist> artists = new ArrayList<>(
        Arrays.asList(
            Artist.builder().name("The Beatles").description("Banda británica formada en Liverpool en 1960, compuesta por John Lennon, Paul McCartney, Ringo Starr y George Harrison. Banda de rock con hits como 'Hey Jude' o 'Come Together'.").image("https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_Fabs.JPG/800px-The_Fabs.JPG").id(1).build(),
            Artist.builder().name("Patricio Rey y sus Redonditos de Ricota").description("Banda de rock argentino formada en 1976 por el cantante Carlos 'Indio' Solari y el guitarrista Eduardo 'Skay' Beilinson. Conocidos por su estilo único y letras crípticas, se convirtieron en un fenómeno cultural en Argentina. Conocidos por hits como 'Jijiji' o 'Salando las heridas'.").image("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Patricio_Rey_y_sus_Redonditos_de_Ricota.jpg/800px-Patricio_Rey_y_sus_Redonditos_de_Ricota.jpg").id(2).build(),
            Artist.builder().name("Soda Stereo").description("Banda de rock argentino formada en 1982 por Gustavo Cerati, Zeta Bosio y Charly Alberti. Pioneros del rock en español, con éxitos como 'De Música Ligera' y 'Persiana Americana'.").image("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Soda_Stereo_1986.jpg/800px-Soda_Stereo_1986.jpg").id(3).build()
        )
    );

    // Calcula el próximo id libre buscando el máximo actual y sumando 1
    private int nextId() {
        return ArtistRepository.artists.stream().mapToInt(Artist::getId).max().orElse(0) + 1;
    }

    public ArrayList<Artist> getArtists(){
        return ArtistRepository.artists;
    }

    public Artist getArtistById(int id){
        for (Artist a : ArtistRepository.artists) {
            if (a.getId() == id) {
                return a;
            }
        }
        return null;
    }

    public Artist createArtist(Artist artist){
        artist.setId(nextId());
        ArtistRepository.artists.add(artist);
        return artist;
    }

    public Artist updateArtist (int id, Artist uArtist){
        Artist existing = getArtistById(id);
        if (existing == null) {
            return null;
        }
        existing.setName(uArtist.getName());
        existing.setDescription(uArtist.getDescription());
        existing.setImage(uArtist.getImage());
        return existing;
    }

    public void deleteArtist(int id){
        ArtistRepository.artists.removeIf(a -> a.getId() == id);
    }

}