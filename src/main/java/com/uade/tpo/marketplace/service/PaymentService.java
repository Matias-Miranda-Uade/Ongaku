package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Payment;
import java.util.ArrayList;

public interface PaymentService {
    ArrayList<Payment> getPayments();
    Payment getPaymentById(int paymentId);
    Payment createPayment(String entity);
}