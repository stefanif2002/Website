package com.example.website_backend.repository;

import com.example.website_backend.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {

    /**
     * Finds all Driver records whose booking_id field is in a list of IDs.
     */
    @Query("SELECT d FROM Driver d WHERE d.id.bookingId IN :bookingIds")
    List<Driver> findAllByBookingIn(@Param("bookingIds") List<Long> bookingIds);

    /**
     * Finds all Driver records for a single booking_id.
     */
    @Query("SELECT d FROM Driver d WHERE d.id.bookingId = :id")
    List<Driver> findAllByBooking_id(@Param("id") Long id);

    @Query("DELETE FROM Driver d WHERE d.id.bookingId = :id")
    List<Driver> deleteAllByBooking_id(Long id);

}
