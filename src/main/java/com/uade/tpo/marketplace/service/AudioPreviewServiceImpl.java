package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.entity.dto.AudioPreviewRequest;
import com.uade.tpo.marketplace.entity.dto.mapper.AudioPreviewMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
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
        return audioPreviewRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Audio preview", id));
    }

    @Override
    public AudioPreview createAudioPreview(AudioPreviewRequest request) {

        if (request == null) {
            throw new InvalidRequestException("Los datos del audio preview son obligatorios");
        }
        if (request.getUrl() == null || request.getUrl().isBlank()) {
            throw new InvalidFieldException("url", "no puede estar vacia");
        }
        if (request.getDurationSeconds() <= 0) {
            throw new InvalidFieldException("durationSeconds", "debe ser mayor a cero");
        }

        return audioPreviewRepository.save(AudioPreviewMapper.toEntity(request));
    }
}