package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.entity.dto.PaymentResponse;

public final class PaymentMapper {
    private PaymentMapper() {
    }

    public static PaymentResponse toResponse(Payment payment) {
        if (payment == null) return null;
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder() != null ? payment.getOrder().getId() : null);
        response.setAmount(payment.getAmount());
        response.setMethod(payment.getMethod());
        response.setPaymentDate(payment.getPaymentDate());
        response.setStatus(payment.getStatus());
        return response;
    }
}
