package com.uade.tpo.marketplace.entity;

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

    DashboardSummary(int totalOrders, int pendingOrders, int paidOrders, int shippedOrders, int deliveredOrders, int cancelledOrders, double totalRevenue, double averageOrderValue, int totalPayments) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.paidOrders = paidOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue;
        this.averageOrderValue = averageOrderValue;
        this.totalPayments = totalPayments;
    }


    public static class DashboardSummaryBuilder {
        private int totalOrders;
        private int pendingOrders;
        private int paidOrders;
        private int shippedOrders;
        private int deliveredOrders;
        private int cancelledOrders;
        private double totalRevenue;
        private double averageOrderValue;
        private int totalPayments;

        DashboardSummaryBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder totalOrders(int totalOrders) {
            this.totalOrders = totalOrders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder pendingOrders(int pendingOrders) {
            this.pendingOrders = pendingOrders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder paidOrders(int paidOrders) {
            this.paidOrders = paidOrders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder shippedOrders(int shippedOrders) {
            this.shippedOrders = shippedOrders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder deliveredOrders(int deliveredOrders) {
            this.deliveredOrders = deliveredOrders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder cancelledOrders(int cancelledOrders) {
            this.cancelledOrders = cancelledOrders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder totalRevenue(double totalRevenue) {
            this.totalRevenue = totalRevenue;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder averageOrderValue(double averageOrderValue) {
            this.averageOrderValue = averageOrderValue;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public DashboardSummary.DashboardSummaryBuilder totalPayments(int totalPayments) {
            this.totalPayments = totalPayments;
            return this;
        }

        public DashboardSummary build() {
            return new DashboardSummary(this.totalOrders, this.pendingOrders, this.paidOrders, this.shippedOrders, this.deliveredOrders, this.cancelledOrders, this.totalRevenue, this.averageOrderValue, this.totalPayments);
        }

        @Override
        public String toString() {
            return "DashboardSummary.DashboardSummaryBuilder(totalOrders=" + this.totalOrders + ", pendingOrders=" + this.pendingOrders + ", paidOrders=" + this.paidOrders + ", shippedOrders=" + this.shippedOrders + ", deliveredOrders=" + this.deliveredOrders + ", cancelledOrders=" + this.cancelledOrders + ", totalRevenue=" + this.totalRevenue + ", averageOrderValue=" + this.averageOrderValue + ", totalPayments=" + this.totalPayments + ")";
        }
    }

    public static DashboardSummary.DashboardSummaryBuilder builder() {
        return new DashboardSummary.DashboardSummaryBuilder();
    }

    public int getTotalOrders() {
        return this.totalOrders;
    }

    public int getPendingOrders() {
        return this.pendingOrders;
    }

    public int getPaidOrders() {
        return this.paidOrders;
    }

    public int getShippedOrders() {
        return this.shippedOrders;
    }

    public int getDeliveredOrders() {
        return this.deliveredOrders;
    }

    public int getCancelledOrders() {
        return this.cancelledOrders;
    }

    public double getTotalRevenue() {
        return this.totalRevenue;
    }

    public double getAverageOrderValue() {
        return this.averageOrderValue;
    }

    public int getTotalPayments() {
        return this.totalPayments;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }

    public void setPendingOrders(int pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public void setPaidOrders(int paidOrders) {
        this.paidOrders = paidOrders;
    }

    public void setShippedOrders(int shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public void setDeliveredOrders(int deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public void setCancelledOrders(int cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public void setAverageOrderValue(double averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public void setTotalPayments(int totalPayments) {
        this.totalPayments = totalPayments;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof DashboardSummary)) return false;
        DashboardSummary other = (DashboardSummary) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getTotalOrders() != other.getTotalOrders()) return false;
        if (this.getPendingOrders() != other.getPendingOrders()) return false;
        if (this.getPaidOrders() != other.getPaidOrders()) return false;
        if (this.getShippedOrders() != other.getShippedOrders()) return false;
        if (this.getDeliveredOrders() != other.getDeliveredOrders()) return false;
        if (this.getCancelledOrders() != other.getCancelledOrders()) return false;
        if (Double.compare(this.getTotalRevenue(), other.getTotalRevenue()) != 0) return false;
        if (Double.compare(this.getAverageOrderValue(), other.getAverageOrderValue()) != 0) return false;
        if (this.getTotalPayments() != other.getTotalPayments()) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof DashboardSummary;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getTotalOrders();
        result = result * PRIME + this.getPendingOrders();
        result = result * PRIME + this.getPaidOrders();
        result = result * PRIME + this.getShippedOrders();
        result = result * PRIME + this.getDeliveredOrders();
        result = result * PRIME + this.getCancelledOrders();
        long $totalRevenue = Double.doubleToLongBits(this.getTotalRevenue());
        result = result * PRIME + (int) ($totalRevenue >>> 32 ^ $totalRevenue);
        long $averageOrderValue = Double.doubleToLongBits(this.getAverageOrderValue());
        result = result * PRIME + (int) ($averageOrderValue >>> 32 ^ $averageOrderValue);
        result = result * PRIME + this.getTotalPayments();
        return result;
    }

    @Override
    public String toString() {
        return "DashboardSummary(totalOrders=" + this.getTotalOrders() + ", pendingOrders=" + this.getPendingOrders() + ", paidOrders=" + this.getPaidOrders() + ", shippedOrders=" + this.getShippedOrders() + ", deliveredOrders=" + this.getDeliveredOrders() + ", cancelledOrders=" + this.getCancelledOrders() + ", totalRevenue=" + this.getTotalRevenue() + ", averageOrderValue=" + this.getAverageOrderValue() + ", totalPayments=" + this.getTotalPayments() + ")";
    }
}
