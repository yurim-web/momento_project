package me.sejoon.yurim.blog.momento.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import me.sejoon.yurim.blog.momento.entity.Diary;
import me.sejoon.yurim.blog.momento.service.DiaryService;

@RestController
@RequestMapping("/api/diaries")
public class DiaryController {

    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    @GetMapping
    public List<Diary> getAllDiaries(@RequestParam(required = false) String authorEmail) {
        if (authorEmail != null && !authorEmail.isEmpty()) {
            return diaryService.getDiariesByAuthor(authorEmail);
        }
        return diaryService.getAllDiaries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diary> getDiary(@PathVariable Long id) {
        return diaryService.getDiaryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Diary createDiary(@RequestBody Diary diary) {
        return diaryService.createDiary(diary);
    }

    @PutMapping("/{id}")
    public Diary updateDiary(@PathVariable Long id, @RequestBody Diary diary) {
        return diaryService.updateDiary(id, diary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiary(@PathVariable Long id) {
        diaryService.deleteDiary(id);
        return ResponseEntity.ok().build();
    }
}
