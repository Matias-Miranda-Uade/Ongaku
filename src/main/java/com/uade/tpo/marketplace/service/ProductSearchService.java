package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductSearchRepository;


public class ProductSearchService {
    private final ProductSearchRepository productSearchRepository = new ProductSearchRepository();

    public ArrayList<Product> searchByName(String query) {
        return productSearchRepository.searchByName(query);
    }
}