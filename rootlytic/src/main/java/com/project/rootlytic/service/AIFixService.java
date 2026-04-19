package com.project.rootlytic.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.rootlytic.DTO.LogDTO;
import com.project.rootlytic.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Optional;

@Service
public class AIFixService {

    @Autowired
    LogRepository logRepository;

    RestClient restClient=RestClient.create();
    ObjectMapper objectMapper=new ObjectMapper();

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    String prompt = "I am providing a parsed log details of the exceptions occurred on users application . Your task is to analyze the log and provide the best fix for it .Please don't ask any followup questions and provide the result strictly on the basis of log details provided . Just provide the solution and no more details or deeper explanations . I am attaching the error details .";


    public String getAiFix(String Id) throws JsonProcessingException {

        LogDTO logEntity = logRepository.findById(Id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        if(logEntity.getAiFix()!=null){
            return logEntity.getAiFix();
        }

        String error = logEntity.toString();
        String finalPrompt = prompt + " " + error;

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", finalPrompt)
                        })
                }
        );

        ResponseEntity<String> response = restClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toEntity(String.class);

        String jsonResponse = response.getBody();
        JsonNode root = objectMapper.readTree(jsonResponse);

        String result = root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        logEntity.setAiFix(result);
        logRepository.save(logEntity);

        return result;
    }
}
