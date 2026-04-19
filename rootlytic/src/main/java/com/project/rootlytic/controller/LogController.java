package com.project.rootlytic.controller;

import com.project.rootlytic.DTO.LogDTO;
import com.project.rootlytic.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LogController {
    @Autowired
    LogService logService;

    @GetMapping("/{applicationId}/getlogs")
    public List<LogDTO> logs(@PathVariable String applicationId){
        return logService.getLogs(applicationId);
    }
}
