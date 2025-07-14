package com.example.website_backend.service.crm;

import com.example.website_backend.dto.crm.PreparationDto;
import com.example.website_backend.dto.crm.PreparationListDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PreparationService {

    @Autowired
    private PreparationRepository repository;

    public void updateValue(PreparationListDto preparationDto) {
        for (PreparationDto preparation: preparationDto.getPreparation()) {
            Preparation temp = repository.findById(preparation.getIts_name())
                    .orElseGet(() -> repository.save(new Preparation(preparation.getIts_name(), 0)));
            temp.setIts_value(preparation.getIts_value());
            repository.save(temp);
        }
    }

}
