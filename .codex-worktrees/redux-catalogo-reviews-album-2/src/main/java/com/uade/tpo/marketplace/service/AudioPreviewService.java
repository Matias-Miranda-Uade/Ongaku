package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.entity.dto.AudioPreviewRequest;
import java.util.ArrayList;

public interface AudioPreviewService {
    ArrayList<AudioPreview> getAudioPreviews();
    AudioPreview getAudioPreviewById(int audioPreviewId);
    AudioPreview createAudioPreview(AudioPreviewRequest request);
}