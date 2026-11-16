package com.uade.tpo.marketplace.controllers.domain;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.CategoryRequest;
import com.uade.tpo.marketplace.entity.dto.CategoryResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.CategoryMapper;
import com.uade.tpo.marketplace.service.CategoryService;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("categories")
public class CategoriesController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        Page<CategoryResponse> result = (page == null || size == null)
                ? categoryService.getCategories(PageRequest.of(0, Integer.MAX_VALUE)).map(CategoryMapper::toResponse)
                : categoryService.getCategories(PageRequest.of(page, size)).map(CategoryMapper::toResponse);
        return ResponseEntity.ok(ApiResponse.list(result.getContent(), "No hay categorias cargadas"));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.ok(CategoryMapper.toResponse(categoryService.getCategoryById(categoryId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody CategoryRequest categoryRequest) {
        CategoryResponse response = CategoryMapper.toResponse(categoryService.createCategory(categoryRequest.getDescription()));
        return ResponseEntity.created(URI.create("/categories/" + response.getId()))
                .body(ApiResponse.created(response, "Categoria creada correctamente"));
    }
}