package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.service.OrderStatusService;

@RestController
@RequestMapping("order-statuses")
public class OrderStatusesController {

    @GetMapping
    public ArrayList<OrderStatus> getOrderStatuses() {
        OrderStatusService orderStatusService = new OrderStatusService();
        return orderStatusService.getOrderStatuses();
    }

    @GetMapping("/{orderStatusId}")
    public ResponseEntity<OrderStatus> getOrderStatusById(@PathVariable int orderStatusId) {
        OrderStatusService orderStatusService = new OrderStatusService();
        OrderStatus orderStatus = orderStatusService.getOrderStatusById(orderStatusId);
        if (orderStatus == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderStatus);
    }

    @PostMapping
    public OrderStatus createOrderStatus(@RequestBody String entity) {
        OrderStatusService orderStatusService = new OrderStatusService();
        return orderStatusService.createOrderStatus(entity);
    }
}