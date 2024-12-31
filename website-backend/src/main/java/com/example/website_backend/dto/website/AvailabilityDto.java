package com.example.website_backend.dto.website;

import com.example.website_backend.dto.crm.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDto {
    private CategoryDto category;
    private float totalPrice;
    private float averagePricePerDay;
}
