# 💌 Momento — 커플 블로그

Momento는 커플이 함께 추억을 기록하고 공유하는 감성 블로그 웹 애플리케이션입니다.
파스텔 톤 디자인과 손글씨 느낌의 폰트로 따뜻한 분위기를 제공합니다.

---

## 주요 기능

- **게시글** — 데이트 기록, 카테고리별 분류 (데이트/여행/일상/기념일/맛집), 댓글
- **일기장** — 기분 이모지 선택, 공유/비공개 설정, 작성자별 필터
- **캘린더** — 월별 일정 관리, 이벤트 점 표시
- **기념일** — D+Day 자동 계산 (100일/200일/1주년 등), 커스텀 기념일 추가
- **갤러리** — 사진 모아보기 (개발 중)
- **커플 연결** — 초대코드로 커플 매칭 (개발 중)
- **프로필** — 커플 정보, D-Day 카운터

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | Next.js 15 (App Router), React 19, TypeScript |
| **스타일링** | Tailwind CSS 3.4, 커스텀 파스텔 테마 |
| **폰트** | Gowun Batang (본문), Nanum Pen Script (제목/손글씨) |
| **백엔드** | Spring Boot 3.4.6, Spring Data JPA |
| **데이터베이스** | MySQL 8 |
| **빌드** | Maven (mvnw), npm |

---

## 폴더 구조

```
momento/
├── src/                          # 프론트엔드 (Next.js)
│   ├── app/                      # 페이지 라우트
│   │   ├── layout.tsx            # 루트 레이아웃 (lang="ko", 폰트 설정)
│   │   ├── page.tsx              # 홈 대시보드
│   │   ├── globals.css           # 전역 스타일 (파스텔 테마, 커스텀 클래스)
│   │   ├── not-found.tsx         # 404 페이지
│   │   ├── login/
│   │   │   └── page.tsx          # 로그인
│   │   ├── signup/
│   │   │   └── page.tsx          # 회원가입
│   │   ├── connect/
│   │   │   └── page.tsx          # 커플 연결 (개발 중)
│   │   ├── posts/
│   │   │   ├── page.tsx          # 게시글 목록
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # 게시글 작성
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 게시글 상세 + 댓글
│   │   ├── diary/
│   │   │   ├── page.tsx          # 일기 목록
│   │   │   ├── write/
│   │   │   │   └── page.tsx      # 일기 작성
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 일기 상세
│   │   ├── calendar/
│   │   │   └── page.tsx          # 캘린더 (월별 일정)
│   │   ├── anniversary/
│   │   │   └── page.tsx          # 기념일 관리
│   │   ├── gallery/
│   │   │   └── page.tsx          # 갤러리 (개발 중)
│   │   └── profile/
│   │       └── page.tsx          # 커플 프로필
│   ├── components/
│   │   └── Navbar.tsx            # 네비게이션 바 (상단 + 모바일 하단)
│   ├── lib/
│   │   └── api.ts                # API 클라이언트 (fetch 래퍼)
│   └── types/
│       └── user.ts               # TypeScript 인터페이스
│
├── backup/                       # 백엔드 (Spring Boot)
│   ├── src/main/java/me/sejoon/yurim/blog/momento/
│   │   ├── Momento.java          # 메인 클래스
│   │   ├── config/
│   │   │   └── CorsConfig.java   # CORS 설정 (localhost:3000 허용)
│   │   ├── controller/
│   │   │   ├── PostController.java          # /api/posts
│   │   │   ├── DiaryController.java         # /api/diaries
│   │   │   ├── CalendarEventController.java # /api/calendar
│   │   │   └── AnniversaryController.java   # /api/anniversaries
│   │   ├── entity/
│   │   │   ├── Post.java
│   │   │   ├── Diary.java
│   │   │   ├── Comment.java
│   │   │   ├── CalendarEvent.java
│   │   │   └── Anniversary.java
│   │   ├── repository/
│   │   │   ├── PostRepository.java
│   │   │   ├── DiaryRepository.java
│   │   │   ├── CommentRepository.java
│   │   │   ├── CalendarEventRepository.java
│   │   │   └── AnniversaryRepository.java
│   │   └── service/
│   │       ├── PostService.java
│   │       ├── DiaryService.java
│   │       ├── CalendarEventService.java
│   │       ├── AnniversaryService.java
│   │       └── CommentService.java
│   ├── src/main/resources/
│   │   └── application.properties  # DB 설정 (port 8081, MySQL)
│   ├── pom.xml                     # Maven 의존성
│   └── mvnw                        # Maven Wrapper 실행 파일
│
├── tailwind.config.js            # Tailwind 커스텀 테마 (파스텔 색상)
├── tsconfig.json                 # TypeScript 설정
├── next.config.js                # Next.js 설정
├── postcss.config.js             # PostCSS 설정
├── package.json                  # npm 의존성
├── PROGRESS.md                   # 개발 진행 상태
└── README.md                     # 이 파일
```

---

## 실행 방법

### 1. MySQL 데이터베이스 설정

```sql
CREATE DATABASE Momento;
CREATE USER 'asj'@'localhost' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON Momento.* TO 'asj'@'localhost';
FLUSH PRIVILEGES;
```

### 2. 백엔드 서버 실행

```bash
cd backup
chmod +x mvnw
./mvnw spring-boot:run
```
> Spring Boot가 `http://localhost:8081`에서 실행됩니다.
> JPA ddl-auto=update 설정으로 테이블이 자동 생성됩니다.

### 3. 프론트엔드 실행

```bash
# 프로젝트 루트에서
npm install
npm run dev
```
> Next.js가 `http://localhost:3000`에서 실행됩니다.

### 4. 접속

브라우저에서 `http://localhost:3000` 접속

---

## API 엔드포인트

### 사용자 (`/user`)
| Method | URL | 설명 |
|--------|-----|------|
| POST | `/user/login` | 로그인 |
| POST | `/user/signup` | 회원가입 |

### 게시글 (`/api/posts`)
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/posts` | 전체 게시글 조회 |
| GET | `/api/posts?category={category}` | 카테고리별 조회 |
| GET | `/api/posts/{id}` | 게시글 상세 |
| POST | `/api/posts` | 게시글 작성 |
| PUT | `/api/posts/{id}` | 게시글 수정 |
| DELETE | `/api/posts/{id}` | 게시글 삭제 |
| GET | `/api/posts/{postId}/comments` | 댓글 조회 |
| POST | `/api/posts/{postId}/comments` | 댓글 작성 |
| DELETE | `/api/posts/comments/{commentId}` | 댓글 삭제 |

### 일기 (`/api/diaries`)
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/diaries` | 전체 일기 조회 |
| GET | `/api/diaries?authorEmail={email}` | 작성자별 조회 |
| GET | `/api/diaries/{id}` | 일기 상세 |
| POST | `/api/diaries` | 일기 작성 |
| PUT | `/api/diaries/{id}` | 일기 수정 |
| DELETE | `/api/diaries/{id}` | 일기 삭제 |

### 캘린더 (`/api/calendar`)
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/calendar?year={year}&month={month}` | 월별 일정 조회 |
| POST | `/api/calendar` | 일정 추가 |
| DELETE | `/api/calendar/{id}` | 일정 삭제 |

### 기념일 (`/api/anniversaries`)
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/anniversaries` | 기념일 조회 |
| POST | `/api/anniversaries` | 기념일 추가 |
| DELETE | `/api/anniversaries/{id}` | 기념일 삭제 |

---

## 디자인 시스템

### 색상 팔레트
| 이름 | 용도 | 대표 색상 |
|------|------|-----------|
| **Pink** | 주요 강조색 | `#f8b4c0` |
| **Lavender** | 보조 강조색 (연하늘색) | `#8ec2ff` |
| **Mint** | 성공/긍정 | `#a8e6cf` |
| **Peach** | 따뜻한 포인트 | `#ffcba4` |
| **Cream** | 배경색 | `#fefcf3` |

### 커스텀 CSS 클래스
- `.card-pastel` — 파스텔 카드 (흰색 배경 + 핑크 그림자)
- `.input-pastel` — 입력 필드 (핑크 테두리 포커스)
- `.btn-primary` — 그라데이션 버튼 (핑크 → 하늘색)
- `.btn-secondary` — 보조 버튼 (흰색 테두리)

---

## 라이선스

Private Project
