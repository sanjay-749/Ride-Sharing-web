package com.ridesharing.controller;

import com.ridesharing.entity.HelpSupport;
import com.ridesharing.security.JwtUtil;
import com.ridesharing.service.HelpSupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/help-support")
@CrossOrigin(origins = "http://localhost:5173")
public class HelpSupportController {

    @Autowired
    private HelpSupportService helpSupportService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public Map<String, Object> submitTicket(@RequestBody HelpSupport helpSupport) {
        try {
            System.out.println("Received help support ticket from: " + helpSupport.getEmail());
            System.out.println("Subject: " + helpSupport.getSubject());
            
            HelpSupport savedTicket = helpSupportService.createSupportTicket(helpSupport);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Support ticket submitted successfully");
            response.put("ticket", savedTicket);
            
            return response;
        } catch (Exception e) {
            System.out.println("Error submitting support ticket: " + e.getMessage());
            throw new RuntimeException("Failed to submit support ticket: " + e.getMessage());
        }
    }

    @GetMapping("/my-tickets")
    public List<HelpSupport> getUserTickets(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            
            System.out.println("Fetching support tickets for user: " + userEmail);
            
            List<HelpSupport> userTickets = helpSupportService.getTicketsByEmail(userEmail);
            System.out.println("Found " + userTickets.size() + " tickets for user: " + userEmail);
            
            return userTickets;
        } catch (Exception e) {
            System.out.println("Error fetching user support tickets: " + e.getMessage());
            throw new RuntimeException("Failed to fetch support tickets: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<HelpSupport> getAllTickets() {
        return helpSupportService.getAllTickets();
    }

    @PutMapping("/{ticketId}/status")
    public HelpSupport updateTicketStatus(@PathVariable Long ticketId, @RequestBody Map<String, String> updateData) {
        String status = updateData.get("status");
        String response = updateData.get("response");
        
        return helpSupportService.updateTicketStatus(ticketId, status, response);
    }
}