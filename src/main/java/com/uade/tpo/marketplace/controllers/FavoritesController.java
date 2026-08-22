package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.service.FavoriteService;

@RestController
@RequestMapping("favorites")
public class FavoritesController {
    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ArrayList<Favorite> getFavorites() {
        return favoriteService.getFavorites();
    }

    @GetMapping("/{id}")
    public Favorite getFavoriteById(@PathVariable int favoriteId) {
        return favoriteService.getFavoriteById(favoriteId);
    }

    @PostMapping
    public Favorite createFavorite(@RequestBody String entity) {
        return favoriteService.createFavorite(entity);
    }
}
