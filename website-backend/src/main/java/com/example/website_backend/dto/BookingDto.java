package com.example.website_backend.dto;

import com.example.website_backend.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long crm_booking_id;
    private Long website_booking_id;


    private String user_id;
    private Long category_id;

    private List<String> drivers;


    private LocalDateTime start;
    private LocalDateTime end;

    private float price;
    private BookingStatus status;

    private String startLocation;
    private String endLocation;


    private LocalDateTime created_at;
    private boolean is_advance_paid;


    @Override
    public String toString() {
        return "WebsiteBookingDto{" +
                "crm_booking_id=" + crm_booking_id +
                ", website_booking_id=" + website_booking_id +
                ", user_id='" + user_id + '\'' +
                ", category_id=" + category_id +
                ", drivers=" + drivers +
                ", start=" + start +
                ", end=" + end +
                ", price=" + price +
                ", status=" + status +
                ", startLocation='" + startLocation + '\'' +
                ", endLocation='" + endLocation + '\'' +
                ", created_at=" + created_at +
                ", is_advance_paid=" + is_advance_paid +
                '}';
    }
}
