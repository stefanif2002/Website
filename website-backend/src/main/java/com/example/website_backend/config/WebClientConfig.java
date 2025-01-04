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
    public WebClient priceWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/price")
                .build();
    }

    @Bean
    public PriceClient priceClient () {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(priceWebClient()))
                .build();
        return factory.createClient(PriceClient.class);
    }

    @Bean
    public WebClient categoryWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/category")
                .build();
    }

    @Bean
    public CategoryClient categoryClient() {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(categoryWebClient()))
                .build();
        return factory.createClient(CategoryClient.class);
    }


    @Bean
    public WebClient carWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/car")
                .build();
    }

    @Bean
    public CarClient carClient() {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(carWebClient()))
                .build();
        return factory.createClient(CarClient.class);
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

    @Bean
    public WebClient userWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/user")
                .build();
    }

    @Bean
    public UserClient userClient() {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(userWebClient()))
                .build();
        return factory.createClient(UserClient.class);
    }
}
