package com.example.website_backend.service.crm;

import com.example.website_backend.client.UserClient;
import com.example.website_backend.dto.website.UserDto;
import com.example.website_backend.dto.website.UserWebsiteUpdateDto;
import com.example.website_backend.model.User;
import com.example.website_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Handles CRM-driven user summary events for the website.
 * Stores only phone, email, and profile-complete flag.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final UserClient userClient;

    /**
     * Dispatches incoming update events for user data on the website side.
     */
    @Transactional
    public void alterUser(UserWebsiteUpdateDto dto) {
        String event = dto.getEventType();
        switch (event) {
            case "UserAddedWebsite"   -> createUser(dto);
            case "UserUpdatedWebsite" -> updateUser(dto);
            case "UserDeletedWebsite" -> deleteUser(dto.getTelephone());
            default -> log.warn("Unknown user event type: {}", event);
        }
    }

    @Transactional
    protected void createUser(UserWebsiteUpdateDto dto) {
        // Map only phone, email, and presence flags into the User entity
        User user = new User();
        modelMapper.map(dto, user);
        userRepository.save(user);
        log.info("Created user {} from CRM.", user.getTelephone());
    }

    public void createUserInternal(UserDto dto) {
        User user = userRepository.findById(dto.getTelephone()).orElse(null);
        if (user != null) {
            if (dto.getEmail() != null)                user.setEmail(dto.getEmail());
            if (dto.getName() != null)                 user.setName(dto.getName());
            if (dto.getLast_name() != null)            user.setLast_name(dto.getLast_name());
            if (dto.getAddress() != null)              user.setAddress(notBlank(dto.getAddress()));
            if (dto.getDateOfBirth() != null)          user.setDateOfBirth(true);
            if (dto.getPostal_code() != null)          user.setPostal_code(notBlank(dto.getPostal_code()));
            if (dto.getCity() != null)                 user.setCity(notBlank(dto.getCity()));
            if (dto.getCountry() != null)              user.setCountry(notBlank(dto.getCountry()));
            if (dto.getVat_number() != null)           user.setVat_number(notBlank(dto.getVat_number()));
            if (dto.getDriver_license() != null)       user.setDriver_license(notBlank(dto.getDriver_license()));
            if (dto.getDriver_license_country() != null) user.setDriver_license_country(notBlank(dto.getDriver_license_country()));
            if (dto.getPassport() != null)             user.setPassport(notBlank(dto.getPassport()));
            if (dto.getPassport_country() != null)     user.setPassport_country(notBlank(dto.getPassport_country()));
            // company is primitive, so we trust the DTO’s boolean
            user.setCompany(dto.isCompany());
            if (dto.getCompany_name() != null)         user.setCompany_name(notBlank(dto.getCompany_name()));
            userRepository.save(user);
            log.warn("User {} already exists, skipping creation.", dto.getTelephone());
            return;
        } else
            user = new User();
        // Map only phone, email, and presence flags into the User entity

        user.setTelephone(dto.getTelephone());
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setLast_name(dto.getLast_name());
        user.setAddress(notBlank(dto.getAddress()));
        user.setDateOfBirth(dto.getDateOfBirth() != null);
        user.setPostal_code(notBlank(dto.getPostal_code()));
        user.setCity(notBlank(dto.getCity()));
        user.setCountry(notBlank(dto.getCountry()));
        user.setVat_number(notBlank(dto.getVat_number()));
        user.setDriver_license(notBlank(dto.getDriver_license()));
        user.setPassport(notBlank(dto.getPassport()));
        user.setPassport_country(notBlank(dto.getPassport_country()));
        user.setDriver_license_country(notBlank(dto.getDriver_license_country()));
        user.setCompany(dto.isCompany());
        user.setCompany_name(notBlank(dto.getCompany_name()));

        userRepository.save(user);
        log.info("Created user {} on website side.", user.getTelephone());
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    @Transactional
    protected void updateUser(UserWebsiteUpdateDto dto) {
        Optional<User> opt = userRepository.findById(dto.getTelephone());
        if (opt.isEmpty()) {
            log.warn("User {} not found for update, creating new.", dto.getTelephone());
            createUser(dto);
            return;
        }
        User user = opt.get();
        modelMapper.map(dto, user);
        userRepository.save(user);
        log.info("Updated user {} on website side.", user.getTelephone());
    }

    @Transactional
    protected void deleteUser(String telephone) {
        if (userRepository.existsById(telephone)) {
            userRepository.deleteById(telephone);
            log.info("Deleted user {} from website side.", telephone);
        } else {
            log.warn("User {} not found for deletion.", telephone);
        }
    }

    public UserWebsiteUpdateDto checkUser(String telephone, String email) {
        Optional<User> existing = userRepository.findById(telephone);
        if (existing.isEmpty()) {
            UserWebsiteUpdateDto userDto = userClient.getForWebsite(telephone);
            if (userDto == null)
                return null;
            User user = new User();
            modelMapper.map(userDto, user);
            userRepository.save(user);
            if (userDto.getEmail().equals(email))
                return userDto;
            else
                return null;
        }
        User user = existing.get();
        UserWebsiteUpdateDto dto = new UserWebsiteUpdateDto();
        dto.setName(user.getName());
        dto.setLast_name(user.getLast_name());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.isAddress());
        dto.setDateOfBirth(user.isDateOfBirth());
        dto.setPostal_code(user.isPostal_code());
        dto.setCity(user.isCity());
        dto.setCountry(user.isCountry());
        dto.setVat_number(user.isVat_number());
        dto.setDriver_license(user.isDriver_license());
        dto.setDriver_license_country(user.isDriver_license_country());
        dto.setPassport(user.isPassport());
        dto.setPassport_country(user.isPassport_country());
        
        dto.setCompany(user.isCompany());
        dto.setCompany_name(user.isCompany_name());
        if (dto.getEmail().equals(email))
            return dto;
        else
            return null;
    }

}
