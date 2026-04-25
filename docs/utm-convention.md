# UTM 명명 규칙 (TripFlowy)

> Sprint 1 산출물. UTM 파라미터 일관성 확보용 — Sprint 5 (Naver 링크), 외부 권위(Sprint 6), 향후 유료 캠페인까지 동일 규칙 적용.
>
> 모든 인입 트래픽은 `proxy.ts`에서 자동 파싱 → `log:agg:utm:{date}` hash에 `utm_source/utm_medium/utm_campaign` 키 조합으로 집계.

## 5개 파라미터

| 파라미터 | 의미 | 형식 | 예시 |
|---|---|---|---|
| `utm_source` | 트래픽이 출발한 *플랫폼* | 소문자, 단어 단일 | `naver_blog`, `instagram`, `youtube`, `chatgpt`, `g2` |
| `utm_medium` | 콘텐츠 *형태* | 소문자, 단어 단일 | `social`, `referral`, `email`, `cpc`, `organic` |
| `utm_campaign` | 묶음 단위 (도시 / 시즌 / 이벤트) | `[scope]_[detail]` 소문자 snake | `tokyo_disneyland`, `osaka_q2_2026`, `spring_sale_2026` |
| `utm_content` | 같은 캠페인 내 변종 (CTA, 위치, A/B) | 자유, 짧게 | `cta_top`, `cta_inline`, `banner_a` |
| `utm_term` | (유료 검색 전용) 키워드 | 소문자 | `tokyo_itinerary` |

## 규칙

1. **소문자 + 언더스코어만.** 하이픈 / 공백 / 한글 금지. URL 인코딩 사고 방지.
2. **`utm_source` 화이트리스트** (확장 시 이 문서 + `/docs/analytics-regex.md` 동시 업데이트):
   - 외부 콘텐츠: `naver_blog`, `tistory`, `medium`
   - 소셜: `instagram`, `youtube`, `threads`, `x`, `facebook`
   - 메신저: `kakao`, `line`
   - LLM/AI: `chatgpt`, `claude`, `perplexity`, `gemini` (※ 사용자가 직접 클릭한 링크에만 — referer 자동감지는 `log:agg:llm:*`이 별도 처리)
   - 외부 권위 사이트: `g2`, `crunchbase`, `wikidata`, `alternativeto`, `producthunt`
   - 유료 검색: `google_ads`, `naver_ads`
3. **`utm_medium` 표준 8개 외 사용 금지**: `social`, `referral`, `email`, `cpc`, `organic`, `affiliate`, `qr`, `print`.
4. **`utm_campaign`은 도시 또는 분기 prefix 권장**:
   - 도시 콘텐츠: `tokyo_disneyland`, `osaka_dotonbori_q2_2026`
   - 분기/시즌: `q2_2026_launch`, `golden_week_2026`
   - 외부 등재: `g2_listing`, `crunchbase_org`
5. **`utm_content`는 같은 글 안의 위치/CTA 구분에만**. 글이 다르면 `utm_campaign`을 분리.
6. **자기 사이트 내부 링크엔 UTM 붙이지 않음** (referer 셀프-매칭으로 노이즈 발생).
7. **단축 URL 사용 시에도 원본 URL에 UTM 박혀 있어야** — 단축 서비스가 UTM stripping 안 하는지 확인.

## 예시 — Sprint 5 Naver 마이그레이션

같은 Naver 글에서 위치만 다른 3개 CTA 변종:

```
https://www.tripflowy.com/ko/posts/tokyo-disneyland-guide?utm_source=naver_blog&utm_medium=referral&utm_campaign=tokyo_disneyland&utm_content=cta_top
https://www.tripflowy.com/ko/posts/tokyo-disneyland-guide?utm_source=naver_blog&utm_medium=referral&utm_campaign=tokyo_disneyland&utm_content=cta_inline
https://www.tripflowy.com/ko/posts/tokyo-disneyland-guide?utm_source=naver_blog&utm_medium=referral&utm_campaign=tokyo_disneyland&utm_content=cta_bottom
```

→ 대시보드 `UTM Campaigns Top 10`에서 `naver_blog/referral/tokyo_disneyland` 1줄로 보임. CTA별 분해는 `utm_content`로 raw entry에서 후속 분석.

## 예시 — Sprint 6 외부 권위

| 등재 | URL 파라미터 |
|---|---|
| G2 listing → 사이트 | `?utm_source=g2&utm_medium=referral&utm_campaign=g2_listing` |
| Crunchbase Person/Org | `?utm_source=crunchbase&utm_medium=referral&utm_campaign=crunchbase_person` |
| Wikidata Person 항목 | `?utm_source=wikidata&utm_medium=referral&utm_campaign=wikidata_person` |
| AlternativeTo | `?utm_source=alternativeto&utm_medium=referral&utm_campaign=alternativeto_listing` |

## 변경 이력

- 2026-04-25 — Sprint 1 초안 (책킴 + Claude Code).
