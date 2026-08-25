package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ArrayList<Product> getProducts() {
        return new ArrayList<>(productRepository.findAll());
    }

    @Override
    public Product getProductById(int productId) {
        return productRepository.findById((long) productId).orElse(null);
    }

    @Override
    public Product createProduct(Product product) {
        if (product == null || product.getPrice() < 0 || product.getStock() < 0)
            throw new IllegalArgumentException("El producto, el precio y el stock deben ser validos");

        Product newProduct = new Product();
        newProduct.setName(product.getName());
        newProduct.setDescription(product.getDescription());
        newProduct.setPrice(product.getPrice());
        newProduct.setStock(product.getStock());
        newProduct.setCategory(product.getCategory());
        newProduct.setArtist(product.getArtist());
        newProduct.setAudioPreview(product.getAudioPreview());
        return productRepository.save(newProduct);
    }

    @Override
    public ArrayList<Product> searchProducts(String query) {
        String term = query == null ? "" : query;
        return new ArrayList<>(
                productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term));
    }

    @Override
    public ArrayList<Product> filterProducts(Integer categoryId, Double minPrice, Double maxPrice,
            Boolean inStock, Integer artistId) {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice)
            throw new IllegalArgumentException("El precio minimo no puede superar al maximo");

        ArrayList<Product> result = new ArrayList<>();
        for (Product product : productRepository.findAll()) {
            if (categoryId != null && (product.getCategory() == null
                    || !product.getCategory().getId().equals(categoryId.longValue())))
                continue;
            if (artistId != null && (product.getArtist() == null
                    || !product.getArtist().getId().equals(artistId.longValue())))
                continue;
            if (minPrice != null && product.getPrice() < minPrice)
                continue;
            if (maxPrice != null && product.getPrice() > maxPrice)
                continue;
            if (inStock != null && inStock != (product.getStock() > 0))
                continue;
            result.add(product);
        }
        return result;
    }

    @Override
    public Product updateStock(int productId, int quantityDelta) {
        Product product = getProductById(productId);
        if (product == null || product.getStock() + quantityDelta < 0)
            return null;
        product.setStock(product.getStock() + quantityDelta);
        return productRepository.save(product);
    }
}