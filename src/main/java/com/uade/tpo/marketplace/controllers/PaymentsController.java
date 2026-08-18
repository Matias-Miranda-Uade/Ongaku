package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Payment;
import com.uade.tpo.marketplace.service.PaymentService;

@RestController
@RequestMapping("payments")
public class PaymentsController {

    @GetMapping
    public ArrayList<Payment> getPayments() {
        PaymentService paymentService = new PaymentService();
        return paymentService.getPayments();
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable int paymentId) {
        PaymentService paymentService = new PaymentService();
        Payment payment = paymentService.getPaymentById(paymentId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payment);
    }

    @PostMapping
    public Payment createPayment(@RequestBody String entity) {
        PaymentService paymentService = new PaymentService();
        return paymentService.createPayment(entity);
    }
}