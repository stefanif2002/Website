package com.example.website_backend.client;

import com.example.website_backend.dto.crm.BookingCreateDtoCrm;
import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.crm.PreparationDto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Flux;

import java.util.List;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE
)
public interface BookingClient {
    @GetExchange(
            value  = "/website/getAll",
            accept = MediaType.APPLICATION_NDJSON_VALUE
    )
    Flux<BookingDto> getAll();

    @PostExchange("/website/receiveAll")
    void receiveAll(@RequestBody List<BookingDto> data);

    @GetExchange("/preparation/getAll")
    List<PreparationDto> getAllPreparations();

    @PostExchange("/create")
    Long createBooking (@RequestBody BookingCreateDtoCrm bookingCreateDto);
}
