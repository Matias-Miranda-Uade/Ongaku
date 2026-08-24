package com.uade.tpo.marketplace.repository;

import java.util.List;

import com.uade.tpo.marketplace.entity.DashboardSummary;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.Payment;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public DashboardRepository(OrderRepository orderRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    // IDs de OrderStatus: 1 PENDIENTE, 2 PAGADA, 3 ENVIADA, 4 ENTREGADA, 5 CANCELADA
    public DashboardSummary getSummary() {
        List<Order> orders = orderRepository.findAll();
        List<Payment> payments = paymentRepository.findAll();

        int pendingOrders = 0;
        int paidOrders = 0;
        int shippedOrders = 0;
        int deliveredOrders = 0;
        int cancelledOrders = 0;
        double totalRevenue = 0;

        for (Order order : orders) {
            switch (order.getOrderStatusId()) {
                case 1 -> pendingOrders++;
                case 2 -> paidOrders++;
                case 3 -> shippedOrders++;
                case 4 -> deliveredOrders++;
                case 5 -> cancelledOrders++;
                default -> {
                }
            }
            if (order.getOrderStatusId() != 5) {
                totalRevenue += order.getTotal();
            }
        }

        double averageOrderValue = orders.isEmpty() ? 0 : totalRevenue / orders.size();

        return DashboardSummary.builder()
                .totalOrders(orders.size())
                .pendingOrders(pendingOrders)
                .paidOrders(paidOrders)
                .shippedOrders(shippedOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .averageOrderValue(averageOrderValue)
                .totalPayments(payments.size())
                .build();
    }
}