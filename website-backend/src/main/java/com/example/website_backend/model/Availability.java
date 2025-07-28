package com.example.website_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(value = "availability")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Availability {
    @Id
    private String id;

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

    // Getters and Setters
}
