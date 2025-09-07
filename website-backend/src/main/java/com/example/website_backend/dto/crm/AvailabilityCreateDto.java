package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityCreateDto {
    private Long id;
    private Long category_id;
    private LocalDateTime start;
    private LocalDateTime end;
    private String eventType;

    @Override
    public String toString() {
        return "AvailabilityCreateDto{" +
                "id=" + id +
                ", category_id=" + category_id +
                ", start=" + start +
                ", end=" + end +
                ", eventType='" + eventType + '\'' +
                '}';
    }

}
