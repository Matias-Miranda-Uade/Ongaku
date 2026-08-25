package com.uade.tpo.marketplace.repository;

import java.util.List;
<<<<<<< HEAD

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Genre;
public interface GenreRepository extends JpaRepository<Genre, Long> {

    List<Genre> findByName(String name);
=======

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    List<Genre> findByNameIgnoreCase(String name);
>>>>>>> origin/main
}