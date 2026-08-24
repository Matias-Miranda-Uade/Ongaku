package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import java.util.ArrayList;

public interface GenreService {
    ArrayList<Genre> getGenres();
    Genre getGenreById(int id);
    Genre createGenre(Genre genre);
    Genre updateGenre(int id, Genre genre);
    void deleteGenre(int id);
    ArrayList<Vinyl> getVinylsByGenre(int genreId);
}
