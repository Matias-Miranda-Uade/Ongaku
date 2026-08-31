package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.AverageScoreRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class AverageScoreServiceImpl implements AverageScoreService {

    private final AverageScoreRepository averageScoreRepository;
    private final VinylRepository vinylRepository;

    public AverageScoreServiceImpl(
            AverageScoreRepository averageScoreRepository,
            VinylRepository vinylRepository) {

        this.averageScoreRepository = averageScoreRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<AverageScore> getAverageScores() {
        return new ArrayList<>(averageScoreRepository.findAll());
    }

    @Override
    public AverageScore getAverageScoreById(int id) {
        return averageScoreRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public AverageScore createAverageScore(String entity) {

        String[] values = entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 2) {
            throw new IllegalArgumentException(
                    "El promedio requiere vinilo y puntuacion");
        }

        int vinylId = Integer.parseInt(values[0].trim());
        double score = Double.parseDouble(values[1].trim());

        if (vinylId <= 0 || score < 0 || score > 5) {
            throw new IllegalArgumentException(
                    "La puntuacion debe estar entre 0 y 5");
        }

        Vinyl vinyl = vinylRepository
                .findById((long) vinylId)
                .orElse(null);

        if (vinyl == null) {
            throw new IllegalArgumentException(
                    "El vinilo no existe");
        }

        AverageScore current = averageScoreRepository
                .findByVinylId(vinylId)
                .stream()
                .findFirst()
                .orElse(null);

        if (current != null) {
            current.setAverageScore(score);
            return averageScoreRepository.save(current);
        }

        AverageScore result = new AverageScore();
        result.setVinyl(vinyl);
        result.setAverageScore(score);

        return averageScoreRepository.save(result);
    }
}