package me.sejoon.yurim.blog.momento.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import me.sejoon.yurim.blog.momento.entity.CoupleLink;
import me.sejoon.yurim.blog.momento.service.CoupleLinkService;

@RestController
@RequestMapping("/api/couple")
public class CoupleLinkController {

    private final CoupleLinkService coupleLinkService;

    public CoupleLinkController(CoupleLinkService coupleLinkService) {
        this.coupleLinkService = coupleLinkService;
    }

    @PostMapping("/generate")
    public CoupleLink generateCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return coupleLinkService.generateCode(email);
    }

    @PostMapping("/connect")
    public ResponseEntity<?> connect(@RequestBody Map<String, String> body) {
        String inviteCode = body.get("inviteCode");
        String partnerEmail = body.get("email");
        try {
            CoupleLink link = coupleLinkService.connect(inviteCode, partnerEmail);
            return ResponseEntity.ok(link);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "fail", "message", e.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@RequestParam String email) {
        Optional<CoupleLink> link = coupleLinkService.getMyCouple(email);
        if (link.isPresent()) {
            return ResponseEntity.ok(link.get());
        }
        return ResponseEntity.ok(Map.of("connected", false));
    }
}
