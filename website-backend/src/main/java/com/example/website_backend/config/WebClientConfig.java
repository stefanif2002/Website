package com.example.website_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import com.example.website_backend.client.AvailabilityClient;
import com.example.website_backend.client.BookingClient;
import com.example.website_backend.client.UserClient;

@Configuration
public class WebClientConfig {

    //
    // 1) Fetch & cache client-credentials tokens
    //
    @Bean
    @Primary
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrations,
            OAuth2AuthorizedClientService clientService
    ) {
        // only client-credentials grant
        OAuth2AuthorizedClientProvider provider = OAuth2AuthorizedClientProviderBuilder.builder()
                .clientCredentials()
                .build();

        // this class knows how to use the clientService to save tokens
        AuthorizedClientServiceOAuth2AuthorizedClientManager manager =
                new AuthorizedClientServiceOAuth2AuthorizedClientManager(
                        clientRegistrations, clientService
                );
        manager.setAuthorizedClientProvider(provider);
        return manager;
    }

    //
    // 2) Helper to turn the manager into a WebClient filter
    //
    private ServletOAuth2AuthorizedClientExchangeFilterFunction oauth2(
            OAuth2AuthorizedClientManager manager
    ) {
        ServletOAuth2AuthorizedClientExchangeFilterFunction oauth2 =
                new ServletOAuth2AuthorizedClientExchangeFilterFunction(manager);
        // match the registration in application.yml: spring.security.oauth2.client.registration.crm-client
        oauth2.setDefaultClientRegistrationId("crm-client");
        return oauth2;
    }

    //
    // 3) One WebClient per downstream CRM service
    //
    @Bean
    public WebClient availabilityWebClient(OAuth2AuthorizedClientManager manager) {
        return WebClient.builder()
                .baseUrl("http://localhost:8081/api/v1/availability")
                .filter(oauth2(manager))
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_NDJSON_VALUE)
                .build();
    }


    @Bean
    public WebClient bookingWebClient(OAuth2AuthorizedClientManager manager) {
        return WebClient.builder()
                .baseUrl("http://localhost:8081/api/v1/booking")
                .filter(oauth2(manager))
                .build();
    }

    @Bean
    public WebClient userWebClient(OAuth2AuthorizedClientManager manager) {
        return WebClient.builder()
                .baseUrl("http://localhost:8081/api/v1/user")
                .filter(oauth2(manager))
                .build();
    }

    //
    // 4) Typed HTTP-service proxies
    //
    @Bean
    public AvailabilityClient availabilityClient(WebClient availabilityWebClient) {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(availabilityWebClient))
                .build();
        return factory.createClient(AvailabilityClient.class);
    }

    @Bean
    public BookingClient bookingClient(WebClient bookingWebClient) {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(bookingWebClient))
                .build();
        return factory.createClient(BookingClient.class);
    }

    @Bean
    public UserClient userClient(WebClient userWebClient) {
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(userWebClient))
                .build();
        return factory.createClient(UserClient.class);
    }
}
