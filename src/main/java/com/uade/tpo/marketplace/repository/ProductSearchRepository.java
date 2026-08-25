package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;

import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Product;

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

        for (Product product : productRepository.findAll()) {

            if ((product.getName() != null &&
                 product.getName().toLowerCase().contains(normalizedQuery))
                ||
                (product.getDescription() != null &&
                 product.getDescription().toLowerCase().contains(normalizedQuery))) {

                result.add(product);
            }
        }

        return result;
    }
}