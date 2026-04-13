package me.sejoon.yurim.blog.momento.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import me.sejoon.yurim.blog.momento.entity.Post;
import me.sejoon.yurim.blog.momento.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByCategory(String category) {
        return postRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post updated) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(updated.getTitle());
            post.setContent(updated.getContent());
            post.setCategory(updated.getCategory());
            post.setLocation(updated.getLocation());
            post.setEventDate(updated.getEventDate());
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
