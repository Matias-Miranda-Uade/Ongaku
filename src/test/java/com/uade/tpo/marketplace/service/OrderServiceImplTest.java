package com.uade.tpo.marketplace.service;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderItem;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {
    private static final long ORDER_ID = 10L;

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderStatusRepository orderStatusRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private VinylRepository vinylRepository;
    @Mock
    private OwnershipGuard ownershipGuard;
    @Mock
    private SavedCardService savedCardService;
    @Mock
    private Order order;
    @Mock
    private OrderStatus cancelledStatus;
    @Mock
    private OrderItem item;
    @Mock
    private Vinyl vinyl;

    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(orderRepository, orderStatusRepository, cartRepository,
                vinylRepository, ownershipGuard, savedCardService);
    }

    @Test
    void expiresPendingOrderAndRestoresReservedStock() {
        when(orderRepository.findForUpdateById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatusType()).thenReturn(OrderStatusType.PENDIENTE);
        when(order.getItems()).thenReturn(List.of(item));
        when(item.getVinyl()).thenReturn(vinyl);
        when(item.getQuantity()).thenReturn(2);
        when(vinyl.getId()).thenReturn(7L);
        when(orderStatusRepository.findById(OrderStatusType.CANCELADA.getId()))
                .thenReturn(Optional.of(cancelledStatus));

        orderService.expirePendingOrder(ORDER_ID);

        verify(orderRepository).findForUpdateById(ORDER_ID);
        verify(vinylRepository).updateStock(7L, 2);
        verify(order).setOrderStatus(cancelledStatus);
        verify(orderRepository).flush();
    }

    @Test
    void doesNotChangePaidOrder() {
        when(orderRepository.findForUpdateById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatusType()).thenReturn(OrderStatusType.PAGADA);

        orderService.expirePendingOrder(ORDER_ID);

        verify(orderRepository).findForUpdateById(ORDER_ID);
        verifyNoInteractions(vinylRepository, orderStatusRepository);
    }
}
