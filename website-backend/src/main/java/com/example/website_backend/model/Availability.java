package com.example.website_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("availability")
@CompoundIndexes({
        @CompoundIndex(name = "cat_time_unique", def = "{'categoryId':1,'time':1}", unique = true)
})
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
    private int numOfAvailableVehicles;

    public static String buildId(Long categoryId, LocalDateTime time) {
        // Use an ISO-like format that sorts lexicographically by time
        return categoryId + "#" + time.toString(); // time.toString() is ISO-8601 for LocalDateTime
    }

}
