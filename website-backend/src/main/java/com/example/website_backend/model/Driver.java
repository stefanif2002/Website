package com.example.website_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

/**
 * Driver entity using a composite primary key of telephone + bookingId.
 */
@Entity
@Table(name = "driver")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @EmbeddedId
    private DriverId id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    /**
     * Composite key class for Driver: telephone + bookingId
     */
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverId implements Serializable {
        @Column(name = "telephone", nullable = false)
        private String telephone;

        @Column(name = "booking_id", nullable = false)
        private Long bookingId;
    }
}
