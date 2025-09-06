package com.example.website_backend.model;

import com.example.website_backend.dto.website.ChecklistItemDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Setter
@Getter
@Table(name = "booking", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"crm_booking_id"})
})
public class Booking {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(name = "crm_booking_id")
    private Long crm_booking_id;
    @Column(name = "category_id", nullable = false)
    private Long category_id;
    @Column(name = "user_id")
    private String user_id;

    @Column(name = "start", nullable = false)
    private LocalDateTime start;
    @Column(name = "end", nullable = false)
    private LocalDateTime end;

    @Column(name = "price")
    private float price;

    private String startLocation;
    private String endLocation;

    private LocalDateTime created_at;
    private boolean is_advance_paid;


    private String flight;
    private String notes;

    @JsonProperty("number_of_people")
    private Integer numberOfPeople;


    @ElementCollection
    @CollectionTable(
            name = "booking_checklist",
            joinColumns = @JoinColumn(name = "booking_id")
    )
    private Set<ChecklistEntry> checklist = new HashSet<>();
    public Booking() {
    }

    public Booking(Long category_id,
                   String user_id,
                   LocalDateTime start,
                   LocalDateTime end,
                   float price,
                   String startLocation,
                   String endLocation,
                   int numberOfPeople,
                   String flight,
                   String notes)
    {
        this.category_id = category_id;
        this.user_id = user_id;
        this.start = start;
        this.end = end;
        this.price = price;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.numberOfPeople = numberOfPeople;
        this.flight = flight;
        this.notes = notes;
        this.created_at = LocalDateTime.now();
        this.is_advance_paid = false;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", start=" + start +
                ", end=" + end +
                '}';
    }
}
