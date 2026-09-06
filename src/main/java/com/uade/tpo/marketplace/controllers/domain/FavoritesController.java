package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.FavoriteRequest;
import com.uade.tpo.marketplace.entity.dto.FavoriteResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.FavoriteMapper;
import com.uade.tpo.marketplace.service.FavoriteService;

@RestController
@RequestMapping("favorites")
public class FavoritesController {
    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getFavorites() {
        List<FavoriteResponse> favorites = favoriteService.getFavorites().stream().map(FavoriteMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(favorites, "No hay favoritos cargados"));
    }

    @GetMapping("/{favoriteId}")
    public ResponseEntity<ApiResponse<FavoriteResponse>> getFavoriteById(@PathVariable("favoriteId") int favoriteId, Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(FavoriteMapper.toResponse(favoriteService.getFavoriteById(favoriteId, principal.getName()))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> createFavorite(@RequestBody FavoriteRequest request, Principal principal) {
        FavoriteResponse response = FavoriteMapper.toResponse(favoriteService.createFavorite(request, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Vinilo agregado a favoritos"));
    }
}