package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.repository.AudioPreviewRepository;

@Service
public class AudioPreviewServiceImpl implements AudioPreviewService {
    private final AudioPreviewRepository audioPreviewRepository;
    public AudioPreviewServiceImpl(AudioPreviewRepository audioPreviewRepository) { this.audioPreviewRepository = audioPreviewRepository; }
    public ArrayList<AudioPreview> getAudioPreviews() { return audioPreviewRepository.getAudioPreviews(); }
    public AudioPreview getAudioPreviewById(int id) { return audioPreviewRepository.getAudioPreviews().stream().filter(p -> p.getId() == id).findFirst().orElse(null); }
    public AudioPreview createAudioPreview(AudioPreview preview) {
        if (preview == null || preview.getUrl() == null || preview.getUrl().isBlank() || preview.getDurationSeconds() <= 0) throw new IllegalArgumentException("El preview debe tener URL y duracion positiva");
        preview.setId(audioPreviewRepository.getAudioPreviews().stream().mapToLong(AudioPreview::getId).max().orElse(0) + 1);
        audioPreviewRepository.getAudioPreviews().add(preview);
        return preview;
    }
}