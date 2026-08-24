package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import org.springframework.stereotype.Repository;

@Repository
public class GenreRepository {
    public ArrayList<Genre> genres = new ArrayList<>(
        Arrays.asList(
           Genre.builder().id(1).name("Rock").build(),
              Genre.builder().id(2).name("Pop").build(),
              Genre.builder().id(3).name("Hip-Hop").build() 
        )
    );

    public ArrayList<Genre> getGenres(){
        return this.genres;
    }

    public Genre getGenreById(int genreId){
        return null;
    }
    
    public Genre createGenre (Genre genre){
        return null;
    }

    public Genre updateGenre (int id, Genre genre){
        return null;
    }
    public void deleteGenre(int id){
    }
    public ArrayList<Vinyl> getVinylsByGenre(int genreId){
        return null;
    }
}
