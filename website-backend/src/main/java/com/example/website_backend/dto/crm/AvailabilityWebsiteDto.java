package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityWebsiteDto {
    private LocalDateTime time;
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
    private int numOfAvailableVehicles;
}
