package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.GenreRepository;

public class GenreService {
    public ArrayList<Genre> getGenres(){
        GenreRepository genreRepository = new GenreRepository();
        return genreRepository.getGenres();
    }
    public Genre getGenreById(int id){
        GenreRepository genreRepository = new GenreRepository();
        return genreRepository.getGenreById(id);
    }
    public Genre createGenre(Genre genre){
        GenreRepository genreRepository = new GenreRepository();
        return genreRepository.createGenre(genre);
    }
    public Genre updateGenre(int id, Genre genre){
        GenreRepository genreRepository = new GenreRepository();
        return genreRepository.updateGenre(id, genre);
    }
    public void deleteGenre(int id){
        GenreRepository genreRepository = new GenreRepository();
        genreRepository.deleteGenre(id);
    }
    public ArrayList<Vinyl> getVinylsByGenre(int genreId){
        GenreRepository genreRepository = new GenreRepository();
        return genreRepository.getVinylsByGenre(genreId);
    }
}
