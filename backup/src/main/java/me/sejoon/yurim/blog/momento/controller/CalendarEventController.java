package me.sejoon.yurim.blog.momento.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import me.sejoon.yurim.blog.momento.entity.CalendarEvent;
import me.sejoon.yurim.blog.momento.service.CalendarEventService;

@RestController
@RequestMapping("/api/calendar")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping
    public List<CalendarEvent> getEvents(
            @RequestParam int year,
            @RequestParam int month) {
        return calendarEventService.getEventsByMonth(year, month);
    }

    @GetMapping("/date")
    public List<CalendarEvent> getEventsByDate(@RequestParam String date) {
        return calendarEventService.getEventsByDate(LocalDate.parse(date));
    }

    @PostMapping
    public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
        return calendarEventService.createEvent(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        calendarEventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }
}
