# Momento — API 명세서

## 기본 정보

| 항목 | 값 |
|------|-----|
| Base URL | `http://localhost:8081` |
| Content-Type | `application/json` |
| 인증 | 없음 (추후 JWT 전환 예정) |

---

## 1. User API

### 1.1 로그인
```
POST /user/login
```

**Request Body**
```json
{
  "email": "test@naver.com",
  "password": "1234"
}
```

**Response (성공)**
```json
{
  "status": "success",
  "message": "로그인 성공"
}
```

**Response (실패)**
```json
{
  "status": "fail",
  "message": "이메일 또는 비밀번호가 올바르지 않습니다"
}
```

---

### 1.2 회원가입
```
POST /user/signup
```

**Request Body**
```json
{
  "email": "test@naver.com",
  "password": "1234",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response**
```json
{
  "status": "success",
  "message": "회원가입 성공"
}
```

---

### 1.3 이메일 중복 확인
```
GET /user/check-email?email=test@naver.com
```

**Response**
```json
{
  "email": "test@naver.com",
  "exists": true
}
```

---

### 1.4 비밀번호 유효성 검사
```
GET /user/check-password?password=1234
```

**Response**
```json
{
  "password": "1234",
  "result": "valid"
}
```

---

## 2. Post API

### 2.1 게시글 전체 조회
```
GET /api/posts
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| category | string | X | 카테고리 필터 (데이트/여행/일상/기념일/맛집) |

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "title": "첫 데이트",
    "content": "오늘 처음으로...",
    "category": "데이트",
    "location": "홍대",
    "eventDate": "2024-03-15",
    "authorEmail": "test@naver.com",
    "authorName": "홍길동",
    "createdAt": "2024-03-15T14:30:00",
    "updatedAt": "2024-03-15T14:30:00"
  }
]
```

---

### 2.2 게시글 상세 조회
```
GET /api/posts/{id}
```

**Response** `200 OK`
```json
{
  "id": 1,
  "title": "첫 데이트",
  "content": "오늘 처음으로 같이 영화를 봤다...",
  "category": "데이트",
  "location": "홍대",
  "eventDate": "2024-03-15",
  "authorEmail": "test@naver.com",
  "authorName": "홍길동",
  "createdAt": "2024-03-15T14:30:00",
  "updatedAt": "2024-03-15T14:30:00"
}
```

---

### 2.3 게시글 작성
```
POST /api/posts
```

**Request Body**
```json
{
  "title": "첫 데이트",
  "content": "오늘 처음으로 같이 영화를 봤다",
  "category": "데이트",
  "location": "홍대",
  "eventDate": "2024-03-15",
  "authorEmail": "test@naver.com",
  "authorName": "홍길동"
}
```

**Response** `200 OK` — 생성된 게시글 객체 (id, createdAt 포함)

---

### 2.4 게시글 수정
```
PUT /api/posts/{id}
```

**Request Body** — 수정할 필드만 포함
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

**Response** `200 OK` — 수정된 게시글 객체

---

### 2.5 게시글 삭제
```
DELETE /api/posts/{id}
```

**Response** `200 OK`

---

### 2.6 댓글 조회
```
GET /api/posts/{postId}/comments
```

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "postId": 1,
    "content": "너무 좋았어!",
    "authorEmail": "test@naver.com",
    "authorName": "홍길동",
    "createdAt": "2024-03-15T15:00:00"
  }
]
```

---

### 2.7 댓글 작성
```
POST /api/posts/{postId}/comments
```

**Request Body**
```json
{
  "content": "너무 좋았어!",
  "authorEmail": "test@naver.com",
  "authorName": "홍길동"
}
```

**Response** `200 OK` — 생성된 댓글 객체

---

### 2.8 댓글 삭제
```
DELETE /api/posts/comments/{commentId}
```

**Response** `200 OK`

---

## 3. Diary API

### 3.1 일기 전체 조회
```
GET /api/diaries
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| authorEmail | string | X | 작성자 이메일 (내 일기 필터) |

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "title": "오늘의 일기",
    "content": "오늘 하루도...",
    "mood": "😊",
    "diaryDate": "2024-03-15",
    "authorEmail": "test@naver.com",
    "authorName": "홍길동",
    "isShared": true,
    "createdAt": "2024-03-15T22:00:00",
    "updatedAt": "2024-03-15T22:00:00"
  }
]
```

---

### 3.2 일기 상세 조회
```
GET /api/diaries/{id}
```

**Response** `200 OK` — 일기 객체

---

### 3.3 일기 작성
```
POST /api/diaries
```

**Request Body**
```json
{
  "title": "오늘의 일기",
  "content": "오늘 하루도 행복했다",
  "mood": "😊",
  "diaryDate": "2024-03-15",
  "authorEmail": "test@naver.com",
  "authorName": "홍길동",
  "isShared": true
}
```

**Response** `200 OK` — 생성된 일기 객체

---

### 3.4 일기 수정
```
PUT /api/diaries/{id}
```

**Request Body** — 수정할 필드만 포함

**Response** `200 OK` — 수정된 일기 객체

---

### 3.5 일기 삭제
```
DELETE /api/diaries/{id}
```

**Response** `200 OK`

---

## 4. Calendar API

### 4.1 월별 일정 조회
```
GET /api/calendar?year=2024&month=3
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| year | number | O | 연도 |
| month | number | O | 월 (1-12) |

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "title": "데이트",
    "category": "데이트",
    "eventDate": "2024-03-15",
    "authorEmail": "test@naver.com",
    "createdAt": "2024-03-10T10:00:00"
  }
]
```

---

### 4.2 날짜별 일정 조회
```
GET /api/calendar/date?date=2024-03-15
```

**Response** `200 OK` — 해당 날짜 일정 배열

---

### 4.3 일정 추가
```
POST /api/calendar
```

**Request Body**
```json
{
  "title": "데이트",
  "category": "데이트",
  "eventDate": "2024-03-15",
  "authorEmail": "test@naver.com"
}
```

**Response** `200 OK` — 생성된 일정 객체

---

### 4.4 일정 삭제
```
DELETE /api/calendar/{id}
```

**Response** `200 OK`

---

## 5. Anniversary API

### 5.1 기념일 전체 조회
```
GET /api/anniversaries
```

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "title": "첫 만남 기념일",
    "anniversaryDate": "2024-01-15",
    "emoji": "💝",
    "authorEmail": "test@naver.com",
    "createdAt": "2024-01-15T00:00:00"
  }
]
```

---

### 5.2 기념일 추가
```
POST /api/anniversaries
```

**Request Body**
```json
{
  "title": "첫 만남 기념일",
  "anniversaryDate": "2024-01-15",
  "emoji": "💝",
  "authorEmail": "test@naver.com"
}
```

**Response** `200 OK` — 생성된 기념일 객체

---

### 5.3 기념일 삭제
```
DELETE /api/anniversaries/{id}
```

**Response** `200 OK`

---

## 6. 데이터 모델 (Entity)

### User
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| email | String | 이메일 (고유) |
| password | String | 비밀번호 |
| name | String | 이름 |
| phone | String | 전화번호 |
| createDate | LocalDateTime | 가입일 |

### Post
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| title | String | 제목 |
| content | String (TEXT) | 내용 |
| category | String | 카테고리 |
| location | String | 장소 (선택) |
| eventDate | String | 이벤트 날짜 (선택) |
| authorEmail | String | 작성자 이메일 |
| authorName | String | 작성자 이름 |
| createdAt | LocalDateTime | 작성일 |
| updatedAt | LocalDateTime | 수정일 |

### Diary
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| title | String | 제목 |
| content | String (TEXT) | 내용 |
| mood | String | 기분 이모지 |
| diaryDate | String | 일기 날짜 |
| authorEmail | String | 작성자 이메일 |
| authorName | String | 작성자 이름 |
| isShared | Boolean | 공유 여부 |
| createdAt | LocalDateTime | 작성일 |
| updatedAt | LocalDateTime | 수정일 |

### Comment
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| postId | Long | 게시글 ID |
| content | String | 내용 |
| authorEmail | String | 작성자 이메일 |
| authorName | String | 작성자 이름 |
| createdAt | LocalDateTime | 작성일 |

### CalendarEvent
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| title | String | 제목 |
| category | String | 카테고리 |
| eventDate | String | 일정 날짜 |
| authorEmail | String | 작성자 이메일 |
| createdAt | LocalDateTime | 작성일 |

### Anniversary
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long (PK) | 자동 생성 |
| title | String | 제목 |
| anniversaryDate | String | 기념일 날짜 |
| emoji | String | 이모지 |
| authorEmail | String | 작성자 이메일 |
| createdAt | LocalDateTime | 작성일 |
