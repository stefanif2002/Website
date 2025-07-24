package com.example.website_backend.dto.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight payload for the website:
 *  - telephone: primary key to look user up in CRM
 *  - flags: bitmask telling which fields the CRM ALREADY has
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserForWebsiteDto {
    private String telephone;
    private int flags;
}
