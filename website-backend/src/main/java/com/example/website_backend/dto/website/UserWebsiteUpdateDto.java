package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserWebsiteUpdateDto {
    private String telephone;

    private String name;
    private String last_name;
    private String email;
    private boolean address;
    private boolean dateOfBirth;
    private boolean postal_code;
    private boolean city;
    private boolean country;
    private boolean vat_number;
    private boolean driver_license;

    private boolean passport;
    private boolean passport_country;
    private boolean driver_license_country;
    private boolean company;
    private boolean company_name;

    private String eventType;
}
