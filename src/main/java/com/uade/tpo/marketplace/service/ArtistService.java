package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.repository.ArtistRepository;

public class ArtistService {
    public ArrayList<Artist> getArtists(){
        ArtistRepository artistRepository = new ArtistRepository();
        return artistRepository.getArtists();
    }
    public Artist getArtistById(int id){
        ArtistRepository artistRepository = new ArtistRepository();
        return artistRepository.getArtistById(id);
    }

    public Artist createArtist(Artist artist){
        ArtistRepository artistRepository= new ArtistRepository();
        return artistRepository.createArtist(artist);
    }
    public Artist updateArtist(int id, Artist artist){
        ArtistRepository artistRepository = new ArtistRepository();
        return artistRepository.updateArtist(id, artist);
    }

    public void deleteArtist(int id){
        ArtistRepository artistRepository = new ArtistRepository();
        artistRepository.deleteArtist(id);
    }

    

}
