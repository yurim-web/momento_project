package me.sejoon.yurim.blog.momento.util;

public class UserUtil {

    public static String validatePassword(String password) {
        if (password.length() < 8) {
            return "비밀번호는 최소 8자 이상이어야 합니다.";
        }

        if (!password.matches(".*[a-z].*")) {
            return "소문자가 포함되어야 합니다.";
        }

        if (!password.matches(".*[A-Z].*")) {
            return "대문자가 포함되어야 합니다.";
        }

        if (!password.matches(".*[0-9].*")) {
            return "숫자가 포함되어야 합니다.";
        }

        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            return "특수문자가 포함되어야 합니다.";
        }

        return "사용 가능합니다.";
    }
}
