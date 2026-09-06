package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.entity.dto.AudioPreviewRequest;
import com.uade.tpo.marketplace.entity.dto.AudioPreviewResponse;

public final class AudioPreviewMapper {
    private AudioPreviewMapper() {
    }

    public static AudioPreviewResponse toResponse(AudioPreview preview) {
        if (preview == null) return null;
        AudioPreviewResponse response = new AudioPreviewResponse();
        response.setId(preview.getId());
        response.setUrl(preview.getUrl());
        response.setDurationSeconds(preview.getDurationSeconds());
        return response;
    }

    public static AudioPreview toEntity(AudioPreviewRequest request) {
        AudioPreview preview = new AudioPreview();
        if (request.getUrl() != null) preview.setUrl(request.getUrl());
        preview.setDurationSeconds(request.getDurationSeconds());
        return preview;
    }
}
