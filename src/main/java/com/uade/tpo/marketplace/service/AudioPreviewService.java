package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.AudioPreview;
import java.util.ArrayList;

public interface AudioPreviewService {
    ArrayList<AudioPreview> getAudioPreviews();
    AudioPreview getAudioPreviewById(int audioPreviewId);
    AudioPreview createAudioPreview(AudioPreview audioPreview);
}