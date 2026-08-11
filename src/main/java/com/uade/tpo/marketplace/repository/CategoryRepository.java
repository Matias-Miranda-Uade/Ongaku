package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Category;


public class CategoryRepository {
    public ArrayList <Category> categories = new ArrayList<>(
        Arrays.asList(
            Category.builder().description("vinilos").id(1).build(),
            Category.builder().description("ropa").id(2).build(),
            Category.builder().description("accesorios").id(3).build()
        )
    );

    public ArrayList<Category> getCategories(){
        return this.categories;
    }

    public String getCategoryById(int categoryId){
        return null;
    }

    public String createCategory (String entity){
        return null;
    }

}
