package com.project.rootlytic.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.rootlytic.DTO.LogDTO;
import com.project.rootlytic.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIFixService {

    @Autowired
    private GitHubContextService gitHubContextService;

    @Autowired
    LogRepository logRepository;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public Map<String,String> getAiFix(String id) throws JsonProcessingException {
        LogDTO logEntity = logRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        if (logEntity.getAICodeFix() != null) {
            Map<String,String> aiFix=new HashMap<>();
            aiFix.put("rca",logEntity.getAiRca());
            aiFix.put("codeFix",logEntity.getAICodeFix());
        }

         String sourceCodeContext = gitHubContextService.fetchFileByName(logEntity.getFileName(), "AddarshKumar123", "test", "main");


        String prompt = String.format("""
            You are an elite Staff Software Engineer diagnosing a production system failure.
            
            THE ERROR CONTEXT:
            - Exception Type: %s
            - Message: %s
            - Endpoint: %s
            - Failed Class/Method: %s.%s
            - Line Number: %s
            
            THE EXACT SOURCE CODE (%s):
            ```
            %s
            ```
            
            Based ONLY on the provided source code and error details, you must respond with a valid JSON object. 
            Do NOT wrap the JSON in markdown formatting (like ```json). Return ONLY the raw JSON object with these two exact keys:
            {
                "rca": "A brief, technical Root Cause Analysis",
                "codeFix": "The exact, corrected code snippet without markdown formatting"
            }
            """,
                logEntity.getExceptionType(), logEntity.getMessage(), logEntity.getEndpoint(),
                logEntity.getClassName(), logEntity.getMethodName(), logEntity.getLine(),
                logEntity.getFileName(), sourceCodeContext
        );

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
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
        String aiRawOutput = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        JsonNode customAiResponse = objectMapper.readTree(aiRawOutput);
        String rca = customAiResponse.path("rca").asText();
        String codeFix = customAiResponse.path("codeFix").asText();

        logEntity.setAiRca(rca);
        logEntity.setAICodeFix(codeFix);
        logRepository.save(logEntity);

        Map<String,String> aiFix=new HashMap<>();
        aiFix.put("rca",logEntity.getAiRca());
        aiFix.put("codeFix",logEntity.getAICodeFix());

        return aiFix;
    }
}