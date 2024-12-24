package com.example.website_backend.client;

import com.example.website_backend.dto.CarAvailabilityDto;
import org.springframework.http.MediaType;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(
        url = "/internal",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface CarClient {
    @GetExchange("/getNumberOfCarsPerCategory")
    CarAvailabilityDto getNumberOfCarsPerCategory();
}