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
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
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

        // Start with date filter
        Criteria criteria = Criteria.where("time").gte(start).lte(end);

        if (name != null && !name.isBlank()) {
            criteria = criteria.and("categoryName").regex(".*" + escapeRegex(name) + ".*", "i");
        }
        if (type != null && !type.isBlank()) {
            criteria = criteria.and("type").is(type);
        }
        if (fuel != null && !fuel.isBlank()) {
            criteria = criteria.and("fuel").is(fuel);
        }
        if (automatic != null) {
            criteria = criteria.and("automatic").is(automatic);
        }
        if (seats != null) {
            criteria = criteria.and("numOfSeats").is(seats);
        }

        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("categoryId")
                        .push("$$ROOT").as("entries")
                        .max(
                                ConditionalOperators.when(Criteria.where("numOfAvailableVehicles").lte(0))
                                        .then(1)
                                        .otherwise(0)
                        ).as("hasZero"),
                Aggregation.match(Criteria.where("hasZero").is(0)),
                Aggregation.unwind("entries"),
                Aggregation.replaceRoot("entries"),
                Aggregation.sort(Sort.by(Sort.Direction.ASC, "categoryId", "time"))
        );

        List<Availability> snapshots = mongoTemplate
                .aggregate(agg, "availability", Availability.class)
                .getMappedResults();

        if (snapshots.isEmpty()) {
            return List.of();
        }

        Set<LocalDate> requiredDays = daysBetween(start.toLocalDate(), end.toLocalDate());

        Map<Long, List<Availability>> byCategory = snapshots.stream()
                .collect(Collectors.groupingBy(Availability::getCategoryId));

        List<AvailabilityDto> result = new ArrayList<>();

        for (Map.Entry<Long, List<Availability>> entry : byCategory.entrySet()) {
            List<Availability> catList = entry.getValue();

            Map<LocalDate, List<Availability>> byDay = catList.stream()
                    .collect(Collectors.groupingBy(a -> a.getTime().toLocalDate()));

            if (!requiredDays.stream().allMatch(byDay::containsKey)) {
                continue;
            }

            double totalPrice = 0.0;
            int dayCount = 0;
            boolean anyUnavailable = false;

            for (LocalDate day : requiredDays) {
                List<Availability> dayEntries = byDay.get(day);
                if (dayEntries == null || dayEntries.isEmpty()) {
                    anyUnavailable = true;
                    break;
                }

                double dayPrice = dayEntries.stream()
                        .mapToDouble(Availability::getPricePerDay)
                        .average()
                        .orElse(0.0);

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

            Availability first = catList.get(0);

            result.add(new AvailabilityDto(
                    first.getCategoryId(),
                    first.getCategoryName(),
                    first.getType(),
                    first.getFuel(),
                    first.isAutomatic(),
                    first.getNumOfSeats(),
                    first.getPricePerDay(),
                    first.getDescription(),
                    first.getImageUrl(),
                    first.getColor(),
                    total,
                    averagePerDay
            ));
        }

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
                case "AvailabilityCreated" ->
                        availability.setNumOfAvailableVehicles(availability.getNumOfAvailableVehicles() - 1);
                case "AvailabilityDeleted" ->
                        availability.setNumOfAvailableVehicles(availability.getNumOfAvailableVehicles() + 1);
                default ->
                        log.warn("Unknown event type: {}", updateDto.getEventType());
            }
            mongoTemplate.save(availability);
        }
    }
}
