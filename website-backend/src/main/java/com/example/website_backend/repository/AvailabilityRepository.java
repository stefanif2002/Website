package com.example.website_backend.repository;

import com.example.website_backend.model.Availability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvailabilityRepository extends MongoRepository<Availability,String> {
}
