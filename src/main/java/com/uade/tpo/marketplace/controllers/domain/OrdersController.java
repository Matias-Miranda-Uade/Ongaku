package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.dto.OrderRequest;
import com.uade.tpo.marketplace.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired private OrderService orderService;

    @GetMapping
    public ArrayList<Order> getOrders() { return orderService.getOrders(); }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable int orderId) {
        Order order = orderService.getOrderById(orderId);
        return order == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(order);
    }

    // Crea la orden usando todos los vinilos del carrito indicado.
    @PostMapping("/cart/{cartId}")
    public ResponseEntity<Order> createOrderFromCart(@PathVariable int cartId) {
        Order order = orderService.createOrderFromCart(cartId);
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PostMapping("/from-cart")
    public ResponseEntity<Order> createOrderFromCartQuery(@RequestParam int cartId) {
        Order order = orderService.createOrderFromCart(cartId);
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    // Crea una orden simple para un usuario con el total indicado.
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        String entity = request.getUserId() + "," + request.getTotal();
        return ResponseEntity.ok(orderService.createOrder(entity));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable int orderId, @RequestParam int orderStatusId) {
        Order order = orderService.updateOrderStatus(orderId, orderStatusId);
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PatchMapping("/{orderId}/status/{orderStatusId}")
    public ResponseEntity<Order> updateOrderStatusPath(@PathVariable int orderId, @PathVariable int orderStatusId) {
        Order order = orderService.updateOrderStatus(orderId, orderStatusId);
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable int orderId,
            @RequestParam(required = false) Integer orderStatusId,
            @RequestBody(required = false) OrderRequest request) {
        int statusId = orderStatusId != null
                ? orderStatusId
                : request == null ? 0 : request.getOrderStatusId();
        Order order = orderService.updateOrderStatus(orderId, statusId);
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }
}
