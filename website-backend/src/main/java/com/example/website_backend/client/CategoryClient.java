package com.example.website_backend.client;

import com.example.website_backend.dto.crm.CategoryDto;
import org.springframework.http.MediaType;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange(
        url = "/internal",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface CategoryClient {
    @GetExchange("/getAll")
    List<CategoryDto> getAllCategories();
}