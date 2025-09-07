package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String email;
    private String name;
    private String last_name;
    private String telephone;
    private String address;
    private String postal_code;
    private String city;
    private String country;
    private String vat_number;
    private String driver_license;
    private String driver_license_country;
    private String passport;
    private String passport_country;
    private boolean company;
    private String company_name;
}
