package com.deva.portfolio.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3 & Swagger UI Configuration with JWT Bearer Authentication Support.
 * Allows interactive REST API exploration and authorization directly in browser.
 */
@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI portfolioOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Deva Yadhala | Full-Stack Portfolio REST API")
                        .description("Production RESTful API powering Deva Yadhala's personal portfolio, showcase modules, resume-verified data, and secure JWT-authenticated admin console.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Deva Yadhala")
                                .email("admin@devayadhala.local")
                                .url("https://github.com/devayadhala"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token obtained from POST /api/auth/login. Format: Bearer <token> (or simply paste token)")));
    }
}
