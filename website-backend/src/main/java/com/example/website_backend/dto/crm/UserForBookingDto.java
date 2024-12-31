package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserForBookingDto {
    private boolean exists;
    private boolean blocked;
}
