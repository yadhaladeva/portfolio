package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.ContactMessageRequest;
import com.deva.portfolio.dto.response.ContactMessageResponse;
import com.deva.portfolio.entity.ContactMessage;
import com.deva.portfolio.exception.ResourceNotFoundException;
import com.deva.portfolio.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public ContactMessageResponse saveMessage(ContactMessageRequest request) {
        ContactMessage msg = ContactMessage.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .subject(request.getSubject() != null ? request.getSubject().trim() : "General Inquiry")
                .message(request.getMessage().trim())
                .status("UNREAD")
                .build();

        ContactMessage saved = contactMessageRepository.save(msg);
        return ContactMessageResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageResponse> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ContactMessageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContactMessageResponse updateMessageStatus(Long id, String status) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));

        msg.setStatus(status.toUpperCase().trim());
        ContactMessage updated = contactMessageRepository.save(msg);
        return ContactMessageResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteMessage(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));
        contactMessageRepository.delete(msg);
    }
}
