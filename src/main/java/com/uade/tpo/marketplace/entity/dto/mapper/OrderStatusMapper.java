package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.dto.OrderStatusResponse;

public final class OrderStatusMapper {
    private OrderStatusMapper() {
    }

    public static OrderStatusResponse toResponse(OrderStatus status) {
        if (status == null) return null;
        OrderStatusResponse response = new OrderStatusResponse();
        response.setId(status.getId());
        response.setName(status.getName());
        response.setDescription(status.getDescription());
        return response;
    }
}
