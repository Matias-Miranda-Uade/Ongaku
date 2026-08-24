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

    public ProductServiceImpl(ProductRepository productRepository,
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
        return productRepository.getProducts();
    }

    @Override
    public Product getProductById(int productId) {
        return productRepository.getProducts().stream().filter(p -> p.getId() == productId).findFirst().orElse(null);
    }

    @Override
    public Product createProduct(Product product) {
        if (product == null || product.getPrice() < 0 || product.getStock() < 0) {
            throw new IllegalArgumentException("El producto, el precio y el stock deben ser validos");
        }
        product.setId(productRepository.getProducts().stream().mapToLong(Product::getId).max().orElse(0) + 1);
        productRepository.getProducts().add(product);
        return product;
    }

    @Override
    public ArrayList<Product> searchProducts(String query) {
        String normalized = query == null ? "" : query.toLowerCase();
        ArrayList<Product> result = new ArrayList<>();
        for (Product product : productRepository.getProducts()) if ((product.getName() != null && product.getName().toLowerCase().contains(normalized)) || (product.getDescription() != null && product.getDescription().toLowerCase().contains(normalized))) result.add(product);
        return result;
    }

    @Override
    public ArrayList<Product> filterProducts(Integer categoryId, Double minPrice, Double maxPrice,
            Boolean inStock, Integer artistId) {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException("El precio minimo no puede superar al maximo");
        }
        ArrayList<Product> result = new ArrayList<>();
        for (Product product : productRepository.getProducts()) {
            if (categoryId != null && (product.getCategory() == null || !product.getCategory().getId().equals(categoryId.longValue()))) continue;
            if (artistId != null && (product.getArtist() == null || !product.getArtist().getId().equals(artistId.longValue()))) continue;
            if (minPrice != null && product.getPrice() < minPrice || maxPrice != null && product.getPrice() > maxPrice) continue;
            if (inStock != null && inStock != (product.getStock() > 0)) continue;
            result.add(product);
        }
        return result;
    }

    @Override
    public Product updateStock(int productId, int quantityDelta) {
        Product product = getProductById(productId);
        if (product == null || product.getStock() + quantityDelta < 0) return null;
        product.setStock(product.getStock() + quantityDelta); return product;
    }
}