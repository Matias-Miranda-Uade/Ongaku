package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.service.PaymentService;

@RestController
@RequestMapping("payments")
public class PaymentsController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ArrayList<Payment> getPayments() {
        return paymentService.getPayments();
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable int paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payment);
    }

    @PostMapping
    public Payment createPayment(@RequestBody String entity) {
        return paymentService.createPayment(entity);
    }
}