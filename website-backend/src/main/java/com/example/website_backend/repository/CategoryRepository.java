package com.example.website_backend.repository;

import com.example.website_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("""
           select distinct trim(c.type)
           from Category c
           where c.type is not null and trim(c.type) <> ''
           order by trim(c.type) asc
           """)
    List<String> findDistinctTypes();

    @Query("""
           select distinct trim(c.fuel)
           from Category c
           where c.fuel is not null and trim(c.fuel) <> ''
           order by trim(c.fuel) asc
           """)
    List<String> findDistinctFuels();
}
