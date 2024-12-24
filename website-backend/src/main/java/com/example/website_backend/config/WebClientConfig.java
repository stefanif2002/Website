package com.example.website_backend.config;

import com.example.website_backend.client.BookingClient;
import com.example.website_backend.client.CarClient;
import com.example.website_backend.client.CategoryClient;
import com.example.website_backend.client.PriceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.loadbalancer.reactive.LoadBalancedExchangeFilterFunction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfig {

    @Autowired
    private LoadBalancedExchangeFilterFunction filterFunction;

    @Bean
    public WebClient priceWebClient () {
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/v1/price")
                .filter(filterFunction)
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
                .filter(filterFunction)
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
                .filter(filterFunction)
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
                .filter(filterFunction)
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
