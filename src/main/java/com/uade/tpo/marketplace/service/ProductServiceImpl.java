package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {
<<<<<<< HEAD

    private final ProductRepository productRepository;
    private final ProductFilterRepository productFilterRepository;
    private final ProductSearchRepository productSearchRepository;
    private final ProductStockRepository productStockRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            ProductFilterRepository productFilterRepository,
            ProductSearchRepository productSearchRepository,
            ProductStockRepository productStockRepository) {

=======

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
>>>>>>> origin/main
        this.productRepository = productRepository;
    }

    @Override
    public ArrayList<Product> getProducts() {
<<<<<<< HEAD
        return new ArrayList<>(
            productRepository.findAll()
        );
=======
        return new ArrayList<>(productRepository.findAll());
>>>>>>> origin/main
    }

    @Override
    public Product getProductById(int productId) {
<<<<<<< HEAD
        return productRepository
                .findById((long) productId)
                .orElse(null);
=======
        return productRepository.findById((long) productId).orElse(null);
>>>>>>> origin/main
    }

    @Override
    public Product createProduct(Product product) {
<<<<<<< HEAD

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
=======
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
>>>>>>> origin/main
    }
}