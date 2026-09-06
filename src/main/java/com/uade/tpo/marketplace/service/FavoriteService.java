package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.entity.dto.FavoriteRequest;
import java.util.ArrayList;

public interface FavoriteService {
    ArrayList<Favorite> getFavorites(String requesterEmail);
    Favorite getFavoriteById(int favoriteId, String requesterEmail);
    Favorite createFavorite(FavoriteRequest request, String requesterEmail);
    void deleteFavorite(int favoriteId, String requesterEmail);
}