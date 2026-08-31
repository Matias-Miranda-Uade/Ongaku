package com.uade.tpo.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.exceptions.CategoryDuplicateException;
import com.uade.tpo.marketplace.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    @Override
    public Category createCategory(String description)
            throws CategoryDuplicateException {

        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException(
                    "La categoria debe tener descripcion");
        }

        List<Category> categories =
                categoryRepository.findByDescription(description);

        if (categories.isEmpty()) {
            return categoryRepository.save(
                    new Category(description));
        }

        throw new CategoryDuplicateException();
    }
}