package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCarDto {
    private String license;
    private Long categoryId;
    private LocalDate subRental_start;
    private LocalDate subRental_end;

    private String eventType;
}
