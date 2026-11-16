package com.uade.tpo.marketplace.controllers.domain;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.service.CoverStorageService;
import java.io.IOException;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class CoverController {
    private final CoverStorageService storage;

    public CoverController(CoverStorageService storage) { this.storage = storage; }

    @PostMapping("/admin/vinyls/covers")
    public ResponseEntity<ApiResponse<Map<String, String>>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(201).body(ApiResponse.created(Map.of("url", storage.save(file)), "Portada guardada"));
    }

    @GetMapping("/media/covers/{filename}")
    public ResponseEntity<Resource> read(@PathVariable String filename) throws IOException {
        return ResponseEntity.ok().header("X-Content-Type-Options", "nosniff")
                .header("Cache-Control", "public, max-age=31536000, immutable")
                .header("Content-Type", filename.endsWith(".png") ? "image/png" : "image/jpeg")
                .body(storage.read(filename));
    }
}
