package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;
import org.springframework.stereotype.Repository;

@Repository
public class ProductSearchRepository {

    private final ProductRepository productRepository;

    public ProductSearchRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

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