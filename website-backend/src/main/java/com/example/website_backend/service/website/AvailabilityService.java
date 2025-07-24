package com.example.website_backend.service.website;

import com.example.website_backend.dto.crm.AvailabilityWebsiteUpdateDto;
import com.example.website_backend.dto.website.AvailabilityDto;
import com.example.website_backend.model.Availability;
import com.example.website_backend.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityService {

    private final MongoTemplate mongoTemplate;

    @Autowired
    private AvailabilityRepository repository;

    public List<AvailabilityDto> searchAvailability(
            String name,
            String type,
            String fuel,
            Boolean automatic,
            Integer seats,
            LocalDateTime start,
            LocalDateTime end
    ) {
        if (start == null || end == null || end.isBefore(start)) {
            throw new IllegalArgumentException("Invalid date range");
        }

        // Build criteria
        List<Criteria> and = new ArrayList<>();
        and.add(Criteria.where("time").gte(start).lte(end));  // inclusive range

        if (name != null && !name.isBlank()) {
            and.add(Criteria.where("categoryName")
                    .regex(".*" + escapeRegex(name) + ".*", "i"));
        }
        if (type != null && !type.isBlank()) {
            and.add(Criteria.where("type").is(type));
        }
        if (fuel != null && !fuel.isBlank()) {
            and.add(Criteria.where("fuel").is(fuel));
        }
        if (automatic != null) {
            and.add(Criteria.where("automatic").is(automatic));
        }
        if (seats != null) {
            and.add(Criteria.where("numOfSeats").is(seats));
        }

        Query query = new Query(new Criteria().andOperator(and.toArray(new Criteria[0])))
                .with(Sort.by(Sort.Direction.ASC, "categoryId", "time"));

        // Optionally project only needed fields
        query.fields()
                .include("categoryId")
                .include("categoryName")
                .include("type")
                .include("fuel")
                .include("automatic")
                .include("numOfSeats")
                .include("pricePerDay")
                .include("description")
                .include("imageUrl")
                .include("color")
                .include("time")
                .include("numOfAvailableVehicles");

        List<Availability> snapshots = mongoTemplate.find(query, Availability.class);

        if (snapshots.isEmpty()) {
            return List.of();
        }

        // Build the set of required days (inclusive)
        Set<LocalDate> requiredDays = daysBetween(start.toLocalDate(), end.toLocalDate());

        // Group by category
        Map<Long, List<Availability>> byCategory = snapshots.stream()
                .collect(Collectors.groupingBy(Availability::getCategoryId));

        List<AvailabilityDto> result = new ArrayList<>();

        for (Map.Entry<Long, List<Availability>> entry : byCategory.entrySet()) {
            List<Availability> catList = entry.getValue();

            // Quick skip if any snapshot has zero or negative availability
            boolean anyUnavailable = catList.stream()
                    .anyMatch(a -> a.getNumOfAvailableVehicles() <= 0);
            if (anyUnavailable) {
                continue;
            }

            // Group the category’s snapshots by day
            Map<LocalDate, List<Availability>> byDay = catList.stream()
                    .collect(Collectors.groupingBy(a -> a.getTime().toLocalDate()));

            // Enforce presence of every requested day (remove if partial is acceptable)
            if (!requiredDays.stream().allMatch(byDay::containsKey)) {
                continue;
            }

            double totalPrice = 0.0;
            int dayCount = 0;

            // Compute per-day price (assuming all entries same price; we can just take first)
            for (LocalDate day : requiredDays) {
                List<Availability> dayEntries = byDay.get(day);
                if (dayEntries == null || dayEntries.isEmpty()) {
                    // Missing day (should not happen after allMatch check), skip category
                    anyUnavailable = true;
                    break;
                }

                // If truly all have the same price you could just use dayEntries.get(0).getPricePerDay()
                double dayPrice = dayEntries.stream()
                        .mapToDouble(Availability::getPricePerDay)
                        .average()
                        .orElse(0.0);

                // Also ensure availability that day > 0 (use max or min; here max)
                int maxAvailThisDay = dayEntries.stream()
                        .mapToInt(Availability::getNumOfAvailableVehicles)
                        .max()
                        .orElse(0);

                if (maxAvailThisDay <= 0) {
                    anyUnavailable = true;
                    break;
                }

                totalPrice += dayPrice;
                dayCount++;
            }

            if (anyUnavailable || dayCount == 0) {
                continue;
            }

            float total = (float) totalPrice;
            float averagePerDay = (float) (totalPrice / dayCount);

            // Use a representative snapshot (first sorted by time)
            Availability first = catList.get(0);

            result.add(new AvailabilityDto(
                    first.getCategoryId(),
                    first.getCategoryName(),
                    first.getType(),
                    first.getFuel(),
                    first.isAutomatic(),
                    first.getNumOfSeats(),
                    first.getPricePerDay(),   // Keep raw daily price (could choose averagePerDay instead)
                    first.getDescription(),
                    first.getImageUrl(),
                    first.getColor(),
                    total,
                    averagePerDay
            ));
        }

        // Sort if desired (e.g., by total price ascending)
        result.sort(Comparator.comparing(AvailabilityDto::getTotalPrice));

        return result;
    }

    private String escapeRegex(String s) {
        return s.replaceAll("([\\\\.*+?\\[^\\]$(){}=!<>|:-])", "\\\\$1");
    }

    private Set<LocalDate> daysBetween(LocalDate start, LocalDate end) {
        Set<LocalDate> days = new LinkedHashSet<>();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            days.add(d);
        }
        return days;
    }

    public void alterAvailability(List<AvailabilityWebsiteUpdateDto> dto) {

        for (AvailabilityWebsiteUpdateDto updateDto : dto) {
            String id = Availability.buildId(updateDto.getCategoryId(), updateDto.getTime());
            Availability availability = repository.findById(id).orElseThrow();
            switch (updateDto.getEventType()) {
                case "AvailabilityCreated" -> availability.setNumOfAvailableVehicles(availability.getNumOfAvailableVehicles() - 1);
                case "AvailabilityDeleted" -> availability.setNumOfAvailableVehicles(availability.getNumOfAvailableVehicles() + 1);
                default ->
                        log.warn("Unknown event type: {}", updateDto.getEventType());
            }
            mongoTemplate.save(availability);
        }

    }

}
