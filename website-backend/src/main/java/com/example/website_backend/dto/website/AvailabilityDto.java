package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDto {
    private Long categoryId;
    private String categoryName;
    private String type;
    private String fuel;
    private boolean automatic;
    private int numOfSeats;
    private float pricePerDay;
    private String description;
    private String imageUrl;
    private String color;

    private float totalPrice;
    private float averagePricePerDay;
}
