package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductRepository;

public class ProductCreationService {
    private final ProductRepository productRepository = new ProductRepository();

    public Product createProduct(Product product) {
        return productRepository.createProduct(product);
    }
}