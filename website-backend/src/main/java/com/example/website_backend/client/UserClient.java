package com.example.website_backend.client;

import com.example.website_backend.dto.crm.UserForWebsiteDto;
import com.example.website_backend.dto.website.UserDto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.List;

@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface UserClient {
    @PostExchange("/create")
    UserDto createUser(@RequestBody UserDto userDto);
}
