package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.service.GenreService;

@RestController
@RequestMapping("genres")
public class GenreController {
    @GetMapping
    public ArrayList<Genre> getGenres(){
        GenreService genreService = new GenreService();
        return genreService.getGenres();
    }
    @GetMapping("/{genreId}")
    public Genre getGenreById(@PathVariable int genreId){
        GenreService genreService = new GenreService();
        return genreService.getGenreById(genreId);
    }
    @PostMapping("/{genre}")
    public Genre createGenre ( @RequestBody Genre genre){
        GenreService genreService = new GenreService();
        return genreService.createGenre(genre);
    }
    @PatchMapping("/{genreId}")
    public Genre updateGenre (@PathVariable int genreId, @RequestBody Genre genre){
        GenreService genreService = new GenreService();
        return genreService.updateGenre(genreId, genre);
    }

    @DeleteMapping("/{genreId}")
    public void deleteGenre (@PathVariable int genreId){
        GenreService genreService = new GenreService();
        genreService.deleteGenre(genreId);
    }
    @GetMapping("/{genreId}/vinyls")
    public ArrayList<Vinyl> getVinylsByGenre(@PathVariable int genreId){
        GenreService genreService = new GenreService();
        return genreService.getVinylsByGenre(genreId);
    }

}
