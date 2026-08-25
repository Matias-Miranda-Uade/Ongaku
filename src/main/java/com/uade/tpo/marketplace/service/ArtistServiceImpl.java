package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.repository.ArtistRepository;

@Service
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistServiceImpl(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @Override
    public ArrayList<Artist> getArtists() {
        return new ArrayList<>(artistRepository.findAll());
    }

    @Override
    public Artist getArtistById(int artistId) {
        return artistRepository.findById((long) artistId).orElse(null);
    }

    @Override
    public Artist createArtist(Artist artist) {
        if (artist == null || artist.getName() == null || artist.getName().isBlank())
            throw new IllegalArgumentException("El artista debe tener nombre");
        if (!artistRepository.findByNameIgnoreCase(artist.getName()).isEmpty())
            throw new IllegalArgumentException("El artista ya existe");

        Artist newArtist = new Artist();
        newArtist.setName(artist.getName());
        newArtist.setDescription(artist.getDescription());
        newArtist.setImage(artist.getImage());
        return artistRepository.save(newArtist);
    }

    @Override
    public Artist updateArtist(int artistId, Artist artist) {
        Artist current = getArtistById(artistId);
        if (current == null || artist == null)
            return null;
        if (artist.getName() != null && !artist.getName().isBlank())
            current.setName(artist.getName());
        if (artist.getDescription() != null)
            current.setDescription(artist.getDescription());
        if (artist.getImage() != null)
            current.setImage(artist.getImage());
        return artistRepository.save(current);
    }

    @Override
    public void deleteArtist(int artistId) {
        artistRepository.deleteById((long) artistId);
    }
}