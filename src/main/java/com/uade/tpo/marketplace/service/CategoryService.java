package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.repository.CategoryRepository;

//aca se usa todo en codigo de java, no se usan frameworks practicamente
public class CategoryService {
    public ArrayList<Category> getCategories(){
        CategoryRepository categoryRepository = new CategoryRepository();
        return categoryRepository.getCategories();
    }

    public String getCategoryById(int categoryId){
        CategoryRepository categoryRepository = new CategoryRepository();
        return categoryRepository.getCategoryById(categoryId);
    }
    
    public String createCategory(String entity){
        CategoryRepository categoryRepository = new CategoryRepository();
        return categoryRepository.createCategory(entity);
    }
}
