package com.example.website_backend.client;

import com.example.website_backend.dto.crm.BookingCreateDtoCrm;
import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.crm.PreparationDto;
import com.example.website_backend.dto.website.BookingCreateDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface BookingClient {
    @GetExchange("/internal/getAll")
    List<BookingDto> getAll();

    @GetExchange("/internal/receiveAll")
    void receiveAll(@RequestBody List<BookingDto> data);

    @GetExchange("/preparation/getAll")
    List<PreparationDto> getAllPreparations();

    @PostMapping("/create")
    BookingDto createBooking (@RequestBody BookingCreateDtoCrm bookingCreateDto);
}
