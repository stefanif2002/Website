package com.example.website_backend.dto.crm;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreparationListDto {
    private List<PreparationDto> preparation;
}
