package com.example.website_backend.service.crm;

import com.example.website_backend.client.UserClient;
import com.example.website_backend.dto.crm.UserForWebsiteDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UserClientService {

    @Autowired
    private UserClient userClient;

    @Cacheable("users")
    public List<UserForWebsiteDto> usersForWebsite () {
        return userClient.getAllForWebsite();
    }

    @CacheEvict(value = "users")
    public void removeUsersFromWebsite() {}

}