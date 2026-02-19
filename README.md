# Vue Front-End

React에서 Vue.js로 마이그레이션된 프론트엔드 프로젝트입니다.

## 기술 스택

- **Vue 3** - Progressive JavaScript Framework
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 빌드 도구
- **Vue Router** - 라우팅
- **Pinia** - 상태 관리 (Zustand 대체)
- **TanStack Query (Vue Query)** - 서버 상태 관리
- **Axios** - HTTP 클라이언트

## 프로젝트 구조

```
src/
├── api/              # API 클라이언트 함수들
├── components/       # Vue 컴포넌트
│   ├── common/      # 공통 컴포넌트
│   ├── attraction/  # 어트랙션 컴포넌트
│   ├── ticket/      # 티켓 컴포넌트
│   └── waiting/     # 대기열 컴포넌트
├── layouts/         # 레이아웃 컴포넌트
├── pages/           # 페이지 컴포넌트
│   ├── attraction/  # 어트랙션 페이지
│   ├── ticket/      # 티켓 페이지
│   └── user/        # 사용자 페이지
├── router/          # Vue Router 설정
├── stores/          # Pinia 스토어
├── styles/          # 전역 스타일
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
└── main.ts         # 애플리케이션 진입점
```

## 설치 및 실행

### 개발 환경 실행

```bash
npm install
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 린트

```bash
npm run lint
```

## 환경 변수

`.env.example` 파일을 `.env`로 복사하고 필요한 값을 설정하세요.

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_TOSS_CLIENT_KEY=
VITE_APP_BASE_URL=http://localhost:5173
```

## React에서 Vue로의 주요 변경사항

### 1. 컴포넌트 구조
- React 함수형 컴포넌트 → Vue 3 Composition API
- JSX → Vue Template (SFC)
- `useState`, `useEffect` → `ref`, `reactive`, `watch`, `computed`

### 2. 상태 관리
- Zustand → Pinia
- 동일한 상태 관리 패턴 유지

### 3. 라우팅
- React Router → Vue Router
- 라우트 가드를 통한 인증 처리

### 4. 서버 상태 관리
- TanStack React Query → TanStack Vue Query
- 동일한 API 유지

## 주요 페이지

- `/` - 어트랙션 목록으로 리다이렉트
- `/attraction` - 어트랙션 목록
- `/attraction/:id` - 어트랙션 상세
- `/login` - 로그인 (비로그인 전용)
- `/signup` - 회원가입 (비로그인 전용)
- `/ticket` - 내 티켓 목록 (로그인 필요)
- `/ticket/order` - 티켓 구매 (로그인 필요)
- `/waiting` - 대기열 (로그인 필요)
- `/mypage` - 마이페이지 (로그인 필요)

## 인증

- 로컬 스토리지 기반 인증 상태 관리
- HTTP 인터셉터를 통한 자동 토큰 갱신
- 라우트 가드를 통한 페이지 접근 제어

## 완료된 추가 작업

✅ **WebSocket 연동** - STOMP 프로토콜 기반 실시간 대기열 업데이트
✅ **결제 연동** - Toss Payments 통합 완료
✅ **세부 컴포넌트** - Calendar, TicketTypeList, Modal, Button 등 구현
✅ **환경 변수** - .env 파일 생성 및 설정 완료

## WebSocket 사용 방법

Vue Composable을 통해 WebSocket 구독을 쉽게 관리할 수 있습니다:

```vue
<script setup>
import { useUserQueueStatusSubscription } from '@/composables/useWebSocket'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

useUserQueueStatusSubscription(authStore.userId, (payload) => {
  console.log('Queue status update:', payload)
})
</script>
```

## 결제 플로우

1. 사용자가 날짜, 티켓 종류 선택
2. `/payments` API로 결제 준비 요청
3. Toss Payments SDK로 결제 진행
4. 성공/실패 페이지로 리다이렉트
5. `/payments/confirm` API로 결제 확인

## 향후 개선 사항

- 유닛 테스트 및 E2E 테스트 추가
- PWA 설정 (Service Worker, Manifest)
- 성능 최적화 (코드 스플리팅, 이미지 최적화)
- 접근성 개선 (ARIA 속성, 키보드 네비게이션)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 라이선스

MIT
