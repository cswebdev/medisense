package com.medisense.backend.services;

import com.medisense.backend.security.config.OpenAIConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);
    @Autowired
    private OpenAIConfig openAIConfig;

    public String callOpenAI(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openAIConfig.getApiKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        String requestBody = "{\n" +
                "  \"model\": \"gpt-3.5-turbo\",\n" +
                "  \"messages\": [\n" +
                "    {\"role\": \"user\", \"content\": \"" + prompt + "\"}\n" +
                "  ],\n" +
                "  \"max_tokens\": 150\n" +
                "}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("OpenAI Request: {}", requestBody);
                logger.info("OpenAI Reponse: {}", response.getBody());
                return response.getBody();
            } else {
                logger.error("OpenAI request failed with status code: {}", response.getStatusCode());
                throw new RuntimeException("OpenAI request failed with status code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error during OpenAI request. Request: {}", requestBody, e);
            throw new RuntimeException("Error during OpenAI request. See logs for details.", e);
        }
    }
}