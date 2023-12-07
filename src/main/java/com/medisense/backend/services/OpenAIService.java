package com.medisense.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medisense.backend.security.config.OpenAIConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);
    @Autowired
    private OpenAIConfig openAIConfig;

    public String callOpenAI(String prompt) {
        logger.info("OpenAI Request Prompt: {}", prompt);

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openAIConfig.getApiKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // Use Jackson to create a JSON payload
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody;
        try {
            Map<String, Object> requestBodyMap = new HashMap<>();
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content",
                    "You are a helpful assistant named Medisense an AI medication analyst. You can provide general information on saftey between medication management, your aim is to inform of potential negative drug interactions between provided medications.Your response should be short and easy to read. You are not a medical professional and you should end your replies with something similar to, 'I am not a medical professional and you should refer to a licensed medical professional for any further information.'"));
            messages.add(Map.of("role", "user", "content", prompt));
            requestBodyMap.put("messages", messages);
            requestBodyMap.put("model", "gpt-3.5-turbo");
            requestBody = objectMapper.writeValueAsString(requestBodyMap);
        } catch (JsonProcessingException e) {
            logger.error("Error converting request body to JSON", e);
            throw new RuntimeException("Error converting request body to JSON", e);
        }

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("OpenAI Request: {}", requestBody);
                logger.info("OpenAI Response: {}", response.getBody());
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
