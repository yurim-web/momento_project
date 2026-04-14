package me.sejoon.yurim.blog.momento.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import me.sejoon.yurim.blog.momento.entity.GalleryImage;
import me.sejoon.yurim.blog.momento.service.GalleryService;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;
    private final Path uploadDir = Paths.get("uploads/gallery");

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllImages() {
        return galleryService.getAllImages().stream().map(img -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", img.getId());
            map.put("fileName", img.getFileName());
            map.put("originalName", img.getOriginalName());
            map.put("imageUrl", "/api/gallery/images/" + img.getFileName());
            map.put("caption", img.getCaption());
            map.put("authorEmail", img.getAuthorEmail());
            map.put("createdAt", img.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", defaultValue = "") String caption,
            @RequestParam(value = "authorEmail", defaultValue = "") String authorEmail
    ) {
        try {
            GalleryImage image = galleryService.uploadImage(file, caption, authorEmail);
            Map<String, Object> result = new HashMap<>();
            result.put("id", image.getId());
            result.put("fileName", image.getFileName());
            result.put("originalName", image.getOriginalName());
            result.put("imageUrl", "/api/gallery/images/" + image.getFileName());
            result.put("caption", image.getCaption());
            result.put("authorEmail", image.getAuthorEmail());
            result.put("createdAt", image.getCreatedAt());
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "업로드 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<Resource> serveImage(@PathVariable String fileName) {
        try {
            Path filePath = uploadDir.resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        try {
            galleryService.deleteImage(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
