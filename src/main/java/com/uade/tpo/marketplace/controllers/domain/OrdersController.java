package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.dto.OrderRequest;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;
import com.uade.tpo.marketplace.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired private OrderService orderService;

    @GetMapping
    public ArrayList<OrderResponse> getOrders(Authentication authentication) {
        return orderService.getOrders(authentication.getName(), isAdministrator(authentication));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable int orderId, Authentication authentication) {
        OrderResponse order = orderService.getOrderById(orderId, authentication.getName(), isAdministrator(authentication));
        return order == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(order);
    }

    // Crea la orden usando el carrito del usuario autenticado.
    @PostMapping("/cart")
    public ResponseEntity<Order> createOrderFromCart(Principal principal) {
        Order order = orderService.createOrderFromCart(principal.getName());
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PostMapping("/from-cart")
    public ResponseEntity<Order> createOrderFromCartQuery(Principal principal) {
        Order order = orderService.createOrderFromCart(principal.getName());
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable int orderId, @RequestParam int orderStatusId,
            Authentication authentication) {
        Order order = orderService.updateOrderStatus(orderId, orderStatusId, authentication.getName(),
                isAdministrator(authentication));
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PatchMapping("/{orderId}/status/{orderStatusId}")
    public ResponseEntity<Order> updateOrderStatusPath(@PathVariable int orderId, @PathVariable int orderStatusId,
            Authentication authentication) {
        Order order = orderService.updateOrderStatus(orderId, orderStatusId, authentication.getName(),
                isAdministrator(authentication));
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable int orderId,
            @RequestParam(required = false) Integer orderStatusId,
            @RequestBody(required = false) OrderRequest request,
            Authentication authentication) {
        int statusId = orderStatusId != null
                ? orderStatusId
                : request == null ? 0 : request.getOrderStatusId();
        Order order = orderService.updateOrderStatus(orderId, statusId, authentication.getName(),
            isAdministrator(authentication));
        return order == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(order);
    }

    private boolean isAdministrator(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ADMIN".equals(authority.getAuthority()));
    }
}
