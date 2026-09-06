package com.uade.tpo.marketplace.controllers.domain;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.AverageScoreRequest;
import com.uade.tpo.marketplace.entity.dto.AverageScoreResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.AverageScoreMapper;
import com.uade.tpo.marketplace.service.AverageScoreService;

@RestController
@RequestMapping("average-scores")
public class AverageScoresController {
    @Autowired
    private AverageScoreService averageScoreService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AverageScoreResponse>>> getAverageScores() {
        List<AverageScoreResponse> scores = averageScoreService.getAverageScores().stream()
                .map(AverageScoreMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(scores, "No hay puntuaciones promedio cargadas"));
    }

    @GetMapping("/{averageScoreId}")
    public ResponseEntity<ApiResponse<AverageScoreResponse>> getAverageScoreById(@PathVariable int averageScoreId) {
        return ResponseEntity.ok(ApiResponse.ok(AverageScoreMapper.toResponse(averageScoreService.getAverageScoreById(averageScoreId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AverageScoreResponse>> createAverageScore(@RequestBody AverageScoreRequest request) {
        AverageScoreResponse response = AverageScoreMapper.toResponse(averageScoreService.createAverageScore(request));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Puntuacion promedio actualizada"));
    }
}