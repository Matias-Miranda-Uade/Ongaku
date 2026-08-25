package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;

import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Product;

@Repository
public class ProductFilterRepository {

    private final ProductRepository productRepository;

    public ProductFilterRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ArrayList<Product> filter(
            Integer categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Integer artistId) {

        ArrayList<Product> result = new ArrayList<>();

        for (Product product : productRepository.findAll()) {

            if (categoryId != null &&
                (product.getCategory() == null ||
                 !product.getCategory().getId().equals(categoryId.longValue()))) {
                continue;
            }

            if (minPrice != null &&
                product.getPrice() < minPrice) {
                continue;
            }

            if (maxPrice != null &&
                product.getPrice() > maxPrice) {
                continue;
            }

            if (inStock != null &&
                inStock != (product.getStock() > 0)) {
                continue;
            }

            if (artistId != null &&
                (product.getArtist() == null ||
                 !product.getArtist().getId().equals(artistId.longValue()))) {
                continue;
            }

            result.add(product);
        }

        return result;
    }
}