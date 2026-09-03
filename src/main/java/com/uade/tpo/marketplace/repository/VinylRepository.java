package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.Vinyl;

public interface VinylRepository extends JpaRepository<Vinyl, Long> {

        @Query("select v from Vinyl v where (v.enabled is null or v.enabled = true) and v.stock > 0 and " +
            "(lower(v.name) like lower(concat('%', ?1, '%')) or " +
            "lower(v.description) like lower(concat('%', ?1, '%')))")
    List<Vinyl> searchPublic(String query);

    @Query("select v from Vinyl v where lower(v.name) like lower(concat('%', ?1, '%')) " +
            "or lower(v.description) like lower(concat('%', ?1, '%'))")
    List<Vinyl> searchAll(String query);

        @Query("select v from Vinyl v where (v.enabled is null or v.enabled = true) and v.stock > 0 and " +
            "(?1 is null or v.category.id = ?1) and " +
            "(?2 is null or v.price >= ?2) and " +
            "(?3 is null or v.price <= ?3) and (?4 is null or v.artist.id = ?4) and " +
            "(?5 is null or v.genre.id = ?5)")
    List<Vinyl> filterPublic(Integer categoryId, Double minPrice, Double maxPrice,
            Integer artistId, Integer genreId);

    @Query("select v from Vinyl v where " +
            "(?1 is null or v.category.id = ?1) and " +
            "(?2 is null or v.price >= ?2) and " +
            "(?3 is null or v.price <= ?3) and " +
            "(?4 is null or (?4 = true and v.stock > 0) or (?4 = false and v.stock <= 0)) and " +
            "(?5 is null or v.artist.id = ?5) and (?6 is null or v.genre.id = ?6)")
    List<Vinyl> filterAll(
            Integer categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Integer artistId,
            Integer genreId);

    @Modifying
    @Transactional
    @Query("update Vinyl v set v.stock = v.stock + ?2 " +
            "where v.id = ?1 and v.stock + ?2 >= 0")
    int updateStock(Long vinylId, int quantityDelta);

        @Query("select v from Vinyl v where (v.enabled is null or v.enabled = true) and v.stock > 0 and v.artist.id = ?1")
        List<Vinyl> findPublicByArtistId(Long artistId);

        @Query("select v from Vinyl v where v.artist.id = ?1")
        List<Vinyl> findAllByArtistId(Long artistId);

        @Query("select v from Vinyl v where (v.enabled is null or v.enabled = true) and v.stock > 0 and v.genre.id = ?1")
        List<Vinyl> findPublicByGenreId(Long genreId);

        @Query("select v from Vinyl v where v.genre.id = ?1")
        List<Vinyl> findAllByGenreId(Long genreId);

        @Query("select v from Vinyl v where (v.enabled is null or v.enabled = true) and v.stock > 0 and v.category.id = ?1")
        List<Vinyl> findPublicByCategoryId(Long categoryId);

        @Query("select v from Vinyl v where v.category.id = ?1")
        List<Vinyl> findAllByCategoryId(Long categoryId);

    @Query("select v from Vinyl v where v.year = ?1")
    List<Vinyl> findByYear(int year);

    @Query("select v from Vinyl v order by v.price asc")
    List<Vinyl> findAllOrderByPriceAsc();

    @Query("select v from Vinyl v order by v.price desc")
    List<Vinyl> findAllOrderByPriceDesc();

    @Query("select v from Vinyl v order by v.year asc")
    List<Vinyl> findAllOrderByYearAsc();

    @Query("select v from Vinyl v order by v.year desc")
    List<Vinyl> findAllOrderByYearDesc();
}
