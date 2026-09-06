package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.marketplace.entity.Cart;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Cart e where e.id = :id")
    java.util.Optional<Cart> findForUpdateById(Long id);

    @Query("SELECT c FROM Cart c WHERE c.user.id = :userId")
    List<Cart> findByUserId(int userId);

    @Query("SELECT c FROM Cart c JOIN c.items i WHERE c.user.id = :userId AND i.id = :vinylId")
    List<Cart> findByUserIdAndVinylId(int userId, int vinylId);
}