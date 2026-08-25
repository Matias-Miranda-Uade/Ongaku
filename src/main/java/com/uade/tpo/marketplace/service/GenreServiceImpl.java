package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.GenreRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final VinylRepository vinylRepository;

    public GenreServiceImpl(GenreRepository genreRepository, VinylRepository vinylRepository) {
        this.genreRepository = genreRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Genre> getGenres() {
        return new ArrayList<>(genreRepository.findAll());
    }

    @Override
    public Genre getGenreById(int id) {
        return genreRepository.findById((long) id).orElse(null);
    }

    @Override
    public Genre createGenre(Genre genre) {
        if (genre == null || genre.getName() == null || genre.getName().isBlank())
            throw new IllegalArgumentException("El genero debe tener nombre");
        if (!genreRepository.findByNameIgnoreCase(genre.getName()).isEmpty())
            throw new IllegalArgumentException("El genero ya existe");

        Genre newGenre = new Genre();
        newGenre.setName(genre.getName());
        return genreRepository.save(newGenre);
    }

    @Override
    public Genre updateGenre(int id, Genre genre) {
        Genre current = getGenreById(id);
        if (current == null || genre == null)
            return null;
        if (genre.getName() != null && !genre.getName().isBlank())
            current.setName(genre.getName());
        return genreRepository.save(current);
    }

    @Override
    public void deleteGenre(int id) {
        genreRepository.deleteById((long) id);
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(int genreId) {
        return new ArrayList<>(vinylRepository.findByGenre_Id((long) genreId));
    }
}