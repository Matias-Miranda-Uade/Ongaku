package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.ArtistRequest;
import com.uade.tpo.marketplace.entity.dto.ArtistResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.ArtistMapper;
import com.uade.tpo.marketplace.service.ArtistService;

@RestController
@RequestMapping("/artists")
public class ArtistsController {
    @Autowired private ArtistService artistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArtistResponse>>> getArtists() {
        List<ArtistResponse> artists = artistService.getArtists().stream().map(ArtistMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(artists, "No hay artistas cargados"));
    }

    @GetMapping("/{artistId}")
    public ResponseEntity<ApiResponse<ArtistResponse>> getArtistById(@PathVariable int artistId) {
        return ResponseEntity.ok(ApiResponse.ok(ArtistMapper.toResponse(artistService.getArtistById(artistId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ArtistResponse>> createArtist(@RequestBody ArtistRequest request) {
        ArtistResponse response = ArtistMapper.toResponse(artistService.createArtist(request));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Artista creado correctamente"));
    }

    @PutMapping("/{artistId}")
    public ResponseEntity<ApiResponse<ArtistResponse>> updateArtist(@PathVariable int artistId, @RequestBody ArtistRequest request) {
        ArtistResponse response = ArtistMapper.toResponse(artistService.updateArtist(artistId, request));
        return ResponseEntity.ok(ApiResponse.ok(response, "Artista actualizado correctamente"));
    }

    @DeleteMapping("/{artistId}")
    public ResponseEntity<ApiResponse<Void>> deleteArtist(@PathVariable int artistId) {
        artistService.deleteArtist(artistId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Artista eliminado correctamente"));
    }
}