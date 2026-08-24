package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    public OrderServiceImpl(OrderRepository repository) { this.orderRepository = repository; }
    public ArrayList<Order> getOrders() { return orderRepository.getOrders(); }
    public Order getOrderById(int id) { return orderRepository.getOrders().stream().filter(o -> o.getId() == id).findFirst().orElse(null); }
    public Order createOrder(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",");
        if (values.length < 2) throw new IllegalArgumentException("La orden requiere usuario y total");
        int userId = Integer.parseInt(values[0].trim()); double total = Double.parseDouble(values[1].trim());
        if (userId <= 0 || total <= 0) throw new IllegalArgumentException("Los datos de la orden son invalidos");
        Order order = Order.builder().id(orderRepository.getOrders().stream().mapToLong(Order::getId).max().orElse(0) + 1).userId(userId).orderStatusId(1).orderDate(java.time.LocalDate.now().toString()).total(total).build();
        orderRepository.getOrders().add(order); return order;
    }
    public Order updateOrderStatus(int orderId, int statusId) {
        Order order = getOrderById(orderId); if (order == null || statusId < 1 || statusId > 5) return null;
        if (order.getOrderStatusId() == 5 || (statusId < order.getOrderStatusId() && statusId != 5)) throw new IllegalStateException("La orden no puede retroceder de estado");
        order.setOrderStatusId(statusId); return order;
    }
}