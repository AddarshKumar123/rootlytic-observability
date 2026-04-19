package com.project.rootlytic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "error_signatures")
public class ErrorSignature {
    @Id
    private String id;

    private String hash;
    private String service;
    private String message;
    private String severity;

    private long firstSeen;
    private long lastSeen;
    private Integer count;
}
