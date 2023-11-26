package com.medisense.backend.controller;

import com.medisense.backend.services.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/openai")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/ask")
    public String askOpenAI(@RequestBody String prompt) {
        return openAIService.callOpenAI(prompt);
    }
}

