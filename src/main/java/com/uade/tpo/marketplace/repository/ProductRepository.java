package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.AudioPreview;
import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Product;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {

    public static ArrayList<Product> products = new ArrayList<>(
        Arrays.asList(
            Product.builder().id(1).name("Abbey Road").description("Vinilo - The Beatles").price(35000).stock(5).category(Category.builder().id(1).description("vinilos").build()).artist(Artist.builder().id(1).name("The Beatles").build()).audioPreview(AudioPreview.builder().id(1).url("/audio/previews/abbey-road.mp3").durationSeconds(30).build()).build(),
            Product.builder().id(2).name("Remera básica").description("Remera de algodón talle M").price(12000).stock(20).category(Category.builder().id(2).description("ropa").build()).artist(null).audioPreview(null).build(),
            Product.builder().id(3).name("Gorra").description("Gorra ajustable").price(8000).stock(0).category(Category.builder().id(3).description("accesorios").build()).artist(null).audioPreview(null).build()
        )
    );

    private int nextId() {
        return products.stream().mapToInt(Product::getId).max().orElse(0) + 1;
    }

    public ArrayList<Product> getProducts() {
        return products;
    }

    public Product getProductById(int productId) {
        for (Product p : products) {
            if (p.getId() == productId) {
                return p;
            }
        }
        return null;
    }

    public Product createProduct(Product product) {
        product.setId(nextId());
        products.add(product);
        return product;
    }
}