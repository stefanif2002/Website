package com.example.website_backend.service.sync;

import com.example.website_backend.client.AvailabilityClient;
import com.example.website_backend.dto.crm.AvailabilityWebsiteDto;
import com.example.website_backend.model.Availability;
import com.example.website_backend.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AvailabilitySyncService {

    private final AvailabilityClient availabilityClient;
    private final AvailabilityRepository repository;
    private final MongoTemplate mongoTemplate;

    /**
     * Whether to delete documents that disappeared from the source.
     * Turn off if you want to keep historical snapshots.
     */
    private static final boolean DELETE_STALE = true;

    /**
     * Startup initial sync – runs once (async) after context refresh.
     */
    @EventListener(ContextRefreshedEvent.class)
    @Async
    public void initialSyncOnStartup() {
        // Random small delay to reduce thundering herd if multiple services start simultaneously.
        try {
            Thread.sleep(ThreadLocalRandom.current().nextLong(5_000, 15_000));
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
        log.info("[AvailabilitySync] Performing initial sync after startup delay...");
        performSyncWithRetry();
    }

    /**
     * Periodic sync every 10 minutes (adjust cron or fixedDelay as needed).
     * - fixedDelay ⇒ wait given ms after previous completion
     * - initialDelay ensures first scheduled run does not clash with startup processes.
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Europe/Athens")
    public void scheduledSync() {
        performSyncWithRetry();
    }

    private void performSyncWithRetry() {
        int maxAttempts = 5;
        long baseBackoffMs = 5_000;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                performSync();
                return; // success
            } catch (Exception ex) {
                long backoff = (long) (baseBackoffMs * Math.pow(2, attempt - 1));
                log.error("[AvailabilitySync] Attempt {}/{} failed: {}. Retrying in {} ms",
                        attempt, maxAttempts, ex.getMessage(), backoff, ex);
                try {
                    Thread.sleep(backoff);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
        log.error("[AvailabilitySync] All {} attempts failed. Will try again on next schedule.", maxAttempts);
    }

    /**
     * Core sync logic:
     *  - Fetch data from remote
     *  - Bulk upsert
     *  - Optionally delete stale
     */
    private void performSync() {
        Instant start = Instant.now();
        List<AvailabilityWebsiteDto> remoteList = availabilityClient.getAll();

        if (remoteList == null) {
            log.warn("[AvailabilitySync] Remote list is null. Skipping this cycle.");
            return;
        }
        if (remoteList.isEmpty()) {
            log.warn("[AvailabilitySync] Remote list is empty. (DELETE_STALE = {})", DELETE_STALE);
            if (DELETE_STALE) {
                long deleted = repository.count();
                repository.deleteAll();
                log.info("[AvailabilitySync] Deleted all {} existing docs because remote was empty.", deleted);
            }
            return;
        }

        // Prepare bulk upsert
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Availability.class);

        Set<String> incomingIds = new HashSet<>(remoteList.size());

        remoteList.forEach(dto -> {
            String id = Availability.buildId(dto.getCategoryId(), dto.getTime());
            incomingIds.add(id);

            Update update = new Update()
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
                    .set("numOfAvailableVehicles", dto.getNumOfAvailableVehicles());

            // Match by _id
            Query q = Query.query(Criteria.where("_id").is(id));
            bulkOps.upsert(q, update);
        });

        // Execute the bulk upserts
        var result = bulkOps.execute();
        long upserts = Optional.of(result.getUpserts()).map(List::size).orElse(0);
        long modified = result.getModifiedCount();

        long deletedCount = 0;
        if (DELETE_STALE) {
            // Find stale ids (present in DB but not in incoming)
            List<String> staleIds = mongoTemplate.query(Availability.class)
                    .distinct("_id")
                    .as(String.class)
                    .all()
                    .stream()
                    .filter(dbId -> !incomingIds.contains(dbId))
                    .collect(Collectors.toList());

            if (!staleIds.isEmpty()) {
                Query deleteQuery = Query.query(Criteria.where("_id").in(staleIds));
                deletedCount = mongoTemplate.remove(deleteQuery, Availability.class).getDeletedCount();
            }
        }

        Duration took = Duration.between(start, Instant.now());
        log.info("[AvailabilitySync] Remote={} Upserts={} Modified={} Deleted={} Duration={} ms",
                remoteList.size(), upserts, modified, deletedCount, took.toMillis());
    }
}
