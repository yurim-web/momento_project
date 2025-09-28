package me.sejoon.yurim.blog.momento.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import me.sejoon.yurim.blog.momento.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email); // Spring Data JPA Auto write

    boolean existsByEmail(String email);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO users (email, password, name, phone, create_date) VALUES (:email, :password, :name, :phone, NOW())", nativeQuery = true)
    int insertUser(String email, String password, String name, String phone);
}
