package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceDto {
    private Long id;
    private Long categoryId;
    private String category_name;
    private LocalDate startingDate;
    private LocalDate endingDate;
    private float pricePerDay;
}
