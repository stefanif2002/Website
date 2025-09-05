package com.example.website_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistEntry implements Serializable {
    @Enumerated(EnumType.STRING)
    @Column(name = "item", nullable = false)
    private ChecklistItem item;

    @Column(name = "quantity", nullable = false)
    private int quantity;
}
