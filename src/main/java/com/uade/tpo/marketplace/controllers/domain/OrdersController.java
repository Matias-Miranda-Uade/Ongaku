package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.OrderRequest;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.OrderMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired private OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(Principal principal) {
        List<OrderResponse> orders = orderService.getOrders(principal.getName()).stream().map(OrderMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(orders, "No hay ordenes cargadas"));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable int orderId, Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(OrderMapper.toResponse(orderService.getOrderById(orderId, principal.getName()))));
    }

    @PostMapping("/cart/{cartId}")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrderFromCart(@PathVariable int cartId, Principal principal) {
        OrderResponse response = OrderMapper.toResponse(orderService.createOrderFromCart(cartId, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Orden creada a partir del carrito"));
    }

    @PostMapping("/from-cart")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrderFromCartQuery(@RequestParam int cartId, Principal principal) {
        OrderResponse response = OrderMapper.toResponse(orderService.createOrderFromCart(cartId, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Orden creada a partir del carrito"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody com.uade.tpo.marketplace.entity.dto.CheckoutRequest request, Principal principal) {
        OrderResponse response = OrderMapper.toResponse(orderService.createOrderFromCart(request.cartId(), principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Orden creada correctamente"));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@PathVariable int orderId, @RequestParam int orderStatusId) {
        OrderResponse response = OrderMapper.toResponse(orderService.updateOrderStatus(orderId, orderStatusId));
        return ResponseEntity.ok(ApiResponse.ok(response, "Estado de la orden actualizado"));
    }

    @PatchMapping("/{orderId}/status/{orderStatusId}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatusPath(@PathVariable int orderId, @PathVariable int orderStatusId) {
        OrderResponse response = OrderMapper.toResponse(orderService.updateOrderStatus(orderId, orderStatusId));
        return ResponseEntity.ok(ApiResponse.ok(response, "Estado de la orden actualizado"));
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable int orderId,
            @RequestParam(required = false) Integer orderStatusId,
            @RequestBody(required = false) OrderRequest request) {
        Integer statusId = orderStatusId != null ? orderStatusId : (request == null ? null : request.getOrderStatusId());
        if (statusId == null) {
            throw new InvalidFieldException("orderStatusId", "es obligatorio");
        }
        OrderResponse response = OrderMapper.toResponse(orderService.updateOrderStatus(orderId, statusId));
        return ResponseEntity.ok(ApiResponse.ok(response, "Estado de la orden actualizado"));
    }
}