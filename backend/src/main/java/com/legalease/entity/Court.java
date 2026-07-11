package com.legalease.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;

    private String state;

    private double latitude;

    private double longitude;

    private String jurisdiction;

    private String phone;
}
