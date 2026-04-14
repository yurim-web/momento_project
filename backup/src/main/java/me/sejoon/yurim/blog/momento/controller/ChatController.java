package me.sejoon.yurim.blog.momento.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import me.sejoon.yurim.blog.momento.entity.ChatMessage;
import me.sejoon.yurim.blog.momento.repository.ChatMessageRepository;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatMessageRepository chatRepo;

    public ChatController(ChatMessageRepository chatRepo) {
        this.chatRepo = chatRepo;
    }

    @GetMapping
    public List<ChatMessage> getRecentMessages() {
        List<ChatMessage> messages = chatRepo.findTop50ByOrderByCreatedAtDesc();
        List<ChatMessage> reversed = new ArrayList<>(messages);
        Collections.reverse(reversed);
        return reversed;
    }

    @PostMapping
    public ChatMessage sendMessage(@RequestBody ChatMessage message) {
        return chatRepo.save(message);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        chatRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
