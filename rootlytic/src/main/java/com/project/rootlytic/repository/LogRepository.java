package com.project.rootlytic.repository;

import com.project.rootlytic.DTO.LogDTO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends MongoRepository<LogDTO,String> {
    List<LogDTO> findByApplicationIdOrderByTimestampDesc(String applicationId);
}
