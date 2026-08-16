package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.service.CategoryService;

@RestController
@RequestMapping("categories")
public class CategoriesController {
    

    @GetMapping
    public ArrayList<Category> getCategories(){
        CategoryService categoryService = new CategoryService();
        return categoryService.getCategories();
    }

    @GetMapping("/{categoryId}")
    public String getCategoryById(@PathVariable int categoryId){
        CategoryService categoryService = new CategoryService();
        return categoryService.getCategoryById(categoryId);
    }
    
    @PostMapping 
    public String createCategory(@RequestBody String entity){
        CategoryService categoryService = new CategoryService();
        return categoryService.createCategory(entity);
    }
    
    
}
