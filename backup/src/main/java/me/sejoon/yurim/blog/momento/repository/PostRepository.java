package me.sejoon.yurim.blog.momento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.sejoon.yurim.blog.momento.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByCategoryOrderByCreatedAtDesc(String category);
}
