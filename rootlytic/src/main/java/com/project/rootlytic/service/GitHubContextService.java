package com.project.rootlytic.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class GitHubContextService {

    @Value("${github.token}")
    private String githubToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String fetchFileByName(String fileName, String owner, String repo,String branch) {

        String treeUrl = String.format("https://api.github.com/repos/%s/%s/git/trees/%s?recursive=1", owner, repo,branch);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.set("Accept", "application/vnd.github.v3+json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> treeResponse = restTemplate.exchange(treeUrl, HttpMethod.GET, entity, String.class);
            JsonNode root = objectMapper.readTree(treeResponse.getBody());
            JsonNode tree = root.path("tree");

            String matchedPath = null;

            for(JsonNode node:tree){
                String path=node.path("path").asText();
                String type=node.path("type").asText();

                if("blob".matches(type) && path.endsWith(fileName)){
                    matchedPath=path;
                    break;
                }
            }

            if (matchedPath == null) {
                return "Error: File not found in repo";
            }

            String contentUrl = String.format(
                    "https://api.github.com/repos/%s/%s/contents/%s",
                    owner, repo, matchedPath
            );

            ResponseEntity<String> contentResponse = restTemplate.exchange(
                    contentUrl, HttpMethod.GET, entity, String.class);

            JsonNode contentRoot=objectMapper.readTree(contentResponse.getBody());
            String base64Content=contentRoot.path("content").asText();

            byte[] decoded = Base64.getMimeDecoder().decode(base64Content);
            return new String(decoded);

        } catch (Exception e) {
            System.err.println("Search API failed: " + e.getMessage());
            return "Failed to discover file path.";
        }
    }
}