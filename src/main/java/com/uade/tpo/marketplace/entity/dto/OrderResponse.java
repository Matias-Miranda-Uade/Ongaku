package com.uade.tpo.marketplace.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private OrderStatusResponse orderStatus;
    private List<OrderItemResponse> items;
    private int totalProducts;
    private int totalUnits;
    private double total;

    public OrderResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Long getUserId() {
        return this.userId;
    }

    public String getUserName() {
        return this.userName;
    }

    public OrderStatusResponse getOrderStatus() {
        return this.orderStatus;
    }

    public List<OrderItemResponse> getItems() {
        return this.items;
    }

    public int getTotalProducts() {
        return this.totalProducts;
    }

    public int getTotalUnits() {
        return this.totalUnits;
    }

    public double getTotal() {
        return this.total;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setOrderStatus(OrderStatusResponse orderStatus) {
        this.orderStatus = orderStatus;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public void setTotalUnits(int totalUnits) {
        this.totalUnits = totalUnits;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof OrderResponse)) return false;
        OrderResponse other = (OrderResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getTotalProducts() != other.getTotalProducts()) return false;
        if (this.getTotalUnits() != other.getTotalUnits()) return false;
        if (Double.compare(this.getTotal(), other.getTotal()) != 0) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$userId = this.getUserId();
        Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        Object this$createdAt = this.getCreatedAt();
        Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        Object this$userName = this.getUserName();
        Object other$userName = other.getUserName();
        if (this$userName == null ? other$userName != null : !this$userName.equals(other$userName)) return false;
        Object this$orderStatus = this.getOrderStatus();
        Object other$orderStatus = other.getOrderStatus();
        if (this$orderStatus == null ? other$orderStatus != null : !this$orderStatus.equals(other$orderStatus)) return false;
        Object this$items = this.getItems();
        Object other$items = other.getItems();
        if (this$items == null ? other$items != null : !this$items.equals(other$items)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getTotalProducts();
        result = result * PRIME + this.getTotalUnits();
        long $total = Double.doubleToLongBits(this.getTotal());
        result = result * PRIME + (int) ($total >>> 32 ^ $total);
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        Object $userName = this.getUserName();
        result = result * PRIME + ($userName == null ? 43 : $userName.hashCode());
        Object $orderStatus = this.getOrderStatus();
        result = result * PRIME + ($orderStatus == null ? 43 : $orderStatus.hashCode());
        Object $items = this.getItems();
        result = result * PRIME + ($items == null ? 43 : $items.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "OrderResponse(id=" + this.getId() + ", createdAt=" + this.getCreatedAt() + ", userId=" + this.getUserId() + ", userName=" + this.getUserName() + ", orderStatus=" + this.getOrderStatus() + ", items=" + this.getItems() + ", totalProducts=" + this.getTotalProducts() + ", totalUnits=" + this.getTotalUnits() + ", total=" + this.getTotal() + ")";
    }
}
