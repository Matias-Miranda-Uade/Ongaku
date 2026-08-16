package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.service.VinylService;

@RestController
@RequestMapping("vinyls")
public class VinylController {
    @GetMapping
    public ArrayList<Vinyl> getVinyls(){
        VinylService vinylService = new VinylService();
        return vinylService.getVinyls();
    }
    @GetMapping("/{vinylId}")
    public Vinyl getVinylById(int vinylId){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylById(vinylId);
    }
    @PostMapping("/{vinyl}")
    public Vinyl createVinyl ( @RequestBody Vinyl vinyl){
        VinylService vinylService = new VinylService();
        return vinylService.createVinyl(vinyl);
    }
    @PatchMapping("/{vinylId}")
    public Vinyl updateVinyl (@PathVariable int vinylId, @RequestBody Vinyl vinyl){
        VinylService vinylService = new VinylService();
        return vinylService.updateVinyl(vinylId, vinyl);
    }

    @DeleteMapping("/{vinylId}")
    public void deleteVinyl (@PathVariable int vinylId){
        VinylService vinylService = new VinylService();
        vinylService.deleteVinyl(vinylId);
    }

    @GetMapping("search")
    public ArrayList<Vinyl> searchVinyls(@RequestParam String searchTerm){
        VinylService vinylService = new VinylService();
        return vinylService.searchVinyls(searchTerm);
    }

    @GetMapping("artist/{artistId}")
    public ArrayList<Vinyl> getVinylsByArtist(@PathVariable int artistId){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsByArtist(artistId);
    }
    @GetMapping("genre/{genreId}")
    public ArrayList<Vinyl> getVinylsByGenre(@PathVariable int genreId){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsByGenre(genreId);
    }
    @GetMapping("category/{categoryId}")
    public ArrayList<Vinyl> getVinylsByCategory(@PathVariable int categoryId){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsByCategory(categoryId);
    }

    @GetMapping("year/{year}")
    public ArrayList<Vinyl> getVinylsByYear(@PathVariable int year){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsByYear(year);
    }
    @GetMapping("price/asc")
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(@RequestParam boolean ascending){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsSortedByPriceAsc(ascending);
    }

    @GetMapping("price/desc")
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(@RequestParam boolean descending){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsSortedByPriceDesc(descending);
    }
    @GetMapping("year/asc")
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(@RequestParam boolean ascending){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsSortedByYearAsc(ascending);
    }

    @GetMapping("year/desc")
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(@RequestParam boolean descending){
        VinylService vinylService = new VinylService();
        return vinylService.getVinylsSortedByYearDesc(descending);
    }

    // A AGREGAR GETVINYLSPREVIEW, NO SE COMO SE HARIA VOY A ESPERAR A QUE TERMINE EL RESTO
}
