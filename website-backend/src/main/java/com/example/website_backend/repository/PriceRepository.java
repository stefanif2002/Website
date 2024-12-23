package com.example.website_backend.repository;

import com.example.website_backend.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    @Query(value = "CALL CheckMultipleAvailabilityInTimeFrame(:input_start, :input_end, :input_category_ids)", nativeQuery = true)
    List<Object[]> CheckMultipleAvailabilityInTimeFrame (@Param("input_category_ids") String categoryId,
                                                         @Param("input_start") LocalDateTime start,
                                                         @Param("input_end") LocalDateTime end);
}
