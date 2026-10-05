package com.uade.tpo.marketplace.entity.dto.mapper;

import java.util.List;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderItem;
import com.uade.tpo.marketplace.entity.dto.OrderItemResponse;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;

public final class OrderMapper {

    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {
        if (order == null) return null;
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCreatedAt(order.getCreatedAt());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setUserName(order.getUser() != null ? order.getUser().getFullName() : null);
        response.setOrderStatus(OrderStatusMapper.toResponse(order.getOrderStatus()));
        List<OrderItemResponse> items = order.getItems().stream().map(OrderMapper::toItemResponse).toList();
        response.setItems(items);
        response.setTotalProducts(order.getTotalProducts());
        response.setTotalUnits(order.getTotalUnits());
        response.setTotal(order.getTotal());
        return response;
    }

    public static OrderItemResponse toItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setVinylId(item.getVinyl() != null ? item.getVinyl().getId() : null);
        response.setName(item.getVinylName());
        response.setArtistName(item.getArtistName());
        response.setImage(item.getImage());
        response.setUnitPrice(item.getUnitPrice());
        response.setOriginalPrice(item.getOriginalPrice());
        response.setDiscountPercentage(item.getDiscountPercentage());
        response.setDiscountAmount(item.getOriginalPrice() - item.getUnitPrice());
        response.setFinalPrice(item.getUnitPrice());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
