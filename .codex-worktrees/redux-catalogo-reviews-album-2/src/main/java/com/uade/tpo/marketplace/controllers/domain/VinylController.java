package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.VinylResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.VinylMapper;
import com.uade.tpo.marketplace.service.VinylService;

@RestController
@RequestMapping("/vinyls")
public class VinylController {
    @Autowired
    private VinylService vinylService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinyls() {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getPublicVinyls()), "No hay vinilos disponibles"));
    }

    @GetMapping("/{vinylId}")
    public ResponseEntity<ApiResponse<VinylResponse>> getVinylById(@PathVariable int vinylId) {
        return ResponseEntity.ok(ApiResponse.ok(VinylMapper.toResponse(vinylService.getPublicVinylById(vinylId))));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> searchVinyls(
            @RequestParam(required = false, defaultValue = "") String searchTerm) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.searchPublicVinyls(searchTerm)),
                "No se encontraron vinilos para \"" + searchTerm + "\""));
    }

    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> searchVinylsByPath(@PathVariable String searchTerm) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.searchPublicVinyls(searchTerm)),
                "No se encontraron vinilos para \"" + searchTerm + "\""));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> filterVinyls(
            @RequestParam(required=false) Integer categoryId,
            @RequestParam(required=false) Double minPrice,
            @RequestParam(required=false) Double maxPrice,
            @RequestParam(required=false) Boolean inStock,
            @RequestParam(required=false) Integer artistId,
            @RequestParam(required=false) Integer genreId) {
        return ResponseEntity.ok(ApiResponse.list(
                map(vinylService.filterPublicVinyls(categoryId, minPrice, maxPrice, artistId, genreId)),
                "No hay vinilos que cumplan los filtros indicados"));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsByArtist(@PathVariable int artistId) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getPublicVinylsByArtist(artistId)),
                "Este artista no tiene vinilos disponibles"));
    }

    @GetMapping("/genre/{genreId}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsByGenre(@PathVariable int genreId) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getPublicVinylsByGenre(genreId)),
                "Este genero no tiene vinilos disponibles"));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsByCategory(@PathVariable int categoryId) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getPublicVinylsByCategory(categoryId)),
                "Esta categoria no tiene vinilos disponibles"));
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsByYear(@PathVariable int year) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getVinylsByYear(year)),
                "No hay vinilos del año " + year));
    }

    @GetMapping("/price/asc")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsSortedByPriceAsc() {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getVinylsSortedByPriceAsc())));
    }

    @GetMapping("/price/desc")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsSortedByPriceDesc() {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getVinylsSortedByPriceDesc())));
    }

    @GetMapping("/year/asc")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsSortedByYearAsc() {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getVinylsSortedByYearAsc())));
    }

    @GetMapping("/year/desc")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinylsSortedByYearDesc() {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getVinylsSortedByYearDesc())));
    }

    private List<VinylResponse> map(List<com.uade.tpo.marketplace.entity.Vinyl> vinyls) {
        return vinyls.stream().map(VinylMapper::toResponse).toList();
    }
}