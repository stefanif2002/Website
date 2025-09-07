package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequestDto {
    private Long booking_id; // Just an external reference ID
    private String user_id;
    private float amount;
    private String currency;
    private String method;
    private Map<String, Object> details; // Dynamic object
}
