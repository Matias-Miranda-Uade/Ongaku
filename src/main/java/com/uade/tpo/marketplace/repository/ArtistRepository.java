package com.uade.tpo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Artist;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Artist findByName(String name);
}