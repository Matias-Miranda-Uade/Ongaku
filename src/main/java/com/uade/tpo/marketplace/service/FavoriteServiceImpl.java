package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.FavoriteRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final VinylRepository vinylRepository;

    public FavoriteServiceImpl(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            VinylRepository vinylRepository) {

        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Favorite> getFavorites() {
        return new ArrayList<>(favoriteRepository.findAll());
    }

    @Override
    public Favorite getFavoriteById(int id) {
        return favoriteRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Favorite createFavorite(String entity) {

        String[] values = entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 2) {
            throw new IllegalArgumentException(
                    "El favorito requiere usuario y vinilo");
        }

        int userId = Integer.parseInt(values[0].trim());
        int vinylId = Integer.parseInt(values[1].trim());

        if (userId <= 0 || vinylId <= 0) {
            throw new IllegalArgumentException(
                    "Los identificadores deben ser positivos");
        }

        User user = userRepository
                .findById((long) userId)
                .orElse(null);

        if (user == null) {
            throw new IllegalArgumentException(
                    "El usuario no existe");
        }

        Vinyl vinyl = vinylRepository
                .findById((long) vinylId)
                .orElse(null);

        if (vinyl == null) {
            throw new IllegalArgumentException(
                    "El vinilo no existe");
        }

        boolean alreadyExists = favoriteRepository
                .findAll()
                .stream()
                .anyMatch(f ->
                        f.getUser() != null
                        && f.getVinyl() != null
                        && f.getUser().getId().equals((long) userId)
                        && f.getVinyl().getId().equals((long) vinylId));

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "El vinilo ya esta en favoritos");
        }

        Favorite favorite = new Favorite();

        favorite.setUser(user);
        favorite.setVinyl(vinyl);

        return favoriteRepository.save(favorite);
    }
}