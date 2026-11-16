package com.uade.tpo.marketplace.controllers.domain;

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
import com.uade.tpo.marketplace.entity.dto.AudioPreviewRequest;
import com.uade.tpo.marketplace.entity.dto.AudioPreviewResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.AudioPreviewMapper;
import com.uade.tpo.marketplace.service.AudioPreviewService;

@RestController
@RequestMapping("audio-previews")
public class AudioPreviewsController {
    @Autowired
    private AudioPreviewService audioPreviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AudioPreviewResponse>>> getAudioPreviews() {
        List<AudioPreviewResponse> previews = audioPreviewService.getAudioPreviews().stream()
                .map(AudioPreviewMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(previews, "No hay audio previews cargados"));
    }

    @GetMapping("/{audioPreviewId}")
    public ResponseEntity<ApiResponse<AudioPreviewResponse>> getAudioPreviewById(@PathVariable int audioPreviewId) {
        return ResponseEntity.ok(ApiResponse.ok(AudioPreviewMapper.toResponse(audioPreviewService.getAudioPreviewById(audioPreviewId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AudioPreviewResponse>> createAudioPreview(@RequestBody AudioPreviewRequest request) {
        AudioPreviewResponse response = AudioPreviewMapper.toResponse(audioPreviewService.createAudioPreview(request));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Audio preview creado correctamente"));
    }
}