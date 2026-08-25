package com.uade.tpo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}