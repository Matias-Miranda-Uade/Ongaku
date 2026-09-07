package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
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
    public ArrayList<Order> getOrders(String requesterEmail) {
        var user = ownershipGuard.requireUser(requesterEmail);
        return new ArrayList<>(user.getRole() == com.uade.tpo.marketplace.entity.Role.ADMIN
                ? orderRepository.findAll() : orderRepository.findByUserId(Math.toIntExact(user.getId())));
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
    @org.springframework.transaction.annotation.Transactional
    public Order createOrderFromCurrentUserCart(String requesterEmail) {
        var user = ownershipGuard.requireCustomer(requesterEmail);
        Cart cart = cartRepository.findFirstByUser_Id(user.getId())
            .orElseThrow(EmptyCartException::new);
        return createOrderFromCart(Math.toIntExact(cart.getId()), requesterEmail);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Order updateOrderStatus(int orderId, int statusId) {

        Order order = orderRepository.findForUpdateById((long) orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden", orderId));

        if (statusId < 1 || statusId > 5) {
            throw new InvalidFieldException("orderStatusId", "debe estar entre 1 y 5");
        }
        Long current = order.getOrderStatus() == null ? null : order.getOrderStatus().getId();
        if (current == null) throw new InvalidOrderStatusTransitionException("La orden no tiene estado inicial");
        if (current == CANCELLED_STATUS_ID) throw new OrderAlreadyCancelledException();
        if (current == statusId) return order;
        boolean allowed = (current == 1 && (statusId == 2 || statusId == 5))
                || (current == 2 && (statusId == 3 || statusId == 5))
                || (current == 3 && statusId == 4);
        if (!allowed) throw new InvalidOrderStatusTransitionException("Transicion de estado no permitida");
        if (statusId == CANCELLED_STATUS_ID && order.getVinyl() != null) {
            for (Vinyl vinyl : order.getVinyl()) {
                vinylRepository.updateStock(vinyl.getId(), order.quantityOf(vinyl.getId()));
            }
        }

        OrderStatus newStatus = orderStatusRepository.findById((long) statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", statusId));

        order.setOrderStatus(newStatus);

        return orderRepository.save(order);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Order createOrderFromCart(int cartId, String requesterEmail) {
        Cart cart = cartRepository.findForUpdateById((long) cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", cartId));

        Long ownerId = cart.getUser() != null ? cart.getUser().getId() : null;
        ownershipGuard.assertOwner(requesterEmail, ownerId);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new EmptyCartException();
        }

        OrderStatus status = orderStatusRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", 1));

        List<Vinyl> items = new ArrayList<>(cart.getItems());

        java.util.Map<Long, Integer> quantities = new java.util.HashMap<>();
        double total = 0;
        // Stable lock order avoids deadlocks between checkouts sharing products.
        items.sort(java.util.Comparator.comparing(Vinyl::getId));
        for (Vinyl vinyl : items) {
            int quantity = cart.quantityOf(vinyl.getId());
            if (quantity <= 0) throw new InvalidFieldException("quantity", "debe ser mayor a cero");
            if (Boolean.FALSE.equals(vinyl.getEnabled())) {
                throw new com.uade.tpo.marketplace.exceptions.conflict.ProductDisabledException();
            }
            if (vinylRepository.reserveStock(vinyl.getId(), quantity) == 0) {
                throw new InsufficientStockException("El vinilo '" + vinyl.getName() + "' no tiene stock disponible");
            }
            quantities.put(vinyl.getId(), quantity);
            total += (double) vinyl.getPrice() * quantity;
        }
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(status);
        order.setOrderDate(LocalDate.now().toString());
        order.setTotal(total);
        order.setVinyl(items);
        order.setQuantities(quantities);

        Order saved = orderRepository.save(order);
        cart.getItems().clear();
        cart.getQuantities().clear();
        cartRepository.save(cart);
        return saved;
    }

}