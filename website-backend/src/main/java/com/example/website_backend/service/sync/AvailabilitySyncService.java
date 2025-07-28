package com.example.website_backend.service.sync;

import com.example.website_backend.client.AvailabilityClient;
import com.example.website_backend.model.Availability;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
@RequiredArgsConstructor
public class AvailabilitySyncService {

    private final AvailabilityClient availabilityClient;
    private final MongoTemplate         mongoTemplate;

    /** delete docs missing from source? */
    private static final boolean DELETE_STALE = true;

    /** tweak this to whatever your memory/throughput sweet spot is */
    private static final int BATCH_SIZE = 10_000;

    @EventListener(ContextRefreshedEvent.class)
    @Async
    public void initialSyncOnStartup() throws InterruptedException {
        Thread.sleep(ThreadLocalRandom.current().nextLong(5_000, 15_000));
        log.info("[AvailabilitySync] initial sync...");
        performSyncWithRetry();
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "Europe/Athens")
    public void scheduledSync() {
        performSyncWithRetry();
    }

    private void performSyncWithRetry() {
        int    maxAttempts  = 5;
        long   baseBackoff  = 5_000;
        for (int i = 1; i <= maxAttempts; i++) {
            try {
                performSync();
                return;
            } catch (Exception e) {
                long backoff = baseBackoff * (1L << (i - 1));
                log.error("[AvailabilitySync] attempt {}/{} failed: {}. retrying in {}ms",
                        i, maxAttempts, e.getMessage(), backoff);
                try { Thread.sleep(backoff); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); return; }
            }
        }
        log.error("[AvailabilitySync] all {} attempts failed.", maxAttempts);
    }

    private void performSync() {
        Instant start      = Instant.now();
        long    syncToken  = System.currentTimeMillis();
        AtomicLong upserts = new AtomicLong();
        AtomicLong modified = new AtomicLong();

        availabilityClient.getAll()
                .buffer(BATCH_SIZE)
                .doOnNext(batch -> {
                    var ops = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Availability.class);
                    for (var dto : batch) {
                        String id = Availability.buildId(dto.getCategoryId(), dto.getTime());
                        Update upd = new Update()
                                .set("time", dto.getTime())
                                .set("categoryId", dto.getCategoryId())
                                .set("categoryName", dto.getCategoryName())
                                .set("type", dto.getType())
                                .set("fuel", dto.getFuel())
                                .set("automatic", dto.isAutomatic())
                                .set("numOfSeats", dto.getNumOfSeats())
                                .set("pricePerDay", dto.getPricePerDay())
                                .set("description", dto.getDescription())
                                .set("imageUrl", dto.getImageUrl())
                                .set("color", dto.getColor())
                                .set("numOfAvailableVehicles", dto.getNumOfAvailableVehicles())
                                .set("lastSync", syncToken);
                        ops.upsert(Query.query(Criteria.where("_id").is(id)), upd);
                    }
                    var res = ops.execute();
                    upserts.addAndGet(res.getUpserts().size());
                    modified.addAndGet(res.getModifiedCount());
                })
                .blockLast(Duration.ofMinutes(10));

        long deleted = 0;
        if (DELETE_STALE) {
            deleted = mongoTemplate.remove(
                    Query.query(Criteria.where("lastSync").ne(syncToken)),
                    Availability.class
            ).getDeletedCount();
        }

        Duration took = Duration.between(start, Instant.now());
        log.info("[AvailabilitySync] total={}, upserts={}, modified={}, deleted={}, took={}ms",
                upserts.get() + modified.get(), upserts.get(), modified.get(), deleted, took.toMillis());
    }
}
