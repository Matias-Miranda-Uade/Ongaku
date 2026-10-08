package com.uade.tpo.marketplace.entity.dto;

public class PaymentRequest {
    private int orderId;
    private double amount;
    private String method;
    private String paymentDate;
    private String status;

    public PaymentRequest() {
    }

    public int getOrderId() {
        return this.orderId;
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

    public void setOrderId(int orderId) {
        this.orderId = orderId;
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

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof PaymentRequest)) return false;
        PaymentRequest other = (PaymentRequest) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getOrderId() != other.getOrderId()) return false;
        if (Double.compare(this.getAmount(), other.getAmount()) != 0) return false;
        Object this$method = this.getMethod();
        Object other$method = other.getMethod();
        if (this$method == null ? other$method != null : !this$method.equals(other$method)) return false;
        Object this$paymentDate = this.getPaymentDate();
        Object other$paymentDate = other.getPaymentDate();
        if (this$paymentDate == null ? other$paymentDate != null : !this$paymentDate.equals(other$paymentDate)) return false;
        Object this$status = this.getStatus();
        Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof PaymentRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getOrderId();
        long $amount = Double.doubleToLongBits(this.getAmount());
        result = result * PRIME + (int) ($amount >>> 32 ^ $amount);
        Object $method = this.getMethod();
        result = result * PRIME + ($method == null ? 43 : $method.hashCode());
        Object $paymentDate = this.getPaymentDate();
        result = result * PRIME + ($paymentDate == null ? 43 : $paymentDate.hashCode());
        Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "PaymentRequest(orderId=" + this.getOrderId() + ", amount=" + this.getAmount() + ", method=" + this.getMethod() + ", paymentDate=" + this.getPaymentDate() + ", status=" + this.getStatus() + ")";
    }
}
