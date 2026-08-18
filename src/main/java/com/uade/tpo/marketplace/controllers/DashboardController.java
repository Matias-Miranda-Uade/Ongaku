package com.uade.tpo.marketplace.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.DashboardSummary;
import com.uade.tpo.marketplace.service.DashboardService;

@RestController
@RequestMapping("dashboard")
public class DashboardController {

    @GetMapping
    public DashboardSummary getSummary() {
        DashboardService dashboardService = new DashboardService();
        return dashboardService.getSummary();
    }
}