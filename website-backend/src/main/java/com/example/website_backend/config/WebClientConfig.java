package com.example.website_backend.config;

import com.example.website_backend.client.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient availabilityWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/availability")
                .build();
    }

    @Bean
    public AvailabilityClient availabilityClient () {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(availabilityWebClient()))
                .build();
        return factory.createClient(AvailabilityClient.class);
    }

    @Bean
    public WebClient bookingWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/booking")
                .build();
    }

    @Bean
    public BookingClient bookingClient() {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(bookingWebClient()))
                .build();
        return factory.createClient(BookingClient.class);
    }
}
