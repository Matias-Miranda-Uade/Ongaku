package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.AverageScoreRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
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
        return averageScoreRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Average score", id));
    }

    @Override
    public AverageScore createAverageScore(AverageScoreRequest request) {

        if (request == null) {
            throw new InvalidRequestException("El promedio requiere vinilo y puntuacion");
        }
        if (request.getVinylId() <= 0) {
            throw new InvalidFieldException("vinylId", "debe ser un identificador positivo");
        }
        if (request.getAverageScore() < 0 || request.getAverageScore() > 5) {
            throw new InvalidFieldException("averageScore", "debe estar entre 0 y 5");
        }

        Vinyl vinyl = vinylRepository.findById((long) request.getVinylId())
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", request.getVinylId()));

        AverageScore current = averageScoreRepository
                .findByVinylId(request.getVinylId())
                .stream()
                .findFirst()
                .orElse(null);

        if (current != null) {
            current.setAverageScore(request.getAverageScore());
            return averageScoreRepository.save(current);
        }

        AverageScore result = new AverageScore();
        result.setVinyl(vinyl);
        result.setAverageScore(request.getAverageScore());

        return averageScoreRepository.save(result);
    }
}