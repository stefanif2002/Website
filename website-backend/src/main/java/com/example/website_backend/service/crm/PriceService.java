package com.example.website_backend.service.crm;

import com.example.website_backend.dto.crm.DiscountCouponDto;
import com.example.website_backend.dto.crm.PriceDto;
import com.example.website_backend.model.DiscountCoupon;
import com.example.website_backend.model.Price;
import com.example.website_backend.repository.DiscountCouponRepository;
import com.example.website_backend.repository.PriceRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class PriceService {

    @Autowired
    private PriceRepository repository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    DiscountCouponRepository discountCouponRepository;

    // Create a new price
    public void createPrice(PriceDto priceDto) {
        try {
            Price price = modelMapper.map(priceDto, Price.class);
            repository.save(price);
        } catch (Exception e) {
            log.warn("Category already exists");
            log.error("Error: ", e);
        }
    }

    // Update an existing price
    public void updatePrice(Long id, PriceDto priceDto) {
        Optional<Price> existingPrice = repository.findById(id);
        if (existingPrice.isEmpty()) {
            throw new RuntimeException("Price with ID " + id + " not found.");
        }

        Price price = existingPrice.get();
        price.setCategoryId(priceDto.getCategoryId());
        price.setStartingDate(priceDto.getStartingDate());
        price.setEndingDate(priceDto.getEndingDate());
        price.setPricePerDay(priceDto.getPricePerDay());

        repository.save(price);
    }

    // Delete a price
    public void deletePrice(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Price with ID " + id + " not found.");
        }
        repository.deleteById(id);
    }

    public void alterDiscountCoupons(DiscountCouponDto discountCouponDto) {
        String eventType = discountCouponDto.getEventType();
        String couponId = discountCouponDto.getId();
        switch (eventType) {
            case "DiscountCouponCreatedWebsite" -> {
                // Map and save new coupon
                DiscountCoupon coupon = modelMapper.map(discountCouponDto, DiscountCoupon.class);
                discountCouponRepository.save(coupon);
                log.info("Created DiscountCoupon ID {} in CRM", couponId);
            }
            case "DiscountCouponUpdatedWebsite" -> {
                // Update existing coupon
                Optional<DiscountCoupon> existing = discountCouponRepository.findById(couponId);
                if (existing.isEmpty()) {
                    log.error("DiscountCoupon ID {} not found in CRM for update.", couponId);
                } else {
                    DiscountCoupon couponToUpdate = existing.get();
                    modelMapper.map(discountCouponDto, couponToUpdate);
                    discountCouponRepository.save(couponToUpdate);
                    log.info("Updated DiscountCoupon ID {} in CRM", couponId);
                }
            }
            case "DiscountCouponDeletedWebsite" -> {
                // Delete coupon
                if (!discountCouponRepository.existsById(couponId)) {
                    log.error("DiscountCoupon ID {} not found in CRM for deletion.", couponId);
                } else {
                    discountCouponRepository.deleteById(couponId);
                    log.info("Deleted DiscountCoupon ID {} from CRM", couponId);
                }
            }
            default ->
                log.error("Unknown DiscountCoupon event type '{}' for coupon ID {}", eventType, couponId);

        }
    }

}
