package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.repository.FavoriteRepository;

@Service
public class FavoriteServiceImpl implements FavoriteService {
    private final FavoriteRepository favoriteRepository;
    public FavoriteServiceImpl(FavoriteRepository repository) { this.favoriteRepository = repository; }
    public ArrayList<Favorite> getFavorites() { return favoriteRepository.getFavorites(); }
    public Favorite getFavoriteById(int id) { return favoriteRepository.getFavorites().stream().filter(f -> f.getId() == id).findFirst().orElse(null); }
    public Favorite createFavorite(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",");
        if (values.length < 2) throw new IllegalArgumentException("El favorito requiere usuario y vinilo");
        int userId = Integer.parseInt(values[0].trim()); int vinylId = Integer.parseInt(values[1].trim());
        if (userId <= 0 || vinylId <= 0) throw new IllegalArgumentException("Los identificadores deben ser positivos");
        if (favoriteRepository.getFavorites().stream().anyMatch(f -> f.getUserId() == userId && f.getVinylId() == vinylId)) throw new IllegalArgumentException("El vinilo ya esta en favoritos");
        Favorite favorite = Favorite.builder().id(favoriteRepository.getFavorites().stream().mapToLong(Favorite::getId).max().orElse(0) + 1).userId(userId).vinylId(vinylId).build();
        favoriteRepository.getFavorites().add(favorite); return favorite;
    }
}