// BookingCreateDto.java
package com.example.website_backend.dto.website;

import com.example.website_backend.dto.crm.DriverDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingCreateDto {
    // maps the frontend "telephone" → userId
    @JsonProperty("telephone")
    private String userId;

    @JsonProperty("category_id")
    private Long categoryId;

    // array of objects { telephone, name }
    private List<DriverDto> drivers;

    private LocalDateTime start;
    private LocalDateTime end;
    private Float price;

    private String startLocation;
    private String endLocation;

    private String flight;
    private String notes;

    @JsonProperty("number_of_people")
    private Integer numberOfPeople;

    private List<ChecklistItemDto> checklist;
}
