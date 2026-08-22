package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.repository.AverageScoreRepository;

@Service
public class AverageScoreServiceImpl implements AverageScoreService {
    private final AverageScoreRepository averageScoreRepository;
    public AverageScoreServiceImpl(AverageScoreRepository repository) { this.averageScoreRepository = repository; }
    public ArrayList<AverageScore> getAverageScores() { return averageScoreRepository.getAverageScores(); }
    public AverageScore getAverageScoreById(int id) { return averageScoreRepository.getAverageScores().stream().filter(s -> s.getId() == id).findFirst().orElse(null); }
    public AverageScore createAverageScore(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",");
        if (values.length < 2) throw new IllegalArgumentException("El promedio requiere vinilo y puntuacion");
        int vinylId = Integer.parseInt(values[0].trim()); double score = Double.parseDouble(values[1].trim());
        if (vinylId <= 0 || score < 0 || score > 5) throw new IllegalArgumentException("La puntuacion debe estar entre 0 y 5");
        AverageScore current = averageScoreRepository.getAverageScores().stream().filter(s -> s.getVinylId() == vinylId).findFirst().orElse(null);
        if (current != null) { current.setAverageScore(score); return current; }
        AverageScore result = AverageScore.builder().id(averageScoreRepository.getAverageScores().stream().mapToLong(AverageScore::getId).max().orElse(0) + 1).vinylId(vinylId).averageScore(score).build();
        averageScoreRepository.getAverageScores().add(result); return result;
    }
}