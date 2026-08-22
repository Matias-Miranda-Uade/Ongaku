package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.AudioPreview;
import org.springframework.stereotype.Repository;

@Repository
public class AudioPreviewRepository {

    public static ArrayList<AudioPreview> audioPreviews = new ArrayList<>();

    private int nextId() {
        return audioPreviews.stream().mapToInt(AudioPreview::getId).max().orElse(0) + 1;
    }

    public ArrayList<AudioPreview> getAudioPreviews() {
        return audioPreviews;
    }

    public AudioPreview getAudioPreviewById(int audioPreviewId) {
        for (AudioPreview ap : audioPreviews) {
            if (ap.getId() == audioPreviewId) {
                return ap;
            }
        }
        return null;
    }

    public AudioPreview createAudioPreview(AudioPreview audioPreview) {
        audioPreview.setId(nextId());
        audioPreviews.add(audioPreview);
        return audioPreview;
    }
}