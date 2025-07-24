package com.example.website_backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document("booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    private String id;

    private Long category_id;
    private String user_id;

    private List<String> drivers;

    private LocalDateTime start;
    private LocalDateTime end;

    private float price;

    private String startLocation;
    private String endLocation;

    private LocalDateTime created_at;
    private boolean is_advance_paid;

    public Booking(Long category_id, String user_id, List<String> drivers, LocalDateTime start, LocalDateTime end, float price, String startLocation, String endLocation) {
        this.category_id = category_id;
        this.user_id = user_id;
        this.drivers = drivers;
        this.start = start;
        this.end = end;
        this.price = price;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.created_at = LocalDateTime.now();
        this.is_advance_paid = false;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", start=" + start +
                ", end=" + end +
                '}';
    }
}