package me.sejoon.yurim.blog.momento.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import me.sejoon.yurim.blog.momento.entity.CalendarEvent;
import me.sejoon.yurim.blog.momento.repository.CalendarEventRepository;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventService(CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    public List<CalendarEvent> getEventsByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return calendarEventRepository.findByEventDateBetweenOrderByEventDateAsc(start, end);
    }

    public List<CalendarEvent> getEventsByDate(LocalDate date) {
        return calendarEventRepository.findByEventDate(date);
    }

    public CalendarEvent createEvent(CalendarEvent event) {
        return calendarEventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        calendarEventRepository.deleteById(id);
    }
}
