package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.service.AudioPreviewService;

@RestController
@RequestMapping("audio-previews")
public class AudioPreviewsController {
    @Autowired
    private AudioPreviewService audioPreviewService;

    @GetMapping
    public ArrayList<AudioPreview> getAudioPreviews() {
        return audioPreviewService.getAudioPreviews();
    }

    @GetMapping("/{audioPreviewId}")
    public ResponseEntity<AudioPreview> getAudioPreviewById(@PathVariable int audioPreviewId) {
        AudioPreview audioPreview = audioPreviewService.getAudioPreviewById(audioPreviewId);
        if (audioPreview == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(audioPreview);
    }

    @PostMapping
    public AudioPreview createAudioPreview(@RequestBody AudioPreview audioPreview) {
        return audioPreviewService.createAudioPreview(audioPreview);
    }
}