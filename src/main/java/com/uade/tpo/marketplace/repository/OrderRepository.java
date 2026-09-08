package com.uade.tpo.marketplace.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.marketplace.entity.Order;

import jakarta.persistence.LockModeType;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Order o where o.id = :id")
    Optional<Order> findForUpdateById(Long id);

    /** Trae la orden con sus lineas en una sola consulta. */
    @Query("select o from Order o left join fetch o.items where o.id = :id")
    Optional<Order> findDetailById(Long id);

    /** Historial del usuario, de la mas reciente a la mas antigua. */
    @Query("select o from Order o left join fetch o.items where o.user.id = :userId order by o.id desc")
    List<Order> findByUserId(Long userId);

    @Query("select o from Order o left join fetch o.items order by o.id desc")
    List<Order> findAllMostRecentFirst();

    @Query("select o from Order o where o.orderStatus.id = :orderStatusId order by o.id desc")
    List<Order> findByOrderStatusId(Long orderStatusId);

    /** Un vinilo que ya fue comprado no se puede borrar del catalogo. */
    @Query("select count(i) > 0 from OrderItem i where i.vinyl.id = :vinylId")
    boolean existsOrderItemForVinyl(Long vinylId);

    /** Solo se puede reseñar un vinilo que el usuario efectivamente compro. */
    @Query("select count(i) > 0 from Order o join o.items i " +
            "where o.user.id = :userId and i.vinyl.id = :vinylId and o.orderStatus.id in :statusIds")
    boolean hasPurchasedVinyl(Long userId, Long vinylId, Collection<Long> statusIds);
}
