package com.project.rootlytic.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.rootlytic.DTO.LogDTO;
import com.project.rootlytic.service.AIFixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class AIFixController {
    @Autowired
    private AIFixService aiFixService;

    @PostMapping("/ai-fix/{id}")
    public String getAiFix(@PathVariable String id) throws JsonProcessingException {
        return aiFixService.getAiFix(id);
    }
}
