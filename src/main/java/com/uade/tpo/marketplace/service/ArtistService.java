package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Artist;
import java.util.ArrayList;

public interface ArtistService {
    ArrayList<Artist> getArtists();
    Artist getArtistById(int artistId);
    Artist createArtist(Artist artist);
    Artist updateArtist(int artistId, Artist artist);
    void deleteArtist(int artistId);
}