package com.example.website_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "discount_coupon")
public class DiscountCoupon {

    @Id
    @Column(name = "coupon_id", nullable = false, updatable = false)
    private String id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "discount_coupon_valid_categories",
            joinColumns = @JoinColumn(name = "coupon_id", referencedColumnName = "coupon_id")
    )
    @Column(name = "valid_category_ids", nullable = false)
    private List<Long> validCategoryIds;

    @Column(name = "discount_percentage", nullable = false)
    private float discountPercentage;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "active", nullable = false)
    private boolean active;

    public DiscountCoupon() {
    }

    public DiscountCoupon(String id, List<Long> validCategoryIds, float discountPercentage, LocalDate startDate, LocalDate endDate, boolean active) {
        this.id = id;
        this.validCategoryIds = validCategoryIds;
        this.discountPercentage = discountPercentage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

}