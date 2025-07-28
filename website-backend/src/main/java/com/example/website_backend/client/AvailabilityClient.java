package com.example.website_backend.client;

import com.example.website_backend.dto.crm.AvailabilityWebsiteDto;
import org.springframework.http.MediaType;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import reactor.core.publisher.Flux;

@HttpExchange(
        url    = "",                                // method‐level paths are relative
        accept = MediaType.APPLICATION_NDJSON_VALUE // only NDJSON
)
public interface AvailabilityClient {

    @GetExchange("/getAll")
    Flux<AvailabilityWebsiteDto> getAll();

}
