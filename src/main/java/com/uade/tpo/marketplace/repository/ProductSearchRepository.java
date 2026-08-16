package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;

public class ProductSearchRepository {

    private final ProductRepository productRepository = new ProductRepository();

    public ArrayList<Product> searchByName(String query) {
        ArrayList<Product> result = new ArrayList<>();
        if (query == null) {
            return result;
        }
        String normalizedQuery = query.toLowerCase();
        for (Product p : productRepository.getProducts()) {
            if (p.getName().toLowerCase().contains(normalizedQuery)
                    || p.getDescription().toLowerCase().contains(normalizedQuery)) {
                result.add(p);
            }
        }
        return result;
    }
}