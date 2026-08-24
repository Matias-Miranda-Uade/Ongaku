package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Payment;
import org.springframework.stereotype.Repository;

@Repository
public class PaymentRepository {
    public ArrayList<Payment> payments = new ArrayList<>(Arrays.asList(
            Payment.builder().id(1).orderId(1).amount(15000.0).method("TARJETA_CREDITO").paymentDate("2026-08-10").status("APROBADO").build(),
            Payment.builder().id(2).orderId(2).amount(8500.0).method("MERCADO_PAGO").paymentDate("2026-08-14").status("PENDIENTE").build(),
            Payment.builder().id(3).orderId(3).amount(23000.0).method("TRANSFERENCIA").paymentDate("2026-08-15").status("APROBADO").build(),
            Payment.builder().id(4).orderId(4).amount(12000.0).method("TARJETA_DEBITO").paymentDate("2026-08-16").status("APROBADO").build(),
            Payment.builder().id(5).orderId(5).amount(6000.0).method("TARJETA_CREDITO").paymentDate("2026-08-17").status("RECHAZADO").build()
    ));

    public ArrayList<Payment> getPayments() {
        return this.payments;
    }

    public Payment getPaymentById(int paymentId) {
        return null;
    }

    public Payment createPayment(String entity) {
        return null;
    }
}