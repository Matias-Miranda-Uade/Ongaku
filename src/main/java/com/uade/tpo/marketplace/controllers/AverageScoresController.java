package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.service.AverageScoreService;

@RestController
@RequestMapping("average-scores")
public class AverageScoresController {
    @Autowired
    private AverageScoreService averageScoreService;

    @GetMapping
    public ArrayList<AverageScore> getAverageScores() {
        return averageScoreService.getAverageScores();
    }

    @GetMapping("/{id}")
    public AverageScore getAverageScoreById(@PathVariable int averageScoreId) {
        return averageScoreService.getAverageScoreById(averageScoreId);
    }

    @PostMapping
    public AverageScore createAverageScore(@RequestBody String entity) {
        return averageScoreService.createAverageScore(entity);
    }
}
