package me.sejoon.yurim.blog.momento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import me.sejoon.yurim.blog.momento.entity.GalleryImage;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findAllByOrderByCreatedAtDesc();
}
