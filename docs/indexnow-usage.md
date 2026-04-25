# IndexNow 사용 가이드 (TripFlowy)

> Sprint 6 산출물. Bing / Yandex / Seznam에 URL 재크롤 요청 protocol. **Google은 IndexNow 미지원** — GSC 콘솔 또는 URL Inspection API (별도) 사용.
>
> 책킴이 GSC + Bing Webmaster Tools 등록 (Sprint 6 Tier 1) 완료한 후부터 사용 가능.

## 동작 원리

1. 도메인 루트에 `<KEY>.txt` 파일 배치 (소유권 증명).
2. `api.indexnow.org/IndexNow`에 `{ host, key, keyLocation, urlList }` POST.
3. Bing/Yandex/Seznam이 KEY 파일 fetch → 매칭하면 URL list 큐 등록 → 빠른 재크롤.

## 셋업 (이미 완료)

- **Key 파일**: `/public/1d7922dd1fe3488190cae2aa0ea728ff93c67973f10047493a09e06871f00b0a.txt`
  - 배포 후 검증: `curl https://www.tripflowy.com/1d7922dd1fe3488190cae2aa0ea728ff93c67973f10047493a09e06871f00b0a.txt` → 키 문자열 그대로 반환.
- **스크립트**: `scripts/indexnow.ts` (Node fetch, host 검증, 최대 10,000 URL/req).
- **URL 시드 리스트**: `scripts/indexnow-urls.txt` (현재 home + locales + 9개 Tokyo 가이드 × 2 locales + planner = 24 URLs).
- **npm 스크립트**:
  - `npm run indexnow -- <url1> <url2> ...` — 한두 개 URL ad-hoc 제출
  - `npm run indexnow:list` — `indexnow-urls.txt` 전체 일괄 제출

## 일반 사용 패턴

### 새 글/페이지 배포 직후 (1~3 URLs)

```bash
npm run indexnow -- \
  https://www.tripflowy.com/posts/new-guide-slug \
  https://www.tripflowy.com/ko/posts/new-guide-slug
```

### 일괄 재색인 (Sprint 6 종료 후 1회 또는 도메인 변경 후)

```bash
npm run indexnow:list
```

### Sprint 7 day-trip 페이지 출시 시

`scripts/indexnow-urls.txt` 하단의 주석 처리된 day-trip URL 라인 활성화 → `npm run indexnow:list`.

## 제한 / 주의

- **Host enforced**: 스크립트가 `www.tripflowy.com` host 만 허용. `tripflowy.com` (apex, www 없는) URL 제출 시 에러 — Vercel이 apex → www 리디렉션이므로 www 형태로만 제출.
- **Hourly quota**: IndexNow에 명시된 분당 한도 없음, 다만 Bing 가이드는 "큰 변경 시에만" 권고. 매일 동일 URL 재제출은 spam 신호.
- **GA4와 무관**: IndexNow 응답은 색인 큐 등록만 보장. 실제 색인 여부는 며칠 후 GSC / Bing Webmaster Tools 색인 보고서에서 확인.

## GSC (Google) 측 처리

Google은 IndexNow 미지원. 다음 둘 중 하나로 진행:

1. **수동** (책킴 추천): GSC 콘솔 → URL 검사 → "색인 생성 요청". 새 글 출시할 때마다 책킴이 수동 제출. 일 한도 ~10 URL.
2. **API (자동)**: GSC URL Inspection API (OAuth + service account 필요). 현재 미구현. Sprint 7 트래픽 증가 시 검토.

## 변경 이력

- 2026-04-25 — Sprint 6 Phase A.4 초안. Key 생성, script + URL 시드 리스트.
