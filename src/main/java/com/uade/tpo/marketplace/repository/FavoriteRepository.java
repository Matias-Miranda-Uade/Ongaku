package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Favorite;
import org.springframework.data.jpa.repository.Query;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId")
    List<Favorite> findByUserId(int userId);

    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId AND f.vinyl.id = :vinylId")
    List<Favorite> findByUserIdAndVinylId(int userId, int vinylId);
}