package com.uade.tpo.marketplace.controllers.config;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.repository.CategoryRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class CategorySeeder implements ApplicationRunner {
    private final CategoryRepository repository;
    public CategorySeeder(CategoryRepository repository) { this.repository = repository; }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Completa opciones de formato; no reemplaza categorías ni relaciones existentes.
        for (String description : java.util.List.of("Álbumes de estudio", "En vivo", "Recopilación", "EP", "Single")) {
            if (repository.findByDescription(description).isEmpty()) repository.save(new Category(description));
        }
    }
}
