package me.sejoon.yurim.blog.momento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.sejoon.yurim.blog.momento.entity.Anniversary;

@Repository
public interface AnniversaryRepository extends JpaRepository<Anniversary, Long> {
    List<Anniversary> findAllByOrderByAnniversaryDateAsc();
}
