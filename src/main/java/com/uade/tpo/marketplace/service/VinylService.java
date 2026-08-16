package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.VinylRepository;

public class VinylService {
    public ArrayList<Vinyl> getVinyls(){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinyls();
    }
    public Vinyl getVinylById(int id){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylById(id);
    }
    public Vinyl createVinyl(Vinyl vinyl){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.createVinyl(vinyl);
    }
    public Vinyl updateVinyl(int id, Vinyl vinyl){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.updateVinyl(id, vinyl);
    }

    public void deleteVinyl(int id){
        VinylRepository vinylRepository = new VinylRepository();
        vinylRepository.deleteVinyl(id);
    }
    public ArrayList<Vinyl> searchVinyls(String searchTerm){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.searchVinyls(searchTerm);
    }
    public ArrayList<Vinyl> getVinylsByArtist(int artistId){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsByArtist(artistId);
    }
    public ArrayList<Vinyl> getVinylsByGenre(int genreId){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsByGenre(genreId);
    }
    public ArrayList<Vinyl> getVinylsByCategory(int categoryId){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsByCategory(categoryId);
    }
    public ArrayList<Vinyl> getVinylsByYear(int year){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsByYear(year);
    }
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(boolean ascending){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsSortedByPriceAsc(ascending);
    }
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(boolean descending){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsSortedByPriceDesc(descending);
    }
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(boolean ascending){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsSortedByYearAsc(ascending);
    }
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(boolean descending){
        VinylRepository vinylRepository = new VinylRepository();
        return vinylRepository.getVinylsSortedByYearDesc(descending);
    }
}
