package com.example.website_backend.dto.website;

import com.example.website_backend.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateDto {
    private Long website_booking_id;

    private String user_id;
    private UserDto user;
    private Long category_id;

    private List<String> drivers;


    private LocalDateTime start;
    private LocalDateTime end;

    private float price;

    private String startLocation;
    private String endLocation;


    @Override
    public String toString() {
        return "WebsiteBookingDto{" +
                ", user_id='" + user_id + '\'' +
                ", category_id=" + category_id +
                ", drivers=" + drivers +
                ", start=" + start +
                ", end=" + end +
                ", price=" + price +
                ", startLocation='" + startLocation + '\'' +
                ", endLocation='" + endLocation + '\'' +
                '}';
    }
}
