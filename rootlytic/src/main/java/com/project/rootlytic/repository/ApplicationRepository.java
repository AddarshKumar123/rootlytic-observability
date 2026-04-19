package com.project.rootlytic.repository;

import com.project.rootlytic.model.ApplicationModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<ApplicationModel,String> {
    List<ApplicationModel> findApplicationByUserId(String userId);
}
