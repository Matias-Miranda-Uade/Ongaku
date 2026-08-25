package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.repository.AudioPreviewRepository;

@Service
public class AudioPreviewServiceImpl implements AudioPreviewService {

    private final AudioPreviewRepository audioPreviewRepository;

    public AudioPreviewServiceImpl(
            AudioPreviewRepository audioPreviewRepository) {

        this.audioPreviewRepository = audioPreviewRepository;
    }

    @Override
    public ArrayList<AudioPreview> getAudioPreviews() {
        return new ArrayList<>(
            audioPreviewRepository.findAll()
        );
    }

    @Override
    public AudioPreview getAudioPreviewById(int id) {
        return audioPreviewRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public AudioPreview createAudioPreview(
            AudioPreview preview) {

        if (preview == null ||
            preview.getUrl() == null ||
            preview.getUrl().isBlank() ||
            preview.getDurationSeconds() <= 0) {

            throw new IllegalArgumentException(
                "El preview debe tener URL y duracion positiva"
            );
        }

        preview.setId(null);

        return audioPreviewRepository.save(preview);
    }
}