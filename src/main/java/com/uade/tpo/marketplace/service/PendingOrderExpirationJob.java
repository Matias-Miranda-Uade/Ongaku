package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.repository.OrderRepository;

@Component
public class PendingOrderExpirationJob {
    private static final Logger log = LoggerFactory.getLogger(PendingOrderExpirationJob.class);

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Value("${application.orders.pending-expiration-minutes:30}")
    private long expirationMinutes;

    public PendingOrderExpirationJob(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @Scheduled(fixedDelay = 60000)
    public void expirePendingOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(expirationMinutes);
        List<Long> orderIds = orderRepository.findPendingOrderIdsCreatedBefore(
                OrderStatusType.PENDIENTE.getId(), cutoff);
        for (Long orderId : orderIds) {
            try {
                orderService.expirePendingOrder(orderId);
            } catch (Exception exception) {
                log.error("No se pudo vencer la orden pendiente {}", orderId, exception);
            }
        }
    }
}
