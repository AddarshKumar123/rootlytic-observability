package com.project.rootlytic.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.rootlytic.repository.ErrorSignatureRepository;
import com.project.rootlytic.model.ErrorSignature;

@Service
public class ErrorDashboardService {
    private final ErrorSignatureRepository errorSignatureRepository;

    public ErrorDashboardService(ErrorSignatureRepository errorSignatureRepository) {
        this.errorSignatureRepository = errorSignatureRepository;
    }
    
//    public List<ErrorSignature> getTopErrors(int limit){
//        return errorSignatureRepository.findAll()
//        .stream()
//        .sorted((a,b)->Integer.compare(b.getCount(), a.getCount()))
//        .limit(limit)
//        .toList();
//    }

    public List<ErrorSignature> getErrorsByService(String service) {
        return errorSignatureRepository.findByService(service);
    }

    public List<ErrorSignature> getNewErrors(long since) {
        return errorSignatureRepository.findByLastSeenGreaterThan(since);
    }

}
