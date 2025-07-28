package com.example.website_backend.service.crm;

import com.example.website_backend.dto.crm.PriceDto;
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
}
