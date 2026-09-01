package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.service.ArtistService;

@RestController
@RequestMapping("/artists")
public class ArtistsController {
    @Autowired private ArtistService artistService;

    @GetMapping
    public ArrayList<Artist> getArtists() { return artistService.getArtists(); }

    @GetMapping("/{artistId}")
    public ResponseEntity<Artist> getArtistById(@PathVariable int artistId) {
        Artist artist = artistService.getArtistById(artistId);
        return artist == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(artist);
    }

    @PostMapping
    public ResponseEntity<Artist> createArtist(@RequestBody Artist artist) { return ResponseEntity.ok(artistService.createArtist(artist)); }

    @PutMapping("/{artistId}")
    public ResponseEntity<Artist> updateArtist(@PathVariable int artistId, @RequestBody Artist artist) {
        Artist updated = artistService.updateArtist(artistId, artist);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{artistId}")
    public ResponseEntity<Void> deleteArtist(@PathVariable int artistId) {
        if (artistService.getArtistById(artistId) == null) return ResponseEntity.notFound().build();
        artistService.deleteArtist(artistId);
        return ResponseEntity.noContent().build();
    }
}
