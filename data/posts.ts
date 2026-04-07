import type { BlogPost } from "@/types";

export const posts: BlogPost[] = [
  {
    slug: "danang-bana-hills-complete-guide",
    courseId: "danang-bana-hills",
    title: {
      en: "Ba Na Hills Complete Guide — Golden Bridge, Cable Car & Tips",
      ko: "바나힐 완벽 가이드 — 골든 브릿지, 케이블카, 꿀팁 총정리",
    },
    excerpt: {
      en: "Everything you need to know before visiting Ba Na Hills: tickets, best time, what to wear, and how to avoid crowds.",
      ko: "바나힐 방문 전 알아야 할 모든 것: 티켓, 최적 시간, 복장, 인파 피하는 법.",
    },
    content: {
      en: `## Ba Na Hills — Is It Worth It?

Ba Na Hills is one of Da Nang's most popular attractions, and for good reason. The Golden Bridge alone draws thousands of visitors daily. But is it worth the trip? Here's my honest take after multiple visits.

### Getting There
- **From Da Nang**: 40-minute drive (grab a Grab for ~150,000 VND)
- **From Hoi An**: 1 hour drive

### Tickets
- **Adult**: 900,000 VND (~$36)
- **Children (1-1.4m)**: 750,000 VND
- Includes cable car, all attractions, Fantasy Park

### Best Time to Visit
- **Go early**: Gates open at 8:00 AM — arrive by 8:30 for crowd-free Golden Bridge photos
- **Avoid weekends** and Vietnamese holidays
- **Best months**: March-August (dry season)

### What to Wear
- Temperature at the top is 5-10°C cooler than Da Nang
- Bring a light jacket
- Comfortable walking shoes (lots of stairs)

### Must-Do
1. Golden Bridge (go first, before 10 AM)
2. Cable car ride (one of the world's longest)
3. French Village walk
4. Linh Ung Pagoda at the summit

### Skip
- Fantasy Park (unless you have kids)
- Wax museum (underwhelming)

### Pro Tips
- Buy tickets online for 10% discount
- Bring your own water and snacks (prices inside are 2-3x)
- The last cable car down is at 5:30 PM — don't miss it
`,
      ko: `## 바나힐 — 가볼 만한 곳인가?

바나힐은 다낭에서 가장 인기 있는 관광지 중 하나입니다. 골든 브릿지만으로도 매일 수천 명이 방문하죠. 여러 번 방문한 솔직한 후기를 공유합니다.

### 가는 방법
- **다낭에서**: 그랩으로 40분 (~15만 동)
- **호이안에서**: 1시간 소요

### 입장권
- **성인**: 90만 동 (~약 5만 원)
- **어린이 (1-1.4m)**: 75만 동
- 케이블카, 모든 어트랙션, 판타지 파크 포함

### 최적 방문 시간
- **일찍 가세요**: 오전 8시 오픈 — 8시 30분까지 도착하면 골든 브릿지 사진 여유있게
- **주말과 베트남 공휴일** 피하기
- **추천 시기**: 3-8월 (건기)

### 복장
- 산 위는 다낭보다 5-10도 서늘합니다
- 가벼운 자켓 필수
- 편한 운동화 (계단 많음)

### 꼭 해야 할 것
1. 골든 브릿지 (오전 10시 전에 먼저!)
2. 케이블카 (세계에서 가장 긴 케이블카 중 하나)
3. 프랑스 마을 산책
4. 정상 영응 사원

### 건너뛰어도 되는 것
- 판타지 파크 (아이가 없다면)
- 밀랍 박물관 (별로)

### 꿀팁
- 온라인 티켓 구매 시 10% 할인
- 물과 간식은 직접 가져가세요 (내부 가격 2-3배)
- 마지막 케이블카는 오후 5시 30분 — 놓치지 마세요
`,
    },
    city: "danang",
    coverGradient: "from-violet-500 to-purple-700",
    tags: ["guide", "must-read", "golden-bridge", "cable-car"],
    publishedAt: "2026-04-07",
  },
  {
    slug: "tokyo-shibuya-crossing-guide",
    courseId: "tokyo-shibuya-harajuku",
    title: {
      en: "Shibuya Crossing & Sky — The Ultimate Tokyo Experience",
      ko: "시부야 스크램블 & 스카이 — 도쿄 필수 코스 완벽 가이드",
    },
    excerpt: {
      en: "How to experience Shibuya Crossing like a local, plus Shibuya Sky tips.",
      ko: "시부야 스크램블을 현지인처럼 즐기는 법과 시부야 스카이 꿀팁.",
    },
    content: {
      en: `## Shibuya Crossing — More Than Just a Crosswalk

Coming soon. This post is being prepared.
`,
      ko: `## 시부야 스크램블 — 단순한 횡단보도 그 이상

준비 중인 포스트입니다.
`,
    },
    city: "tokyo",
    coverGradient: "from-pink-500 to-purple-600",
    tags: ["guide", "must-read", "shibuya", "sky"],
    publishedAt: "2026-04-07",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCourse(courseId: string): BlogPost[] {
  return posts.filter((p) => p.courseId === courseId);
}

export function getPostsByCity(city: string): BlogPost[] {
  return posts.filter((p) => p.city === city);
}
