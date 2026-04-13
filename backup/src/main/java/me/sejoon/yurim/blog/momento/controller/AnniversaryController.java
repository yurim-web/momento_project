package me.sejoon.yurim.blog.momento.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import me.sejoon.yurim.blog.momento.entity.Anniversary;
import me.sejoon.yurim.blog.momento.service.AnniversaryService;

@RestController
@RequestMapping("/api/anniversaries")
public class AnniversaryController {

    private final AnniversaryService anniversaryService;

    public AnniversaryController(AnniversaryService anniversaryService) {
        this.anniversaryService = anniversaryService;
    }

    @GetMapping
    public List<Anniversary> getAllAnniversaries() {
        return anniversaryService.getAllAnniversaries();
    }

    @PostMapping
    public Anniversary createAnniversary(@RequestBody Anniversary anniversary) {
        return anniversaryService.createAnniversary(anniversary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnniversary(@PathVariable Long id) {
        anniversaryService.deleteAnniversary(id);
        return ResponseEntity.ok().build();
    }
}
