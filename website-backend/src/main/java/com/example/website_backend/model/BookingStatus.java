package com.example.website_backend.model;

public enum BookingStatus {
    ACCEPTED, // ONLY IF USER IS NOT TRUSTED
    VERIFIED,
    STARTED,
    FINISHED
}
