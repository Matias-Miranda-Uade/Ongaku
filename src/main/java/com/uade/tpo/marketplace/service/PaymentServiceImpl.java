package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.entity.dto.PaymentRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidPaymentAmountException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicatePaymentException;
import com.uade.tpo.marketplace.exceptions.conflict.OrderAlreadyPaidException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.exceptions.unprocessable.PaymentNotAllowedException;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final long CANCELLED_STATUS_ID = 5L;
    private static final long PAID_STATUS_ID = 2L;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final OwnershipGuard ownershipGuard;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderStatusRepository orderStatusRepository,
            OwnershipGuard ownershipGuard) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.ownershipGuard = ownershipGuard;
    }

    @Override
    public ArrayList<Payment> getPayments(String requesterEmail) {
        var user = ownershipGuard.requireUser(requesterEmail);
        return new ArrayList<>(user.getRole() == com.uade.tpo.marketplace.entity.Role.ADMIN
                ? paymentRepository.findAll() : paymentRepository.findByOrderUserId(user.getId()));
    }

    @Override
    public Payment getPaymentById(int id, String requesterEmail) {
        Payment payment = paymentRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", id));

        Long ownerId = payment.getOrder() != null && payment.getOrder().getUser() != null
                ? payment.getOrder().getUser().getId()
                : null;
        ownershipGuard.assertSelfOrAdmin(requesterEmail, ownerId);

        return payment;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
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

        Order order = orderRepository.findForUpdateById((long) request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Orden", request.getOrderId()));

        Long ownerId = order.getUser() != null ? order.getUser().getId() : null;
        ownershipGuard.assertOwner(requesterEmail, ownerId);

        Long statusId = order.getOrderStatus() != null ? order.getOrderStatus().getId() : null;

        if (statusId != null && statusId == CANCELLED_STATUS_ID) {
            throw new PaymentNotAllowedException("No se puede pagar una orden cancelada");
        }
        if (statusId != null && statusId == PAID_STATUS_ID) {
            throw new OrderAlreadyPaidException();
        }
        if (statusId == null || statusId != 1L) {
            throw new PaymentNotAllowedException("Solo se pueden pagar ordenes pendientes");
        }
        var paidStatus = orderStatusRepository.findById(PAID_STATUS_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", PAID_STATUS_ID));
        if (order.getPayment() != null && !order.getPayment().isEmpty()) {
            throw new DuplicatePaymentException();
        }
        if (request.getAmount() != order.getTotal()) {
            throw new InvalidPaymentAmountException("El importe (" + request.getAmount()
                    + ") no coincide con el total de la orden (" + order.getTotal() + ")");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod().trim().toUpperCase());
        payment.setPaymentDate(LocalDate.now().toString());
        payment.setStatus("APROBADO");

        Payment saved = paymentRepository.save(payment);

        order.setOrderStatus(paidStatus);
        orderRepository.save(order);

        return saved;
    }
}