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

    private String user_id;
    private Long category_id;

    private List<String> drivers;


    private LocalDateTime start;
    private LocalDateTime end;

    private float price;

    private String startLocation;
    private String endLocation;

    private boolean externalCar;

    private LocalDateTime created_at;
    private boolean is_advance_paid;
}
