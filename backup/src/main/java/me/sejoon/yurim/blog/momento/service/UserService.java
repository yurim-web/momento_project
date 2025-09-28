package me.sejoon.yurim.blog.momento.service;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import me.sejoon.yurim.blog.momento.dto.LoginRequest;
import me.sejoon.yurim.blog.momento.dto.LoginResponse;
import me.sejoon.yurim.blog.momento.dto.SignupResponse;
import me.sejoon.yurim.blog.momento.entity.User;
import me.sejoon.yurim.blog.momento.repository.UserRepository;
import me.sejoon.yurim.blog.momento.util.UserUtil;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Test Code
    @Bean
    public CommandLineRunner insertTestUser() {
        return args -> {
            if (userRepository.count() == 0) {
                User testUser = new User("test@naver.com", "1234", "홍길동", "010-1234-5678");
                userRepository.save(testUser);
                System.out.println("✅ 테스트 유저 삽입 완료");
            }
        };
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return new LoginResponse("fail", "사용자를 찾을 수 없습니다.");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse("fail", "비밀번호가 일치하지 않습니다.");
        }

        return new LoginResponse("success", "로그인 성공");
    }

    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public SignupResponse signUp(String email, String password, String name, String phone) {
        try {
            if (userRepository.existsByEmail(email)) {
                return new SignupResponse("fail", "중복된 이메일입니다.");
            }

            int result = userRepository.insertUser(email, password, name, phone);
            if (result == 1) {
                return new SignupResponse("success", "회원가입 성공");
            } else {
                return new SignupResponse("fail", "회원가입 실패");
            }

        } catch (Exception e) {
            return new SignupResponse("error", "에러 발생: " + e.getMessage());
        }
    }
}
