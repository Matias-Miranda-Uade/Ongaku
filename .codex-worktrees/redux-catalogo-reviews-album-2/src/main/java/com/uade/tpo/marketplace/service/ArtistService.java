package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.dto.ArtistRequest;
import java.util.ArrayList;

public interface ArtistService {
    ArrayList<Artist> getArtists();
    Artist getArtistById(int artistId);
    Artist createArtist(ArtistRequest request);
    Artist updateArtist(int artistId, ArtistRequest request);
    void deleteArtist(int artistId);
}