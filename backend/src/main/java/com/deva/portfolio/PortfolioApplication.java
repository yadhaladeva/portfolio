package com.deva.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for Deva Yadhala's Full-Stack Portfolio Application.
 * Configures Spring Boot component scanning, auto-configuration, and JPA repositories.
 */
@SpringBootApplication
public class PortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }
}
