package com.uade.tpo.marketplace.service;

import java.util.List;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatusType;

public interface OrderService {

    /** Historial del usuario autenticado; para un admin, todas las ordenes. */
    List<Order> getOrders(String requesterEmail);

    Order getOrderById(long orderId, String requesterEmail);

    /** Crea la orden en estado PENDIENTE a partir del carrito del usuario. */
    Order createOrder(String requesterEmail);

    Order updateStatus(long orderId, OrderStatusType target, String requesterEmail);

    /** Cambio de estado interno (pagos): no depende de un usuario autenticado. */
    Order applyStatus(Order order, OrderStatusType target);
}
