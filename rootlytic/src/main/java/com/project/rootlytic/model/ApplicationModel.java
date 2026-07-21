package com.project.rootlytic.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "applications")
public class ApplicationModel {
    @Id
    private String applicationId;
    private String userId;
    private String api_key;
    private String applicationName;
    private String type;
    private String status;
    private String githubUsername;
    private String repoName;
    private String branch;
    private List<Object>errorLogs =new ArrayList<>();
}
