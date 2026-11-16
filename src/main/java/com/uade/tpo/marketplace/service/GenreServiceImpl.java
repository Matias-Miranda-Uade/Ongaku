package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // Antes de borrar se quita el genero de los vinilos que lo usan, como principal o adicional,
    // para no violar las claves foraneas. Si era el principal, toma su lugar el primer adicional.
    @Override
    @Transactional
    public void deleteGenre(int id) {
        Genre genre = getGenreById(id);
        List<Vinyl> vinyls = vinylRepository.findAllByGenreId((long) id);
        for (Vinyl vinyl : vinyls) {
            if (vinyl.getAdditionalGenres() != null) {
                vinyl.getAdditionalGenres().removeIf(item -> item.getId().equals(genre.getId()));
            }
            if (vinyl.getGenre() != null && vinyl.getGenre().getId().equals(genre.getId())) {
                List<Genre> remaining = vinyl.getAdditionalGenres();
                vinyl.setGenre(remaining == null || remaining.isEmpty() ? null : remaining.remove(0));
            }
        }
        if (!vinyls.isEmpty()) {
            vinylRepository.saveAll(vinyls);
            vinylRepository.flush();
        }
        genreRepository.delete(genre);
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(int id) {
        return new ArrayList<>(vinylRepository.findPublicByGenreId((long) id));
    }
}