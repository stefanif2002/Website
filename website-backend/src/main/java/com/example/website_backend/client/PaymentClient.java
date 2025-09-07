package com.example.website_backend.client;

import com.example.website_backend.dto.crm.CreatePaymentRequestDto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE
)
public interface PaymentClient {
    @PostExchange("/new")
    void createPayment (@RequestBody CreatePaymentRequestDto paymentDto);
}
