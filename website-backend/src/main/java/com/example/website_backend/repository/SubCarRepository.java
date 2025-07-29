package com.example.website_backend.repository;

import com.example.website_backend.model.SubCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubCarRepository extends JpaRepository<SubCar, String> {
}

