package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.entity.dto.FavoriteResponse;

public final class FavoriteMapper {
    private FavoriteMapper() {
    }

    public static FavoriteResponse toResponse(Favorite favorite) {
        if (favorite == null) return null;
        FavoriteResponse response = new FavoriteResponse();
        response.setId(favorite.getId());
        response.setUserId(favorite.getUser() != null ? favorite.getUser().getId() : null);
        response.setVinylId(favorite.getVinyl() != null ? favorite.getVinyl().getId() : null);
        return response;
    }
}
