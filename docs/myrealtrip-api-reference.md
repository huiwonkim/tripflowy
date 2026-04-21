# 마이리얼트립 API 레퍼런스 (추출 2026-04-10)

> JS 번들에서 추출한 문서. 원본: https://docs.myrealtrip.com

---

## 기본 정보

- **Base URL**: `https://partner-ext-api.myrealtrip.com`
- **인증**: Bearer 토큰 — `Authorization: Bearer YOUR_API_KEY`
- **프로토콜**: HTTPS만 지원
- **응답 형식**: JSON만 지원
- **Rate Limit**: 분당 60회, 초과 시 429 (Too Many Requests)
- **MCP 엔드포인트**: `https://mcp-servers.myrealtrip.com/mcp`
- **파트너 페이지**: `https://partner.myrealtrip.com`
- **문의**: marketing_partner@myrealtrip.com

---

## 공통 응답 구조

```json
{
  "success": true,
  "data": { ... },       // 목록 조회 시 배열, 단건 시 객체
  "meta": {
    "totalCount": 100,
    "page": 0,
    "size": 20
  }
}
```

---

## API 키

- 파트너 페이지에서 발급 (마케팅파트너팀 권한 필요)
- 발급 시점에만 전체 값 확인 가능, 이후 마스킹 처리
- 재발급 시 기존 키 자동 만료
- GitHub 등 공개 저장소 업로드 금지, 환경 변수에 저장 권장

---

## 에러 코드

| HTTP | 설명 | 대응 |
|------|------|------|
| 400 | 필수 파라미터 누락, 형식 오류, 유효하지 않은 값 | 파라미터 확인 (yyyy-MM-dd 형식 등) |
| 401 | 인증 실패 — API 키 누락 또는 유효하지 않음 | `Authorization: Bearer YOUR_API_KEY` 형식 확인, 키 재발급 |
| 403 | 접근 권한 없음 — API 키는 유효하지만 리소스 권한 없음 | marketing_partner@myrealtrip.com 문의 |
| 404 | 엔드포인트 URL 오타 | Base URL 및 경로 확인 |
| 429 | Rate Limit 초과 | X-RateLimit-Remaining 헤더 모니터링, Exponential Backoff |
| 500/503 | 서버 오류 | 최대 3회 재시도 (Exponential Backoff) |

---

## 파트너 API

### 1. POST /v1/mylink — 마이 링크 생성

마이리얼트립 상품 URL을 파트너 추적 링크로 변환.

**Request Body**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| targetUrl | string | O | 마이리얼트립 URL (최대 2,000자) |

**Response**:

| 필드 | 타입 | 설명 |
|------|------|------|
| mylink | string | 생성된 마이 링크 |

**예시 URL**: `https://www.myrealtrip.com/offers/3467?mylink_id=1234567&utm_content={utm_content}`

> targetUrl 2,000자 초과 시 500 에러. 항공편 검색 URL은 파라미터가 많아 길어지기 쉬우므로 불필요한 파라미터 제거 필요.

---

### 2. GET /v1/revenues — 수익 현황 (비항공)

비항공 상품(숙소, 투어, 액티비티 등)의 수익 조회.

**Query Parameters**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| dateSearchType | string | O | `SETTLEMENT` (정산기준일) 또는 `PAYMENT` (예약일) |
| startDate | string (date) | O | 조회 시작일 (yyyy-MM-dd, KST) |
| endDate | string (date) | O | 조회 종료일 (yyyy-MM-dd, KST) |
| page | integer | X | 페이지 번호 |
| pageSize | integer | X | 페이지 크기 |

**Response Fields**:

| 필드 | 타입 | 설명 |
|------|------|------|
| reservationNo | string | 예약 번호 |
| linkId | string | 마케팅 링크 ID |
| gid | integer (int64) | 상품 ID |
| productTitle | string | 상품명 |
| productCategory | string | 상품 카테고리 (아래 enum 참조) |
| salePrice | integer (int64) | 판매 금액 |
| commissionBase | integer (int64) | 정산 대상 금액 (2026-04-01 이후 예약건만, 이전은 null → salePrice 사용) |
| commission | integer (int64) | 수익 금액 (VAT 포함) |
| commissionRate | number | 커미션율 (소수) |
| partnershipCommissionType | string | 커미션 유형 |
| closingType | string | 주문 구분 |
| settlementCriteriaDate | string (date) | 정산 기준일 |
| reservedAt | string (date-time) | 예약일 |
| tripStartedAt | string (date-time) | 여행 시작일 (UTC) |
| tripStartedAtKst | string | 여행 시작일 (KST) |
| tripEndedAt | string (date-time) | 여행 종료일 (UTC) |
| tripEndedAtKst | string | 여행 종료일 (KST) |
| utmContent | string | UTM 컨텐츠 |
| quantity | integer | 수량 |
| city | string | 도시명 |
| country | string | 국가명 |

**closingType enum**: `결제완료`, `환불완료`, `부분환불`, `여행종료 후 부분환불`, `파트너 공제`, `여행자 보상`, `인보이스`

**productCategory enum**: `ACCOMMODATION`(숙소), `HOTEL_V2`(호텔), `RESORT_V2`(리조트), `BNB_APARTMENT_V2`(민박/아파트), `TOUR`(투어), `ACTIVITY`(액티비티), `TICKET`(티켓), `PACKAGE`(패키지), `FLIGHT`(항공), `TRANSPORTATION_V2`(교통), `SNAP`(스냅), `CLASS`(클래스), `CONVENIENCE`(편의시설), `THEME_PARK`(테마파크) 등

> 수익 데이터는 매일 오전 6시(KST) 일정산 완료. 전일까지만 조회 가능.
> commission이 마이너스인 건 발생 가능 (부분환불 등).

---

### 3. GET /v1/revenues/flight — 수익 현황 (항공)

항공 상품 전용 수익 조회. `/v1/revenues`와 데이터 중복 없음 — 전체 수익 확인 시 두 API 모두 호출 필요.

**Query Parameters**: `/v1/revenues`와 동일

**Response Fields**: `/v1/revenues`와 유사하지만 항공 특화:

| 필드 | 타입 | 설명 |
|------|------|------|
| salePrice | integer (int64) | 판매 금액 (항공료) |
| issueNet | integer (int64) | 항공료 금액 |

---

### 4. GET /v1/reservations — 예약 내역 (비항공)

**Query Parameters**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| dateSearchType | string | O | `RESERVATION_DATE` (예약일) 또는 `TRIP_END_DATE` (여행종료일) |
| startDate | string (date) | O | 조회 시작일 (yyyy-MM-dd) |
| endDate | string (date) | O | 조회 종료일 (yyyy-MM-dd) |
| page | integer | X | 페이지 번호 |
| pageSize | integer | X | 페이지 크기 (최대 300) |

**Response Fields**:

| 필드 | 타입 | 설명 |
|------|------|------|
| reservationNo | string | 예약 번호 |
| status | string | 예약 상태 (아래 enum) |
| statusKor | string | 예약 상태 (한글) |
| gid | integer (int64) | 상품 ID |
| productTitle | string | 상품명 |
| productCategory | string | 상품 카테고리 |
| salePrice | integer (int64) | 판매 금액 |
| commissionBase | integer (int64) | 정산 대상 금액 |
| reservedAt | string (date-time) | 예약일 |
| cancelledAt | string (date-time) | 취소 일시 |
| tripStartedAt/tripEndedAt | date-time | 여행 시작/종료일 |
| linkId | string | 마케팅 링크 ID |
| utmContent | string | UTM 컨텐츠 |
| city / country | string | 도시/국가명 |

**status enum**:

| 코드 | 한글 |
|------|------|
| TEMP | 임시 |
| WAIT_DEPOSIT | 입금대기 |
| PENDING_PAYMENT | 결제대기 |
| WAIT_CONFIRM | 확정대기 |
| CONFIRM | 예약확정 |
| REQUEST_CANCEL | 취소요청 |
| FINISH | 여행완료 |
| CANCEL | 예약취소 |
| FAIL | 실패 |

> 최대 6개월까지 조회 가능. pageSize 최대 300.

---

### 5. GET /v1/reservations/flight — 예약 내역 (항공)

**Query Parameters**: `/v1/reservations`와 동일

**Response Fields**:

| 필드 | 타입 | 설명 |
|------|------|------|
| reservationNo | string | 예약 ID |
| flightReservationNo | string | 항공사 예약번호 (PNR) |
| status | string | 예약 상태 |

**항공 예약 status enum**:

| 코드 | 한글 |
|------|------|
| WAITING | 예약대기(미처리) |
| RESERVED | 예약확정(미결제) |
| IN_PAY | 발권대상(결제진행중) |
| CONFIRMED | 발권완료(결제완료) |
| NOT_PAID_CONFIRMED | 미결제발권완료 |
| CANCELLED_ | 예약취소 |

> 최대 1개월까지 조회 가능. 수수료 정산 대상 예약만 반환, 취소 예약은 미포함.

---

### 6. GET /health — 헬스 체크

인증 필요 없음. API 서버 상태 확인용.

---

## 서비스 API

### 1. POST /v1/products/accommodation/search — 숙소 조회

**Request Body**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| keyword | string | O | 검색 키워드 (도시명 등) |
| regionId | integer | X | 마이리얼트립 내부 지역 ID |
| checkIn | string (date) | O | 체크인 날짜 |
| checkOut | string (date) | O | 체크아웃 날짜 |
| isDomestic | boolean | X | 국내 여부 |
| starRating | string | X | `threestar`, `fourstar`, `fivestar` |
| stayPoi | integer | X | 숙소 POI |
| order | string | X | `price_asc`, `price_desc`, `review_desc` |
| minPrice | integer | X | 최소 가격 (전체 숙박 기간 총액 기준) |
| maxPrice | integer | X | 최대 가격 |
| page | integer | X | 페이지 (0부터, 기본값 0) |
| size | integer | X | 페이지 크기 (1~50, 기본값 20) |

**Response Fields**:

| 필드 | 타입 | 설명 |
|------|------|------|
| totalCount | integer | 전체 결과 수 |
| items | array | 숙소 목록 |
| items[].itemId | integer (int64) | 숙소 ID |
| items[].itemName | string | 숙소명 |
| items[].starRating | integer | 성급 (1~5) |
| items[].reviewScore | string | 리뷰 평점 |
| items[].reviewCount | integer | 리뷰 수 |
| items[].originalPrice | integer (int64) | 정가 (원) |
| items[].salePrice | integer (int64) | 판매가 (원, 전체 숙박 기간 총액) |

---

### 2. 항공권 조회 API 그룹

#### POST /v1/products/flight/calendar — 항공편 달력 조회

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| depAirportCd | string | O | 출발 공항 코드 |
| arrAirportCd | string | O | 도착 공항 코드 |
| tripTypeCd | string | O | `OW`(편도), `RT`(왕복), `MT`(다구간) |
| depDate | string (date) | X | 출발일 |
| arrDate | string (date) | X | 도착일 |
| adult | integer | X | 성인 수 |
| child | integer | X | 소아 수 |
| infant | integer | X | 유아 수 |
| airline | string | X | 항공사 코드 |
| cabinClass | string | X | `FIRST`, `BUSINESS`, `PREMIUM_ECONOMY`, `ECONOMY`, `NONE` |

#### POST /v1/products/flight/calendar/lowest — 최저가 달력

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| depCityCd | string | O | 출발 도시 코드 |
| arrCityCd | string | O | 도착 도시 코드 |
| period | integer | O | 여행 기간 (3~7일) |

#### POST /v1/products/flight/calendar/bulk-lowest — 다목적지 최저가

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| depCityCd | string | O | 출발 도시 코드 |
| arrCityCds | array[string] | O | 도착 도시 코드 목록 |
| period | integer | O | 여행 기간 (3~7일) |

#### POST /v1/products/flight/calendar/window — 달력 윈도우

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| depCityCd | string | O | 출발 도시 코드 |
| arrCityCd | string | O | 도착 도시 코드 |
| period | integer | O | 여행 기간 (3~7일) |

#### POST /v1/products/flight/fare-query-landing-url — 항공 운임 조회 랜딩 URL

**Response**:

| 필드 | 타입 | 설명 |
|------|------|------|
| data | string | 항공 운임 조회 랜딩 URL |

**항공편 응답 공통 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| departureDate | string (date) | 출발일 |
| returnDate | string (date) | 귀국일 |
| fromCity | string | 출발 도시 코드 |
| toCity | string | 도착 도시 코드 |
| totalPrice | integer (int64) | 최저가 (원) |
| averagePrice | integer (int64) | 평균가 (원) |
| airline | string | 항공사 코드 |
| airlineName | string | 항공사 이름 |
| transfer | integer | 경유 횟수 (0 = 직항) |
| tripType | string | `ONE_WAY`(편도), `ROUND_TRIP`(왕복), `MULTI_CITY`(다구간) |
| operationScope | string | `DOMESTIC`(국내), `INTERNATIONAL`(국제) |
| period | integer | 여행 기간(일) |
| categoryCode | string | 카테고리 코드 |

---

## MCP (Model Context Protocol)

### 개요
AI 도구에서 마이리얼트립의 항공편, 숙소, 투어/액티비티 검색 기능을 사용 가능.
별도 인증 없이 엔드포인트 하나로 연결.

**엔드포인트**: `https://mcp-servers.myrealtrip.com/mcp`

### 제공 도구

| 도구 이름 | 설명 |
|-----------|------|
| searchDomesticFlights | 국내선 항공편 검색 (김포-제주, 김포-부산 등) |
| searchInternationalFlights | 국제선 항공편 검색 (일본, 동남아, 유럽 등) |
| searchStays | 숙소 검색 — 평점, 가격, 리뷰 포함 |
| getStayDetail | 숙소 상세 정보, 객실, 리뷰, 편의시설 조회 |
| searchTnas | 투어/액티비티 검색 |
| getTnaDetail | 투어/액티비티 상세 조회 |
| getTnaOptions | 투어/액티비티 옵션 조회 |
| getCategoryList | 카테고리 목록 조회 |
| getPromotionAirlines | 프로모션 항공사 조회 |
| getCurrentTime | 현재 시간 조회 |

### 연결 가이드

**Claude Code**:
```bash
claude mcp add --transport http myrealtrip https://mcp-servers.myrealtrip.com/mcp
```

**Cursor**: Settings → Tools & MCP → mcp.json에 추가:
```json
{
  "myrealtrip": {
    "url": "https://mcp-servers.myrealtrip.com/mcp"
  }
}
```

**Windsurf**: `~/.codeium/windsurf/mcp_config.json`에 추가

**OpenAI Codex CLI**:
```bash
codex mcp add myrealtrip --url https://mcp-servers.myrealtrip.com/mcp
```

**Google Gemini CLI**:
```bash
gemini mcp add -t http -s user myrealtrip https://mcp-servers.myrealtrip.com/mcp
```

**Cline**: Configure MCP Servers → 엔드포인트 추가

---

## FAQ 요약

- **개인 파트너 API 사용 가능?** — 가능. partner.myrealtrip.com 가입 후 marketing_partner@myrealtrip.com으로 권한 요청.
- **테스트 환경?** — 프로덕션만 제공. Try it 탭에서 cURL/Python/JS 코드 생성 가능.
- **API 키 분실?** — 재확인 불가. 파트너 페이지에서 재발급 (기존 키 즉시 만료).
- **401 에러?** — `Authorization: Bearer YOUR_API_KEY` 형식 확인. Bearer 누락, 공백/줄바꿈, 만료 키가 흔한 원인.
- **403 에러?** — API 키는 유효하나 접근 권한 없음. marketing_partner@myrealtrip.com 문의.
- **수익 데이터 정산 시간?** — 매일 오전 6시(KST) 일정산 완료. 전일까지만 조회 가능.
- **항공/비항공 수익 분리 이유?** — 정산 구조가 다름. 전체 수익 = `/v1/revenues` + `/v1/revenues/flight`.
- **commission 마이너스?** — 결제완료/환불완료가 건별 분리되어 전송.
- **예약 내역 조회 기간 제한?** — 비항공 최대 6개월, 항공 최대 1개월.
- **pageSize 에러?** — 예약 내역 최대 300. page 파라미터로 페이지네이션.
- **날짜 기준?** — 요청은 yyyy-MM-dd KST. 응답 중 reservedAt 등은 UTC, `*Kst` 접미사는 KST.
- **commissionBase vs salePrice?** — commissionBase = 쿠폰·포인트 차감 후 실결제금액. 2026-04-01 이후 예약건만 제공, 이전은 null → salePrice 사용.
- **regionId 모르면?** — keyword에 도시명만 입력해도 검색 가능.
- **숙소 가격 기준?** — minPrice/maxPrice, salePrice 모두 전체 숙박 기간 총액.
- **예약 상태 변동 알림?** — Webhook 미제공. 주기적으로 예약 내역 API 호출하여 status 모니터링.
- **reservationNo vs flightReservationNo?** — reservationNo = 마이리얼트립 내부, flightReservationNo = 항공사 PNR.
