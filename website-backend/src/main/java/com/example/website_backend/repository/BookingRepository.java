package com.example.website_backend.repository;

import com.example.website_backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query(value = "CALL CheckMultipleAvailabilityInTimeFrame3(:input_start, :input_end, :input_category_type, :input_category_fuel, :input_category_automatic, :input_num_of_seats, :input_category_name)", nativeQuery = true)
    List<Object[]> CheckMultipleAvailabilityInTimeFrame3 (@Param("input_category_name") String input_category_name,
                                                          @Param("input_category_type") String input_category_type,
                                                          @Param("input_category_fuel") String input_category_fuel,
                                                          @Param("input_category_automatic") Boolean input_category_automatic,
                                                          @Param("input_num_of_seats") Integer input_num_of_seats,
                                                          @Param("input_start") LocalDateTime start,
                                                          @Param("input_end") LocalDateTime end);

    @Query("SELECT b FROM Booking b WHERE b.created_at < :createdAt AND b.is_advance_paid = false")
    List<Booking> findAllByCreatedAtBeforeAndIsAdvancePaidFalse(LocalDateTime threshold);

    /**
     * Finds all bookings where the end timestamp is before the specified time.
     */
    @Query("SELECT b FROM Booking b WHERE b.end < :threshold")
    List<Booking> findAllByEndBefore(@Param("threshold") LocalDateTime threshold);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.drivers WHERE b.id IN :ids")
    List<Booking> findAllByIdWithDrivers(@Param("ids") List<Long> ids);

    @Query("SELECT b FROM Booking b WHERE b.crm_booking_id IN :ids")
    List<Booking> findAllByCRM(@Param("ids") List<Long> ids);
}
