package com.example.website_backend.client;

import com.example.website_backend.dto.website.UserDto;
import com.example.website_backend.dto.website.UserWebsiteUpdateDto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;


@HttpExchange(
        url = "",
        accept = MediaType.APPLICATION_JSON_VALUE)
public interface UserClient {
    @PostExchange("/createWebsite")
    void createUser(@RequestBody UserDto userDto);
    @GetExchange("/getByPhone")
    UserWebsiteUpdateDto getForWebsite(@RequestParam String telephone);
}
