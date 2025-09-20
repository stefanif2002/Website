package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailDto {
    private String email;
    private String telephone;
    private String name;
    private Long bookingId;
    private LocalDateTime start;
    private LocalDateTime end;
    private String startLocation;
    private String endLocation;
}
