package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.service.ArtistService;

@RestController
@RequestMapping("artists")
public class ArtistsController {
    @Autowired
    private ArtistService artistService;

    @GetMapping
    public ArrayList<Artist> getArtists() {
        return artistService.getArtists();
    }

    @GetMapping("/{artistId}")
    public ResponseEntity<Artist> getArtistById(@PathVariable int artistId) {
        Artist artist = artistService.getArtistById(artistId);
        if (artist == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(artist);
    }

    @PostMapping
    public Artist createArtist(@RequestBody Artist artist) {
        return artistService.createArtist(artist);
    }

    @PutMapping("/{artistId}")
    public ResponseEntity<Artist> updateArtist(@PathVariable int artistId, @RequestBody Artist uArtist) {
        Artist updated = artistService.updateArtist(artistId, uArtist);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{artistId}")
    public ResponseEntity<Void> deleteArtist(@PathVariable int artistId) {
        artistService.deleteArtist(artistId);
        return ResponseEntity.noContent().build();
    }
}