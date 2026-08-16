package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.repository.FavoriteRepository;

public class FavoriteService {
    
    public ArrayList<Favorite> getFavorites() {
        FavoriteRepository favoriteRepository = new FavoriteRepository();
        return favoriteRepository.getFavorites();
    }

    public Favorite getFavoriteById(int favoriteId) {
        FavoriteRepository favoriteRepository = new FavoriteRepository();
        return favoriteRepository.getFavoriteById(favoriteId);
    }

    public Favorite createFavorite(String entity) {
        FavoriteRepository favoriteRepository = new FavoriteRepository();
        return favoriteRepository.createFavorite(entity);
    }
}
