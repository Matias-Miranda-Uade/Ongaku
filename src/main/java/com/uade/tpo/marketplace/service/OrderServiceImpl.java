package com.uade.tpo.marketplace.service;

import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.CartItem;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderItem;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.exceptions.conflict.EmptyCartException;
import com.uade.tpo.marketplace.exceptions.conflict.InsufficientStockException;
import com.uade.tpo.marketplace.exceptions.conflict.InvalidOrderStatusTransitionException;
import com.uade.tpo.marketplace.exceptions.conflict.OrderAlreadyCancelledException;
import com.uade.tpo.marketplace.exceptions.conflict.ProductDisabledException;
import com.uade.tpo.marketplace.exceptions.forbidden.ForbiddenOperationException;
import com.uade.tpo.marketplace.exceptions.forbidden.ResourceOwnershipException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final CartRepository cartRepository;
    private final VinylRepository vinylRepository;
    private final OwnershipGuard ownershipGuard;

    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrders(String requesterEmail) {
        User user = ownershipGuard.requireUser(requesterEmail);
        return user.getRole() == Role.ADMIN ? orderRepository.findAllMostRecentFirst() : orderRepository.findByUserId(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(long orderId, String requesterEmail) {
        Order order = orderRepository.findDetailById(orderId).orElseThrow(() -> new ResourceNotFoundException("Orden", orderId));
        ownershipGuard.assertSelfOrAdmin(requesterEmail, order.getUser() == null ? null : order.getUser().getId());
        return order;
    }

    @Override
    public Order createOrder(String requesterEmail) {
        User user = ownershipGuard.requireCustomer(requesterEmail);
        // Bloquea el carrito para que dos checkouts simultaneos no compren dos veces.
        Cart cart = cartRepository.findForUpdateByUserId(user.getId()).stream().findFirst().orElseThrow(EmptyCartException::new);
        if (cart.isEmpty()) {
            throw new EmptyCartException();
        }
        Order order = new Order();
        order.setUser(user);
        order.setOrderStatus(status(OrderStatusType.PENDIENTE));
        // Orden estable de bloqueo de productos: evita deadlocks entre compras simultaneas.
        List<CartItem> items = cart.getItems().stream().sorted(Comparator.comparing(item -> item.getVinyl().getId())).toList();
        int total = 0;
        for (CartItem item : items) {
            Vinyl vinyl = item.getVinyl();
            if (Boolean.FALSE.equals(vinyl.getEnabled())) {
                throw new ProductDisabledException();
            }
            if (vinylRepository.reserveStock(vinyl.getId(), item.getQuantity()) == 0) {
                throw new InsufficientStockException("El vinilo \'" + vinyl.getName() + "\' no tiene stock disponible para la cantidad pedida");
            }
            total += order.addItem(vinyl, item.getQuantity()).getSubtotal();
        }
        order.setTotal(total);
        Order saved = orderRepository.save(order);
        // El carrito queda vacio, listo para la proxima compra. El carrito ya
        // esta administrado por la transaccion, asi que no se vuelve a guardar:
        // un merge romperia el borrado automatico de sus lineas.
        cart.clear();
        cartRepository.flush();
        return saved;
    }

    @Override
    public Order updateStatus(long orderId, OrderStatusType target, String requesterEmail) {
        User requester = ownershipGuard.requireUser(requesterEmail);
        Order order = orderRepository.findForUpdateById(orderId).orElseThrow(() -> new ResourceNotFoundException("Orden", orderId));
        boolean admin = requester.getRole() == Role.ADMIN;
        Long ownerId = order.getUser() == null ? null : order.getUser().getId();
        if (!admin && !requester.getId().equals(ownerId)) {
            throw new ResourceOwnershipException();
        }
        OrderStatusType current = order.getStatusType();
        if (current == null) {
            throw new InvalidOrderStatusTransitionException("La orden no tiene un estado valido");
        }
        // Una orden cancelada es un estado final, sin importar quien lo pida.
        if (current == OrderStatusType.CANCELADA) {
            throw new OrderAlreadyCancelledException();
        }
        // El comprador solo puede arrepentirse mientras la orden siga pendiente.
        if (!admin && !(current == OrderStatusType.PENDIENTE && target == OrderStatusType.CANCELADA)) {
            throw new ForbiddenOperationException("Solo podes cancelar una orden que siga en estado PENDIENTE");
        }
        return applyStatus(order, target);
    }

    @Override
    public Order applyStatus(Order order, OrderStatusType target) {
        OrderStatusType current = order.getStatusType();
        if (current == OrderStatusType.CANCELADA) {
            throw new OrderAlreadyCancelledException();
        }
        if (current == target) {
            throw new InvalidOrderStatusTransitionException("La orden ya esta en estado " + target);
        }
        if (!current.canTransitionTo(target)) {
            throw new InvalidOrderStatusTransitionException("No se puede pasar de " + current + " a " + target);
        }
        if (target == OrderStatusType.CANCELADA) {
            restoreStock(order);
        }
        order.setOrderStatus(status(target));
        orderRepository.flush();
        return order;
    }

    /**
     * Al cancelar, las unidades reservadas vuelven al catalogo.
     */
    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getVinyl() != null) {
                vinylRepository.updateStock(item.getVinyl().getId(), item.getQuantity());
            }
        }
    }

    private OrderStatus status(OrderStatusType type) {
        return orderStatusRepository.findById(type.getId()).orElseThrow(() -> new ResourceNotFoundException("Estado de orden", type.getId()));
    }

    public OrderServiceImpl(OrderRepository orderRepository, OrderStatusRepository orderStatusRepository, CartRepository cartRepository, VinylRepository vinylRepository, OwnershipGuard ownershipGuard) {
        this.orderRepository = orderRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.cartRepository = cartRepository;
        this.vinylRepository = vinylRepository;
        this.ownershipGuard = ownershipGuard;
    }
}
