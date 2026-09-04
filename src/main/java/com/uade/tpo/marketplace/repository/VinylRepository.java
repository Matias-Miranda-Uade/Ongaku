package com.uade.tpo.marketplace.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.Vinyl;

public interface VinylRepository extends JpaRepository<Vinyl, Long> {

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("select v from Vinyl v where v.id = :id")
        Optional<Vinyl> findByIdForUpdate(Long id);

    @Query("select v from Vinyl v where lower(v.name) like lower(concat('%', ?1, '%')) " +
            "or lower(v.description) like lower(concat('%', ?1, '%'))")
    List<Vinyl> search(String query);

    @Query("select v from Vinyl v where " +
            "(?1 is null or v.category.id = ?1) and " +
            "(?2 is null or v.price >= ?2) and " +
            "(?3 is null or v.price <= ?3) and " +
            "(?4 is null or (?4 = true and v.stock > 0) or (?4 = false and v.stock <= 0)) and " +
            "(?5 is null or v.artist.id = ?5)")
    List<Vinyl> filter(
            Integer categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Integer artistId);

    @Modifying
    @Transactional
    @Query("update Vinyl v set v.stock = v.stock + ?2 " +
            "where v.id = ?1 and v.stock + ?2 >= 0")
    int updateStock(Long vinylId, int quantityDelta);

    @Query("select v from Vinyl v where v.artist.id = ?1")
    List<Vinyl> findByArtistId(Long artistId);

    @Query("select v from Vinyl v where v.genre.id = ?1")
    List<Vinyl> findByGenreId(Long genreId);

    @Query("select v from Vinyl v where v.category.id = ?1")
    List<Vinyl> findByCategoryId(Long categoryId);

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
