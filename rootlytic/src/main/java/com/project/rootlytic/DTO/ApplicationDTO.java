package com.project.rootlytic.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDTO {
    private String id;
    private String applicationName;
    private String type;
    private String status;
    private List<Object> errorLogs =new ArrayList<>();
}
