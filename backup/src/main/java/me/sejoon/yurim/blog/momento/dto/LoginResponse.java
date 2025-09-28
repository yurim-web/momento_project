package me.sejoon.yurim.blog.momento.dto;

public class LoginResponse {

    private String status;
    private String message;

    public LoginResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
