package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.repository.PaymentRepository;

public class PaymentService {

    public ArrayList<Payment> getPayments() {
        PaymentRepository paymentRepository = new PaymentRepository();
        return paymentRepository.getPayments();
    }

    public Payment getPaymentById(int paymentId) {
        PaymentRepository paymentRepository = new PaymentRepository();
        return paymentRepository.getPaymentById(paymentId);
    }

    public Payment createPayment(String entity) {
        PaymentRepository paymentRepository = new PaymentRepository();
        return paymentRepository.createPayment(entity);
    }
}