package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
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
@RequestMapping("/admin/vinyls")
public class AdminVinylController {
    private final VinylService vinylService;

    public AdminVinylController(VinylService vinylService) {
        this.vinylService = vinylService;
    }

    @GetMapping
    public ArrayList<Vinyl> getVinyls() {
        return vinylService.getAllVinyls();
    }

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

    @PatchMapping("/{vinylId}/enabled")
    public ResponseEntity<Vinyl> setEnabled(@PathVariable int vinylId, @RequestParam boolean enabled) {
        Vinyl vinyl = vinylService.setEnabled(vinylId, enabled);
        return vinyl == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(vinyl);
    }

    @DeleteMapping("/{vinylId}")
    public ResponseEntity<Void> deleteVinyl(@PathVariable int vinylId) {
        if (vinylService.getVinylById(vinylId) == null) return ResponseEntity.notFound().build();
        vinylService.deleteVinyl(vinylId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{vinylId}/stock")
    public ResponseEntity<Vinyl> updateStock(@PathVariable int vinylId, @RequestParam int quantity) {
        Vinyl vinyl = vinylService.updateStock(vinylId, quantity);
        return vinyl == null ? ResponseEntity.status(409).build() : ResponseEntity.ok(vinyl);
    }

    @GetMapping("/search")
    public ArrayList<Vinyl> search(@RequestParam(required = false, defaultValue = "") String searchTerm) {
        return vinylService.searchAllVinyls(searchTerm);
    }

    @GetMapping("/filter")
    public ArrayList<Vinyl> filter(@RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Integer artistId,
            @RequestParam(required = false) Integer genreId) {
        return vinylService.filterVinyls(categoryId, minPrice, maxPrice, inStock, artistId, genreId);
    }

    @GetMapping("/artist/{artistId}")
    public ArrayList<Vinyl> byArtist(@PathVariable int artistId) {
        return vinylService.getAllVinylsByArtist(artistId);
    }

    @GetMapping("/genre/{genreId}")
    public ArrayList<Vinyl> byGenre(@PathVariable int genreId) {
        return vinylService.getAllVinylsByGenre(genreId);
    }

    @GetMapping("/category/{categoryId}")
    public ArrayList<Vinyl> byCategory(@PathVariable int categoryId) {
        return vinylService.getAllVinylsByCategory(categoryId);
    }
}
