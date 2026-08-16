package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.repository.AudioPreviewRepository;

public class AudioPreviewService {
    private final AudioPreviewRepository audioPreviewRepository = new AudioPreviewRepository();

    public ArrayList<AudioPreview> getAudioPreviews() {
        return audioPreviewRepository.getAudioPreviews();
    }

    public AudioPreview getAudioPreviewById(int audioPreviewId) {
        return audioPreviewRepository.getAudioPreviewById(audioPreviewId);
    }

    public AudioPreview createAudioPreview(AudioPreview audioPreview) {
        return audioPreviewRepository.createAudioPreview(audioPreview);
    }
}