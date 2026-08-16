package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.service.ArtistService;

@RestController
@RequestMapping("artists")
public class ArtistController {
    @GetMapping
    public ArrayList<Artist> getArtists(){
        ArtistService artistService = new ArtistService();
        return artistService.getArtists();
    }
    
    @GetMapping("{artistId}")
    public Artist getArtistById (int artistId){
        ArtistService artistService = new ArtistService();
        return artistService.getArtistById(artistId);
    }
    @PostMapping("{artist}")
    public Artist createArtist (@RequestBody Artist artist){
        ArtistService artistService = new ArtistService();
        return artistService.createArtist(artist);
    }
    @PatchMapping("{artistId}")
    public Artist updateArtist (@PathVariable int artistId, @RequestBody Artist artist){
        ArtistService artistService = new ArtistService();
        return artistService.updateArtist(artistId, artist);
    }

    @DeleteMapping("{artistId}")
    public void deleteArtist (@PathVariable int artistId){
        ArtistService artistService = new ArtistService();
        artistService.deleteArtist(artistId);
    }
}
