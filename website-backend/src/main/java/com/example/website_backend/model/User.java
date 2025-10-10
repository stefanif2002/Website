package com.example.website_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import jakarta.persistence.Id;

@Entity
@Table(name = "user")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
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

    public User(String telephone, String name, String last_name, String email) {
        this.telephone = telephone;
        if (name != null && !name.isEmpty())
            this.name = name;
        if (last_name != null && !last_name.isEmpty())
            this.last_name = last_name;
        if (email != null && !email.isEmpty())
            this.email = email;
    }

    public User(String email) {
        this.email = email;
    }

}
