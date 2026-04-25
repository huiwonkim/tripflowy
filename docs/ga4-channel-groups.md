# GA4 "AI Assistants" 커스텀 채널 그룹 (TripFlowy)

> Sprint 1 산출물. 책킴이 GA4 콘솔에서 직접 설정. Claude Code는 코드/스키마 영역만 커버.
>
> 목적: GA4 기본 채널 그룹은 LLM referral을 "Direct" 또는 "Referral"로 분류함. AI assistant 트래픽을 별도 채널로 떼어내야 GEO 효과 측정 가능.

## 사전 확인

- GA4 속성: `G-3Y0XB545M3` (`app/[locale]/layout.tsx`).
- 책킴 권한: 속성 편집자 이상.
- 적용 대기시간: 채널 그룹 변경은 24~48시간 후 데이터에 반영.

## Step 1 — 새 채널 그룹 생성

1. GA4 → **관리(Admin)** → 속성(Property) 컬럼 → **데이터 표시(Data display)** → **채널 그룹(Channel groups)**.
2. 우측 상단 **새 채널 그룹 만들기**.
3. 이름: `TripFlowy with AI Assistants`.
4. 설명: `Default channel group + AI Assistants channel for LLM referral attribution`.
5. **기본 채널 그룹 복사** 클릭 → 모든 표준 채널이 base로 들어옴.

## Step 2 — "AI Assistants" 채널 추가

1. **채널 추가(Add channel)** → 이름 `AI Assistants`.
2. 채널 순서(매치 우선순위): **목록 맨 위**로 이동 (Direct/Referral보다 먼저 평가되어야 매치 가능).
3. 조건(Conditions) — `OR` 로 묶어서 다음 호스트들 추가. 매치 필드: **Source** (또는 **Referrer**).
   - `chatgpt.com` (정확히 일치)
   - `chat.openai.com` (정확히 일치)
   - `perplexity.ai` (정확히 일치)
   - `www.perplexity.ai` (정확히 일치)
   - `claude.ai` (정확히 일치)
   - `gemini.google.com` (정확히 일치)
   - `bard.google.com` (정확히 일치)
   - `copilot.microsoft.com` (정확히 일치)
   - `you.com` (정확히 일치)
   - `phind.com` (정확히 일치)
4. **추가 조건** (UTM 직접 매치 — 사용자가 LLM 답변에서 UTM 박힌 링크 클릭한 경우):
   - **Source 정확히 일치**: `chatgpt`, `claude`, `perplexity`, `gemini` (UTM convention의 LLM source 화이트리스트 — `/docs/utm-convention.md`).
5. **저장**.

## Step 3 — 보고서 적용

1. **보고서 → 획득(Acquisition) → 트래픽 획득(Traffic acquisition)**.
2. 좌상단 채널 그룹 드롭다운에서 `TripFlowy with AI Assistants` 선택.
3. `AI Assistants` 행이 별도 채널로 분리되어 나오는지 확인 (24~48h 후).

## Step 4 — 비교 보고서 (선택)

- **탐색(Explore)** → 새 자유 형식 보고서 생성.
- 차원: `Default channel group` + `Session source / medium`.
- 측정항목: `Sessions`, `Engaged sessions`, `Average engagement time`.
- 필터: `Session source` matches regex `chatgpt|perplexity|claude|gemini|copilot|you\.com|phind`.
- → 일/주/월 단위 LLM referral 트렌드.

## 검증 체크리스트

- [ ] `TripFlowy with AI Assistants` 채널 그룹 생성됨.
- [ ] `AI Assistants` 채널이 매치 우선순위 1번.
- [ ] 10개 LLM 호스트 + 4개 UTM source 모두 OR 조건에 등록.
- [ ] 보고서 좌상단 드롭다운에서 새 그룹 선택 가능.
- [ ] (24~48h 후) 트래픽 획득 보고서에 `AI Assistants` 행 표시.

## 향후 확장

- 새 LLM 서비스가 등장하면:
  1. `lib/analytics/log-schema.ts` `LLM_HOSTS` Set에 호스트 추가.
  2. `/docs/analytics-regex.md` 표 업데이트.
  3. 본 GA4 채널 그룹의 `AI Assistants` 채널 OR 조건에 호스트 추가.
- 셋이 어긋나면 **코드(`log-schema.ts`)가 SoT**.

## 변경 이력

- 2026-04-25 — Sprint 1 초안.
