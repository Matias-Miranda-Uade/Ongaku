package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;
import com.uade.tpo.marketplace.entity.dto.OrderStatusUpdateRequest;
import com.uade.tpo.marketplace.entity.dto.mapper.OrderMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrderService orderService;

    /** Todas las ordenes del usuario autenticado (para un admin, las de todos). */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(Principal principal) {
        List<OrderResponse> orders = orderService.getOrders(principal.getName()).stream()
                .map(OrderMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(orders, "Todavia no tenes ordenes"));
    }

    /** Detalle de una orden propia (el admin puede ver cualquiera). */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable long orderId, Principal principal) {
        OrderResponse response = OrderMapper.toResponse(orderService.getOrderById(orderId, principal.getName()));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /** Checkout: la orden se arma con lo que haya en el carrito y nace PENDIENTE. */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(Principal principal) {
        OrderResponse response = OrderMapper.toResponse(orderService.createOrder(principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Orden creada a partir del carrito"));
    }

    /**
     * El comprador solo puede cancelar una orden PENDIENTE; el resto de los
     * estados (PAGADA, ENVIADA, ENTREGADA) los maneja el admin.
     */
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(@PathVariable long orderId,
            @RequestBody(required = false) OrderStatusUpdateRequest request, Principal principal) {
        OrderStatusType target = resolveStatus(request);
        OrderResponse response = OrderMapper.toResponse(
                orderService.updateStatus(orderId, target, principal.getName()));
        return ResponseEntity.ok(ApiResponse.ok(response, "La orden ahora esta " + target));
    }

    private OrderStatusType resolveStatus(OrderStatusUpdateRequest request) {
        if (request == null || (request.getStatus() == null && request.getOrderStatusId() == null)) {
            throw new InvalidRequestException("Indica el nuevo estado con 'status' o con 'orderStatusId'");
        }
        return request.getStatus() != null
                ? OrderStatusType.fromName(request.getStatus())
                : OrderStatusType.fromId(request.getOrderStatusId().longValue());
    }
}
