package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(
            PaymentRepository repository) {

        this.paymentRepository = repository;
    }

    @Override
    public ArrayList<Payment> getPayments() {
        return new ArrayList<>(
            paymentRepository.findAll()
        );
    }

    @Override
    public Payment getPaymentById(int id) {
        return paymentRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Payment createPayment(
            String entity) {

        String[] values =
                entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 4) {
            throw new IllegalArgumentException(
                "El pago requiere orden, importe, medio y estado"
            );
        }

        int orderId =
                Integer.parseInt(values[0].trim());

        double amount =
                Double.parseDouble(values[1].trim());

        if (orderId <= 0 ||
            amount <= 0 ||
            values[2].isBlank()) {

            throw new IllegalArgumentException(
                "Datos de pago invalidos"
            );
        }

        Payment payment = new Payment();

        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setMethod(
            values[2].trim().toUpperCase()
        );
        payment.setPaymentDate(
            LocalDate.now().toString()
        );
        payment.setStatus(
            values[3].trim().toUpperCase()
        );

        return paymentRepository.save(payment);
    }
}