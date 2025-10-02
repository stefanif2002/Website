// DiscountCouponRepository.java
package com.example.website_backend.repository;

import com.example.website_backend.model.DiscountCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface DiscountCouponRepository extends JpaRepository<DiscountCoupon, String> {

    /**
     * Find a single active coupon matching the given code, valid for the specified category
     * and having any overlap with the requested date range.
     */
    @Query("""
        SELECT c
          FROM DiscountCoupon c
         WHERE c.id            = :code
           AND :categoryId     MEMBER OF c.validCategoryIds
           AND c.active        = true
           AND c.startDate     < :reservationEnd
           AND c.endDate       > :reservationStart
        """)
    DiscountCoupon findIfOverlaps(
            String code,
            Long categoryId,
            LocalDate reservationStart,
            LocalDate reservationEnd
    );

}
