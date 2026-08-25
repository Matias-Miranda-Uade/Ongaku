package com.uade.tpo.marketplace.repository;

import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Product;

@Repository
public class ProductStockRepository {

    private final ProductRepository productRepository;

    public ProductStockRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product updateStock(int productId, int quantityDelta) {

        Product product = productRepository
                .findById((long) productId)
                .orElse(null);

        if (product == null) {
            return null;
        }

        int newStock = product.getStock() + quantityDelta;

        if (newStock < 0) {
            return null;
        }

        product.setStock(newStock);

        return productRepository.save(product);
    }
}