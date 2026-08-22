package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import org.springframework.stereotype.Repository;

//A REVISAR TODO ESTO PORQUE USA OTROS BUILDER DENTRO DEL BUILDER DE CADA VINILO DE LA CLASE, SE HABLARÁ CON LA PROFE  
@Repository
public class VinylRepository {
    ArrayList<Vinyl> vinyls = new ArrayList<>(
        Arrays.asList(
            Vinyl.builder().id(1).name("Abbey Road").artist(Artist.builder().id(1).name("The Beatles").build()).genre(Genre.builder().id(1).name("Rock").build()).year(1969).build(), //A REVISAR
            Vinyl.builder().id(2).name("La mosca y la sopa").artist(Artist.builder().id(2).name("Patricio Rey y sus Redonditos de Ricota").build()).genre(Genre.builder().id(2).name("Rock").build()).year(1991).build(),
            Vinyl.builder().id(3).name("Canción Animal").artist(Artist.builder().id(2).name("Soda Stereo").build()).genre(Genre.builder().id(2).name("Rock").build()).year(1990).build()
        )
    );

    public ArrayList<Vinyl> getVinyls(){
        return this.vinyls;
    }
    public Vinyl getVinylById(int vinylId){
        return null;
    }
    public Vinyl createVinyl(Vinyl vinyl){
        return null;
    }
    public Vinyl updateVinyl(int id, Vinyl uVinyl){
        return null;
    }
    public void deleteVinyl(int id){
    }
    public ArrayList<Vinyl> searchVinyls(String searchTerm){
        return null;
    }
    public ArrayList<Vinyl> getVinylsByArtist(int artistId){
        return null;
    }
    public ArrayList<Vinyl> getVinylsByGenre(int genreId){
        return null;
    }
    public ArrayList<Vinyl> getVinylsByCategory(int categoryId){
        return null;
    }
    public ArrayList<Vinyl> getVinylsByYear(int year){
        return null;
    }
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(boolean ascending){
        return null;
    }
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(boolean descending){
        return null;
    }
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(boolean ascending){
        return null;
    }
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(boolean descending){
        return null;
    }
}
