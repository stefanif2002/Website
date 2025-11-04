package com.example.website_backend.controller.crm;


import com.example.website_backend.dto.website.UserWebsiteUpdateDto;
import com.example.website_backend.service.crm.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/website/v1/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/alter")
    public ResponseEntity<Void> alterUser(@RequestBody UserWebsiteUpdateDto websiteUpdateDto) {
        log.info("User alteration received: {}", websiteUpdateDto.toString());
        service.alterUser(websiteUpdateDto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("checkUser/{telephone}")
    public ResponseEntity<UserWebsiteUpdateDto> checkUser(@PathVariable String telephone, @RequestParam String cc, @RequestParam String email) {
        return ResponseEntity.ok(service.checkUser(cc, telephone, email));
    }

}
