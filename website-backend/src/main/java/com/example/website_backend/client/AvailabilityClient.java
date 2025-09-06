package com.example.website_backend.client;

import com.example.website_backend.dto.crm.InfoDto;
import com.example.website_backend.dto.crm.PreparationDto;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange(
        url    = ""                              // method‐level paths are relative
)
public interface AvailabilityClient {

    @GetExchange("/getAllCategories")
    InfoDto getAll();

    @GetExchange("/preparation/getAll")
    List<PreparationDto> getAllPreparations();

}