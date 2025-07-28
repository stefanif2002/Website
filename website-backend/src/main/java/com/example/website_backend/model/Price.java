package com.example.website_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Setter
@Getter
@Table(name = "prices", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"category_id", "starting_date", "ending_date"})
})
public class Price {
    @Id
    private Long id;
    private Long categoryId;
    private LocalDate startingDate;
    private LocalDate endingDate;
    private float pricePerDay;

    public Price(Long categoryId, LocalDate startingDate, LocalDate endingDate, float pricePerDay) {
        this.categoryId = categoryId;
        this.startingDate = startingDate;
        this.endingDate = endingDate;
        this.pricePerDay = pricePerDay;
    }

    public Price() {

    }

}
