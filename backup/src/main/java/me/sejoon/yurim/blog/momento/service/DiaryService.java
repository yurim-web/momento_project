package me.sejoon.yurim.blog.momento.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import me.sejoon.yurim.blog.momento.entity.Diary;
import me.sejoon.yurim.blog.momento.repository.DiaryRepository;

@Service
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }

    public List<Diary> getAllDiaries() {
        return diaryRepository.findAllByOrderByDiaryDateDesc();
    }

    public List<Diary> getDiariesByAuthor(String authorEmail) {
        return diaryRepository.findByAuthorEmailOrderByDiaryDateDesc(authorEmail);
    }

    public Optional<Diary> getDiaryById(Long id) {
        return diaryRepository.findById(id);
    }

    public Diary createDiary(Diary diary) {
        return diaryRepository.save(diary);
    }

    public Diary updateDiary(Long id, Diary updated) {
        return diaryRepository.findById(id).map(diary -> {
            diary.setTitle(updated.getTitle());
            diary.setContent(updated.getContent());
            diary.setMood(updated.getMood());
            diary.setDiaryDate(updated.getDiaryDate());
            diary.setIsShared(updated.getIsShared());
            return diaryRepository.save(diary);
        }).orElseThrow(() -> new RuntimeException("일기를 찾을 수 없습니다."));
    }

    public void deleteDiary(Long id) {
        diaryRepository.deleteById(id);
    }
}
