package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.VinylPreviewResponse;
import com.uade.tpo.marketplace.entity.dto.VinylRequest;
import com.uade.tpo.marketplace.entity.dto.VinylResponse;

public final class VinylMapper {

    private VinylMapper() {
    }

    public static VinylResponse toResponse(Vinyl vinyl) {
        if (vinyl == null) return null;
        VinylResponse response = new VinylResponse();
        response.setId(vinyl.getId());
        response.setName(vinyl.getName());
        response.setDescription(vinyl.getDescription());
        response.setPrice(vinyl.getPrice());
        response.setStock(vinyl.getStock());
        response.setImage(vinyl.getImage());
        response.setYear(vinyl.getYear());
        response.setCategoryId(vinyl.getCategory() != null ? vinyl.getCategory().getId() : null);
        response.setArtistId(vinyl.getArtist() != null ? vinyl.getArtist().getId() : null);
        response.setGenreId(vinyl.getGenre() != null ? vinyl.getGenre().getId() : null);
        response.setAudioPreviewId(vinyl.getAudioPreview() != null ? vinyl.getAudioPreview().getId() : null);
        return response;
    }

    public static VinylPreviewResponse toPreviewResponse(Vinyl vinyl) {
        if (vinyl == null) return null;
        VinylPreviewResponse response = new VinylPreviewResponse();
        response.setId(vinyl.getId());
        response.setName(vinyl.getName());
        response.setImage(vinyl.getImage());
        response.setPrice(vinyl.getPrice());
        response.setYear(vinyl.getYear());
        response.setArtistName(vinyl.getArtist() != null ? vinyl.getArtist().getName() : null);
        response.setCategoryDescription(vinyl.getCategory() != null ? vinyl.getCategory().getDescription() : null);
        return response;
    }

    /** Copia los campos simples del request a una entidad; las relaciones se resuelven en el service. */
    public static Vinyl toEntity(VinylRequest request) {
        Vinyl vinyl = new Vinyl();
        applyFields(vinyl, request);
        return vinyl;
    }

    public static void applyFields(Vinyl vinyl, VinylRequest request) {
        if (request.getName() != null) vinyl.setName(request.getName());
        if (request.getDescription() != null) vinyl.setDescription(request.getDescription());
        vinyl.setPrice(request.getPrice());
        vinyl.setStock(request.getStock());
        if (request.getImage() != null) vinyl.setImage(request.getImage());
        vinyl.setYear(request.getYear());
    }

    public static void applyRelations(Vinyl vinyl, Category category, Artist artist, Genre genre, AudioPreview audioPreview) {
        if (category != null) vinyl.setCategory(category);
        if (artist != null) vinyl.setArtist(artist);
        if (genre != null) vinyl.setGenre(genre);
        if (audioPreview != null) vinyl.setAudioPreview(audioPreview);
    }
}
