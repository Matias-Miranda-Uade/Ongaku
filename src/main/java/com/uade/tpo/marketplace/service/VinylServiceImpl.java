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
        return new ArrayList<>(vinylRepository.findAll());
    }

    @Override
    public Vinyl getVinylById(int id) {
        return vinylRepository.findById((long) id).orElse(null);
    }

    @Override
    public Vinyl createVinyl(Vinyl vinyl) {
        if (vinyl == null || vinyl.getName() == null || vinyl.getName().isBlank()
                || vinyl.getPrice() < 0 || vinyl.getStock() < 0 || vinyl.getYear() < 1900)
            throw new IllegalArgumentException("Datos de vinilo invalidos");

        Vinyl newVinyl = new Vinyl();
        newVinyl.setName(vinyl.getName());
        newVinyl.setDescription(vinyl.getDescription());
        newVinyl.setPrice(vinyl.getPrice());
        newVinyl.setStock(vinyl.getStock());
        newVinyl.setImage(vinyl.getImage());
        newVinyl.setCategory(vinyl.getCategory());
        newVinyl.setArtist(vinyl.getArtist());
        newVinyl.setGenre(vinyl.getGenre());
        newVinyl.setYear(vinyl.getYear());
        return vinylRepository.save(newVinyl);
    }

    @Override
    public Vinyl updateVinyl(int id, Vinyl vinyl) {
        Vinyl current = getVinylById(id);
        if (current == null || vinyl == null)
            return null;
        if (vinyl.getName() != null && !vinyl.getName().isBlank())
            current.setName(vinyl.getName());
        if (vinyl.getDescription() != null)
            current.setDescription(vinyl.getDescription());
        if (vinyl.getPrice() >= 0)
            current.setPrice(vinyl.getPrice());
        if (vinyl.getStock() >= 0)
            current.setStock(vinyl.getStock());
        if (vinyl.getYear() >= 1900)
            current.setYear(vinyl.getYear());
        if (vinyl.getCategory() != null)
            current.setCategory(vinyl.getCategory());
        if (vinyl.getArtist() != null)
            current.setArtist(vinyl.getArtist());
        if (vinyl.getGenre() != null)
            current.setGenre(vinyl.getGenre());
        return vinylRepository.save(current);
    }

    @Override
    public void deleteVinyl(int id) {
        vinylRepository.deleteById((long) id);
    }

    @Override
    public ArrayList<Vinyl> searchVinyls(String searchTerm) {
        String term = searchTerm == null ? "" : searchTerm;
        return new ArrayList<>(
                vinylRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByArtist(int artistId) {
        return new ArrayList<>(vinylRepository.findByArtist_Id((long) artistId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(int genreId) {
        return new ArrayList<>(vinylRepository.findByGenre_Id((long) genreId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByCategory(int categoryId) {
        return new ArrayList<>(vinylRepository.findByCategory_Id((long) categoryId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByYear(int year) {
        return new ArrayList<>(vinylRepository.findByYear(year));
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(boolean ascending) {
        return new ArrayList<>(
                ascending ? vinylRepository.findAllByOrderByPriceAsc() : vinylRepository.findAllByOrderByPriceDesc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(boolean descending) {
        return new ArrayList<>(
                descending ? vinylRepository.findAllByOrderByPriceDesc() : vinylRepository.findAllByOrderByPriceAsc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(boolean ascending) {
        return new ArrayList<>(
                ascending ? vinylRepository.findAllByOrderByYearAsc() : vinylRepository.findAllByOrderByYearDesc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(boolean descending) {
        return new ArrayList<>(
                descending ? vinylRepository.findAllByOrderByYearDesc() : vinylRepository.findAllByOrderByYearAsc());
    }
}