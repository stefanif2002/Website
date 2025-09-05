package com.example.website_backend.dto.crm;

import com.example.website_backend.dto.website.ChecklistItemDto;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    private List<DriverDto> drivers;


    private LocalDateTime start;
    private LocalDateTime end;

    private float price;

    private String startLocation;
    private String endLocation;


    private LocalDateTime created_at;
    private boolean is_advance_paid;

    private String flight;
    private String notes;

    @JsonProperty("number_of_people")
    private Integer numberOfPeople;

    private List<ChecklistItemDto> checklist;


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
                ", startLocation='" + startLocation + '\'' +
                ", endLocation='" + endLocation + '\'' +
                ", created_at=" + created_at +
                ", is_advance_paid=" + is_advance_paid +
                '}';
    }

    public BookingDto(Long crm_booking_id, Long website_booking_id) {
        this.crm_booking_id = crm_booking_id;
        this.website_booking_id = website_booking_id;
    }

    public BookingDto(Long crm_booking_id, Long website_booking_id, String user_id, Long category_id, LocalDateTime start, LocalDateTime end, float price, String startLocation, String endLocation, LocalDateTime created_at, boolean is_advance_paid) {
        this.crm_booking_id = crm_booking_id;
        this.website_booking_id = website_booking_id;
        this.user_id = user_id;
        this.category_id = category_id;
        this.start = start;
        this.end = end;
        this.price = price;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.created_at = created_at;
        this.is_advance_paid = is_advance_paid;
    }
}
