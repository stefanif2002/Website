package com.example.website_backend.repository;

import com.example.website_backend.model.Preparation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreparationRepository extends MongoRepository<Preparation, String> {

}