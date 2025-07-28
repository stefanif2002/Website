package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateDtoCrm {
    private Long website_booking_id;

    private String telephone;
    private Long category_id;

    private LocalDateTime start;
    private LocalDateTime end;

    private List<String> drivers;

    private float price;

    private String startLocation;
    private String endLocation;

    private LocalDateTime created_at;
    private boolean is_advance_paid;
}
