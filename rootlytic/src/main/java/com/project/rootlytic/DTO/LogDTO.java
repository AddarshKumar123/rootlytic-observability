package com.project.rootlytic.DTO;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

@Document(collection = "logs")
public class LogDTO {
    private String applicationId;
    @Id
    private String _id;
    private String service;
    private String exceptionType;
    private String severity;
    private String message;
    private String stack;
    private String endpoint;
    private int line;
    private String className;
    private String fileName;
    private String methodName;
    private String timestamp;
    private String AiFix;
}
