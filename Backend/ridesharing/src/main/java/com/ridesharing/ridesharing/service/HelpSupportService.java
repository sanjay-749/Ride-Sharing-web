package com.ridesharing.ridesharing.service;

import com.ridesharing.ridesharing.entity.HelpSupport;
import com.ridesharing.ridesharing.repository.HelpSupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HelpSupportService {

    @Autowired
    private HelpSupportRepository helpSupportRepository;

    public HelpSupport createSupportTicket(HelpSupport helpSupport) {
        helpSupport.setSubject(cleanText(helpSupport.getSubject()));
        helpSupport.setMessage(cleanText(helpSupport.getMessage()));
        helpSupport.setStatus(cleanText(helpSupport.getStatus()));
        
        if (helpSupport.getStatus() == null) {
            helpSupport.setStatus("pending");
        }
        
        return helpSupportRepository.save(helpSupport);
    }

    public List<HelpSupport> getTicketsByEmail(String email) {
        return helpSupportRepository.findByEmailOrderByCreatedAtDesc(email);
    }

    public List<HelpSupport> getTicketsByStatus(String status) {
        return helpSupportRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public HelpSupport updateTicketStatus(Long ticketId, String status, String response) {
        Optional<HelpSupport> ticketOptional = helpSupportRepository.findById(ticketId);
        if (ticketOptional.isPresent()) {
            HelpSupport ticket = ticketOptional.get();
            ticket.setStatus(cleanText(status));
            ticket.setResponse(cleanText(response));
            
            if ("resolved".equals(status)) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
            
            return helpSupportRepository.save(ticket);
        }
        throw new RuntimeException("Support ticket not found with ID: " + ticketId);
    }

    public List<HelpSupport> getAllTickets() {
        return helpSupportRepository.findAll();
    }

    private String cleanText(String input) {
        if (input == null) return null;
        return input.replaceAll("[^\\x00-\\x7F]", "");
    }
}