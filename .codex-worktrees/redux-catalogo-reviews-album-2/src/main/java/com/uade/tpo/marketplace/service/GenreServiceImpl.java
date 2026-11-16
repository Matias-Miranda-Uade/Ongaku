package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.GenreRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateResourceException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.GenreRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final VinylRepository vinylRepository;

    public GenreServiceImpl(
            GenreRepository repository,
            VinylRepository vinylRepository) {

        this.genreRepository = repository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Genre> getGenres() {
        return new ArrayList<>(
            genreRepository.findAll()
        );
    }

    @Override
    public Genre getGenreById(int id) {
        return genreRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Genero", id));
    }

    @Override
    public Genre createGenre(GenreRequest request) {

        if (request == null) {
            throw new InvalidRequestException("Los datos del genero son obligatorios");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new InvalidFieldException("name", "no puede estar vacio");
        }

        if (!genreRepository.findByName(request.getName()).isEmpty()) {
            throw new DuplicateResourceException("Genero", request.getName());
        }

        Genre genre = new Genre();
        genre.setName(request.getName());

        return genreRepository.save(genre);
    }

    @Override
    public Genre updateGenre(int id, GenreRequest request) {

        Genre current = getGenreById(id);

        if (request == null) {
            throw new InvalidRequestException("Los datos del genero son obligatorios");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            current.setName(request.getName());
        }

        return genreRepository.save(current);
    }

    @Override
    public void deleteGenre(int id) {
        Genre genre = getGenreById(id);
        genreRepository.delete(genre);
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(int id) {
        return new ArrayList<>(vinylRepository.findPublicByGenreId((long) id));
    }
}