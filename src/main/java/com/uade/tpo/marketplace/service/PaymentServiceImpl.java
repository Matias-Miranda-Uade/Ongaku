package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.entity.dto.PaymentRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidPaymentAmountException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicatePaymentException;
import com.uade.tpo.marketplace.exceptions.conflict.OrderAlreadyPaidException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.exceptions.unprocessable.PaymentNotAllowedException;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final OwnershipGuard ownershipGuard;

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Payment> getPayments(String requesterEmail) {
        var user = ownershipGuard.requireUser(requesterEmail);
        return new ArrayList<>(user.getRole() == Role.ADMIN ? paymentRepository.findAll() : paymentRepository.findByOrderUserId(user.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public Payment getPaymentById(int id, String requesterEmail) {
        Payment payment = paymentRepository.findById((long) id).orElseThrow(() -> new ResourceNotFoundException("Pago", id));
        Long ownerId = payment.getOrder() != null && payment.getOrder().getUser() != null ? payment.getOrder().getUser().getId() : null;
        ownershipGuard.assertSelfOrAdmin(requesterEmail, ownerId);
        return payment;
    }

    @Override
    @Transactional
    public Payment createPayment(PaymentRequest request, String requesterEmail) {
        if (request == null) {
            throw new InvalidRequestException("El pago requiere orden, importe y medio");
        }
        if (request.getOrderId() <= 0) {
            throw new InvalidFieldException("orderId", "debe ser un identificador positivo");
        }
        if (request.getAmount() <= 0) {
            throw new InvalidPaymentAmountException("El importe debe ser mayor a cero");
        }
        if (request.getMethod() == null || request.getMethod().isBlank()) {
            throw new InvalidFieldException("method", "no puede estar vacio");
        }
        Order order = orderRepository.findForUpdateById((long) request.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("Orden", request.getOrderId()));
        Long ownerId = order.getUser() != null ? order.getUser().getId() : null;
        ownershipGuard.assertOwner(requesterEmail, ownerId);
        OrderStatusType status = order.getStatusType();
        if (status == OrderStatusType.CANCELADA) {
            throw new PaymentNotAllowedException("No se puede pagar una orden cancelada");
        }
        if (status == OrderStatusType.PAGADA) {
            throw new OrderAlreadyPaidException();
        }
        if (status != OrderStatusType.PENDIENTE) {
            throw new PaymentNotAllowedException("Solo se pueden pagar ordenes pendientes");
        }
        if (order.getPayment() != null && !order.getPayment().isEmpty()) {
            throw new DuplicatePaymentException();
        }
        if (request.getAmount() != order.getTotal()) {
            throw new InvalidPaymentAmountException("El importe (" + request.getAmount() + ") no coincide con el total de la orden (" + order.getTotal() + ")");
        }
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod().trim().toUpperCase());
        payment.setPaymentDate(LocalDate.now().toString());
        payment.setStatus("APROBADO");
        Payment saved = paymentRepository.save(payment);
        // Un pago aprobado mueve la orden a PAGADA sin pasar por el endpoint de admin.
        orderService.applyStatus(order, OrderStatusType.PAGADA);
        return saved;
    }

    public PaymentServiceImpl(PaymentRepository paymentRepository, OrderRepository orderRepository, OrderService orderService, OwnershipGuard ownershipGuard) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.ownershipGuard = ownershipGuard;
    }
}
