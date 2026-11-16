package com.uade.tpo.marketplace.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.dto.AverageScoreResponse;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.ReviewRepository;

@Service
public class AverageScoreServiceImpl implements AverageScoreService {
    private final ReviewRepository reviewRepository;

    @Override
    public List<AverageScoreResponse> getAverageScores() {
        return reviewRepository.calculateAverageScores();
    }

    @Override
    public AverageScoreResponse getAverageScoreById(int vinylId) {
        return reviewRepository.calculateAverageScore((long) vinylId).orElseThrow(() -> new ResourceNotFoundException("Vinilo", vinylId));
    }

    public AverageScoreServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
}
