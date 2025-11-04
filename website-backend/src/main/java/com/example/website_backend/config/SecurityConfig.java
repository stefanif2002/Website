package com.example.website_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Apply CORS from a CorsConfigurationSource bean (or withDefaults())
                .cors(Customizer.withDefaults())

                // Disable CSRF for a stateless JSON API
                .csrf(AbstractHttpConfigurer::disable)

                // allow anonymous access to all availability endpoints
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/website/v1/**").permitAll()
                        // everything else must be authenticated
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}