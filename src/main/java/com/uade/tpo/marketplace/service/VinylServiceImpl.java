package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.VinylRequest;
import com.uade.tpo.marketplace.entity.dto.mapper.VinylMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidPriceRangeException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.StockUpdateConflictException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.ArtistRepository;
import com.uade.tpo.marketplace.repository.AudioPreviewRepository;
import com.uade.tpo.marketplace.repository.CategoryRepository;
import com.uade.tpo.marketplace.repository.GenreRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class VinylServiceImpl implements VinylService {

    private final VinylRepository vinylRepository;
    private final CategoryRepository categoryRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final AudioPreviewRepository audioPreviewRepository;

    public VinylServiceImpl(VinylRepository vinylRepository,
            CategoryRepository categoryRepository,
            ArtistRepository artistRepository,
            GenreRepository genreRepository,
            AudioPreviewRepository audioPreviewRepository) {
        this.vinylRepository = vinylRepository;
        this.categoryRepository = categoryRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.audioPreviewRepository = audioPreviewRepository;
    }

    @Override
    public ArrayList<Vinyl> getPublicVinyls() {
        return new ArrayList<>(vinylRepository.findAll().stream()
                .filter(vinyl -> !Boolean.FALSE.equals(vinyl.getEnabled()))
                .toList());
    }

    @Override
    public ArrayList<Vinyl> getAllVinyls() {
        return new ArrayList<>(vinylRepository.findAll());
    }

    @Override
    public Vinyl getVinylById(int id) {
        return vinylRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", id));
    }

    @Override
    public Vinyl getPublicVinylById(int id) {
        Vinyl vinyl = getVinylById(id);
        if (Boolean.FALSE.equals(vinyl.getEnabled())) {
            throw new ResourceNotFoundException("Vinilo", id);
        }
        return vinyl;
    }

    @Override
    public Vinyl createVinyl(VinylRequest request) {
        if (request == null) {
            throw new InvalidRequestException("Los datos del vinilo son obligatorios");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new InvalidFieldException("name", "no puede estar vacio");
        }
        if (request.getPrice() < 0) {
            throw new InvalidFieldException("price", "no puede ser negativo");
        }
        if (request.getStock() < 0) {
            throw new InvalidFieldException("stock", "no puede ser negativo");
        }
        if (request.getYear() < 1900) {
            throw new InvalidFieldException("year", "debe ser mayor o igual a 1900");
        }

        Vinyl vinyl = VinylMapper.toEntity(request);
        vinyl.setEnabled(true);
        applyRelations(vinyl, request);

        return vinylRepository.save(vinyl);
    }

    @Override
    public Vinyl updateVinyl(int id, VinylRequest request) {
        Vinyl current = getVinylById(id);

        if (request == null) {
            throw new InvalidRequestException("Los datos del vinilo son obligatorios");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            current.setName(request.getName());
        }
        if (request.getDescription() != null) {
            current.setDescription(request.getDescription());
        }
        if (request.getPrice() >= 0) {
            current.setPrice(request.getPrice());
        }
        if (request.getStock() >= 0) {
            current.setStock(request.getStock());
        }
        if (request.getImage() != null) {
            current.setImage(request.getImage());
        }
        if (request.getYear() >= 1900) {
            current.setYear(request.getYear());
        }

        applyRelations(current, request);

        return vinylRepository.save(current);
    }

    private void applyRelations(Vinyl vinyl, VinylRequest request) {
        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.getCategoryId()))
                : null;
        Artist artist = request.getArtistId() != null
                ? artistRepository.findById(request.getArtistId())
                        .orElseThrow(() -> new ResourceNotFoundException("Artista", request.getArtistId()))
                : null;
        Genre genre = request.getGenreId() != null
                ? genreRepository.findById(request.getGenreId())
                        .orElseThrow(() -> new ResourceNotFoundException("Genero", request.getGenreId()))
                : null;
        AudioPreview audioPreview = request.getAudioPreviewId() != null
                ? audioPreviewRepository.findById(request.getAudioPreviewId())
                        .orElseThrow(() -> new ResourceNotFoundException("Audio preview", request.getAudioPreviewId()))
                : null;

        VinylMapper.applyRelations(vinyl, category, artist, genre, audioPreview);
    }

    @Override
    public Vinyl setEnabled(int id, boolean enabled) {
        Vinyl current = getVinylById(id);
        current.setEnabled(enabled);
        return vinylRepository.save(current);
    }

    @Override
    public void deleteVinyl(int id) {
        Vinyl vinyl = getVinylById(id);
        vinylRepository.delete(vinyl);
    }

    @Override
    public ArrayList<Vinyl> searchPublicVinyls(String term) {
        if (term == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(vinylRepository.searchPublic(term));
    }

    @Override
    public ArrayList<Vinyl> searchAllVinyls(String term) {
        if (term == null) return new ArrayList<>();
        return new ArrayList<>(vinylRepository.searchAll(term));
    }

    @Override
    public ArrayList<Vinyl> filterPublicVinyls(Integer categoryId, Double minPrice, Double maxPrice,
            Integer artistId, Integer genreId) {
        validatePriceRange(minPrice, maxPrice);
        return new ArrayList<>(vinylRepository.filterPublic(
                categoryId, minPrice, maxPrice, artistId, genreId));
    }

    @Override
    public ArrayList<Vinyl> filterVinyls(
            Integer categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Integer artistId,
            Integer genreId,
            Boolean enabled) {
        validatePriceRange(minPrice, maxPrice);
        return new ArrayList<>(vinylRepository.filterAll(
            categoryId, minPrice, maxPrice, inStock, artistId, genreId, enabled));
    }

    private void validatePriceRange(Double minPrice, Double maxPrice) {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new InvalidPriceRangeException();
        }
    }

    @Override
    public Vinyl updateStock(int vinylId, int quantityDelta) {

        getVinylById(vinylId);
        int updatedRows = vinylRepository.updateStock((long) vinylId, quantityDelta);
        if (updatedRows == 0) {

            throw new StockUpdateConflictException();
        }
        return vinylRepository.findById((long) vinylId)
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", vinylId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByArtist(int id) {
        return new ArrayList<>(vinylRepository.findAllByArtistId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(int id) {
        return new ArrayList<>(vinylRepository.findAllByGenreId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByCategory(int id) {
        return new ArrayList<>(vinylRepository.findAllByCategoryId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getPublicVinylsByArtist(int id) {
        return new ArrayList<>(vinylRepository.findPublicByArtistId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getPublicVinylsByGenre(int id) {
        return new ArrayList<>(vinylRepository.findPublicByGenreId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getPublicVinylsByCategory(int id) {
        return new ArrayList<>(vinylRepository.findPublicByCategoryId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getAllVinylsByArtist(int id) {
        return new ArrayList<>(vinylRepository.findAllByArtistId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getAllVinylsByGenre(int id) {
        return new ArrayList<>(vinylRepository.findAllByGenreId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getAllVinylsByCategory(int id) {
        return new ArrayList<>(vinylRepository.findAllByCategoryId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByYear(int year) {
        return available(vinylRepository.findByYear(year));
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc() {
        return available(vinylRepository.findAllOrderByPriceAsc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc() {
        return available(vinylRepository.findAllOrderByPriceDesc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearAsc() {
        return available(vinylRepository.findAllOrderByYearAsc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearDesc() {
        return available(vinylRepository.findAllOrderByYearDesc());
    }

    private ArrayList<Vinyl> available(List<Vinyl> vinyls) {
        return new ArrayList<>(vinyls.stream()
                .filter(vinyl -> !Boolean.FALSE.equals(vinyl.getEnabled()))
                .toList());
    }
}
