package com.project.rootlytic.service;

import com.project.rootlytic.DTO.LogDTO;
import com.project.rootlytic.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    @Autowired
    LogRepository logRepository;

    public List<LogDTO> getLogs(String applicationId){
        return logRepository.findByApplicationIdOrderByTimestampDesc(applicationId);
    }
}