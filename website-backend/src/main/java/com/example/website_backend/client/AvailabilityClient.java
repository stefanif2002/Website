package com.example.website_backend.client;

import com.example.website_backend.dto.crm.AvailabilityWebsiteDto;
import com.example.website_backend.dto.crm.PreparationDto;
import org.springframework.http.MediaType;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface AvailabilityClient {

    @GetExchange("/getAll")
    List<AvailabilityWebsiteDto> getAll();

}
