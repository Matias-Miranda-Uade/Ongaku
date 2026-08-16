package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductFilterRepository;

public class ProductFilterService {
    private final ProductFilterRepository productFilterRepository = new ProductFilterRepository();

    public ArrayList<Product> filter(Integer categoryId, Double minPrice, Double maxPrice, Boolean inStock, Integer artistId) {
        return productFilterRepository.filter(categoryId, minPrice, maxPrice, inStock, artistId);
    }
}