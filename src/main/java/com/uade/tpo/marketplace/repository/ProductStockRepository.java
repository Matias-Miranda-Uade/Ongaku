package com.uade.tpo.marketplace.repository;

import com.uade.tpo.marketplace.entity.Product;

public class ProductStockRepository {

    private final ProductRepository productRepository = new ProductRepository();
    
    public Product updateStock(int productId, int quantityDelta) {
        Product product = productRepository.getProductById(productId);
        if (product == null) {
            return null;
        }
        int newStock = product.getStock() + quantityDelta;
        if (newStock < 0) {
            return null;
        }
        product.setStock(newStock);
        return product;
    }
}