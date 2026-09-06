package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.PaymentRequest;
import com.uade.tpo.marketplace.entity.dto.PaymentResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.PaymentMapper;
import com.uade.tpo.marketplace.service.PaymentService;

@RestController
@RequestMapping("payments")
public class PaymentsController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPayments() {
        List<PaymentResponse> payments = paymentService.getPayments().stream().map(PaymentMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(payments, "No hay pagos registrados"));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable int paymentId, Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(PaymentMapper.toResponse(paymentService.getPaymentById(paymentId, principal.getName()))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@RequestBody PaymentRequest request, Principal principal) {
        PaymentResponse response = PaymentMapper.toResponse(paymentService.createPayment(request, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Pago registrado correctamente"));
    }
}