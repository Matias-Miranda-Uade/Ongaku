package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByDescription(String description);
}
