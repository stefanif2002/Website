package com.example.website_backend.controller.payment;

import com.example.website_backend.dto.crm.CreatePaymentRequestDto;
import com.example.website_backend.dto.website.CheckoutSessionRequestDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.repository.OutboxEventRepository;
import com.example.website_backend.service.helper.OutboxEventService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/website/v1/payment")
public class PaymentController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private OutboxEventService outboxEventService;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @PostMapping("/stripe/create-checkout-session/{id}")
    public ResponseEntity<String> createCheckoutSession(
            @PathVariable Long id, @RequestBody CheckoutSessionRequestDto req
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

        // Create a new payment record (CreatePaymentRequestDto) in your system here, associating it with 'id' and 'session.getId()' and push it to outbox
        CreatePaymentRequestDto paymentRequest = new CreatePaymentRequestDto();
        paymentRequest.setBooking_id(id);
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.badRequest().body("Invalid booking ID");
        } else
            paymentRequest.setUser_id(booking.getUser_id());
        paymentRequest.setAmount((float) value);
        paymentRequest.setCurrency(currency);
        paymentRequest.setMethod("stripe");

        outboxEventRepository.deleteAll(outboxEventRepository.findAllByAggregateIdToDelete(id));

        outboxEventService.push(paymentRequest, id, "PaymentCreated");

        return ResponseEntity.ok(session.getId());
    }

    @GetMapping("/stripe/success")
    public String getSuccess() { return "payment successful"; }

    @GetMapping("/stripe/cancel")
    public String cancel() { return "payment canceled"; }
}
