package com.example.website_backend.repository;

import com.example.website_backend.model.Preparation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreparationRepository extends JpaRepository<Preparation, String> {

}
