package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;

public interface ProductService {
    ArrayList<Product> getProducts();

    Product getProductById(int productId);

    Product createProduct(Product product);

    ArrayList<Product> searchProducts(String query);

    ArrayList<Product> filterProducts(Integer categoryId, Double minPrice, Double maxPrice,
            Boolean inStock, Integer artistId);

    Product updateStock(int productId, int quantityDelta);
}