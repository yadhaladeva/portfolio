package com.deva.portfolio.dto.response;

import com.deva.portfolio.entity.ContactMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing an inquiry message for admin dashboard review.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageResponse {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public static ContactMessageResponse fromEntity(ContactMessage msg) {
        if (msg == null) return null;
        return ContactMessageResponse.builder()
                .id(msg.getId())
                .name(msg.getName())
                .email(msg.getEmail())
                .subject(msg.getSubject())
                .message(msg.getMessage())
                .status(msg.getStatus())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
