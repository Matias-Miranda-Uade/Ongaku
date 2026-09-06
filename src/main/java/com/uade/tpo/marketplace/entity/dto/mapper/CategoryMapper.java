package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.dto.CategoryResponse;

public final class CategoryMapper {
    private CategoryMapper() {
    }

    public static CategoryResponse toResponse(Category category) {
        if (category == null) return null;
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setDescription(category.getDescription());
        return response;
    }
}
