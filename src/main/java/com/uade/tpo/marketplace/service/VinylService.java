package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Vinyl;
import java.util.ArrayList;

public interface VinylService {
    ArrayList<Vinyl> getVinyls();
    Vinyl getVinylById(int id);
    Vinyl createVinyl(Vinyl vinyl);
    Vinyl updateVinyl(int id, Vinyl vinyl);
    void deleteVinyl(int id);
    ArrayList<Vinyl> searchVinyls(String searchTerm);
    ArrayList<Vinyl> getVinylsByArtist(int artistId);
    ArrayList<Vinyl> getVinylsByGenre(int genreId);
    ArrayList<Vinyl> getVinylsByCategory(int categoryId);
    ArrayList<Vinyl> getVinylsByYear(int year);
    ArrayList<Vinyl> getVinylsSortedByPriceAsc(boolean ascending);
    ArrayList<Vinyl> getVinylsSortedByPriceDesc(boolean descending);
    ArrayList<Vinyl> getVinylsSortedByYearAsc(boolean ascending);
    ArrayList<Vinyl> getVinylsSortedByYearDesc(boolean descending);
}
