package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.ShippingAddress;
import com.uade.tpo.marketplace.service.AddressService;

@RestController
@RequestMapping("/users/me/addresses")
public class AddressesController {
    private final AddressService service;
    public AddressesController(AddressService service) { this.service=service; }
    @GetMapping public ResponseEntity<ApiResponse<List<AddressService.Response>>> list(Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.list(principal.getName())));
    }
    @PostMapping public ResponseEntity<ApiResponse<AddressService.Response>> create(@Valid @RequestBody ShippingAddress body,Principal principal) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.save(null,body,principal.getName()),"Direccion guardada"));
    }
    @PatchMapping("/{id}") public ResponseEntity<ApiResponse<AddressService.Response>> update(@PathVariable long id,@Valid @RequestBody ShippingAddress body,Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.save(id,body,principal.getName())));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable long id,Principal principal) {
        service.delete(id,principal.getName()); return ResponseEntity.noContent().build();
    }
}
