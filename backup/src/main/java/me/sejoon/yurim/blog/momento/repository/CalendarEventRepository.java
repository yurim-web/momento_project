package me.sejoon.yurim.blog.momento.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.sejoon.yurim.blog.momento.entity.CalendarEvent;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByEventDateBetweenOrderByEventDateAsc(LocalDate start, LocalDate end);
    List<CalendarEvent> findByEventDate(LocalDate date);
}
