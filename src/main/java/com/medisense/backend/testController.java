package com.medisense.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testController {

	@RequestMapping("/api")
	public String HelloWorld() {
		return "hello world";
	}

}
