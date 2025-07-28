package com.example.website_backend.client;

import org.springframework.http.MediaType;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface AvailabilityClient {
}
