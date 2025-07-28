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
import org.springframework.web.service.annotation.PostExchange;

import java.util.List;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface BookingClient {
    @PostExchange("/create")
    Long createBooking (@RequestBody BookingCreateDtoCrm bookingCreateDto);
}
