package com.example.website_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "preparation")
public class Preparation {
    @Id
    private String its_name;

    private int its_value;

    public Preparation() {

    }

    public Preparation(String its_name, int its_value) {
        this.its_name = its_name;
        this.its_value = its_value;
    }
}
