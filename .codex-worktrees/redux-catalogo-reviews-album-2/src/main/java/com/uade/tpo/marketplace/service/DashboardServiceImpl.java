package com.uade.tpo.marketplace.service;

import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.DashboardSummary;
import com.uade.tpo.marketplace.repository.DashboardRepository;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final DashboardRepository dashboardRepository;
    public DashboardServiceImpl(DashboardRepository repository) { this.dashboardRepository = repository; }
    public DashboardSummary getSummary() { return dashboardRepository.getSummary(); }
}