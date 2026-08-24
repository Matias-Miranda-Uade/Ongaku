package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    public PaymentServiceImpl(PaymentRepository repository) { this.paymentRepository = repository; }
    public ArrayList<Payment> getPayments() { return paymentRepository.getPayments(); }
    public Payment getPaymentById(int id) { return paymentRepository.getPayments().stream().filter(p -> p.getId() == id).findFirst().orElse(null); }
    public Payment createPayment(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",");
        if (values.length < 4) throw new IllegalArgumentException("El pago requiere orden, importe, medio y estado");
        int orderId = Integer.parseInt(values[0].trim()); double amount = Double.parseDouble(values[1].trim());
        if (orderId <= 0 || amount <= 0 || values[2].isBlank()) throw new IllegalArgumentException("Datos de pago invalidos");
        Payment payment = Payment.builder().id(paymentRepository.getPayments().stream().mapToLong(Payment::getId).max().orElse(0) + 1).orderId(orderId).amount(amount).method(values[2].trim().toUpperCase()).paymentDate(java.time.LocalDate.now().toString()).status(values[3].trim().toUpperCase()).build();
        paymentRepository.getPayments().add(payment); return payment;
    }
}