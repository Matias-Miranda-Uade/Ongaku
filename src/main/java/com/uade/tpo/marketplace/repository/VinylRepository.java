package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Vinyl;

@Repository
public interface VinylRepository extends JpaRepository<Vinyl, Long> {

    List<Vinyl> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    List<Vinyl> findByArtist_Id(Long artistId);

    List<Vinyl> findByGenre_Id(Long genreId);

    List<Vinyl> findByCategory_Id(Long categoryId);

    List<Vinyl> findByYear(int year);

    List<Vinyl> findAllByOrderByPriceAsc();

    List<Vinyl> findAllByOrderByPriceDesc();

    List<Vinyl> findAllByOrderByYearAsc();

    List<Vinyl> findAllByOrderByYearDesc();
}