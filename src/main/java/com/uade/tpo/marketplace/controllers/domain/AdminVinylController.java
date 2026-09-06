package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.VinylRequest;
import com.uade.tpo.marketplace.entity.dto.VinylResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.VinylMapper;
import com.uade.tpo.marketplace.service.VinylService;

@RestController
@RequestMapping("/admin/vinyls")
public class AdminVinylController {
    private final VinylService vinylService;

    public AdminVinylController(VinylService vinylService) {
        this.vinylService = vinylService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VinylResponse>>> getVinyls() {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getAllVinyls()), "No hay vinilos cargados"));
    }

    @GetMapping("/{vinylId}")
    public ResponseEntity<ApiResponse<VinylResponse>> getVinylById(@PathVariable int vinylId) {
        return ResponseEntity.ok(ApiResponse.ok(VinylMapper.toResponse(vinylService.getVinylById(vinylId))));
    }

    @PostMapping({"", "/new"})
    public ResponseEntity<ApiResponse<VinylResponse>> createVinyl(@RequestBody VinylRequest request) {
        VinylResponse response = VinylMapper.toResponse(vinylService.createVinyl(request));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Vinilo creado correctamente"));
    }

    @PatchMapping("/{vinylId}")
    public ResponseEntity<ApiResponse<VinylResponse>> updateVinyl(@PathVariable int vinylId, @RequestBody VinylRequest request) {
        VinylResponse response = VinylMapper.toResponse(vinylService.updateVinyl(vinylId, request));
        return ResponseEntity.ok(ApiResponse.ok(response, "Vinilo actualizado correctamente"));
    }

    @PatchMapping("/{vinylId}/enabled")
    public ResponseEntity<ApiResponse<VinylResponse>> setEnabled(@PathVariable int vinylId, @RequestParam boolean enabled) {
        VinylResponse response = VinylMapper.toResponse(vinylService.setEnabled(vinylId, enabled));
        return ResponseEntity.ok(ApiResponse.ok(response, enabled ? "Vinilo habilitado" : "Vinilo deshabilitado"));
    }

    @DeleteMapping("/{vinylId}")
    public ResponseEntity<ApiResponse<Void>> deleteVinyl(@PathVariable int vinylId) {
        vinylService.deleteVinyl(vinylId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Vinilo eliminado correctamente"));
    }

    @PatchMapping("/{vinylId}/stock")
    public ResponseEntity<ApiResponse<VinylResponse>> updateStock(@PathVariable int vinylId, @RequestParam int quantity) {
        VinylResponse response = VinylMapper.toResponse(vinylService.updateStock(vinylId, quantity));
        return ResponseEntity.ok(ApiResponse.ok(response, "Stock actualizado correctamente"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> search(@RequestParam(required = false, defaultValue = "") String searchTerm) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.searchAllVinyls(searchTerm)),
                "No se encontraron vinilos para \"" + searchTerm + "\""));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> filter(@RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Integer artistId,
            @RequestParam(required = false) Integer genreId) {
        return ResponseEntity.ok(ApiResponse.list(
                map(vinylService.filterVinyls(categoryId, minPrice, maxPrice, inStock, artistId, genreId)),
                "No hay vinilos que cumplan los filtros indicados"));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> byArtist(@PathVariable int artistId) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getAllVinylsByArtist(artistId)),
                "Este artista no tiene vinilos cargados"));
    }

    @GetMapping("/genre/{genreId}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> byGenre(@PathVariable int genreId) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getAllVinylsByGenre(genreId)),
                "Este genero no tiene vinilos cargados"));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<VinylResponse>>> byCategory(@PathVariable int categoryId) {
        return ResponseEntity.ok(ApiResponse.list(map(vinylService.getAllVinylsByCategory(categoryId)),
                "Esta categoria no tiene vinilos cargados"));
    }

    private List<VinylResponse> map(List<com.uade.tpo.marketplace.entity.Vinyl> vinyls) {
        return vinyls.stream().map(VinylMapper::toResponse).toList();
    }
}