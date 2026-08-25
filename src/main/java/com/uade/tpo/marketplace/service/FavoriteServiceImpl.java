package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.repository.FavoriteRepository;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteServiceImpl(
            FavoriteRepository repository) {

        this.favoriteRepository = repository;
    }

    @Override
    public ArrayList<Favorite> getFavorites() {
        return new ArrayList<>(
            favoriteRepository.findAll()
        );
    }

    @Override
    public Favorite getFavoriteById(int id) {
        return favoriteRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Favorite createFavorite(
            String entity) {

        String[] values =
                entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 2) {
            throw new IllegalArgumentException(
                "El favorito requiere usuario y vinilo"
            );
        }

        int userId =
                Integer.parseInt(values[0].trim());

        int vinylId =
                Integer.parseInt(values[1].trim());

        if (userId <= 0 || vinylId <= 0) {
            throw new IllegalArgumentException(
                "Los identificadores deben ser positivos"
            );
        }

        if (!favoriteRepository
                .findByUserIdAndVinylId(
                    userId,
                    vinylId
                )
                .isEmpty()) {

            throw new IllegalArgumentException(
                "El vinilo ya esta en favoritos"
            );
        }

        Favorite favorite = new Favorite();

        favorite.setUserId(userId);
        favorite.setVinylId(vinylId);

        return favoriteRepository.save(favorite);
    }
}