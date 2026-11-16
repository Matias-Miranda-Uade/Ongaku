package com.uade.tpo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.AudioPreview;

public interface AudioPreviewRepository extends JpaRepository<AudioPreview, Long> {
}