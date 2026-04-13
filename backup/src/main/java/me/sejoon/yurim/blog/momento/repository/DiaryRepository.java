package me.sejoon.yurim.blog.momento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.sejoon.yurim.blog.momento.entity.Diary;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findAllByOrderByDiaryDateDesc();
    List<Diary> findByAuthorEmailOrderByDiaryDateDesc(String authorEmail);
}
