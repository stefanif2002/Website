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
    private int cars;

    public CategoryDto(Long id, String name, String type, String fuel, boolean automatic, int numOfSeats, float pricePerDay, String description, String imageUrl, String color) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.fuel = fuel;
        this.automatic = automatic;
        this.numOfSeats = numOfSeats;
        this.pricePerDay = pricePerDay;
        this.description = description;
        this.imageUrl = imageUrl;
        this.color = color;
    }
}