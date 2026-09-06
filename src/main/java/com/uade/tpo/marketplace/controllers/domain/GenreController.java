package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.GenreRequest;
import com.uade.tpo.marketplace.entity.dto.GenreResponse;
import com.uade.tpo.marketplace.entity.dto.VinylPreviewResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.GenreMapper;
import com.uade.tpo.marketplace.entity.dto.mapper.VinylMapper;
import com.uade.tpo.marketplace.service.GenreService;

@RestController
@RequestMapping("genres")
public class GenreController {
    @Autowired
    private GenreService genreService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GenreResponse>>> getGenres() {
        List<GenreResponse> genres = genreService.getGenres().stream().map(GenreMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(genres, "No hay generos cargados"));
    }

    @GetMapping("/{genreId}")
    public ResponseEntity<ApiResponse<GenreResponse>> getGenreById(@PathVariable int genreId) {
        return ResponseEntity.ok(ApiResponse.ok(GenreMapper.toResponse(genreService.getGenreById(genreId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GenreResponse>> createGenre(@RequestBody GenreRequest request) {
        GenreResponse response = GenreMapper.toResponse(genreService.createGenre(request));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Genero creado correctamente"));
    }

    @PatchMapping("/{genreId}")
    public ResponseEntity<ApiResponse<GenreResponse>> updateGenre(@PathVariable int genreId, @RequestBody GenreRequest request) {
        GenreResponse response = GenreMapper.toResponse(genreService.updateGenre(genreId, request));
        return ResponseEntity.ok(ApiResponse.ok(response, "Genero actualizado correctamente"));
    }

    @DeleteMapping("/{genreId}")
    public ResponseEntity<ApiResponse<Void>> deleteGenre(@PathVariable int genreId) {
        genreService.deleteGenre(genreId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Genero eliminado correctamente"));
    }

    @GetMapping("/{genreId}/vinyls")
    public ResponseEntity<ApiResponse<List<VinylPreviewResponse>>> getVinylsByGenre(@PathVariable int genreId) {
        List<VinylPreviewResponse> vinyls = genreService.getVinylsByGenre(genreId).stream()
                .map(VinylMapper::toPreviewResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(vinyls, "Este genero no tiene vinilos disponibles"));
    }
}