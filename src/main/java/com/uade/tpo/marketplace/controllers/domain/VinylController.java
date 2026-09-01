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
    public ArrayList<Vinyl> getVinyls() { return vinylService.getVinyls(); }

    @GetMapping("/{vinylId}")
    public ResponseEntity<Vinyl> getVinylById(@PathVariable int vinylId) {
        Vinyl vinyl = vinylService.getVinylById(vinylId);
        return vinyl == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(vinyl);
    }

    @PostMapping({"", "/new"})
    public ResponseEntity<Vinyl> createVinyl(@RequestBody Vinyl vinyl) {
        return ResponseEntity.ok(vinylService.createVinyl(vinyl));
    }

    @PatchMapping("/{vinylId}")
    public ResponseEntity<Vinyl> updateVinyl(@PathVariable int vinylId, @RequestBody Vinyl vinyl) {
        Vinyl updated = vinylService.updateVinyl(vinylId, vinyl);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{vinylId}")
    public ResponseEntity<Void> deleteVinyl(@PathVariable int vinylId) {
        if (vinylService.getVinylById(vinylId) == null) return ResponseEntity.notFound().build();
        vinylService.deleteVinyl(vinylId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ArrayList<Vinyl> searchVinyls(
            @RequestParam(required = false, defaultValue = "") String searchTerm) {
        return vinylService.searchVinyls(searchTerm);
    }

    @GetMapping("/search/{searchTerm}")
    public ArrayList<Vinyl> searchVinylsByPath(@PathVariable String searchTerm) {
        return vinylService.searchVinyls(searchTerm);
    }

    @GetMapping("/filter")
    public ArrayList<Vinyl> filterVinyls(
            @RequestParam(required=false) Integer categoryId,
            @RequestParam(required=false) Double minPrice,
            @RequestParam(required=false) Double maxPrice,
            @RequestParam(required=false) Boolean inStock,
            @RequestParam(required=false) Integer artistId) {
        return vinylService.filterVinyls(categoryId, minPrice, maxPrice, inStock, artistId);
    }

    @PatchMapping("/{vinylId}/stock")
    public ResponseEntity<Vinyl> updateStock(@PathVariable int vinylId, @RequestParam int quantity) {
        Vinyl vinyl = vinylService.updateStock(vinylId, quantity);
        return vinyl == null ? ResponseEntity.status(409).build() : ResponseEntity.ok(vinyl);
    }

    @GetMapping("/artist/{artistId}")
    public ArrayList<Vinyl> getVinylsByArtist(@PathVariable int artistId) { return vinylService.getVinylsByArtist(artistId); }

    @GetMapping("/genre/{genreId}")
    public ArrayList<Vinyl> getVinylsByGenre(@PathVariable int genreId) { return vinylService.getVinylsByGenre(genreId); }

    @GetMapping("/category/{categoryId}")
    public ArrayList<Vinyl> getVinylsByCategory(@PathVariable int categoryId) { return vinylService.getVinylsByCategory(categoryId); }

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
