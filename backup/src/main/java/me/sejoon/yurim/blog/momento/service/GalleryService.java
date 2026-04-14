package me.sejoon.yurim.blog.momento.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import me.sejoon.yurim.blog.momento.entity.GalleryImage;
import me.sejoon.yurim.blog.momento.repository.GalleryImageRepository;

@Service
public class GalleryService {

    private final GalleryImageRepository repository;
    private final Path uploadDir = Paths.get("uploads/gallery");

    public GalleryService(GalleryImageRepository repository) {
        this.repository = repository;
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("업로드 디렉토리 생성 실패", e);
        }
    }

    public List<GalleryImage> getAllImages() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public GalleryImage uploadImage(MultipartFile file, String caption, String authorEmail) throws IOException {
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;

        Path filePath = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        GalleryImage image = new GalleryImage(fileName, originalName != null ? originalName : fileName, caption, authorEmail);
        return repository.save(image);
    }

    public void deleteImage(Long id) throws IOException {
        GalleryImage image = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("이미지를 찾을 수 없습니다."));

        Path filePath = uploadDir.resolve(image.getFileName());
        Files.deleteIfExists(filePath);

        repository.deleteById(id);
    }
}
