package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductRepository;

public class ProductQueryService {
    private final ProductRepository productRepository = new ProductRepository();

    public ArrayList<Product> getProducts() {
        return productRepository.getProducts();
    }

    public Product getProductById(int productId) {
        return productRepository.getProductById(productId);
    }
}