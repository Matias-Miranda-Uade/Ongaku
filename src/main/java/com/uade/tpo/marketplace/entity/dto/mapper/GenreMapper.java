package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Genre;
import com.uade.tpo.marketplace.entity.dto.GenreRequest;
import com.uade.tpo.marketplace.entity.dto.GenreResponse;

public final class GenreMapper {
    private GenreMapper() {
    }

    public static GenreResponse toResponse(Genre genre) {
        if (genre == null) return null;
        GenreResponse response = new GenreResponse();
        response.setId(genre.getId());
        response.setName(genre.getName());
        response.setVinylId(genre.getVinyl() != null ? genre.getVinyl().getId() : null);
        return response;
    }

    public static Genre toEntity(GenreRequest request) {
        Genre genre = new Genre();
        if (request.getName() != null) genre.setName(request.getName());
        return genre;
    }
}
