package com.example.website_backend.dto.website;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSessionRequestDto {
    private Double amount;                 // e.g. 49.99
    private String currency = "EUR";       // default if omitted
    private String successUrl;             // absolute FE URL
    private String cancelUrl;              // absolute FE URL
    private Map<String, Object> metadata;
}
