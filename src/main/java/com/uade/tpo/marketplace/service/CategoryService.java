package com.uade.tpo.marketplace.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.marketplace.entity.Category;

public interface CategoryService {
    Page<Category> getCategories(PageRequest pageRequest);

    Category getCategoryById(Long categoryId);

    Category createCategory(String description);
}