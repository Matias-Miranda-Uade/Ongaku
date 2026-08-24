package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.OrderStatus;
import org.springframework.stereotype.Repository;

@Repository
public class OrderStatusRepository {
    public ArrayList<OrderStatus> orderStatuses = new ArrayList<>(Arrays.asList(
            OrderStatus.builder().id(1).name("PENDIENTE").description("La orden fue creada y espera confirmación de pago").build(),
            OrderStatus.builder().id(2).name("PAGADA").description("El pago de la orden fue aprobado").build(),
            OrderStatus.builder().id(3).name("ENVIADA").description("La orden fue despachada al comprador").build(),
            OrderStatus.builder().id(4).name("ENTREGADA").description("La orden fue entregada al comprador").build(),
            OrderStatus.builder().id(5).name("CANCELADA").description("La orden fue cancelada").build()
    ));

    public ArrayList<OrderStatus> getOrderStatuses() {
        return this.orderStatuses;
    }

    public OrderStatus getOrderStatusById(int orderStatusId) {
        return null;
    }

    public OrderStatus createOrderStatus(String entity) {
        return null;
    }
}