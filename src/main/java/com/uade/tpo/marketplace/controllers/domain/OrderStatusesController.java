package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.OrderStatusRequest;
import com.uade.tpo.marketplace.entity.dto.OrderStatusResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.OrderStatusMapper;
import com.uade.tpo.marketplace.service.OrderStatusService;

@RestController
@RequestMapping("order-statuses")
public class OrderStatusesController {
    @Autowired
    private OrderStatusService orderStatusService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderStatusResponse>>> getOrderStatuses() {
        List<OrderStatusResponse> statuses = orderStatusService.getOrderStatuses().stream()
                .map(OrderStatusMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(statuses, "No hay estados de orden cargados"));
    }

    @GetMapping("/{orderStatusId}")
    public ResponseEntity<ApiResponse<OrderStatusResponse>> getOrderStatusById(@PathVariable int orderStatusId) {
        return ResponseEntity.ok(ApiResponse.ok(OrderStatusMapper.toResponse(orderStatusService.getOrderStatusById(orderStatusId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderStatusResponse>> createOrderStatus(@RequestBody OrderStatusRequest request) {
        OrderStatusResponse response = OrderStatusMapper.toResponse(orderStatusService.createOrderStatus(request));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Estado de orden creado correctamente"));
    }
}