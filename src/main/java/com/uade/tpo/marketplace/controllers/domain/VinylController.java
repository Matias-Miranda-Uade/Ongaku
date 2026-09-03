package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.service.VinylService;

@RestController
@RequestMapping("/vinyls")
public class VinylController {
    @Autowired
    private VinylService vinylService;

    @GetMapping
    public ArrayList<Vinyl> getVinyls() { return vinylService.getPublicVinyls(); }

    @GetMapping("/{vinylId}")
    public ResponseEntity<Vinyl> getVinylById(@PathVariable int vinylId) {
        Vinyl vinyl = vinylService.getPublicVinylById(vinylId);
        return vinyl == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(vinyl);
    }

    @GetMapping("/search")
    public ArrayList<Vinyl> searchVinyls(
            @RequestParam(required = false, defaultValue = "") String searchTerm) {
        return vinylService.searchPublicVinyls(searchTerm);
    }

    @GetMapping("/search/{searchTerm}")
    public ArrayList<Vinyl> searchVinylsByPath(@PathVariable String searchTerm) {
        return vinylService.searchPublicVinyls(searchTerm);
    }

    @GetMapping("/filter")
    public ArrayList<Vinyl> filterVinyls(
            @RequestParam(required=false) Integer categoryId,
            @RequestParam(required=false) Double minPrice,
            @RequestParam(required=false) Double maxPrice,
            @RequestParam(required=false) Boolean inStock,
            @RequestParam(required=false) Integer artistId,
            @RequestParam(required=false) Integer genreId) {
        return vinylService.filterPublicVinyls(categoryId, minPrice, maxPrice, artistId, genreId);
    }

    @GetMapping("/artist/{artistId}")
    public ArrayList<Vinyl> getVinylsByArtist(@PathVariable int artistId) { return vinylService.getPublicVinylsByArtist(artistId); }

    @GetMapping("/genre/{genreId}")
    public ArrayList<Vinyl> getVinylsByGenre(@PathVariable int genreId) { return vinylService.getPublicVinylsByGenre(genreId); }

    @GetMapping("/category/{categoryId}")
    public ArrayList<Vinyl> getVinylsByCategory(@PathVariable int categoryId) { return vinylService.getPublicVinylsByCategory(categoryId); }

    @GetMapping("/year/{year}")
    public ArrayList<Vinyl> getVinylsByYear(@PathVariable int year) { return vinylService.getVinylsByYear(year); }

    @GetMapping("/price/asc")
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc() { return vinylService.getVinylsSortedByPriceAsc(); }

    @GetMapping("/price/desc")
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc() { return vinylService.getVinylsSortedByPriceDesc(); }

    @GetMapping("/year/asc")
    public ArrayList<Vinyl> getVinylsSortedByYearAsc() { return vinylService.getVinylsSortedByYearAsc(); }

    @GetMapping("/year/desc")
    public ArrayList<Vinyl> getVinylsSortedByYearDesc() { return vinylService.getVinylsSortedByYearDesc(); }
}
