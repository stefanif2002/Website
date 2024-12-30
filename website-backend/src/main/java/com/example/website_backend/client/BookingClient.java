package com.example.website_backend.client;

import com.example.website_backend.dto.BookingDto;
import com.example.website_backend.dto.PreparationDto;
import org.springframework.http.MediaType;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface BookingClient {
    @GetExchange("/internal/getAll")
    List<BookingDto> getAll();

    @GetExchange("/preparation/getAll")
    List<PreparationDto> getAllPreparations();
}
