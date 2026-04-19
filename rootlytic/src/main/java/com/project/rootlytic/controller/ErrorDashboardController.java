package com.project.rootlytic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.rootlytic.service.ErrorDashboardService;
import com.project.rootlytic.model.ErrorSignature;

@RestController
public class ErrorDashboardController {
    private final ErrorDashboardService errorDashboardService;

    public ErrorDashboardController(ErrorDashboardService errorDashboardService){
        this.errorDashboardService=errorDashboardService;
    }

//    @GetMapping("/top")
//    public List<ErrorSignature> getTopErrors(@RequestParam(defaultValue = "10") int limit){
//        return errorDashboardService.getTopErrors(limit);
//    }

    @GetMapping("/by-service")
    public List<ErrorSignature> getErrorsByService(
            @RequestParam String serviceName) {
        return errorDashboardService.getErrorsByService(serviceName);
    }

    @GetMapping("/new")
    public List<ErrorSignature> getNewErrors(
            @RequestParam long since) {
        return errorDashboardService.getNewErrors(since);
    }

}
