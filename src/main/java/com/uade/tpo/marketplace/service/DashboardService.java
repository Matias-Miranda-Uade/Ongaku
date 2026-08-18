package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.DashboardSummary;
import com.uade.tpo.marketplace.repository.DashboardRepository;

public class DashboardService {

    public DashboardSummary getSummary() {
        DashboardRepository dashboardRepository = new DashboardRepository();
        return dashboardRepository.getSummary();
    }
}