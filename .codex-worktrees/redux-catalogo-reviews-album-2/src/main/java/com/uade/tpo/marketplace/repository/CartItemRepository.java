package com.uade.tpo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.marketplace.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /** Saca un vinilo de todos los carritos, por ejemplo al borrarlo del catalogo. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from CartItem i where i.vinyl.id = :vinylId")
    int deleteByVinylId(Long vinylId);
}
