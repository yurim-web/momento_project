package me.sejoon.yurim.blog.momento.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import me.sejoon.yurim.blog.momento.dto.LoginRequest;
import me.sejoon.yurim.blog.momento.dto.LoginResponse;
import me.sejoon.yurim.blog.momento.dto.SignupRequest;
import me.sejoon.yurim.blog.momento.dto.SignupResponse;
import me.sejoon.yurim.blog.momento.service.UserService;
import me.sejoon.yurim.blog.momento.util.UserUtil;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService authService;

    public UserController(UserService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest login_Request) {
        return authService.login(login_Request);
    }

    @GetMapping("/check-email")
    public Map<String, Object> checkEmail(@RequestParam String email) {
        boolean exists = authService.checkEmailExists(email);
        Map<String, Object> result = new HashMap<>();
        result.put("email", email);
        result.put("exists", exists);
        return result;
    }

    @GetMapping("/check-password")
    public Map<String, String> checkPassword(@RequestParam String password) {
        String exists = UserUtil.validatePassword(password);

        Map<String, String> result = new HashMap<>();
        result.put("password", password);
        result.put("result", exists);
        return result;
    }

    @PostMapping("/signup")
    public SignupResponse signup(@RequestBody SignupRequest request) {
        return authService.signUp(
                request.getEmail(),
                request.getPassword(),
                request.getName(),
                request.getPhone());
    }
}
