package com.example.website_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the /app/resources directory
        registry.addResourceHandler("/api/v1/resources/**")  // Path adjusted to match the gateway
                .addResourceLocations("file:/app/resources/") // Path inside the Docker container
                .setCachePeriod(3600); // Cache resources for 1 hour
    }
}
