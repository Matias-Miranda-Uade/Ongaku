package com.uade.tpo.marketplace.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.DashboardSummary;
import com.uade.tpo.marketplace.service.DashboardService;

@RestController
@RequestMapping("dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardSummary getSummary() {
        return dashboardService.getSummary();
    }
}