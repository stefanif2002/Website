package com.example.website_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "category")
public class Category {
    @Id
    private Long id;

    private String name;
    private String type;
    private String fuel;
    private boolean automatic;
    private int numOfSeats;
    private float pricePerDay;

    private int cars;
    private String description;


    private String imageUrl;
    private String color;

    public Category() {

    }

    public Category(Long id, String name, String type, String fuel, boolean automatic, int numOfSeats, float pricePerDay, int cars, String description, String imageUrl, String color) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.fuel = fuel;
        this.automatic = automatic;
        this.numOfSeats = numOfSeats;
        this.pricePerDay = pricePerDay;
        this.cars = cars;
        this.description = description;
        this.imageUrl = imageUrl;
        this.color = color;
    }

    public Category(Long id, String name, String type, String fuel, boolean automatic, int numOfSeats, float pricePerDay, String description, String imageUrl, String color) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.fuel = fuel;
        this.automatic = automatic;
        this.numOfSeats = numOfSeats;
        this.pricePerDay = pricePerDay;
        this.description = description;
        this.imageUrl = imageUrl;
        this.color = color;
    }

}
