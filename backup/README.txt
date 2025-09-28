# Momento 프로젝트 사용법

## 🔧 컴파일 방법 (Maven 사용)

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

    ./mvnw clean package

이 명령어는 Maven Wrapper를 통해 프로젝트를 빌드하고,
`target/momento-0.0.1-SNAPSHOT.jar` 파일을 생성합니다.

---

## 🚀 실행 방법

JAR 파일을 실행합니다:

    java -jar target/momento-0.0.1-SNAPSHOT.jar

Spring Boot 애플리케이션이 실행되며, 내장 Tomcat 서버가 포트 8080에서 동작합니다.

---

## 📁 디렉토리 구조 예시

    src/main/java/
        me/sejoon/yurim/blog/momento/       # 메인 클래스
        me/sejoon/yurim/blog/momento/controller/  # 컨트롤러
        me/sejoon/yurim/blog/momento/service/     # 서비스
        me/sejoon/yurim/blog/momento/repository/  # 레포지토리
        me/sejoon/yurim/blog/momento/entity/      # 엔티티

---

## ✅ 요구사항

- Java 17 이상
- MySQL 실행 중 (localhost:3306)

[1] Controller      --> HTTP 요청 수신 (/api/login)
       ↓
[2] DTO             --> LoginRequest(email, password) 로 값 받음
       ↓
[3] Service         --> UserService.login(request)
       ↓
[4] Repository      --> userRepository.findByEmail(email)
       ↓
[5] Entity          --> DB에서 User 엔티티 매핑
       ↑
[6] Service         --> 비밀번호 일치 여부 검사
       ↑
[7] DTO             --> LoginResponse("success"/"fail", message) 리턴
       ↑
[8] Controller      --> JSON 응답 반환
