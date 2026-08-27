package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

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
    public ArrayList<Vinyl> getVinyls() {
        return new ArrayList<>(
            vinylRepository.findAll()
        );
    }

    @Override
    public Vinyl getVinylById(int id) {
        return vinylRepository
                .findById((long) id)
                .orElse(null);
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
    public void deleteVinyl(int id) {
        vinylRepository.deleteById((long) id);
    }

    @Override
    public ArrayList<Vinyl> searchVinyls(
            String term) {
        if (term == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(vinylRepository.search(term));
    }

    @Override
    public ArrayList<Vinyl> filterVinyls(
            Integer categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Integer artistId) {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException(
                    "El precio minimo no puede superar al maximo");
        }
        return new ArrayList<>(vinylRepository.filter(
                categoryId, minPrice, maxPrice, inStock, artistId));
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

        return new ArrayList<>(vinylRepository.findByArtistId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(
            int id) {

        return new ArrayList<>(vinylRepository.findByGenreId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByCategory(
            int id) {

        return new ArrayList<>(vinylRepository.findByCategoryId((long) id));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByYear(
            int year) {

        return new ArrayList<>(vinylRepository.findByYear(year));
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(
            boolean ascending) {

        return new ArrayList<>(vinylRepository.findAllOrderByPriceAsc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(
            boolean descending) {

        return new ArrayList<>(vinylRepository.findAllOrderByPriceDesc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(
            boolean ascending) {

        return new ArrayList<>(vinylRepository.findAllOrderByYearAsc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(
            boolean descending) {

        return new ArrayList<>(vinylRepository.findAllOrderByYearDesc());
    }
}
