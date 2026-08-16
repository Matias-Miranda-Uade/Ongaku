package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Favorite;

public class FavoriteRepository {
    public ArrayList<Favorite> favorites = new ArrayList<>(Arrays.asList(
            Favorite.builder().id(1).userId(1).vinylId(10).build(),
            Favorite.builder().id(2).userId(2).vinylId(11).build(),
            Favorite.builder().id(3).userId(3).vinylId(12).build()
    ));

    public ArrayList<Favorite> getFavorites() {
        return this.favorites;
    }

    public Favorite getFavoriteById(int favoriteId) {
        return null;
    }

    public Favorite createFavorite(String entity) {
        return null;
    }
}
