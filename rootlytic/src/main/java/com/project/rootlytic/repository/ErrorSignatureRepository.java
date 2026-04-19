package com.project.rootlytic.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.project.rootlytic.model.ErrorSignature;

@Repository
public interface ErrorSignatureRepository extends MongoRepository<ErrorSignature,String> {
    List<ErrorSignature> findTop10ByOrderByCountDesc();

    List<ErrorSignature> findByService(String service);

    List<ErrorSignature> findByLastSeenGreaterThan(long timestamp);
}
