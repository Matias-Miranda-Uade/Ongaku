package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.repository.ArtistRepository;

@Service
public class ArtistServiceImpl implements ArtistService {
    private final ArtistRepository artistRepository;

    public ArtistServiceImpl(ArtistRepository artistRepository) { this.artistRepository = artistRepository; }
    public ArrayList<Artist> getArtists() { return artistRepository.getArtists(); }
    public Artist getArtistById(int artistId) {
        return artistRepository.getArtists().stream().filter(a -> a.getId() == artistId).findFirst().orElse(null);
    }
    public Artist createArtist(Artist artist) {
        if (artist == null || artist.getName() == null || artist.getName().isBlank()) throw new IllegalArgumentException("El artista debe tener nombre");
        if (artistRepository.getArtists().stream().anyMatch(a -> a.getName().equalsIgnoreCase(artist.getName()))) throw new IllegalArgumentException("El artista ya existe");
        artist.setId(nextId());
        artistRepository.getArtists().add(artist);
        return artist;
    }
    public Artist updateArtist(int artistId, Artist artist) {
        Artist current = getArtistById(artistId);
        if (current == null || artist == null) return null;
        if (artist.getName() != null && !artist.getName().isBlank()) current.setName(artist.getName());
        if (artist.getDescription() != null) current.setDescription(artist.getDescription());
        if (artist.getImage() != null) current.setImage(artist.getImage());
        return current;
    }
    public void deleteArtist(int artistId) { artistRepository.getArtists().removeIf(a -> a.getId() == artistId); }

    private long nextId() { return artistRepository.getArtists().stream().mapToLong(Artist::getId).max().orElse(0) + 1; }
}