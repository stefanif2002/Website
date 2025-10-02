package com.example.website_backend.service.sync;

import com.example.website_backend.client.PriceClient;
import com.example.website_backend.dto.crm.DiscountCouponDto;
import com.example.website_backend.model.DiscountCoupon;
import com.example.website_backend.repository.DiscountCouponRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Synchronizes discount coupons from the pricing service into the local CRM database on startup.
 */
@Service
@Slf4j
public class DiscountCouponSyncService {

    @Autowired
    private PriceClient priceClient;

    @Autowired
    private DiscountCouponRepository repository;

    @Autowired
    private ModelMapper mapper;

    @EventListener(ContextRefreshedEvent.class)
    @Async
    public void syncCoupons() throws InterruptedException {
        while (true) {
            try {
                List<DiscountCouponDto> coupons = priceClient.getAllCoupons();
                if (coupons != null) {
                    List<DiscountCoupon> entities = new ArrayList<>();
                    repository.deleteAll();
                    for (DiscountCouponDto dto : coupons) {
                        entities.add(mapper.map(dto, DiscountCoupon.class));
                    }
                    repository.saveAll(entities);
                    log.info("Successfully synchronized discount coupons.");
                    break;
                }
            } catch (Exception e) {
                log.error("Error during discount coupon synchronization. Retrying in 1 minute...", e);
                TimeUnit.MINUTES.sleep(1);
            }
        }
    }
}
