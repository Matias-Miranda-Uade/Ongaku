package com.uade.tpo.marketplace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateResourceException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.CategoryRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private VinylRepository vinylRepository;

    @Override
    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", categoryId));
    }

    @Override
    public Category createCategory(String description) {

        if (description == null || description.isBlank()) {
            throw new InvalidFieldException("description", "no puede estar vacia");
        }

        description = description.trim();
        if (description.length() > 255) throw new InvalidFieldException("description", "no puede superar 255 caracteres");
        List<Category> categories = categoryRepository.findByDescription(description);

        if (!categories.isEmpty()) {
            throw new DuplicateResourceException("Categoria", description);
        }

        return categoryRepository.save(new Category(description));
    }

    // Igual que con los artistas: los vinilos se conservan y quedan sin categoria.
    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = getCategoryById(categoryId);
        List<Vinyl> vinyls = vinylRepository.findAllByCategoryId(categoryId);
        if (!vinyls.isEmpty()) {
            vinyls.forEach(vinyl -> vinyl.setCategory(null));
            vinylRepository.saveAll(vinyls);
            vinylRepository.flush();
        }
        categoryRepository.delete(category);
    }
}
