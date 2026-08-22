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
    public GenreServiceImpl(GenreRepository repository, VinylRepository vinylRepository) { this.genreRepository = repository; this.vinylRepository = vinylRepository; }
    public ArrayList<Genre> getGenres() { return genreRepository.getGenres(); }
    public Genre getGenreById(int id) { return genreRepository.getGenres().stream().filter(g -> g.getId() == id).findFirst().orElse(null); }
    public Genre createGenre(Genre genre) {
        if (genre == null || genre.getName() == null || genre.getName().isBlank()) throw new IllegalArgumentException("El genero debe tener nombre");
        if (genreRepository.getGenres().stream().anyMatch(g -> g.getName().equalsIgnoreCase(genre.getName()))) throw new IllegalArgumentException("El genero ya existe");
        genre.setId(genreRepository.getGenres().stream().mapToLong(Genre::getId).max().orElse(0) + 1);
        genreRepository.getGenres().add(genre);
        return genre;
    }
    public Genre updateGenre(int id, Genre genre) { Genre current = getGenreById(id); if (current == null || genre == null) return null; if (genre.getName() != null && !genre.getName().isBlank()) current.setName(genre.getName()); return current; }
    public void deleteGenre(int id) { genreRepository.getGenres().removeIf(g -> g.getId() == id); }
    public ArrayList<Vinyl> getVinylsByGenre(int id) { ArrayList<Vinyl> result = new ArrayList<>(); for (Vinyl vinyl : vinylRepository.getVinyls()) if (vinyl.getGenre() != null && vinyl.getGenre().getId() == id) result.add(vinyl); return result; }
}