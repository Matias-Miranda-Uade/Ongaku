package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.AverageScoreResponse;
import com.uade.tpo.marketplace.service.AverageScoreService;

@RestController
@RequestMapping("average-scores")
public class AverageScoresController {
    @Autowired
    private AverageScoreService averageScoreService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AverageScoreResponse>>> getAverageScores() {
        List<AverageScoreResponse> scores = averageScoreService.getAverageScores();
        return ResponseEntity.ok(ApiResponse.list(scores, "No hay puntuaciones promedio cargadas"));
    }

    @GetMapping("/{vinylId}")
    public ResponseEntity<ApiResponse<AverageScoreResponse>> getAverageScoreById(@PathVariable int vinylId) {
        return ResponseEntity.ok(ApiResponse.ok(averageScoreService.getAverageScoreById(vinylId)));
    }

}
