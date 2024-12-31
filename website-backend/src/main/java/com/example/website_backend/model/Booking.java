package com.example.website_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(name = "crm_booking_id", nullable = false)
    private Long crm_booking_id;
    @Column(name = "category_id", nullable = false)
    private Long category_id;
    @Column(name = "user_id", nullable = false)
    private String user_id;

    @ElementCollection
    @CollectionTable(name = "booking_drivers", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "driver_id")
    private List<String> drivers;

    @Column(name = "start", nullable = false)
    private LocalDateTime start;
    @Column(name = "end", nullable = false)
    private LocalDateTime end;

    @Column(name = "price", nullable = false)
    private float price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status;

    private String startLocation;
    private String endLocation;

    private LocalDateTime created_at;
    private boolean is_advance_paid;

    public Booking() {
    }

    public Booking(Long category_id,
                   String user_id,
                   List<String> drivers,
                   LocalDateTime start,
                   LocalDateTime end,
                   float price,
                   BookingStatus status,
                   String startLocation,
                   String endLocation)
    {
        this.category_id = category_id;
        this.user_id = user_id;
        this.drivers = drivers;
        this.start = start;
        this.end = end;
        this.price = price;
        this.status = status;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
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
