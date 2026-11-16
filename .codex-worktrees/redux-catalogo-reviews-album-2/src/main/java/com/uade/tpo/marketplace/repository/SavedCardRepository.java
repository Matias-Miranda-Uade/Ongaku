package com.uade.tpo.marketplace.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.marketplace.entity.SavedCard;

public interface SavedCardRepository extends JpaRepository<SavedCard,Long> {
    List<SavedCard> findByUser_IdOrderByIdAsc(Long userId);
}
