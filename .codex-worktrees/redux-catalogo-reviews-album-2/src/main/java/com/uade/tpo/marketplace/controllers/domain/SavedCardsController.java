package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.SavedCardRequest;
import com.uade.tpo.marketplace.service.SavedCardService;

@RestController @RequestMapping("/users/me/cards")
public class SavedCardsController {
    private final SavedCardService service;
    public SavedCardsController(SavedCardService service) { this.service=service; }
    @GetMapping public ResponseEntity<ApiResponse<List<SavedCardService.Response>>> list(Principal principal) { return ResponseEntity.ok(ApiResponse.ok(service.list(principal.getName()))); }
    @PostMapping public ResponseEntity<ApiResponse<SavedCardService.Response>> create(@Valid @RequestBody SavedCardRequest request,Principal principal) { return ResponseEntity.status(201).body(ApiResponse.created(service.save(null,request,principal.getName()),"Tarjeta de prueba guardada")); }
    @PatchMapping("/{id}") public ResponseEntity<ApiResponse<SavedCardService.Response>> update(@PathVariable long id,@Valid @RequestBody SavedCardRequest request,Principal principal) { return ResponseEntity.ok(ApiResponse.ok(service.save(id,request,principal.getName()))); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable long id,Principal principal) { service.delete(id,principal.getName()); return ResponseEntity.noContent().build(); }
}
