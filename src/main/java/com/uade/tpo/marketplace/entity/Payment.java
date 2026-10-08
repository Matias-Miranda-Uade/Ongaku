package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private double amount;
    @Column
    private String method;
    @Column
    private String paymentDate;
    @Column
    private String status;
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    public Payment() {
    }

    public Long getId() {
        return this.id;
    }

    public double getAmount() {
        return this.amount;
    }

    public String getMethod() {
        return this.method;
    }

    public String getPaymentDate() {
        return this.paymentDate;
    }

    public String getStatus() {
        return this.status;
    }

    public Order getOrder() {
        return this.order;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public void setPaymentDate(String paymentDate) {
        this.paymentDate = paymentDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Payment)) return false;
        Payment other = (Payment) o;
        if (!other.canEqual((Object) this)) return false;
        if (Double.compare(this.getAmount(), other.getAmount()) != 0) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$method = this.getMethod();
        Object other$method = other.getMethod();
        if (this$method == null ? other$method != null : !this$method.equals(other$method)) return false;
        Object this$paymentDate = this.getPaymentDate();
        Object other$paymentDate = other.getPaymentDate();
        if (this$paymentDate == null ? other$paymentDate != null : !this$paymentDate.equals(other$paymentDate)) return false;
        Object this$status = this.getStatus();
        Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        Object this$order = this.getOrder();
        Object other$order = other.getOrder();
        if (this$order == null ? other$order != null : !this$order.equals(other$order)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Payment;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        long $amount = Double.doubleToLongBits(this.getAmount());
        result = result * PRIME + (int) ($amount >>> 32 ^ $amount);
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $method = this.getMethod();
        result = result * PRIME + ($method == null ? 43 : $method.hashCode());
        Object $paymentDate = this.getPaymentDate();
        result = result * PRIME + ($paymentDate == null ? 43 : $paymentDate.hashCode());
        Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        Object $order = this.getOrder();
        result = result * PRIME + ($order == null ? 43 : $order.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Payment(id=" + this.getId() + ", amount=" + this.getAmount() + ", method=" + this.getMethod() + ", paymentDate=" + this.getPaymentDate() + ", status=" + this.getStatus() + ", order=" + this.getOrder() + ")";
    }
}
