package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private String id;

    private String user_id;
    private Long category_id;

    private List<String> drivers;


    private LocalDateTime start;
    private LocalDateTime end;

    private float price;

    private String startLocation;
    private String endLocation;


    private LocalDateTime created_at;
    private boolean is_advance_paid;


    @Override
    public String toString() {
        return "BookingDto{" +
                "id='" + id + '\'' +
                ", user_id='" + user_id + '\'' +
                ", category_id=" + category_id +
                ", drivers=" + drivers +
                ", start=" + start +
                ", end=" + end +
                ", price=" + price +
                ", startLocation='" + startLocation + '\'' +
                ", endLocation='" + endLocation + '\'' +
                ", created_at=" + created_at +
                ", is_advance_paid=" + is_advance_paid +
                '}';
    }

}
