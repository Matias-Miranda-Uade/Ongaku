package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.OrderRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.EmptyCartException;
import com.uade.tpo.marketplace.exceptions.conflict.InsufficientStockException;
import com.uade.tpo.marketplace.exceptions.conflict.InvalidOrderStatusTransitionException;
import com.uade.tpo.marketplace.exceptions.conflict.OrderAlreadyCancelledException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class OrderServiceImpl implements OrderService {

    private static final long CANCELLED_STATUS_ID = 5L;

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final CartRepository cartRepository;
    private final VinylRepository vinylRepository;
    private final OwnershipGuard ownershipGuard;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderStatusRepository orderStatusRepository,
            CartRepository cartRepository,
            VinylRepository vinylRepository,
            OwnershipGuard ownershipGuard) {

        this.orderRepository = orderRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.cartRepository = cartRepository;
        this.vinylRepository = vinylRepository;
        this.ownershipGuard = ownershipGuard;
    }

    @Override
    public ArrayList<Order> getOrders() {
        return new ArrayList<>(orderRepository.findAll());
    }

    @Override
    public Order getOrderById(int id, String requesterEmail) {
        Order order = orderRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden", id));

        Long ownerId = order.getUser() != null ? order.getUser().getId() : null;
        ownershipGuard.assertSelfOrAdmin(requesterEmail, ownerId);

        return order;
    }

    @Override
    public Order createOrder(OrderRequest request, String requesterEmail) {

        if (request == null) {
            throw new InvalidRequestException("La orden requiere usuario y total");
        }
        if (request.getUserId() <= 0) {
            throw new InvalidFieldException("userId", "debe ser un identificador positivo");
        }
        if (request.getTotal() <= 0) {
            throw new InvalidFieldException("total", "debe ser mayor a cero");
        }

        User user = ownershipGuard.assertSelfOrAdmin(requesterEmail, (long) request.getUserId());

        long statusId = request.getOrderStatusId() > 0 ? request.getOrderStatusId() : 1L;
        OrderStatus status = orderStatusRepository.findById(statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", statusId));

        Order order = new Order();
        order.setUser(user);
        order.setOrderStatus(status);
        order.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : LocalDate.now().toString());
        order.setTotal(request.getTotal());

        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(int orderId, int statusId) {

        Order order = orderRepository.findById((long) orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden", orderId));

        if (statusId < 1) {
            throw new InvalidFieldException("orderStatusId", "debe ser un identificador positivo");
        }

        OrderStatus currentStatus = order.getOrderStatus();

        if (currentStatus != null && currentStatus.getId() == CANCELLED_STATUS_ID) {
            throw new OrderAlreadyCancelledException();
        }

        if (currentStatus != null && statusId < currentStatus.getId() && statusId != CANCELLED_STATUS_ID) {
            throw new InvalidOrderStatusTransitionException("La orden no puede retroceder de estado");
        }

        OrderStatus newStatus = orderStatusRepository.findById((long) statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", statusId));

        order.setOrderStatus(newStatus);

        return orderRepository.save(order);
    }

    @Override
    public Order createOrderFromCart(int cartId, String requesterEmail) {
        Cart cart = cartRepository.findById((long) cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", cartId));

        Long ownerId = cart.getUser() != null ? cart.getUser().getId() : null;
        ownershipGuard.assertSelfOrAdmin(requesterEmail, ownerId);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new EmptyCartException();
        }

        OrderStatus status = orderStatusRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", 1));

        List<Vinyl> items = new ArrayList<>(cart.getItems());

        List<Long> alreadyDiscounted = new ArrayList<>();
        try {
            for (Vinyl vinyl : items) {
                int updated = vinylRepository.updateStock(vinyl.getId(), -1);
                if (updated == 0) {
                    throw new InsufficientStockException("El vinilo '" + vinyl.getName() + "' ya no tiene stock disponible");
                }
                alreadyDiscounted.add(vinyl.getId());
            }
        } catch (InsufficientStockException ex) {

            for (Long vinylId : alreadyDiscounted) {
                vinylRepository.updateStock(vinylId, 1);
            }
            throw ex;
        }

        double total = items.stream().mapToDouble(Vinyl::getPrice).sum();
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(status);
        order.setOrderDate(LocalDate.now().toString());
        order.setTotal(total);
        order.setVinyl(items);

        Order saved = orderRepository.save(order);
        cart.setItems(new ArrayList<>());
        cartRepository.save(cart);
        return saved;
    }

}