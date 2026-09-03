package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class VinylServiceImpl implements VinylService {

    private final VinylRepository vinylRepository;

    public VinylServiceImpl(VinylRepository vinylRepository) {
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Vinyl> getPublicVinyls() {
        return new ArrayList<>(vinylRepository.findAll().stream()
                .filter(vinyl -> !Boolean.FALSE.equals(vinyl.getEnabled()) && vinyl.getStock() > 0)
                .toList());
    }

    @Override
    public ArrayList<Vinyl> getAllVinyls() {
        return new ArrayList<>(vinylRepository.findAll());
    }

    @Override
    public Vinyl getVinylById(int id) {
        return vinylRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Vinyl getPublicVinylById(int id) {
        Vinyl vinyl = getVinylById(id);
        return vinyl != null && !Boolean.FALSE.equals(vinyl.getEnabled()) && vinyl.getStock() > 0
                ? vinyl : null;
    }

    @Override
    public Vinyl createVinyl(Vinyl vinyl) {

        if (vinyl == null ||
            vinyl.getName() == null ||
            vinyl.getName().isBlank() ||
            vinyl.getPrice() < 0 ||
            vinyl.getStock() < 0 ||
            vinyl.getYear() < 1900) {

            throw new IllegalArgumentException(
                "Datos de vinilo invalidos"
            );
        }

        vinyl.setId(null);
        if (vinyl.getEnabled() == null) {
            vinyl.setEnabled(true);
        }

        return vinylRepository.save(vinyl);
    }

    @Override
    public Vinyl updateVinyl(
            int id,
            Vinyl vinyl) {

        Vinyl current = getVinylById(id);

        if (current == null ||
            vinyl == null) {

            return null;
        }

        if (vinyl.getName() != null &&
            !vinyl.getName().isBlank()) {

            current.setName(vinyl.getName());
        }

        if (vinyl.getDescription() != null) {
            current.setDescription(
                vinyl.getDescription()
            );
        }

        if (vinyl.getPrice() >= 0) {
            current.setPrice(
                vinyl.getPrice()
            );
        }

        if (vinyl.getStock() >= 0) {
            current.setStock(
                vinyl.getStock()
            );
        }

        if (vinyl.getEnabled() != null) {
            current.setEnabled(vinyl.getEnabled());
        }

        if (vinyl.getImage() != null) {
            current.setImage(
                vinyl.getImage()
            );
        }

        if (vinyl.getYear() >= 1900) {
            current.setYear(
                vinyl.getYear()
            );
        }

        if (vinyl.getCategory() != null) {
            current.setCategory(
                vinyl.getCategory()
            );
        }

        if (vinyl.getArtist() != null) {
            current.setArtist(
                vinyl.getArtist()
            );
        }

        if (vinyl.getGenre() != null) {
            current.setGenre(
                vinyl.getGenre()
            );
        }

        if (vinyl.getAudioPreview() != null) {
            current.setAudioPreview(vinyl.getAudioPreview());
        }

        return vinylRepository.save(current);
    }

    @Override
    public Vinyl setEnabled(int id, boolean enabled) {
        Vinyl current = getVinylById(id);
        if (current == null) {
            return null;
        }
        current.setEnabled(enabled);
        return vinylRepository.save(current);
    }

    @Override
    public void deleteVinyl(int id) {
        vinylRepository.deleteById((long) id);
    }

    @Override
    public ArrayList<Vinyl> searchPublicVinyls(
            String term) {
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
            Integer genreId) {
        validatePriceRange(minPrice, maxPrice);
        return new ArrayList<>(vinylRepository.filterAll(
            categoryId, minPrice, maxPrice, inStock, artistId, genreId));
    }

    private void validatePriceRange(Double minPrice, Double maxPrice) {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException("El precio minimo no puede superar al maximo");
        }
    }

    @Override
    public Vinyl updateStock(int vinylId, int quantityDelta) {
        int updatedRows = vinylRepository.updateStock((long) vinylId, quantityDelta);
        if (updatedRows == 0) {
            return null;
        }
        return vinylRepository.findById((long) vinylId).orElse(null);
    }

    @Override
    public ArrayList<Vinyl> getVinylsByArtist(
            int id) {
        return new ArrayList<>(vinylRepository.findAllByArtistId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(
            int id) {

        return new ArrayList<>(vinylRepository.findAllByGenreId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByCategory(
            int id) {

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
    public ArrayList<Vinyl> getVinylsByYear(
            int year) {
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
                .filter(vinyl -> !Boolean.FALSE.equals(vinyl.getEnabled()) && vinyl.getStock() > 0)
                .toList());
    }
}
