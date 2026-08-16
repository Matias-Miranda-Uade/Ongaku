package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.service.ProductCreationService;
import com.uade.tpo.marketplace.service.ProductFilterService;
import com.uade.tpo.marketplace.service.ProductQueryService;
import com.uade.tpo.marketplace.service.ProductSearchService;
import com.uade.tpo.marketplace.service.ProductStockService;

@RestController
@RequestMapping("products")
public class ProductsController {

    @GetMapping
    public ArrayList<Product> getProducts() {
        ProductQueryService productQueryService = new ProductQueryService();
        return productQueryService.getProducts();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable int productId) {
        ProductQueryService productQueryService = new ProductQueryService();
        Product product = productQueryService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        ProductCreationService productCreationService = new ProductCreationService();
        return productCreationService.createProduct(product);
    }

    @GetMapping("/search")
    public ArrayList<Product> searchProducts(@RequestParam String q) {
        ProductSearchService productSearchService = new ProductSearchService();
        return productSearchService.searchByName(q);
    }

    @GetMapping("/filter")
    public ArrayList<Product> filterProducts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Integer artistId) {
        ProductFilterService productFilterService = new ProductFilterService();
        return productFilterService.filter(categoryId, minPrice, maxPrice, inStock, artistId);
    }

    @PatchMapping("/{productId}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable int productId, @RequestParam int quantity) {
        ProductStockService productStockService = new ProductStockService();
        Product product = productStockService.updateStock(productId, quantity);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(product);
    }
}