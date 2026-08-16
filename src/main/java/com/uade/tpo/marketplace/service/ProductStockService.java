package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductStockRepository;

public class ProductStockService {
    private final ProductStockRepository productStockRepository = new ProductStockRepository();

    public Product updateStock(int productId, int quantityDelta) {
        return productStockRepository.updateStock(productId, quantityDelta);
    }
}