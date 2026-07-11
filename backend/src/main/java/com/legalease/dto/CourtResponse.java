package com.legalease.dto;

import com.legalease.entity.Court;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CourtResponse {
    private Long id;
    private String name;
    private String type;
    private String address;
    private String city;
    private String state;
    private double latitude;
    private double longitude;
    private String jurisdiction;
    private String phone;

    public static CourtResponse fromCourt(Court c) {
        return CourtResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .type(c.getType())
                .address(c.getAddress())
                .city(c.getCity())
                .state(c.getState())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .jurisdiction(c.getJurisdiction())
                .phone(c.getPhone())
                .build();
    }
}
