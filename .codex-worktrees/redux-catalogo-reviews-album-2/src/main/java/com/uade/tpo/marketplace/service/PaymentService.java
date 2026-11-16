package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.entity.dto.PaymentRequest;
import java.util.ArrayList;

public interface PaymentService {
    ArrayList<Payment> getPayments(String requesterEmail);
    Payment getPaymentById(int paymentId, String requesterEmail);
    Payment createPayment(PaymentRequest request, String requesterEmail);
}