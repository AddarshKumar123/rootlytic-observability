package com.project.rootlytic.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthHandler {
    @GetMapping("/auth")
    public ResponseEntity<String> validateToken(){
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
