package com.example.website_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "outbox_event", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"aggregateType", "aggregateId", "createdAt"})
})
public class OutboxEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Describes the entity type (e.g., "Category")
    private String aggregateType;

    // The id of the aggregate (e.g., category id)
    private Long aggregateId;

    // The id of the aggregate (e.g., category id)
    private String aggregateStringId;

    // The type of event (e.g., "CategoryCreated")
    private String eventType;

    // The creator of the event (e.g., "Admin")
    private String eventCreator;

    // The serialized event payload (JSON, for example)
    @Column(columnDefinition = "TEXT")
    private String payload;

    // Timestamp of event creation
    private LocalDateTime createdAt;

    // Flag to mark if the event has been processed/published
    private boolean processed = false;

    private boolean readyToProcess = false;

    // Getters and setters...
}
