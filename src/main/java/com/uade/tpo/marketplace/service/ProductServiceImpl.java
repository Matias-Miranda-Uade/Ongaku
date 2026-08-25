package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductFilterRepository;
import com.uade.tpo.marketplace.repository.ProductRepository;
import com.uade.tpo.marketplace.repository.ProductSearchRepository;
import com.uade.tpo.marketplace.repository.ProductStockRepository;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductFilterRepository productFilterRepository;
    private final ProductSearchRepository productSearchRepository;
    private final ProductStockRepository productStockRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            ProductFilterRepository productFilterRepository,
            ProductSearchRepository productSearchRepository,
            ProductStockRepository productStockRepository) {

        this.productRepository = productRepository;
        this.productFilterRepository = productFilterRepository;
        this.productSearchRepository = productSearchRepository;
        this.productStockRepository = productStockRepository;
    }

    @Override
    public ArrayList<Product> getProducts() {
        return new ArrayList<>(
            productRepository.findAll()
        );
    }

    @Override
    public Product getProductById(int productId) {
        return productRepository
                .findById((long) productId)
                .orElse(null);
    }

    @Override
    public Product createProduct(Product product) {

        if (product == null ||
            product.getPrice() < 0 ||
            product.getStock() < 0) {

            throw new IllegalArgumentException(
                "El producto, el precio y el stock deben ser validos"
            );
        }

        product.setId(null);

        return productRepository.save(product);
    }

    @Override
    public ArrayList<Product> searchProducts(
            String query) {

        return productSearchRepository
                .searchByName(query);
    }

    @Override
    public ArrayList<Product> filterProducts(
            Integer categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Integer artistId) {

        if (minPrice != null &&
            maxPrice != null &&
            minPrice > maxPrice) {

            throw new IllegalArgumentException(
                "El precio minimo no puede superar al maximo"
            );
        }

        return productFilterRepository.filter(
            categoryId,
            minPrice,
            maxPrice,
            inStock,
            artistId
        );
    }

    @Override
    public Product updateStock(
            int productId,
            int quantityDelta) {

        return productStockRepository
                .updateStock(
                    productId,
                    quantityDelta
                );
    }
}