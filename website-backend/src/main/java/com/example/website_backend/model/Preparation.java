package com.example.website_backend.model;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "preparation")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Preparation {
    @Id
    private String its_name;

    private int its_value;

}