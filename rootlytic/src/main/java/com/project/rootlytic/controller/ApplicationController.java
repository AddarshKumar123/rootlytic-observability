package com.project.rootlytic.controller;

import com.project.rootlytic.DTO.ApplicationDTO;
import com.project.rootlytic.model.ApplicationModel;
import com.project.rootlytic.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ApplicationController {
    @Autowired
    ApplicationService applicationService;

    @PostMapping("/create_application")
    public ResponseEntity<String> createApplication(@RequestBody ApplicationDTO applicationDTO){
        return applicationService.createApplication(applicationDTO);
    }

    @GetMapping("/fetch_application")
    public ResponseEntity<List<ApplicationDTO>> fetchServices(){
        return applicationService.fetchServices();
    }
}
