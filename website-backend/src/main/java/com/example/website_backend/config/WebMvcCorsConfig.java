// src/main/java/.../config/WebMvcCorsConfig.java
package com.example.website_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcCorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/website/**")
                // ✅ list your real front-end origins (scheme+host+port). No "*".
                .allowedOriginPatterns(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "https://4rent.duckdns.org"
                        // add more if you have other preview URLs, e.g. "https://*.yourdomain.com"
                )
                .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Location")   // optional, if you need it
                .allowCredentials(true)
                .maxAge(3600);
    }
}
