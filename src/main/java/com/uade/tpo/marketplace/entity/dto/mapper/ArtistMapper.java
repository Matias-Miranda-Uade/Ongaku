package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.dto.ArtistRequest;
import com.uade.tpo.marketplace.entity.dto.ArtistResponse;

public final class ArtistMapper {
    private ArtistMapper() {
    }

    public static ArtistResponse toResponse(Artist artist) {
        if (artist == null) return null;
        ArtistResponse response = new ArtistResponse();
        response.setId(artist.getId());
        response.setName(artist.getName());
        response.setDescription(artist.getDescription());
        response.setImage(artist.getImage());
        return response;
    }

    public static Artist toEntity(ArtistRequest request) {
        Artist artist = new Artist();
        applyFields(artist, request);
        return artist;
    }

    public static void applyFields(Artist artist, ArtistRequest request) {
        if (request.getName() != null) artist.setName(request.getName());
        if (request.getDescription() != null) artist.setDescription(request.getDescription());
        if (request.getImage() != null) artist.setImage(request.getImage());
    }
}
