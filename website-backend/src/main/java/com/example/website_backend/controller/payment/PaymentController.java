package com.example.website_backend.controller.payment;

import com.example.website_backend.dto.website.CheckoutSessionRequestDto;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @PostMapping("/stripe/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession(
            @RequestBody CheckoutSessionRequestDto req
    ) throws StripeException {

        double value = (req.getAmount() != null ? req.getAmount() : 0.00);
        long amountInCents = Math.round(value * 100);

        String currency = Optional.ofNullable(req.getCurrency())
                .orElse("EUR")
                .toLowerCase(Locale.ROOT);

        String successUrl = Optional.ofNullable(req.getSuccessUrl())
                .filter(s -> !s.isBlank())
                .orElse("https://your-frontend.example.com/book/payment/success");

        String cancelUrl = Optional.ofNullable(req.getCancelUrl())
                .filter(s -> !s.isBlank())
                .orElse("https://your-frontend.example.com/book/payment/retry");

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(currency)
                        .setUnitAmount(amountInCents)
                        .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Car Rental Booking")
                                        .build()
                        )
                        .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setPriceData(priceData)
                        .setQuantity(1L)
                        .build();

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(lineItem);

        // Convert metadata values to String (Stripe requires String map)
        Map<String, Object> mdObj = req.getMetadata();
        if (mdObj != null && !mdObj.isEmpty()) {
            Map<String, String> md = new HashMap<>();
            mdObj.forEach((k, v) -> md.put(k, v == null ? "" : String.valueOf(v)));
            builder.putAllMetadata(md);
        }

        Session session = Session.create(builder.build());
        return ResponseEntity.ok(session.getId());
    }

    @GetMapping("/stripe/success")
    public String getSuccess() { return "payment successful"; }

    @GetMapping("/stripe/cancel")
    public String cancel() { return "payment canceled"; }
}
