package com.example.website_backend.service.website;

import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.dto.website.AvailabilityDto;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.service.crm.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
public class AvailabilityService {

    @Autowired
    private BookingRepository repository;

    @Autowired
    private CategoryService categoryService;

    public List<AvailabilityDto> searchAvailability(String name, String type, String fuel, Boolean automatic, Integer seats, LocalDateTime start, LocalDateTime end) {

        if (start == null || end == null)
            throw new RuntimeException();

        List<AvailabilityDto> finals = new ArrayList<>();

        List<Object[]> results = repository.CheckMultipleAvailabilityInTimeFrame3(name, type, fuel, automatic, seats, start, end);

        HashMap<Long,CategoryDto> categoryMap = categoryService.getMap();

        for (Object[] result : results) {

            if (((Number) result[1]).intValue() != 0) {
                Long category_id = ((Number) result[0]).longValue();

                float average = ((Number) result[3]).floatValue();
                float total = ((Number) result[2]).floatValue();

                finals.add(new AvailabilityDto(categoryMap.get(category_id), total, average));
            }

        }

        return finals;

    }

}
