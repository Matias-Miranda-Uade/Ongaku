package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.repository.ArtistRepository;

public class ArtistService {
    private final ArtistRepository artistRepository = new ArtistRepository();

    public ArrayList<Artist> getArtists() {
        return artistRepository.getArtists();
    }

    public Artist getArtistById(int artistId) {
        return artistRepository.getArtistById(artistId);
    }

    public Artist createArtist(Artist artist) {
        return artistRepository.createArtist(artist);
    }

    public Artist updateArtist(int artistId, Artist uArtist) {
        return artistRepository.updateArtist(artistId, uArtist);
    }

    public void deleteArtist(int artistId) {
        artistRepository.deleteArtist(artistId);
    }
}