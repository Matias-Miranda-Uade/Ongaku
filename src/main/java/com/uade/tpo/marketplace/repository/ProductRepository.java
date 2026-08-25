package com.uade.tpo.marketplace.repository;

<<<<<<< HEAD
import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

=======
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
>>>>>>> origin/main
}