package com.example.website_backend.repository;

import com.example.website_backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // created_at < threshold AND is_advance_paid = false
    @Query("{ 'created_at': { $lt: ?0 }, 'is_advance_paid': false }")
    List<Booking> findAllByCreatedAtBeforeAndIsAdvancePaidFalse(LocalDateTime threshold);

    // end < threshold
    List<Booking> findAllByEndBefore(LocalDateTime threshold);
}
