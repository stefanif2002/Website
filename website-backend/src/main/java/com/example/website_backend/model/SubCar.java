package com.example.website_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Setter
@Getter
@Table(name = "sub_car")
public class SubCar {
    @Id
    private String license;
    private Long categoryId;
    private LocalDate subRental_start;
    private LocalDate subRental_end;

    public SubCar(String license, Long categoryId, LocalDate subRental_start, LocalDate subRental_end) {
        this.license = license;
        this.categoryId = categoryId;
        this.subRental_start = subRental_start;
        this.subRental_end = subRental_end;
    }

    public SubCar() {
    }
}
