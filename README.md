# Momento

> 커플이 함께 추억을 기록하는 프라이빗 블로그

Momento는 연인과 함께 일상의 소소한 순간부터 특별한 기념일까지 예쁘게 기록하는 웹 애플리케이션입니다.
파스텔 톤 디자인과 손글씨 폰트로 따뜻한 분위기를 제공합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **게시글** | 데이트/여행/일상/기념일/맛집 카테고리별 기록, 댓글, 수정/삭제 |
| **일기장** | 기분 이모지 선택, 공유/비공개 설정, 작성자별 필터 |
| **캘린더** | 월별 일정 관리, 카테고리별 이벤트 점 표시, 일정 추가 모달 |
| **기념일** | D+Day 자동 계산 (100일/200일/1주년 등), 커스텀 기념일 추가 |
| **갤러리** | 사진 업로드/삭제, 캡션, 이미지 상세 보기 모달 |
| **여행 계획** | 일별 일정 관리 (DAY 1, 2...), 장소별 주소 입력 시 네이버 지도 연결 |
| **채팅** | 둘만의 비밀 채팅, 실시간 메시지 (3초 폴링), 말풍선 UI |
| **커플 연결** | UUID 초대코드 생성/공유로 커플 매칭 |
| **프로필** | 별명 변경, 사귄 날 설정, 오늘의 한마디, 알림/테마/데이터 내보내기 |
| **가이드** | 서비스 소개 및 기능 안내 페이지 |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | Next.js 15 (App Router), React 19, TypeScript |
| **스타일링** | Tailwind CSS 3.4, 커스텀 파스텔 테마 |
| **폰트** | Pretendard (UI), Nanum Pen Script (제목/손글씨), Gowun Batang (본문) |
| **백엔드** | Spring Boot 3.4.6, Spring Data JPA |
| **데이터베이스** | MySQL 8 |
| **빌드** | Maven (mvnw), npm |

---

## 실행 방법

> 자세한 가이드는 [서버실행가이드](docs/서버실행가이드.md) 참고

### 1. MySQL 시작
```bash
brew services start mysql
```

### 2. 백엔드 서버 (포트 8081)
```bash
cd backup
./mvnw spring-boot:run
```

### 3. 프론트엔드 서버 (포트 3000)
```bash
npm install
npm run dev
```

### 4. 접속
브라우저에서 http://localhost:3000

### 테스트 계정
| 이메일 | 비밀번호 |
|--------|----------|
| test@test.com | test1234 |
| demo@momento.com | demo1234 |

---

## 폴더 구조

```
momento/
├── src/                              # 프론트엔드 (Next.js)
│   ├── app/
│   │   ├── layout.tsx                # 루트 레이아웃 + Footer
│   │   ├── page.tsx                  # 홈 대시보드
│   │   ├── globals.css               # 전역 스타일 (파스텔 테마)
│   │   ├── login/page.tsx            # 로그인
│   │   ├── signup/page.tsx           # 회원가입
│   │   ├── guide/page.tsx            # 서비스 가이드
│   │   ├── posts/
│   │   │   ├── page.tsx              # 게시글 목록
│   │   │   ├── new/page.tsx          # 게시글 작성
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # 게시글 상세 + 댓글
│   │   │       └── edit/page.tsx     # 게시글 수정
│   │   ├── diary/
│   │   │   ├── page.tsx              # 일기 목록
│   │   │   ├── write/page.tsx        # 일기 작성
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # 일기 상세
│   │   │       └── edit/page.tsx     # 일기 수정
│   │   ├── calendar/page.tsx         # 캘린더
│   │   ├── anniversary/page.tsx      # 기념일
│   │   ├── gallery/page.tsx          # 갤러리
│   │   ├── travel/page.tsx           # 여행 계획
│   │   ├── chat/page.tsx             # 둘만의 채팅
│   │   ├── connect/page.tsx          # 커플 연결
│   │   └── profile/page.tsx          # 프로필 + 설정
│   ├── components/
│   │   ├── Navbar.tsx                # 네비게이션 (상단 + 모바일 하단)
│   │   └── Footer.tsx                # 푸터
│   ├── lib/
│   │   ├── api.ts                    # API 클라이언트
│   │   └── useAuth.ts                # 로그인 가드 훅
│   └── types/
│       └── user.ts                   # TypeScript 타입
│
├── backup/                           # 백엔드 (Spring Boot)
│   ├── src/main/java/.../
│   │   ├── config/CorsConfig.java
│   │   ├── controller/
│   │   │   ├── PostController.java
│   │   │   ├── DiaryController.java
│   │   │   ├── CalendarEventController.java
│   │   │   ├── AnniversaryController.java
│   │   │   ├── ChatController.java
│   │   │   ├── CoupleLinkController.java
│   │   │   └── GalleryController.java
│   │   ├── entity/
│   │   │   ├── Post.java, Diary.java, Comment.java
│   │   │   ├── CalendarEvent.java, Anniversary.java
│   │   │   ├── ChatMessage.java
│   │   │   ├── CoupleLink.java
│   │   │   └── GalleryImage.java
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/
│       └── application.properties
│
├── docs/                             # 기획 문서
│   ├── 01_PRD.md
│   ├── 02_기능명세서.md
│   ├── 03_디자인시스템.md
│   ├── 04_API명세서.md
│   ├── 05_아키텍처.md
│   ├── 06_유저플로우.md
│   └── 서버실행가이드.md
│
├── tailwind.config.js
├── package.json
└── README.md
```

---

## API 엔드포인트

### 사용자
| Method | URL | 설명 |
|--------|-----|------|
| POST | `/user/login` | 로그인 |
| POST | `/user/signup` | 회원가입 |

### 게시글 `/api/posts`
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/posts` | 전체/카테고리별 조회 |
| POST | `/api/posts` | 작성 |
| PUT | `/api/posts/{id}` | 수정 |
| DELETE | `/api/posts/{id}` | 삭제 |
| GET/POST/DELETE | `/api/posts/{id}/comments` | 댓글 |

### 일기 `/api/diaries`
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/diaries` | 전체/작성자별 조회 |
| POST | `/api/diaries` | 작성 |
| PUT | `/api/diaries/{id}` | 수정 |
| DELETE | `/api/diaries/{id}` | 삭제 |

### 캘린더 `/api/calendar`
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/calendar?year=&month=` | 월별 조회 |
| POST | `/api/calendar` | 추가 |
| DELETE | `/api/calendar/{id}` | 삭제 |

### 기념일 `/api/anniversaries`
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/anniversaries` | 전체 조회 |
| POST | `/api/anniversaries` | 추가 |
| DELETE | `/api/anniversaries/{id}` | 삭제 |

### 채팅 `/api/chat`
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/chat` | 최근 50개 메시지 |
| POST | `/api/chat` | 메시지 전송 |
| DELETE | `/api/chat/{id}` | 메시지 삭제 |

### 갤러리 `/api/gallery`
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/gallery` | 전체 조회 |
| POST | `/api/gallery/upload` | 이미지 업로드 |
| DELETE | `/api/gallery/{id}` | 삭제 |

### 커플 연결 `/api/couple`
| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/couple/generate` | 초대코드 생성 |
| POST | `/api/couple/connect` | 커플 연결 |
| GET | `/api/couple/status` | 연결 상태 조회 |

---

## 디자인 시스템

### 색상 팔레트
| 이름 | 용도 | 대표 색상 |
|------|------|-----------|
| **Pink** | 주요 강조색 | `#f8b4c0` |
| **Lavender** | 보조 강조색 | `#8ec2ff` |
| **Mint** | 성공/긍정 | `#a8e6cf` |
| **Peach** | 따뜻한 포인트 | `#ffcba4` |
| **Cream** | 배경색 | `#fefcf3` |

### 폰트
| 폰트 | 용도 | 클래스 |
|------|------|--------|
| Pretendard | UI 텍스트, 버튼, 라벨 | `font-ui` (body 기본) |
| Nanum Pen Script | 제목, 손글씨 느낌 | `font-handwriting` |
| Gowun Batang | 본문 텍스트 | - |

### 커스텀 CSS
| 클래스 | 설명 |
|--------|------|
| `.card-pastel` | 파스텔 카드 (흰색 + 핑크 그림자) |
| `.input-pastel` | 입력 필드 (핑크 테두리 포커스) |
| `.btn-primary` | 그라데이션 버튼 (핑크 → 하늘) |
| `.btn-secondary` | 보조 버튼 (흰색 테두리) |

---

## 라이선스

Private Project
