package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private String type;
    private String fuel;
    private boolean automatic;
    private int numOfSeats;
    private float pricePerDay;
    private String description;

    private String imageUrl;
    private String color;
}