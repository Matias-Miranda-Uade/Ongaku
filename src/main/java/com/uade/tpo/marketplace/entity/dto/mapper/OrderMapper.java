package com.uade.tpo.marketplace.entity.dto.mapper;

import java.util.Collections;
import java.util.List;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;

public final class OrderMapper {
    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {
        if (order == null) return null;
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderDate(order.getOrderDate());
        response.setTotal(order.getTotal());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setOrderStatus(OrderStatusMapper.toResponse(order.getOrderStatus()));
        List<Long> vinylIds = order.getVinyl() == null
                ? Collections.emptyList()
                : order.getVinyl().stream().map(com.uade.tpo.marketplace.entity.Vinyl::getId).toList();
        response.setVinylIds(vinylIds);
        java.util.Map<Long, Integer> quantities = new java.util.LinkedHashMap<>();
        if (order.getVinyl() != null) {
            order.getVinyl().forEach(vinyl -> quantities.put(vinyl.getId(), order.quantityOf(vinyl.getId())));
        }
        response.setQuantities(quantities);
        return response;
    }
}
