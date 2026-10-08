package com.uade.tpo.marketplace.entity.dto;

/**
 * Admite el estado por nombre ("CANCELADA") o por id del catalogo.
 */
public class OrderStatusUpdateRequest {
    private String status;
    private Integer orderStatusId;

    public OrderStatusUpdateRequest() {
    }

    public String getStatus() {
        return this.status;
    }

    public Integer getOrderStatusId() {
        return this.orderStatusId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOrderStatusId(Integer orderStatusId) {
        this.orderStatusId = orderStatusId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof OrderStatusUpdateRequest)) return false;
        OrderStatusUpdateRequest other = (OrderStatusUpdateRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$orderStatusId = this.getOrderStatusId();
        Object other$orderStatusId = other.getOrderStatusId();
        if (this$orderStatusId == null ? other$orderStatusId != null : !this$orderStatusId.equals(other$orderStatusId)) return false;
        Object this$status = this.getStatus();
        Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderStatusUpdateRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $orderStatusId = this.getOrderStatusId();
        result = result * PRIME + ($orderStatusId == null ? 43 : $orderStatusId.hashCode());
        Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "OrderStatusUpdateRequest(status=" + this.getStatus() + ", orderStatusId=" + this.getOrderStatusId() + ")";
    }
}
