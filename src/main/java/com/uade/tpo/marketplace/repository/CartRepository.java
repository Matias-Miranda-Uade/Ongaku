package com.uade.tpo.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.marketplace.entity.Cart;

import jakarta.persistence.LockModeType;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findFirstByUser_IdOrderByIdAsc(Long userId);

    /**
     * Bloquea el carrito del usuario para que dos pedidos simultaneos no puedan
     * modificarlo (o comprarlo) a la vez. Devuelve lista por prudencia: si una
     * instalacion vieja tuviera carritos duplicados, se usa el primero.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Cart c where c.user.id = :userId order by c.id asc")
    List<Cart> findForUpdateByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Cart c where c.id = :id")
    Optional<Cart> findForUpdateById(Long id);
}
