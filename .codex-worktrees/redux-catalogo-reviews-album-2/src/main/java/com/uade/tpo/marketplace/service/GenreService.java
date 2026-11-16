package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.GenreRequest;
import java.util.ArrayList;

public interface GenreService {
    ArrayList<Genre> getGenres();
    Genre getGenreById(int id);
    Genre createGenre(GenreRequest request);
    Genre updateGenre(int id, GenreRequest request);
    void deleteGenre(int id);
    ArrayList<Vinyl> getVinylsByGenre(int genreId);
}