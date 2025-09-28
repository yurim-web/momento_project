package me.sejoon.yurim.blog.momento.dto;

public class SignupResponse {

    private String status;
    private String message;

    public SignupResponse(String status, String message) {
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
