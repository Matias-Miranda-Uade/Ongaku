package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummary {
    private int totalOrders;
    private int pendingOrders;
    private int paidOrders;
    private int shippedOrders;
    private int deliveredOrders;
    private int cancelledOrders;
    private double totalRevenue;
    private double averageOrderValue;
    private int totalPayments;
}