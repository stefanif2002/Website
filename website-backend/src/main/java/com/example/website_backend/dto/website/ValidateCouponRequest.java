package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateCouponRequest {
    private String code;
    private Long categoryId;
    private LocalDate startDate;
    private LocalDate endDate;
}
