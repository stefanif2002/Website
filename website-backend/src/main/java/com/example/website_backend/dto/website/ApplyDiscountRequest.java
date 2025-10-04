package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplyDiscountRequest {
    private String couponCode;
    private float discountPercentage;
    private float originalTotal;
    private float discountedTotal;
}
