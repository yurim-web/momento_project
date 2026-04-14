package me.sejoon.yurim.blog.momento.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "gallery_images")
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalName;

    @Column
    private String caption;

    @Column
    private String authorEmail;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public GalleryImage() {}

    public GalleryImage(String fileName, String originalName, String caption, String authorEmail) {
        this.fileName = fileName;
        this.originalName = originalName;
        this.caption = caption;
        this.authorEmail = authorEmail;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getFileName() { return fileName; }
    public String getOriginalName() { return originalName; }
    public String getCaption() { return caption; }
    public String getAuthorEmail() { return authorEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCaption(String caption) { this.caption = caption; }
}
