package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.AverageScore;

public class AverageScoreRepository {
    public ArrayList<AverageScore> averageScores = new ArrayList<>(Arrays.asList(
            AverageScore.builder().id(1).vinylId(10).averageScore(4.5).build(),
            AverageScore.builder().id(2).vinylId(11).averageScore(4.8).build(),
            AverageScore.builder().id(3).vinylId(12).averageScore(4.2).build()
    ));

    public ArrayList<AverageScore> getAverageScores() {
        return this.averageScores;
    }

    public AverageScore getAverageScoreById(int averageScoreId) {
        return null;
    }

    public AverageScore createAverageScore(String entity) {
        return null;
    }
}
