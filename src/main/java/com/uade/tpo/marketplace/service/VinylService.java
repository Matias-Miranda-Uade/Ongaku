package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Vinyl;
import java.util.ArrayList;

public interface VinylService {
    ArrayList<Vinyl> getPublicVinyls();
    ArrayList<Vinyl> getAllVinyls();
    Vinyl getPublicVinylById(int id);
    Vinyl getVinylById(int id);
    Vinyl createVinyl(Vinyl vinyl);
    Vinyl updateVinyl(int id, Vinyl vinyl);
    Vinyl setEnabled(int id, boolean enabled);
    void deleteVinyl(int id);
        ArrayList<Vinyl> searchPublicVinyls(String searchTerm);
        ArrayList<Vinyl> searchAllVinyls(String searchTerm);
            ArrayList<Vinyl> filterPublicVinyls(Integer categoryId, Double minPrice, Double maxPrice,
                Integer artistId, Integer genreId);
    ArrayList<Vinyl> filterVinyls(Integer categoryId, Double minPrice, Double maxPrice,
            Boolean inStock, Integer artistId, Integer genreId);
    Vinyl updateStock(int vinylId, int quantityDelta);
    ArrayList<Vinyl> getVinylsByArtist(int artistId);
    ArrayList<Vinyl> getVinylsByGenre(int genreId);
    ArrayList<Vinyl> getVinylsByCategory(int categoryId);
    ArrayList<Vinyl> getVinylsByYear(int year);
    ArrayList<Vinyl> getPublicVinylsByArtist(int artistId);
    ArrayList<Vinyl> getPublicVinylsByGenre(int genreId);
    ArrayList<Vinyl> getPublicVinylsByCategory(int categoryId);
    ArrayList<Vinyl> getAllVinylsByArtist(int artistId);
    ArrayList<Vinyl> getAllVinylsByGenre(int genreId);
    ArrayList<Vinyl> getAllVinylsByCategory(int categoryId);
    ArrayList<Vinyl> getVinylsSortedByPriceAsc();
    ArrayList<Vinyl> getVinylsSortedByPriceDesc();
    ArrayList<Vinyl> getVinylsSortedByYearAsc();
    ArrayList<Vinyl> getVinylsSortedByYearDesc();
}
