package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCouponDto {
    private String id;
    private List<Long> validCategoryIds;
    private float discountPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
    private String eventType;
}