package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Favorite;
import java.util.ArrayList;

public interface FavoriteService {
    ArrayList<Favorite> getFavorites();
    Favorite getFavoriteById(int favoriteId);
    Favorite createFavorite(String entity);
}
