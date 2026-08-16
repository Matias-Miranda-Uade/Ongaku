package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;

public class ProductFilterRepository {

    private final ProductRepository productRepository = new ProductRepository();
    public ArrayList<Product> filter(Integer categoryId, Double minPrice, Double maxPrice, Boolean inStock, Integer artistId) {
        ArrayList<Product> result = new ArrayList<>();
        for (Product p : productRepository.getProducts()) {
            if (categoryId != null && p.getCategory().getId() != categoryId) {
                continue;
            }
            if (minPrice != null && p.getPrice() < minPrice) {
                continue;
            }
            if (maxPrice != null && p.getPrice() > maxPrice) {
                continue;
            }
            if (inStock != null && inStock && p.getStock() <= 0) {
                continue;
            }
            if (artistId != null && (p.getArtist() == null || p.getArtist().getId() != artistId)) {
                continue;
            }
            result.add(p);
        }
        return result;
    }
}