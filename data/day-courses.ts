import type { DayCourse } from "@/types";

export const dayCourses: DayCourse[] = [
  // ════════════════════════════════════════════════════
  // DA NANG (4 courses)
  // ════════════════════════════════════════════════════
  {
    id: "danang-my-khe-beach",
    city: "danang",
    title: { en: "My Khe Beach & Sunset", ko: "미케 해변 & 선셋" },
    summary: { en: "A relaxed day walking My Khe Beach, sunset cocktails, and fresh seafood dinner.", ko: "미케 해변 산책, 선셋 칵테일, 신선한 해산물 디너." },
    styles: ["relaxed", "hotel-focused"],
    travelerTypes: ["couple", "solo", "family"],
    activities: [
      { time: "15:30", title: { en: "My Khe Beach walk", ko: "미케 해변 산책" }, description: { en: "Stroll along one of Asia's most beautiful beaches. The late afternoon light is perfect for photos.", ko: "아시아에서 가장 아름다운 해변 중 하나를 산책하세요." }, type: "beach", location: { lat: 16.0544, lng: 108.2472 } },
      { time: "18:00", title: { en: "Sunset cocktails by the beach", ko: "해변에서 선셋 칵테일" }, description: { en: "Pick any of the beachfront bars for a relaxed sunset drink together.", ko: "해변 바에서 둘이서 선셋을 즐기세요." }, type: "free", location: { lat: 16.0560, lng: 108.2480 } },
      { time: "19:30", title: { en: "Dinner at a local seafood restaurant", ko: "현지 해산물 레스토랑 저녁" }, description: { en: "Try fresh grilled fish and Vietnamese BBQ near the beach.", ko: "신선한 해산물 BBQ를 즐기세요." }, type: "dining", location: { lat: 16.0590, lng: 108.2465 } },
    ],
    center: { lat: 16.0565, lng: 108.2472 },
    tags: ["beach", "sunset", "seafood"],
    coverGradient: "from-cyan-500 to-blue-700",
  },
  {
    id: "danang-hoi-an-day",
    city: "danang",
    title: { en: "Hoi An Ancient Town Day Trip", ko: "호이안 구시가지 당일치기" },
    summary: { en: "Explore Hoi An's lantern-lit old town, Thu Bon River boat ride, and street food.", ko: "호이안 등불 구시가지 탐방, 뚜본 강 보트, 길거리 음식." },
    styles: ["relaxed", "efficient"],
    travelerTypes: ["couple", "solo", "friends"],
    activities: [
      { time: "09:00", title: { en: "Explore Hoi An Ancient Town", ko: "호이안 구시가지 탐방" }, description: { en: "Walk through the UNESCO World Heritage old town. Visit the Japanese Covered Bridge.", ko: "유네스코 세계유산 구시가지를 여유롭게 걸어보세요." }, type: "sightseeing", location: { lat: 15.8801, lng: 108.3380 } },
      { time: "12:00", title: { en: "Lunch at Morning Glory", ko: "모닝글로리에서 점심" }, description: { en: "One of Hoi An's iconic restaurants. Reserve ahead if possible.", ko: "호이안의 유명 레스토랑에서 점심을 즐기세요." }, type: "dining", location: { lat: 15.8775, lng: 108.3355 } },
      { time: "14:00", title: { en: "Boat ride on Thu Bon River", ko: "뚜본 강 보트 투어" }, description: { en: "45-minute river ride. Relaxing and scenic.", ko: "45분간 강에서 여유로운 보트 투어를 즐기세요." }, type: "tour", location: { lat: 15.8770, lng: 108.3370 } },
      { time: "17:00", title: { en: "Lantern-buying & evening stroll", ko: "랜턴 구경 & 저녁 산책" }, description: { en: "Buy a paper lantern as a souvenir. The old town glows at night.", ko: "종이 랜턴을 기념품으로 구입하고 야경을 즐기세요." }, type: "shopping", location: { lat: 15.8790, lng: 108.3360 } },
    ],
    center: { lat: 15.8784, lng: 108.3366 },
    tags: ["cultural", "river", "shopping", "UNESCO"],
    coverGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "danang-bana-hills",
    city: "danang",
    title: { en: "Ba Na Hills & Shopping", ko: "바나힐 & 쇼핑" },
    summary: {
      en: "Ride the cable car to Da Nang's main theme park! Take photos at the Golden Bridge, try craft beer at the brewery, enjoy a budget-friendly buffet lunch at Four Seasons, and end with shopping at Lotte Mart.",
      ko: "케이블카 타고 다낭 메인 테마파크 둘러보세요! 골든브릿지에서 사진도 찍고, 브루어리에서 수제 맥주도 마시고, 점심에는 포시즌스 뷔페에서 가성비 점심까지 포함. 저녁에는 롯데마트 가서 쇼핑까지 할 수 있어요!",
    },
    whyThisCourse: {
      en: "If you only visit spas and restaurants in Da Nang city, it gets repetitive. This course is for those who want to experience the city's most famous theme park — a must-visit attraction.",
      ko: "다낭 시내에서 스파랑 맛집만 돌아다니면 진부하고, 여행지에서 가장 유명한 메인 테마파크 하나는 꼭 가야 하는 분들에게 추천하는 코스",
    },
    courseType: [
      { en: "First-timer recommended", ko: "첫 여행자에게 추천" },
      { en: "Morning person friendly", ko: "아침형 인간 맞춤" },
      { en: "Local food spots", ko: "자타공인 맛집 코스" },
    ],
    styles: ["efficient", "activity-focused"],
    travelerTypes: ["couple", "family", "friends"],
    activities: [
      {
        time: "09:00", title: { en: "Travel to Ba Na Hills", ko: "바나힐 이동" },
        description: { en: "40-minute drive from the city center.", ko: "시내에서 이동 시간 40분." },
        tips: [
          { en: "Use Grab or book a pickup taxi in advance for convenience.", ko: "그랩을 이용하거나 미리 픽업 택시를 예약하면 편해요." },
        ],
        type: "transport", location: { lat: 15.9977, lng: 107.9942 },
      },
      {
        time: "10:00", title: { en: "Ba Na Hills Cable Car", ko: "바나힐 케이블카" },
        description: { en: "Ride the cable car for about 20 minutes up to 1,400m Ba Na Hills.", ko: "약 20분간 케이블카를 타고 높이 1,400m 바나힐까지 올라가 보세요." },
        tips: [
          { en: "Book tickets online for discounts.", ko: "바나힐 입장권 저렴하게 예약하기" },
        ],
        type: "sightseeing", location: { lat: 15.9977, lng: 107.9942 },
        photo: "/images/courses/danang-bana-cable-car.jpg",
        postSlug: "danang-bana-hills-complete-guide",
        bookingLinks: { klook: "https://www.klook.com/activity/1818-ba-na-hills-ticket-da-nang/" },
        duration: 20,
      },
      {
        time: "11:00", title: { en: "Golden Bridge / French Village", ko: "골든브릿지 / 프렌치빌리지" },
        description: { en: "The iconic Golden Bridge held by giant stone hands, and the French alpine village.", ko: "거대한 손 모양으로 된 암벽이 다리를 받치고 있는 골든브릿지." },
        tips: [
          { en: "The opposite side of the bridge entrance has fewer people — better photos!", ko: "처음 보이는 다리 입구보다 반대쪽이 사람이 없어서 사진이 잘 나와요." },
          { en: "Try the Alpine Coaster at French Village too.", ko: "프렌치 빌리지에서는 알파인코스터도 타 보세요." },
          { en: "Just follow this Ba Na Hills course as-is.", ko: "바나힐 코스는 이대로만 따라가세요." },
        ],
        type: "sightseeing", location: { lat: 15.9935, lng: 107.9885 },
        photo: "/images/courses/danang-golden-bridge.jpg",
        duration: 90,
      },
      {
        time: "12:30", title: { en: "Four Seasons Restaurant", ko: "포시즌스 레스토랑" },
        description: { en: "Great value buffet lunch included with ticket packages. Korean and Western menus available — everyone loves it.", ko: "입장권 예약할 때 가성비 좋은 점심 뷔페도 함께 이용해 보세요. 한식과 양식까지 메뉴가 다양해서 남녀 노소가 다 좋아하는 식당입니다." },
        type: "dining", location: { lat: 15.9955, lng: 107.9920 },
        duration: 60,
      },
      {
        time: "14:00", title: { en: "Craft Beer at Brewery", ko: "브루어리에서 수제맥주" },
        description: { en: "Enjoy a glass of craft beer. They sometimes have live performances too!", ko: "가끔씩 진행하는 공연도 있으니 놓치지 마시고 들렸다 가세요." },
        type: "free", location: { lat: 15.9950, lng: 107.9910 },
        duration: 60,
      },
      {
        time: "16:00", title: { en: "Return to city center", ko: "시내로 이동" },
        description: { en: "Head back to Da Nang city.", ko: "다낭 시내로 돌아갑니다." },
        type: "transport", location: { lat: 16.0544, lng: 108.2472 },
      },
      {
        time: "17:30", title: { en: "Som Moi Garden", ko: "썸모이가든" },
        description: { en: "Famous for bánh xèo and pho — a must-try local restaurant.", ko: "반쎄오, 쌀국수가 유명한 썸모이가든에서 저녁 드셔보세요!" },
        type: "dining", location: { lat: 16.0600, lng: 108.2280 },
        duration: 60,
      },
      {
        time: "19:00", title: { en: "Lotte Mart Shopping", ko: "롯데마트" },
        description: { en: "One-stop shop for Da Nang souvenirs — nuts, snacks, Vietnamese beer.", ko: "다낭 쇼핑리스트는 롯데마트에서 모두 해결. 견과류, 과자, 베트남 맥주를 주로 사 가고 있어요!" },
        type: "shopping", location: { lat: 16.0410, lng: 108.2180 },
        postSlug: "danang-lotte-mart-shopping-list",
        duration: 60,
      },
      {
        time: "20:00", title: { en: "Return to hotel", ko: "숙소 이동" },
        description: { en: "Head back to your accommodation.", ko: "숙소로 돌아갑니다." },
        type: "transport", location: { lat: 16.0544, lng: 108.2472 },
      },
    ],
    center: { lat: 16.0200, lng: 108.1200 },
    tags: ["theme-park", "cable-car", "golden-bridge", "shopping"],
    coverGradient: "from-violet-500 to-purple-700",
    costs: { food: 35000, activity: 60000, transport: 7500, etc: 10000, currency: "KRW" },
  },
  {
    id: "danang-marble-mountains",
    city: "danang",
    title: { en: "Marble Mountains & Lady Buddha", ko: "오행산 & 영응 사원" },
    summary: { en: "Morning at the Marble Mountains caves, then visit the Lady Buddha statue.", ko: "오행산 동굴 탐방 후 영응 사원의 해수관음상 방문." },
    styles: ["efficient", "activity-focused"],
    travelerTypes: ["couple", "solo", "friends"],
    activities: [
      { time: "08:00", title: { en: "Marble Mountains exploration", ko: "오행산 탐방" }, description: { en: "Climb stone steps, explore caves and pagodas with panoramic city views.", ko: "석조 계단을 오르고, 동굴과 탑을 둘러보며 시내 전경을 감상하세요." }, type: "sightseeing", location: { lat: 16.0040, lng: 108.2630 } },
      { time: "11:00", title: { en: "Lady Buddha at Linh Ung Pagoda", ko: "영응 사원 해수관음상" }, description: { en: "67m tall Lady Buddha statue on Son Tra Peninsula. Stunning coastal views.", ko: "선짜 반도 위 67m 해수관음상. 해안 경치가 장관입니다." }, type: "sightseeing", location: { lat: 16.1000, lng: 108.2777 } },
      { time: "13:00", title: { en: "Lunch at a local pho restaurant", ko: "현지 쌀국수 맛집 점심" }, description: { en: "Try Da Nang-style pho — lighter and more fragrant than Hanoi.", ko: "다낭 스타일 쌀국수를 맛보세요. 하노이보다 가볍고 향긋합니다." }, type: "dining", location: { lat: 16.0680, lng: 108.2210 } },
    ],
    center: { lat: 16.0573, lng: 108.2539 },
    tags: ["cultural", "temple", "hiking", "viewpoint"],
    coverGradient: "from-slate-500 to-slate-700",
  },

  // ════════════════════════════════════════════════════
  // BANGKOK (5 courses)
  // ════════════════════════════════════════════════════
  {
    id: "bangkok-grand-palace-riverside",
    city: "bangkok",
    title: { en: "Grand Palace & Riverside", ko: "왕궁 & 짜오프라야강" },
    summary: { en: "Bangkok's iconic core: Grand Palace, Wat Arun, and riverside food stalls.", ko: "방콕 핵심: 왕궁, 왓 아룬, 강변 노점." },
    styles: ["efficient", "relaxed"],
    travelerTypes: ["couple", "solo", "family", "friends"],
    activities: [
      { time: "09:00", title: { en: "Grand Palace & Wat Phra Kaew", ko: "왕궁 & 에메랄드 사원" }, description: { en: "Arrive early before the crowds. 2 hours. Dress code required.", ko: "혼잡 전 일찍 도착하세요. 복장 규정 필수." }, type: "sightseeing", location: { lat: 13.7500, lng: 100.4914 } },
      { time: "11:30", title: { en: "Wat Arun (Temple of Dawn)", ko: "왓 아룬 (새벽의 사원)" }, description: { en: "Short boat ride across the river. Stunning ceramic mosaic towers.", ko: "강 건너 도착. 화려한 도자기 타일 사원." }, type: "sightseeing", location: { lat: 13.7437, lng: 100.4888 } },
      { time: "13:00", title: { en: "Lunch at Tha Tien Market", ko: "타띠안 시장에서 점심" }, description: { en: "Local riverside food stalls. Try pad kra pao and mango sticky rice.", ko: "현지 강변 노점에서 팟끄라파오와 망고 찰밥을 드세요." }, type: "dining", location: { lat: 13.7460, lng: 100.4930 } },
      { time: "16:00", title: { en: "Chao Phraya evening cruise", ko: "짜오프라야강 선셋 크루즈" }, description: { en: "1-hour dinner cruise or hop-on hop-off river boat.", ko: "1시간 저녁 크루즈 또는 수상버스를 이용하세요." }, type: "tour", location: { lat: 13.7400, lng: 100.4900 } },
    ],
    center: { lat: 13.7449, lng: 100.4908 },
    tags: ["temples", "cultural", "iconic", "riverside"],
    coverGradient: "from-amber-500 to-orange-700",
  },
  {
    id: "bangkok-chatuchak-ari",
    city: "bangkok",
    title: { en: "Chatuchak Market & Ari", ko: "짜뚜짝 시장 & 아리" },
    summary: { en: "World's largest weekend market, then hipster cafes in Ari neighborhood.", ko: "세계 최대 주말 시장, 아리 동네 힙한 카페." },
    styles: ["efficient", "activity-focused"],
    travelerTypes: ["solo", "friends"],
    activities: [
      { time: "09:00", title: { en: "Chatuchak Weekend Market", ko: "짜뚜짝 주말 시장" }, description: { en: "15,000 stalls. Go before noon for the best experience.", ko: "세계 최대 규모 주말 시장. 오전에 방문하세요." }, type: "shopping", location: { lat: 13.7999, lng: 100.5500 } },
      { time: "13:00", title: { en: "Lunch near JJ Market", ko: "짜뚜짝 근처 점심" }, description: { en: "Plenty of Thai and international food stalls around the market.", ko: "시장 주변에 다양한 식당이 있습니다." }, type: "dining", location: { lat: 13.8010, lng: 100.5510 } },
      { time: "15:00", title: { en: "Ari neighborhood cafes", ko: "아리 동네 카페" }, description: { en: "Bangkok's hipster neighborhood. Great coffee and local boutiques.", ko: "방콕의 힙한 동네. 개성 있는 카페와 부티크 상점들." }, type: "free", location: { lat: 13.7900, lng: 100.5450 } },
      { time: "19:00", title: { en: "Rooftop bar experience", ko: "루프탑 바 경험" }, description: { en: "Head to Vertigo & Moon Bar or Octave Rooftop for skyline views.", ko: "버티고 바 또는 옥타브 루프탑에서 방콕 야경을 감상하세요." }, type: "free", location: { lat: 13.7250, lng: 100.5680 } },
    ],
    center: { lat: 13.7790, lng: 100.5535 },
    tags: ["markets", "shopping", "cafes", "nightlife"],
    coverGradient: "from-pink-500 to-rose-700",
  },
  {
    id: "bangkok-chinatown-silom",
    city: "bangkok",
    title: { en: "Chinatown & Silom", ko: "차이나타운 & 실롬" },
    summary: { en: "Wat Pho, Chinatown dim sum, gold shops, and Yaowarat night street food.", ko: "왓 포, 차이나타운 딤섬, 금 상점, 야와랏 야간 길거리 음식." },
    styles: ["efficient"],
    travelerTypes: ["solo", "friends"],
    activities: [
      { time: "10:00", title: { en: "Wat Pho (Reclining Buddha)", ko: "왓 포 (와불 사원)" }, description: { en: "46-meter gold reclining Buddha. One of the best temple experiences.", ko: "46미터 황금 와불 사원. 방콕 최고의 사원 중 하나." }, type: "sightseeing", location: { lat: 13.7463, lng: 100.4928 } },
      { time: "12:00", title: { en: "Chinatown lunch", ko: "차이나타운 점심" }, description: { en: "Dim sum, roast duck, and street noodles.", ko: "딤섬, 오리구이, 길거리 국수." }, type: "dining", location: { lat: 13.7400, lng: 100.5090 } },
      { time: "14:30", title: { en: "Explore Yaowarat", ko: "야와랏 탐방" }, description: { en: "Gold shops, herb markets, shrines hidden in alleys.", ko: "금 상점, 약재 시장, 골목 사원들." }, type: "sightseeing", location: { lat: 13.7390, lng: 100.5100 } },
      { time: "20:00", title: { en: "Yaowarat night street food", ko: "야와랏 야간 길거리 음식" }, description: { en: "Come back after dark for seafood, durian, and lobster.", ko: "밤에 돌아와 해산물, 두리안, 랍스터를 즐기세요." }, type: "dining", location: { lat: 13.7385, lng: 100.5105 } },
    ],
    center: { lat: 13.7410, lng: 100.5056 },
    tags: ["street-food", "temples", "chinatown", "night-market"],
    coverGradient: "from-red-500 to-orange-600",
  },
  {
    id: "bangkok-ayutthaya",
    city: "bangkok",
    title: { en: "Ayutthaya Day Trip", ko: "아유타야 당일 여행" },
    summary: { en: "Ancient temple ruins 1 hour from Bangkok. Rent a bicycle and explore.", ko: "방콕에서 1시간, 자전거로 고대 사원 유적 탐방." },
    styles: ["activity-focused", "efficient"],
    travelerTypes: ["solo", "couple", "friends"],
    activities: [
      { time: "07:30", title: { en: "Train to Ayutthaya", ko: "아유타야행 기차" }, description: { en: "1.5-hour train. Cheap and scenic.", ko: "1시간 30분 기차 이동. 저렴하고 경관이 아름답습니다." }, type: "transport", location: { lat: 13.7380, lng: 100.5170 } },
      { time: "09:30", title: { en: "Ayutthaya Historical Park", ko: "아유타야 역사 공원" }, description: { en: "Rent a bicycle and explore the ancient temple ruins.", ko: "자전거를 빌려 고대 사원 유적을 탐방하세요." }, type: "sightseeing", location: { lat: 14.3560, lng: 100.5690 } },
      { time: "13:00", title: { en: "Lunch — boat noodles", ko: "점심 — 보트 누들" }, description: { en: "The region is famous for boat noodles.", ko: "아유타야 명물 보트 누들을 꼭 드세요." }, type: "dining", location: { lat: 14.3530, lng: 100.5700 } },
      { time: "16:00", title: { en: "Return to Bangkok", ko: "방콕으로 귀환" }, description: { en: "Train or minivan back.", ko: "기차나 미니밴으로 귀환." }, type: "transport", location: { lat: 14.3500, lng: 100.5720 } },
    ],
    center: { lat: 14.3548, lng: 100.5700 },
    tags: ["ruins", "cycling", "history", "day-trip"],
    coverGradient: "from-yellow-500 to-amber-700",
  },
  {
    id: "bangkok-khao-san-nightlife",
    city: "bangkok",
    title: { en: "Khao San Road & Nightlife", ko: "카오산 로드 & 나이트라이프" },
    summary: { en: "Backpacker street by day, Silom nightlife by night.", ko: "낮에는 배낭여행자 거리, 밤에는 실롬 나이트라이프." },
    styles: ["relaxed", "activity-focused"],
    travelerTypes: ["solo", "friends"],
    activities: [
      { time: "10:00", title: { en: "Khao San Road breakfast & walk", ko: "카오산 로드 아침 & 산책" }, description: { en: "Famous backpacker street — quieter and more authentic in the morning.", ko: "유명한 배낭여행자 거리를 오전에 여유있게 구경하세요." }, type: "sightseeing", location: { lat: 13.7589, lng: 100.4973 } },
      { time: "12:00", title: { en: "Thai massage on Khao San", ko: "카오산 타이 마사지" }, description: { en: "Affordable 1-hour Thai massage at any of the street parlors.", ko: "거리 마사지 샵에서 저렴한 1시간 타이 마사지." }, type: "free", location: { lat: 13.7585, lng: 100.4978 } },
      { time: "15:00", title: { en: "Canal boat to Siam", ko: "운하 보트로 시암 이동" }, description: { en: "Take the Saen Saep canal boat — fast and local.", ko: "쌘쌥 운하 보트 — 빠르고 로컬 느낌." }, type: "transport", location: { lat: 13.7540, lng: 100.5010 } },
      { time: "21:00", title: { en: "Silom nightlife", ko: "실롬 나이트라이프" }, description: { en: "Bars, clubs, and night markets on Silom and Patpong.", ko: "실롬과 팟퐁의 바, 클럽, 야시장." }, type: "free", location: { lat: 13.7280, lng: 100.5350 } },
    ],
    center: { lat: 13.7499, lng: 100.5078 },
    tags: ["nightlife", "backpacker", "massage", "bars"],
    coverGradient: "from-indigo-500 to-purple-700",
  },

  // ════════════════════════════════════════════════════
  // BALI (6 courses)
  // ════════════════════════════════════════════════════
  {
    id: "bali-seminyak-sunset",
    city: "bali",
    title: { en: "Seminyak Beach & Sunset", ko: "스미냑 해변 & 선셋" },
    summary: { en: "Beach walk, Bali's iconic sunset, and dinner at top restaurants.", ko: "해변 산책, 발리 선셋, 최고 레스토랑에서 저녁." },
    styles: ["relaxed", "hotel-focused"],
    travelerTypes: ["couple", "friends"],
    activities: [
      { time: "16:00", title: { en: "Seminyak Beach sunset", ko: "스미냑 해변 선셋" }, description: { en: "Walk to the beach for the iconic Bali sunset.", ko: "상징적인 발리 선셋을 보러 해변으로 가세요." }, type: "beach", location: { lat: -8.6914, lng: 115.1566 } },
      { time: "19:00", title: { en: "Dinner at Merah Putih", ko: "메라 푸티에서 저녁" }, description: { en: "One of Bali's best restaurants for a special dinner.", ko: "발리 최고 레스토랑에서 특별한 저녁." }, type: "dining", location: { lat: -8.6840, lng: 115.1620 } },
    ],
    center: { lat: -8.6877, lng: 115.1593 },
    tags: ["beach", "sunset", "dining", "romantic"],
    coverGradient: "from-orange-400 to-pink-600",
  },
  {
    id: "bali-surf-canggu",
    city: "bali",
    title: { en: "Surf Lesson & Canggu", ko: "서핑 레슨 & 창구" },
    summary: { en: "Catch your first waves at Kuta, then explore Canggu's hip cafes.", ko: "쿠타에서 첫 서핑, 창구 힙한 카페 탐방." },
    styles: ["activity-focused"],
    travelerTypes: ["couple", "solo", "friends"],
    activities: [
      { time: "07:00", title: { en: "Surf lesson at Kuta Beach", ko: "쿠타 해변 서핑 레슨" }, description: { en: "2-hour beginner surf lesson with certified instructor.", ko: "공인 강사와 함께하는 2시간 서핑 레슨." }, type: "tour", location: { lat: -8.7180, lng: 115.1690 } },
      { time: "10:00", title: { en: "Canggu breakfast", ko: "창구 아침 식사" }, description: { en: "Smoothie bowls and avocado toast at a Canggu cafe.", ko: "창구 카페에서 스무디 볼과 아보카도 토스트." }, type: "dining", location: { lat: -8.6478, lng: 115.1385 } },
      { time: "14:00", title: { en: "Canggu neighborhood explore", ko: "창구 동네 탐방" }, description: { en: "Browse vintage shops, local art galleries, and surf stores.", ko: "빈티지 숍, 로컬 갤러리, 서핑 상점을 둘러보세요." }, type: "free", location: { lat: -8.6490, lng: 115.1370 } },
      { time: "19:00", title: { en: "Dinner at The Lawn", ko: "더 론에서 저녁" }, description: { en: "Beachside restaurant with ocean views and great cocktails.", ko: "칵테일과 오션뷰를 즐길 수 있는 해변 레스토랑." }, type: "dining", location: { lat: -8.6520, lng: 115.1340 } },
    ],
    center: { lat: -8.6667, lng: 115.1446 },
    tags: ["surfing", "cafes", "canggu", "active"],
    coverGradient: "from-cyan-400 to-blue-600",
  },
  {
    id: "bali-ubud-rice-waterfall",
    city: "bali",
    title: { en: "Ubud Rice Terraces & Waterfalls", ko: "우붓 논 & 폭포" },
    summary: { en: "Tegallalang rice terraces, Kanto Lampo waterfall, and Campuhan ridge walk.", ko: "떼갈랄랑 논, 칸토 람포 폭포, 캄푸한 리지 트레킹." },
    styles: ["activity-focused", "relaxed"],
    travelerTypes: ["couple", "solo", "friends"],
    activities: [
      { time: "09:00", title: { en: "Tegallalang Rice Terraces", ko: "떼갈랄랑 논 계단식 논" }, description: { en: "Walk through the iconic UNESCO rice terraces.", ko: "유네스코 논 계단식 논을 걸어보세요." }, type: "sightseeing", location: { lat: -8.4312, lng: 115.2793 } },
      { time: "14:00", title: { en: "Kanto Lampo Waterfall", ko: "칸토 람포 폭포" }, description: { en: "One of Bali's most photogenic waterfalls. Bring swimwear.", ko: "수영복을 꼭 챙기세요." }, type: "tour", location: { lat: -8.4850, lng: 115.3340 } },
      { time: "17:00", title: { en: "Campuhan Ridge Walk sunset", ko: "캄푸한 리지 선셋 트레킹" }, description: { en: "Gentle 2km ridge walk with panoramic valley views.", ko: "파노라마 계곡 전망의 2km 리지 트레킹." }, type: "free", location: { lat: -8.5020, lng: 115.2520 } },
    ],
    center: { lat: -8.4727, lng: 115.2884 },
    tags: ["nature", "rice-terraces", "waterfall", "trekking"],
    coverGradient: "from-emerald-500 to-teal-700",
  },
  {
    id: "bali-mount-batur",
    city: "bali",
    title: { en: "Mount Batur Sunrise Hike", ko: "바투르 산 선라이즈 하이킹" },
    summary: { en: "Pre-dawn hike to an active volcano summit, breakfast at the top, hot spring recovery.", ko: "새벽 활화산 하이킹, 정상 아침 식사, 온천 회복." },
    styles: ["activity-focused"],
    travelerTypes: ["couple", "solo", "friends"],
    activities: [
      { time: "03:30", title: { en: "Pre-dawn pickup", ko: "새벽 출발" }, description: { en: "Guide picks you up at 3:30am.", ko: "가이드가 새벽 3시 30분에 픽업합니다." }, type: "transport", location: { lat: -8.5069, lng: 115.2625 } },
      { time: "05:00", title: { en: "Summit sunrise", ko: "정상 선라이즈" }, description: { en: "1,717m active volcano. 2-hour guided hike. Breakfast at the top.", ko: "1717m 활화산. 2시간 가이드 하이킹. 정상에서 아침 식사." }, type: "tour", location: { lat: -8.2420, lng: 115.3750 } },
      { time: "09:00", title: { en: "Hot spring recovery", ko: "온천 회복" }, description: { en: "Natural volcanic hot springs at the base.", ko: "바투르 산 아래 천연 온천." }, type: "free", location: { lat: -8.2600, lng: 115.3900 } },
    ],
    center: { lat: -8.3363, lng: 115.3425 },
    tags: ["volcano", "hiking", "sunrise", "hot-spring"],
    coverGradient: "from-orange-500 to-red-700",
  },
  {
    id: "bali-ubud-culture",
    city: "bali",
    title: { en: "Ubud Art & Kecak Dance", ko: "우붓 예술 & 케착 댄스" },
    summary: { en: "Art galleries, Ubud Palace, monkey forest, and traditional Kecak dance at sunset.", ko: "갤러리, 우붓 왕궁, 몽키 포레스트, 선셋 케착 댄스 공연." },
    styles: ["relaxed", "efficient"],
    travelerTypes: ["couple", "solo", "family"],
    activities: [
      { time: "09:00", title: { en: "Ubud Art Market", ko: "우붓 아트 마켓" }, description: { en: "Browse handmade crafts, paintings, and textiles.", ko: "수공예품, 그림, 직물을 구경하세요." }, type: "shopping", location: { lat: -8.5069, lng: 115.2625 } },
      { time: "11:00", title: { en: "Sacred Monkey Forest", ko: "몽키 포레스트" }, description: { en: "Walk through lush jungle with playful macaques. Keep belongings secure.", ko: "장난기 넘치는 원숭이들이 사는 울창한 정글 산책." }, type: "sightseeing", location: { lat: -8.5185, lng: 115.2588 } },
      { time: "14:00", title: { en: "Lunch at Clear Cafe", ko: "클리어 카페에서 점심" }, description: { en: "Iconic healthy-food cafe in the heart of Ubud.", ko: "우붓 중심의 상징적인 건강식 카페." }, type: "dining", location: { lat: -8.5060, lng: 115.2630 } },
      { time: "18:00", title: { en: "Kecak dance at Ubud Palace", ko: "우붓 왕궁 케착 댄스" }, description: { en: "Traditional fire dance performance at sunset.", ko: "일몰 시간 전통 불춤 공연." }, type: "tour", location: { lat: -8.5063, lng: 115.2625 } },
    ],
    center: { lat: -8.5094, lng: 115.2617 },
    tags: ["cultural", "art", "dance", "monkeys"],
    coverGradient: "from-amber-400 to-yellow-600",
  },
  {
    id: "bali-uluwatu-cliffs",
    city: "bali",
    title: { en: "Uluwatu Cliffs & Sunset", ko: "울루와뚜 절벽 & 선셋" },
    summary: { en: "Clifftop temple, surf beaches, and sunset dinner at Single Fin.", ko: "절벽 사원, 서핑 해변, 싱글 핀에서 선셋 디너." },
    styles: ["activity-focused", "relaxed"],
    travelerTypes: ["couple", "friends"],
    activities: [
      { time: "12:00", title: { en: "Uluwatu Temple", ko: "울루와뚜 사원" }, description: { en: "Cliffside Hindu temple 70m above the Indian Ocean.", ko: "인도양 위 70m 절벽의 힌두 사원." }, type: "sightseeing", location: { lat: -8.8292, lng: 115.0849 } },
      { time: "14:00", title: { en: "Padang Padang Beach", ko: "빠당빠당 해변" }, description: { en: "One of Bali's best surf beaches. Watch pro surfers or take a dip.", ko: "발리 최고의 서핑 해변." }, type: "beach", location: { lat: -8.8130, lng: 115.0990 } },
      { time: "18:00", title: { en: "Sunset dinner at Single Fin", ko: "싱글 핀에서 선셋 디너" }, description: { en: "Clifftop bar overlooking a world-class surf break.", ko: "세계적 서핑 포인트를 내려다보는 절벽 레스토랑." }, type: "dining", location: { lat: -8.8100, lng: 115.1010 } },
    ],
    center: { lat: -8.8174, lng: 115.0950 },
    tags: ["cliffs", "temple", "sunset", "surfing"],
    coverGradient: "from-teal-500 to-emerald-700",
  },

  // ════════════════════════════════════════════════════
  // NHA TRANG (5 courses)
  // ════════════════════════════════════════════════════
  { id: "nhatrang-beach-island", city: "nhatrang", title: { en: "Beach Day & Island Hopping", ko: "해변 & 섬 투어" }, summary: { en: "Relax on Nha Trang Beach, then hop to nearby islands by speedboat.", ko: "나트랑 해변에서 휴식 후 스피드보트로 인근 섬 투어." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "08:00", title: { en: "Nha Trang Beach morning swim", ko: "나트랑 해변 아침 수영" }, description: { en: "Calm morning waters perfect for swimming.", ko: "아침 잔잔한 바다에서 수영." }, type: "beach", location: { lat: 12.2451, lng: 109.1943 } },
    { time: "10:00", title: { en: "Island hopping tour", ko: "섬 투어" }, description: { en: "Visit Mun Island, Mot Island — snorkeling included.", ko: "문 섬, 못 섬 방문. 스노클링 포함." }, type: "tour", location: { lat: 12.1700, lng: 109.2300 } },
    { time: "15:00", title: { en: "Seafood lunch on the island", ko: "섬에서 해산물 점심" }, description: { en: "Fresh grilled seafood at a beachfront restaurant.", ko: "해변 레스토랑에서 신선한 해산물 구이." }, type: "dining", location: { lat: 12.1750, lng: 109.2280 } },
  ], center: { lat: 12.1967, lng: 109.2174 }, tags: ["beach", "island", "snorkeling"], coverGradient: "from-cyan-400 to-blue-600" },

  { id: "nhatrang-vinpearl", city: "nhatrang", title: { en: "VinWonders Theme Park", ko: "빈원더스 테마파크" }, summary: { en: "Full day at Vietnam's largest amusement park on Hon Tre Island.", ko: "혼째 섬의 베트남 최대 놀이공원 종일 코스." }, styles: ["activity-focused"], travelerTypes: ["family", "couple", "friends"], activities: [
    { time: "09:00", title: { en: "Cable car to VinWonders", ko: "빈원더스 케이블카" }, description: { en: "3km cable car over the ocean to Hon Tre Island.", ko: "바다 위 3km 케이블카로 혼째 섬 이동." }, type: "transport", location: { lat: 12.2200, lng: 109.2100 } },
    { time: "10:00", title: { en: "Water park & rides", ko: "워터파크 & 놀이기구" }, description: { en: "Slides, wave pool, roller coasters — full day of fun.", ko: "슬라이드, 파도풀, 롤러코스터." }, type: "tour", location: { lat: 12.2100, lng: 109.2400 } },
    { time: "17:00", title: { en: "Sunset from cable car", ko: "케이블카에서 선셋" }, description: { en: "Return ride with stunning sunset views.", ko: "선셋을 보며 돌아오는 케이블카." }, type: "sightseeing", location: { lat: 12.2200, lng: 109.2100 } },
  ], center: { lat: 12.2167, lng: 109.2200 }, tags: ["theme-park", "cable-car", "family"], coverGradient: "from-pink-400 to-rose-600" },

  { id: "nhatrang-mud-bath", city: "nhatrang", title: { en: "Mud Bath & Hot Springs", ko: "머드 배스 & 온천" }, summary: { en: "Mineral mud baths, hot springs, and waterfall pools at Thap Ba.", ko: "탑바에서 머드 배스, 온천, 폭포 풀 체험." }, styles: ["relaxed", "hotel-focused"], travelerTypes: ["couple", "solo"], activities: [
    { time: "09:00", title: { en: "Thap Ba mud bath", ko: "탑바 머드 배스" }, description: { en: "Soak in warm mineral mud — great for skin.", ko: "따뜻한 미네랄 머드에 몸을 담그세요." }, type: "tour", location: { lat: 12.2650, lng: 109.1870 } },
    { time: "11:00", title: { en: "Hot spring pools", ko: "온천 풀" }, description: { en: "Multiple temperature pools surrounded by gardens.", ko: "정원에 둘러싸인 다양한 온도의 풀." }, type: "free", location: { lat: 12.2660, lng: 109.1880 } },
    { time: "14:00", title: { en: "Vietnamese coffee & rest", ko: "베트남 커피 & 휴식" }, description: { en: "Ca phe sua da at a local cafe.", ko: "현지 카페에서 까페쓰어다." }, type: "dining", location: { lat: 12.2450, lng: 109.1950 } },
  ], center: { lat: 12.2587, lng: 109.1900 }, tags: ["spa", "wellness", "mud-bath"], coverGradient: "from-amber-400 to-orange-500" },

  { id: "nhatrang-po-nagar-night", city: "nhatrang", title: { en: "Po Nagar Towers & Night Market", ko: "포나가르 사원 & 야시장" }, summary: { en: "Ancient Cham towers, then Nha Trang's vibrant night market.", ko: "고대 참 사원 탐방 후 활기찬 야시장 구경." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "15:00", title: { en: "Po Nagar Cham Towers", ko: "포나가르 참 사원" }, description: { en: "8th-century Hindu temple complex on a hill.", ko: "8세기 힌두 사원 단지." }, type: "sightseeing", location: { lat: 12.2655, lng: 109.1960 } },
    { time: "17:00", title: { en: "Nha Trang Cathedral", ko: "나트랑 대성당" }, description: { en: "French Gothic cathedral on a hilltop.", ko: "언덕 위 프랑스 고딕 성당." }, type: "sightseeing", location: { lat: 12.2480, lng: 109.1850 } },
    { time: "19:00", title: { en: "Night market street food", ko: "야시장 길거리 음식" }, description: { en: "Grilled squid, banh xeo, and local beer.", ko: "오징어 구이, 반쎄오, 현지 맥주." }, type: "dining", location: { lat: 12.2430, lng: 109.1910 } },
  ], center: { lat: 12.2522, lng: 109.1907 }, tags: ["cultural", "night-market", "temple"], coverGradient: "from-violet-500 to-purple-600" },

  { id: "nhatrang-diving", city: "nhatrang", title: { en: "Scuba Diving Adventure", ko: "스쿠버 다이빙 체험" }, summary: { en: "Beginner-friendly diving at Hon Mun marine reserve.", ko: "혼문 해양보호구역에서 초보자 다이빙." }, styles: ["activity-focused"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "07:30", title: { en: "Dive briefing & boat", ko: "다이빙 브리핑 & 보트" }, description: { en: "Morning briefing then boat to dive site.", ko: "오전 브리핑 후 다이빙 포인트로 보트 이동." }, type: "tour", location: { lat: 12.2350, lng: 109.2000 } },
    { time: "09:00", title: { en: "Two dives at Hon Mun", ko: "혼문에서 2회 다이빙" }, description: { en: "See coral reefs, tropical fish. Equipment provided.", ko: "산호초와 열대어 관찰. 장비 제공." }, type: "tour", location: { lat: 12.1680, lng: 109.2350 } },
    { time: "13:00", title: { en: "Boat lunch & return", ko: "보트 점심 & 귀환" }, description: { en: "Lunch on the boat, back to Nha Trang by 2pm.", ko: "보트에서 점심 후 오후 2시 귀환." }, type: "dining", location: { lat: 12.1700, lng: 109.2300 } },
  ], center: { lat: 12.1910, lng: 109.2217 }, tags: ["diving", "marine", "adventure"], coverGradient: "from-blue-500 to-indigo-700" },

  // ════════════════════════════════════════════════════
  // HANOI (5 courses)
  // ════════════════════════════════════════════════════
  { id: "hanoi-old-quarter", city: "hanoi", title: { en: "Old Quarter & Hoan Kiem Lake", ko: "구시가지 & 호안끼엠 호수" }, summary: { en: "Walk the 36 streets, visit the lake temple, and eat pho.", ko: "36거리 산책, 호수 사원 방문, 쌀국수." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "08:00", title: { en: "Pho breakfast at Pho Gia Truyen", ko: "포 자 트루옌에서 아침 쌀국수" }, description: { en: "Hanoi's most famous pho shop. Arrive early.", ko: "하노이에서 가장 유명한 쌀국수 맛집." }, type: "dining", location: { lat: 21.0355, lng: 105.8530 } },
    { time: "09:30", title: { en: "Old Quarter walking tour", ko: "구시가지 도보 투어" }, description: { en: "Explore the historic 36 streets — each named after its trade.", ko: "각 거리가 거래 품목으로 이름 붙은 36거리 탐방." }, type: "sightseeing", location: { lat: 21.0340, lng: 105.8510 } },
    { time: "12:00", title: { en: "Hoan Kiem Lake & Ngoc Son Temple", ko: "호안끼엠 호수 & 옥산 사원" }, description: { en: "Red bridge to the island temple in the lake.", ko: "호수 위 섬 사원으로 이어지는 빨간 다리." }, type: "sightseeing", location: { lat: 21.0288, lng: 105.8525 } },
    { time: "14:00", title: { en: "Egg coffee at Cafe Giang", ko: "카페 장에서 에그 커피" }, description: { en: "Hanoi's iconic egg coffee — creamy and unique.", ko: "하노이의 상징적인 에그 커피." }, type: "dining", location: { lat: 21.0335, lng: 105.8520 } },
  ], center: { lat: 21.0330, lng: 105.8521 }, tags: ["old-quarter", "cultural", "food"], coverGradient: "from-yellow-500 to-amber-600" },

  { id: "hanoi-ho-chi-minh-mausoleum", city: "hanoi", title: { en: "Ho Chi Minh Complex & Temple of Literature", ko: "호치민 묘소 & 문묘" }, summary: { en: "Vietnam's political heart and the country's first university.", ko: "베트남 정치의 중심과 최초의 대학." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "08:00", title: { en: "Ho Chi Minh Mausoleum", ko: "호치민 묘소" }, description: { en: "Open mornings only. Queue can be long — arrive by 7:30.", ko: "오전에만 개방. 줄이 길 수 있어 7:30까지 도착하세요." }, type: "sightseeing", location: { lat: 21.0369, lng: 105.8345 } },
    { time: "10:00", title: { en: "One Pillar Pagoda", ko: "일주사" }, description: { en: "Tiny pagoda on a single stone pillar — iconic symbol.", ko: "하나의 돌 기둥 위 작은 탑 — 상징적 건축물." }, type: "sightseeing", location: { lat: 21.0360, lng: 105.8340 } },
    { time: "11:30", title: { en: "Temple of Literature", ko: "문묘" }, description: { en: "Vietnam's first university (1070). Beautiful traditional architecture.", ko: "베트남 최초 대학(1070년). 전통 건축의 아름다움." }, type: "sightseeing", location: { lat: 21.0275, lng: 105.8355 } },
    { time: "13:30", title: { en: "Bun cha lunch", ko: "분짜 점심" }, description: { en: "Hanoi's other iconic dish — grilled pork with noodles.", ko: "하노이의 또 다른 명물 — 구운 돼지고기와 국수." }, type: "dining", location: { lat: 21.0300, lng: 105.8400 } },
  ], center: { lat: 21.0326, lng: 105.8360 }, tags: ["history", "cultural", "political"], coverGradient: "from-red-500 to-rose-700" },

  { id: "hanoi-west-lake", city: "hanoi", title: { en: "West Lake & Tay Ho Cafes", ko: "서호 & 떠이호 카페" }, summary: { en: "Cycle around Hanoi's largest lake, visit Tran Quoc Pagoda.", ko: "하노이 최대 호수 자전거, 쩐꾸옥 사원 방문." }, styles: ["relaxed"], travelerTypes: ["couple", "solo"], activities: [
    { time: "09:00", title: { en: "Cycle around West Lake", ko: "서호 자전거" }, description: { en: "17km lakeside cycling path. Rent a bike nearby.", ko: "17km 호수 자전거 도로. 근처에서 자전거 대여." }, type: "free", location: { lat: 21.0580, lng: 105.8230 } },
    { time: "11:00", title: { en: "Tran Quoc Pagoda", ko: "쩐꾸옥 사원" }, description: { en: "Hanoi's oldest pagoda (6th century) on a tiny lake island.", ko: "하노이에서 가장 오래된 사원(6세기)." }, type: "sightseeing", location: { lat: 21.0480, lng: 105.8360 } },
    { time: "13:00", title: { en: "Lakeside cafe lunch", ko: "호수 카페 점심" }, description: { en: "Trendy cafes along the eastern shore of West Lake.", ko: "서호 동쪽 해안의 트렌디한 카페." }, type: "dining", location: { lat: 21.0550, lng: 105.8350 } },
  ], center: { lat: 21.0537, lng: 105.8313 }, tags: ["lake", "cycling", "pagoda", "cafe"], coverGradient: "from-emerald-400 to-teal-600" },

  { id: "hanoi-street-food-night", city: "hanoi", title: { en: "Hanoi Street Food Evening", ko: "하노이 길거리 음식 저녁" }, summary: { en: "Evening food crawl through the best street food stalls.", ko: "최고의 길거리 음식 노점을 돌아보는 저녁." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "17:00", title: { en: "Banh mi & beer corner", ko: "반미 & 맥주 코너" }, description: { en: "Start with Vietnam's famous sandwich and bia hoi (draft beer).", ko: "베트남 유명 샌드위치와 비아 호이(생맥주)로 시작." }, type: "dining", location: { lat: 21.0340, lng: 105.8500 } },
    { time: "18:30", title: { en: "Bun bo Nam Bo", ko: "분보남보" }, description: { en: "Dry noodle salad with beef — unique to Hanoi.", ko: "소고기 비빔 국수 — 하노이 특유의 요리." }, type: "dining", location: { lat: 21.0330, lng: 105.8530 } },
    { time: "20:00", title: { en: "Night market walk", ko: "야시장 산책" }, description: { en: "Friday-Sunday night market in the Old Quarter.", ko: "금~일 구시가지 야시장." }, type: "shopping", location: { lat: 21.0350, lng: 105.8520 } },
    { time: "21:00", title: { en: "Water puppet show", ko: "수상 인형극" }, description: { en: "Traditional Vietnamese water puppetry at Thang Long Theatre.", ko: "탕롱 극장에서 전통 수상 인형극." }, type: "tour", location: { lat: 21.0295, lng: 105.8535 } },
  ], center: { lat: 21.0329, lng: 105.8521 }, tags: ["street-food", "night-market", "culture"], coverGradient: "from-orange-500 to-red-600" },

  { id: "hanoi-ninh-binh-daytrip", city: "hanoi", title: { en: "Ninh Binh Day Trip", ko: "닌빈 당일 여행" }, summary: { en: "Boat through Tam Coc's rice paddies and limestone karsts.", ko: "땀꼭 논과 석회암 카르스트 보트 투어." }, styles: ["activity-focused", "efficient"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "07:00", title: { en: "Drive to Ninh Binh", ko: "닌빈으로 이동" }, description: { en: "2-hour drive south from Hanoi.", ko: "하노이에서 남쪽으로 2시간 운전." }, type: "transport", location: { lat: 21.0285, lng: 105.8542 } },
    { time: "09:30", title: { en: "Tam Coc boat ride", ko: "땀꼭 보트 투어" }, description: { en: "Row through caves and rice paddies — 'Ha Long Bay on land'.", ko: "동굴과 논 사이로 보트 — '육지의 하롱베이'." }, type: "tour", location: { lat: 20.2150, lng: 105.9380 } },
    { time: "13:00", title: { en: "Goat meat lunch", ko: "염소 고기 점심" }, description: { en: "Ninh Binh's specialty — grilled goat with herbs.", ko: "닌빈 특산물 — 허브와 구운 염소 고기." }, type: "dining", location: { lat: 20.2530, lng: 105.9750 } },
    { time: "14:30", title: { en: "Mua Cave viewpoint", ko: "무아 동굴 전망대" }, description: { en: "500 steps to the top for panoramic karst views.", ko: "500계단 올라가면 파노라마 카르스트 전경." }, type: "sightseeing", location: { lat: 20.2180, lng: 105.9400 } },
  ], center: { lat: 20.2265, lng: 105.9455 }, tags: ["boat", "karst", "nature", "day-trip"], coverGradient: "from-lime-500 to-green-700" },

  // ════════════════════════════════════════════════════
  // PATTAYA (4 courses)
  // ════════════════════════════════════════════════════
  { id: "pattaya-beach-walking-street", city: "pattaya", title: { en: "Beach Day & Walking Street", ko: "해변 & 워킹 스트리트" }, summary: { en: "Pattaya Beach by day, famous Walking Street by night.", ko: "낮에는 파타야 해변, 밤에는 워킹 스트리트." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "10:00", title: { en: "Pattaya Beach", ko: "파타야 해변" }, description: { en: "Jet ski, parasailing, or just relax on the sand.", ko: "제트스키, 패러세일링 또는 모래 위에서 휴식." }, type: "beach", location: { lat: 12.9276, lng: 100.8773 } },
    { time: "14:00", title: { en: "Lunch at Jomtien Beach", ko: "좀티엔 비치 점심" }, description: { en: "Quieter beach with great seafood restaurants.", ko: "조용한 해변에 좋은 해산물 식당." }, type: "dining", location: { lat: 12.8920, lng: 100.8700 } },
    { time: "20:00", title: { en: "Walking Street nightlife", ko: "워킹 스트리트 나이트라이프" }, description: { en: "Pattaya's famous entertainment strip.", ko: "파타야의 유명 유흥가." }, type: "free", location: { lat: 12.9270, lng: 100.8750 } },
  ], center: { lat: 12.9155, lng: 100.8741 }, tags: ["beach", "nightlife", "water-sports"], coverGradient: "from-blue-400 to-indigo-600" },

  { id: "pattaya-sanctuary-truth", city: "pattaya", title: { en: "Sanctuary of Truth & Nong Nooch", ko: "진리의 성전 & 농눅 가든" }, summary: { en: "Giant wooden temple and Thailand's most impressive gardens.", ko: "거대 목조 사원과 태국 최고의 정원." }, styles: ["efficient"], travelerTypes: ["couple", "family"], activities: [
    { time: "09:00", title: { en: "Sanctuary of Truth", ko: "진리의 성전" }, description: { en: "All-wood temple covered in intricate carvings. Still under construction since 1981.", ko: "정교한 조각으로 덮인 목조 사원. 1981년부터 건설 중." }, type: "sightseeing", location: { lat: 12.9730, lng: 100.8870 } },
    { time: "12:00", title: { en: "Seafood lunch", ko: "해산물 점심" }, description: { en: "Fresh seafood at Naklua fish market area.", ko: "나클루아 어시장 지역에서 신선한 해산물." }, type: "dining", location: { lat: 12.9660, lng: 100.8840 } },
    { time: "14:00", title: { en: "Nong Nooch Tropical Garden", ko: "농눅 트로피컬 가든" }, description: { en: "600-acre gardens with Thai cultural shows.", ko: "600에이커 정원과 태국 문화 공연." }, type: "sightseeing", location: { lat: 12.7650, lng: 100.9350 } },
  ], center: { lat: 12.9013, lng: 100.9020 }, tags: ["temple", "garden", "cultural"], coverGradient: "from-green-400 to-emerald-600" },

  { id: "pattaya-coral-island", city: "pattaya", title: { en: "Coral Island (Koh Larn)", ko: "꼬란 섬 투어" }, summary: { en: "Speed boat to Koh Larn — crystal clear water and white sand.", ko: "스피드보트로 꼬란 섬 — 맑은 물과 하얀 모래." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "09:00", title: { en: "Speed boat to Koh Larn", ko: "꼬란 섬 스피드보트" }, description: { en: "20-minute ride from Bali Hai Pier.", ko: "발리하이 부두에서 20분." }, type: "transport", location: { lat: 12.9210, lng: 100.8720 } },
    { time: "10:00", title: { en: "Tawaen Beach swim", ko: "타왠 비치 수영" }, description: { en: "Main beach — clear water, water sports available.", ko: "메인 해변 — 맑은 물, 수상 스포츠." }, type: "beach", location: { lat: 12.9180, lng: 100.7880 } },
    { time: "13:00", title: { en: "Seafood lunch on island", ko: "섬에서 해산물 점심" }, description: { en: "Beachfront grilled seafood stalls.", ko: "해변 해산물 구이 노점." }, type: "dining", location: { lat: 12.9175, lng: 100.7875 } },
    { time: "15:00", title: { en: "Snorkeling at Samae Beach", ko: "사매 비치 스노클링" }, description: { en: "Quieter beach with better snorkeling.", ko: "더 조용한 해변에서 스노클링." }, type: "tour", location: { lat: 12.9100, lng: 100.7830 } },
  ], center: { lat: 12.9166, lng: 100.8076 }, tags: ["island", "snorkeling", "beach"], coverGradient: "from-teal-400 to-cyan-600" },

  { id: "pattaya-floating-market", city: "pattaya", title: { en: "Floating Market & Art Village", ko: "수상시장 & 아트 빌리지" }, summary: { en: "Four-region floating market and creative art village.", ko: "4개 지역 수상시장과 아트 빌리지." }, styles: ["efficient", "relaxed"], travelerTypes: ["family", "couple"], activities: [
    { time: "10:00", title: { en: "Pattaya Floating Market", ko: "파타야 수상시장" }, description: { en: "Thai food and crafts from 4 regions. Boat rides available.", ko: "4개 지역 음식과 공예품. 보트 탑승 가능." }, type: "shopping", location: { lat: 12.8960, lng: 100.8980 } },
    { time: "13:00", title: { en: "Art in Paradise", ko: "아트 인 파라다이스" }, description: { en: "3D art museum — interactive photo opportunities.", ko: "3D 미술관 — 인터랙티브 사진 촬영." }, type: "sightseeing", location: { lat: 12.9320, lng: 100.8800 } },
    { time: "15:00", title: { en: "Terminal 21 shopping", ko: "터미널 21 쇼핑" }, description: { en: "Airport-themed mall with affordable shopping.", ko: "공항 테마 몰에서 저렴한 쇼핑." }, type: "shopping", location: { lat: 12.9450, lng: 100.8830 } },
  ], center: { lat: 12.9243, lng: 100.8870 }, tags: ["market", "art", "shopping"], coverGradient: "from-yellow-400 to-orange-500" },

  // ════════════════════════════════════════════════════
  // CHIANG MAI (5 courses)
  // ════════════════════════════════════════════════════
  { id: "chiangmai-old-city-temples", city: "chiangmai", title: { en: "Old City Temples Walk", ko: "올드시티 사원 산책" }, summary: { en: "Explore Chiang Mai's most beautiful temples within the old city walls.", ko: "올드시티 성벽 안의 아름다운 사원 탐방." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "08:30", title: { en: "Wat Chedi Luang", ko: "왓 체디 루앙" }, description: { en: "14th-century temple with a massive ruined chedi.", ko: "14세기 사원과 거대한 체디 유적." }, type: "sightseeing", location: { lat: 18.7863, lng: 98.9862 } },
    { time: "10:00", title: { en: "Wat Phra Singh", ko: "왓 프라 싱" }, description: { en: "Chiang Mai's most revered temple. Lanna architecture.", ko: "치앙마이에서 가장 숭배받는 사원. 란나 건축." }, type: "sightseeing", location: { lat: 18.7884, lng: 98.9815 } },
    { time: "12:00", title: { en: "Khao soi lunch", ko: "카오 소이 점심" }, description: { en: "Northern Thai curry noodle soup — Chiang Mai's signature dish.", ko: "치앙마이 대표 음식 — 북부 태국 커리 국수." }, type: "dining", location: { lat: 18.7900, lng: 98.9830 } },
    { time: "14:00", title: { en: "Wat Chiang Man", ko: "왓 치앙 만" }, description: { en: "Chiang Mai's oldest temple (1296).", ko: "치앙마이에서 가장 오래된 사원(1296년)." }, type: "sightseeing", location: { lat: 18.7935, lng: 98.9885 } },
  ], center: { lat: 18.7896, lng: 98.9848 }, tags: ["temples", "cultural", "old-city"], coverGradient: "from-amber-500 to-yellow-600" },

  { id: "chiangmai-doi-suthep", city: "chiangmai", title: { en: "Doi Suthep Mountain Temple", ko: "도이수텝 산 사원" }, summary: { en: "Golden mountaintop temple with panoramic city views.", ko: "파노라마 도시 전경의 황금 산꼭대기 사원." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "08:00", title: { en: "Songthaew to Doi Suthep", ko: "쏭태우로 도이수텝 이동" }, description: { en: "Shared red truck up the mountain. 30 minutes.", ko: "공유 빨간 트럭으로 산 위로 30분." }, type: "transport", location: { lat: 18.7884, lng: 98.9815 } },
    { time: "09:00", title: { en: "Wat Phra That Doi Suthep", ko: "왓 프라 탓 도이수텝" }, description: { en: "306 steps up to a golden chedi. Panoramic views of Chiang Mai.", ko: "306계단 올라가면 황금 체디. 치앙마이 전경." }, type: "sightseeing", location: { lat: 18.8048, lng: 98.9216 } },
    { time: "11:00", title: { en: "Hmong hill tribe village", ko: "흐몽 산족 마을" }, description: { en: "Visit a traditional Hmong village near the temple.", ko: "사원 근처 전통 흐몽 마을 방문." }, type: "sightseeing", location: { lat: 18.8100, lng: 98.9180 } },
    { time: "13:00", title: { en: "Nimman Road cafes", ko: "니만 로드 카페" }, description: { en: "Trendy neighborhood with art cafes and boutiques.", ko: "아트 카페와 부티크가 있는 트렌디한 동네." }, type: "dining", location: { lat: 18.7975, lng: 98.9680 } },
  ], center: { lat: 18.8002, lng: 98.9473 }, tags: ["mountain", "temple", "panoramic", "tribe"], coverGradient: "from-yellow-400 to-amber-600" },

  { id: "chiangmai-elephant-sanctuary", city: "chiangmai", title: { en: "Ethical Elephant Sanctuary", ko: "코끼리 보호구역 체험" }, summary: { en: "Spend a morning feeding and bathing rescued elephants.", ko: "구조된 코끼리와 먹이 주기, 목욕 체험." }, styles: ["activity-focused"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "08:00", title: { en: "Pickup & drive to sanctuary", ko: "픽업 & 보호구역 이동" }, description: { en: "1-hour drive from Chiang Mai.", ko: "치앙마이에서 1시간 이동." }, type: "transport", location: { lat: 18.7884, lng: 98.9815 } },
    { time: "09:30", title: { en: "Meet & feed elephants", ko: "코끼리 만나기 & 먹이 주기" }, description: { en: "Learn about each elephant's rescue story. Feed them bananas and sugarcane.", ko: "각 코끼리의 구조 이야기를 듣고 바나나와 사탕수수를 먹여주세요." }, type: "tour", location: { lat: 18.8500, lng: 98.8200 } },
    { time: "11:30", title: { en: "Mud bath with elephants", ko: "코끼리와 머드 배스" }, description: { en: "Get muddy together, then bathe them in the river.", ko: "함께 진흙탕에 들어간 후 강에서 목욕시키기." }, type: "tour", location: { lat: 18.8510, lng: 98.8210 } },
    { time: "13:00", title: { en: "Thai lunch at sanctuary", ko: "보호구역에서 태국 점심" }, description: { en: "Traditional Thai lunch prepared by staff.", ko: "스태프가 준비한 전통 태국 점심." }, type: "dining", location: { lat: 18.8505, lng: 98.8205 } },
  ], center: { lat: 18.8350, lng: 98.8358 }, tags: ["elephant", "ethical", "nature", "animal"], coverGradient: "from-green-500 to-emerald-700" },

  { id: "chiangmai-sunday-night-market", city: "chiangmai", title: { en: "Sunday Night Market (Walking Street)", ko: "일요 야시장 (워킹 스트리트)" }, summary: { en: "Chiang Mai's best market — street food, crafts, and live music.", ko: "치앙마이 최고 시장 — 길거리 음식, 공예품, 라이브 음악." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "16:00", title: { en: "Tha Phae Gate area", ko: "타패 게이트 지역" }, description: { en: "Start at the iconic gate — the market runs from here.", ko: "상징적인 문에서 시작 — 시장이 여기서 이어집니다." }, type: "sightseeing", location: { lat: 18.7870, lng: 98.9930 } },
    { time: "17:00", title: { en: "Street food crawl", ko: "길거리 음식 투어" }, description: { en: "Sai ua (sausage), mango sticky rice, fried insects.", ko: "싸이 우아(소시지), 망고 찹쌀밥, 곤충 튀김." }, type: "dining", location: { lat: 18.7875, lng: 98.9900 } },
    { time: "19:00", title: { en: "Handicraft shopping", ko: "수공예품 쇼핑" }, description: { en: "Hand-painted umbrellas, wood carvings, hill-tribe textiles.", ko: "수공예 우산, 목각, 산족 직물." }, type: "shopping", location: { lat: 18.7880, lng: 98.9870 } },
    { time: "20:30", title: { en: "Live music at a bar", ko: "바에서 라이브 음악" }, description: { en: "End the night at a rooftop bar near the old city.", ko: "올드시티 근처 루프탑 바에서 마무리." }, type: "free", location: { lat: 18.7890, lng: 98.9860 } },
  ], center: { lat: 18.7879, lng: 98.9890 }, tags: ["night-market", "street-food", "crafts"], coverGradient: "from-purple-500 to-pink-600" },

  { id: "chiangmai-cooking-class", city: "chiangmai", title: { en: "Thai Cooking Class & Market Tour", ko: "태국 요리 수업 & 시장 투어" }, summary: { en: "Morning market visit, then cook 5 Thai dishes with a local chef.", ko: "아침 시장 방문 후 현지 셰프와 5가지 태국 요리." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "08:30", title: { en: "Warorot Market visit", ko: "와로롯 시장 방문" }, description: { en: "Shop for ingredients with your chef guide.", ko: "셰프 가이드와 함께 재료 쇼핑." }, type: "shopping", location: { lat: 18.7910, lng: 98.9980 } },
    { time: "10:00", title: { en: "Cooking class (5 dishes)", ko: "요리 수업 (5가지)" }, description: { en: "Tom yum, pad thai, green curry, papaya salad, mango sticky rice.", ko: "똠얌, 팟타이, 그린 커리, 파파야 샐러드, 망고 찹쌀밥." }, type: "tour", location: { lat: 18.7950, lng: 98.9750 } },
    { time: "14:00", title: { en: "Eat everything you cooked", ko: "만든 음식 시식" }, description: { en: "Sit down and enjoy your own creations with the group.", ko: "그룹과 함께 자신이 만든 음식을 즐기세요." }, type: "dining", location: { lat: 18.7950, lng: 98.9750 } },
  ], center: { lat: 18.7937, lng: 98.9827 }, tags: ["cooking", "market", "food-culture"], coverGradient: "from-orange-400 to-red-500" },

  // ════════════════════════════════════════════════════
  // PHUKET (5 courses)
  // ════════════════════════════════════════════════════
  { id: "phuket-old-town-cape", city: "phuket", title: { en: "Old Town & Promthep Cape", ko: "올드타운 & 프롬텝 곶" }, summary: { en: "Sino-Portuguese architecture, then Phuket's best sunset viewpoint.", ko: "시노포르투갈 건축물, 푸켓 최고 선셋 포인트." }, styles: ["efficient", "relaxed"], travelerTypes: ["couple", "solo"], activities: [
    { time: "09:00", title: { en: "Phuket Old Town walk", ko: "푸켓 올드타운 산책" }, description: { en: "Colorful Sino-Portuguese buildings, cafes, and murals.", ko: "알록달록한 시노포르투갈 건물, 카페, 벽화." }, type: "sightseeing", location: { lat: 7.8847, lng: 98.3873 } },
    { time: "12:00", title: { en: "Dim sum lunch", ko: "딤섬 점심" }, description: { en: "Old Town is known for Hokkien-style dim sum.", ko: "올드타운은 호킨 스타일 딤섬으로 유명." }, type: "dining", location: { lat: 7.8840, lng: 98.3870 } },
    { time: "17:00", title: { en: "Promthep Cape sunset", ko: "프롬텝 곶 선셋" }, description: { en: "Phuket's most famous sunset spot on the southern tip.", ko: "푸켓 남단의 가장 유명한 선셋 포인트." }, type: "sightseeing", location: { lat: 7.7580, lng: 98.3050 } },
  ], center: { lat: 7.8422, lng: 98.3598 }, tags: ["architecture", "sunset", "cultural"], coverGradient: "from-rose-400 to-pink-600" },

  { id: "phuket-phi-phi-island", city: "phuket", title: { en: "Phi Phi Island Day Trip", ko: "피피 섬 당일 투어" }, summary: { en: "Speed boat to Maya Bay, snorkeling, and Phi Phi viewpoint.", ko: "마야 베이 스피드보트, 스노클링, 피피 전망대." }, styles: ["activity-focused"], travelerTypes: ["couple", "friends"], activities: [
    { time: "07:00", title: { en: "Speed boat to Phi Phi", ko: "피피 섬 스피드보트" }, description: { en: "1-hour ride from Rassada Pier.", ko: "라싸다 부두에서 1시간." }, type: "transport", location: { lat: 7.8440, lng: 98.3960 } },
    { time: "09:00", title: { en: "Maya Bay", ko: "마야 베이" }, description: { en: "The beach from 'The Beach' movie. Limited daily visitors.", ko: "'더 비치' 영화 촬영지. 일일 방문자 제한." }, type: "beach", location: { lat: 7.6780, lng: 98.7650 } },
    { time: "11:00", title: { en: "Snorkeling at Pileh Lagoon", ko: "필레 라군 스노클링" }, description: { en: "Crystal clear lagoon surrounded by cliffs.", ko: "절벽으로 둘러싸인 맑은 라군." }, type: "tour", location: { lat: 7.6830, lng: 98.7700 } },
    { time: "14:00", title: { en: "Phi Phi Viewpoint hike", ko: "피피 전망대 하이킹" }, description: { en: "30-minute hike to a stunning double-bay viewpoint.", ko: "30분 하이킹으로 쌍만 전망대." }, type: "sightseeing", location: { lat: 7.7400, lng: 98.7770 } },
  ], center: { lat: 7.7363, lng: 98.6770 }, tags: ["island", "snorkeling", "movie-location"], coverGradient: "from-cyan-500 to-blue-700" },

  { id: "phuket-patong-beach", city: "phuket", title: { en: "Patong Beach & Bangla Road", ko: "파통 해변 & 방라 로드" }, summary: { en: "Phuket's busiest beach by day, Bangla Road nightlife by night.", ko: "낮에는 파통 해변, 밤에는 방라 로드 나이트라이프." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "10:00", title: { en: "Patong Beach morning", ko: "파통 해변 오전" }, description: { en: "Water sports, sunbathing, or just swim.", ko: "수상 스포츠, 일광욕 또는 수영." }, type: "beach", location: { lat: 7.8960, lng: 98.2960 } },
    { time: "13:00", title: { en: "Beachfront seafood lunch", ko: "해변 해산물 점심" }, description: { en: "Grilled prawns and Thai beer by the beach.", ko: "해변에서 구운 새우와 태국 맥주." }, type: "dining", location: { lat: 7.8950, lng: 98.2970 } },
    { time: "16:00", title: { en: "Jungceylon Mall shopping", ko: "정실론 몰 쇼핑" }, description: { en: "Air-conditioned mall with international brands.", ko: "에어컨 완비 국제 브랜드 몰." }, type: "shopping", location: { lat: 7.8910, lng: 98.3000 } },
    { time: "21:00", title: { en: "Bangla Road nightlife", ko: "방라 로드 나이트라이프" }, description: { en: "Neon-lit street with bars, clubs, and street performers.", ko: "네온 불빛 거리에 바, 클럽, 거리 공연." }, type: "free", location: { lat: 7.8940, lng: 98.2980 } },
  ], center: { lat: 7.8940, lng: 98.2978 }, tags: ["beach", "nightlife", "shopping"], coverGradient: "from-indigo-400 to-violet-600" },

  { id: "phuket-james-bond-island", city: "phuket", title: { en: "James Bond Island (Phang Nga Bay)", ko: "제임스 본드 섬 (팡아만)" }, summary: { en: "Longtail boat through limestone karsts to the famous needle rock.", ko: "석회암 카르스트 사이 롱테일 보트로 유명한 바위." }, styles: ["efficient", "activity-focused"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "08:00", title: { en: "Boat to Phang Nga Bay", ko: "팡아만 보트 출발" }, description: { en: "Longtail or speed boat through the bay.", ko: "만을 가로지르는 롱테일 또는 스피드보트." }, type: "transport", location: { lat: 8.2000, lng: 98.5200 } },
    { time: "09:30", title: { en: "James Bond Island", ko: "제임스 본드 섬" }, description: { en: "Iconic needle rock from 'The Man with the Golden Gun'.", ko: "'황금총을 가진 사나이'의 상징적인 바위." }, type: "sightseeing", location: { lat: 8.2750, lng: 98.5010 } },
    { time: "11:00", title: { en: "Kayak through sea caves", ko: "바다 동굴 카약" }, description: { en: "Paddle through hidden lagoons and sea caves.", ko: "숨겨진 라군과 바다 동굴을 카약으로 탐험." }, type: "tour", location: { lat: 8.2100, lng: 98.4800 } },
    { time: "13:00", title: { en: "Floating village lunch", ko: "수상 마을 점심" }, description: { en: "Lunch at Koh Panyee floating Muslim village.", ko: "꼬 빤이 수상 무슬림 마을에서 점심." }, type: "dining", location: { lat: 8.3350, lng: 98.5100 } },
  ], center: { lat: 8.2550, lng: 98.5028 }, tags: ["kayak", "karst", "movie-location", "boat"], coverGradient: "from-emerald-500 to-teal-700" },

  { id: "phuket-big-buddha-chalong", city: "phuket", title: { en: "Big Buddha & Wat Chalong", ko: "빅 부다 & 왓 찰롱" }, summary: { en: "Phuket's biggest religious sites with hilltop views.", ko: "푸켓 최대 종교 유적지와 언덕 위 전경." }, styles: ["relaxed", "efficient"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "09:00", title: { en: "Big Buddha statue", ko: "빅 부다 상" }, description: { en: "45m marble Buddha on Nakkerd Hill. 360° views.", ko: "나커드 힐 위 45m 대리석 불상. 360도 전경." }, type: "sightseeing", location: { lat: 7.8280, lng: 98.3130 } },
    { time: "11:00", title: { en: "Wat Chalong temple", ko: "왓 찰롱 사원" }, description: { en: "Phuket's most important Buddhist temple.", ko: "푸켓에서 가장 중요한 불교 사원." }, type: "sightseeing", location: { lat: 7.8430, lng: 98.3380 } },
    { time: "13:00", title: { en: "Local Thai lunch", ko: "현지 태국 점심" }, description: { en: "Authentic Thai food near the temple.", ko: "사원 근처 정통 태국 음식." }, type: "dining", location: { lat: 7.8440, lng: 98.3390 } },
  ], center: { lat: 7.8383, lng: 98.3300 }, tags: ["temple", "viewpoint", "religious"], coverGradient: "from-sky-400 to-blue-600" },

  // ════════════════════════════════════════════════════
  // TOKYO (6 courses)
  // ════════════════════════════════════════════════════
  { id: "tokyo-shibuya-harajuku", city: "tokyo", title: { en: "Shibuya & Harajuku", ko: "시부야 & 하라주쿠" }, summary: { en: "Iconic crossing, Meiji Shrine, and Takeshita Street fashion.", ko: "상징적인 스크램블, 메이지 신궁, 다케시타 거리 패션." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "09:00", title: { en: "Meiji Shrine", ko: "메이지 신궁" }, description: { en: "Peaceful forest shrine in the heart of Tokyo.", ko: "도쿄 중심의 평화로운 숲속 신사." }, type: "sightseeing", location: { lat: 35.6764, lng: 139.6993 } },
    { time: "11:00", title: { en: "Takeshita Street", ko: "다케시타 거리" }, description: { en: "Harajuku's famous fashion and crepe street.", ko: "하라주쿠의 유명 패션과 크레이프 거리." }, type: "shopping", location: { lat: 35.6716, lng: 139.7026 } },
    { time: "13:00", title: { en: "Omotesando lunch", ko: "오모테산도 점심" }, description: { en: "Tokyo's Champs-Élysées — designer shops and restaurants.", ko: "도쿄의 샹젤리제 — 디자이너 숍과 레스토랑." }, type: "dining", location: { lat: 35.6654, lng: 139.7100 } },
    { time: "18:00", title: { en: "Shibuya Crossing & Sky", ko: "시부야 스크램블 & 스카이" }, description: { en: "World's busiest crossing. Then Shibuya Sky for sunset views.", ko: "세계에서 가장 바쁜 교차로. 시부야 스카이에서 선셋." }, type: "sightseeing", location: { lat: 35.6595, lng: 139.7004 } },
  ], center: { lat: 35.6682, lng: 139.7031 }, tags: ["fashion", "shrine", "crossing", "urban"], coverGradient: "from-pink-500 to-purple-600" },

  { id: "tokyo-asakusa-akihabara", city: "tokyo", title: { en: "Asakusa & Akihabara", ko: "아사쿠사 & 아키하바라" }, summary: { en: "Traditional temple town and electric otaku district.", ko: "전통 사원 마을과 전자 오타쿠 지구." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends", "family"], activities: [
    { time: "09:00", title: { en: "Senso-ji Temple", ko: "센소지 사원" }, description: { en: "Tokyo's oldest temple. Walk through Kaminarimon gate.", ko: "도쿄에서 가장 오래된 사원. 가미나리몬 통과." }, type: "sightseeing", location: { lat: 35.7148, lng: 139.7967 } },
    { time: "10:30", title: { en: "Nakamise shopping street", ko: "나카미세 쇼핑 거리" }, description: { en: "Traditional snacks and souvenirs.", ko: "전통 간식과 기념품." }, type: "shopping", location: { lat: 35.7130, lng: 139.7960 } },
    { time: "12:00", title: { en: "Tokyo Skytree", ko: "도쿄 스카이트리" }, description: { en: "634m tower observation deck — all of Tokyo visible.", ko: "634m 타워 전망대 — 도쿄 전체 조망." }, type: "sightseeing", location: { lat: 35.7101, lng: 139.8107 } },
    { time: "15:00", title: { en: "Akihabara Electric Town", ko: "아키하바라 전자 상가" }, description: { en: "Anime, manga, gaming, and electronics paradise.", ko: "애니메, 만화, 게임, 전자제품의 천국." }, type: "shopping", location: { lat: 35.7023, lng: 139.7745 } },
  ], center: { lat: 35.7101, lng: 139.7945 }, tags: ["temple", "anime", "electronics", "traditional"], coverGradient: "from-red-500 to-orange-600" },

  { id: "tokyo-shinjuku-golden-gai", city: "tokyo", title: { en: "Shinjuku & Golden Gai", ko: "신주쿠 & 골든 가이" }, summary: { en: "Department stores, Gyoen garden, and tiny bar alleyways.", ko: "백화점, 교엔 정원, 작은 바 골목." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "10:00", title: { en: "Shinjuku Gyoen National Garden", ko: "신주쿠 교엔 국립정원" }, description: { en: "Beautiful Japanese, French, and English gardens.", ko: "일본식, 프랑스식, 영국식 정원." }, type: "sightseeing", location: { lat: 35.6852, lng: 139.7100 } },
    { time: "12:30", title: { en: "Ramen lunch in Kabukicho", ko: "가부키초에서 라멘 점심" }, description: { en: "Fuunji or Ichiran — legendary ramen shops.", ko: "후운지 또는 이치란 — 전설적인 라멘 가게." }, type: "dining", location: { lat: 35.6938, lng: 139.7035 } },
    { time: "14:00", title: { en: "Department store shopping", ko: "백화점 쇼핑" }, description: { en: "Isetan, Lumine, or Takashimaya department stores.", ko: "이세탄, 루미네 또는 타카시마야 백화점." }, type: "shopping", location: { lat: 35.6910, lng: 139.7040 } },
    { time: "20:00", title: { en: "Golden Gai bar hopping", ko: "골든 가이 바 호핑" }, description: { en: "200+ tiny bars in narrow alleys — each seats 6-10 people.", ko: "좁은 골목에 200개 이상 작은 바 — 각각 6~10석." }, type: "free", location: { lat: 35.6935, lng: 139.7037 } },
  ], center: { lat: 35.6909, lng: 139.7053 }, tags: ["garden", "ramen", "nightlife", "bars"], coverGradient: "from-violet-400 to-indigo-600" },

  { id: "tokyo-tsukiji-ginza", city: "tokyo", title: { en: "Tsukiji Outer Market & Ginza", ko: "쓰키지 외부시장 & 긴자" }, summary: { en: "Fresh sushi breakfast, then upscale Ginza shopping.", ko: "신선한 초밥 아침, 고급 긴자 쇼핑." }, styles: ["efficient", "hotel-focused"], travelerTypes: ["couple", "family"], activities: [
    { time: "07:00", title: { en: "Tsukiji Outer Market", ko: "쓰키지 외부시장" }, description: { en: "Fresh sushi, tamago, and street food stalls.", ko: "신선한 초밥, 타마고, 길거리 음식." }, type: "dining", location: { lat: 35.6654, lng: 139.7707 } },
    { time: "10:00", title: { en: "TeamLab Planets", ko: "팀랩 플래닛" }, description: { en: "Immersive digital art museum — walk through water and light.", ko: "몰입형 디지털 아트 — 물과 빛 속을 걸어보세요." }, type: "sightseeing", location: { lat: 35.6546, lng: 139.7884 } },
    { time: "13:00", title: { en: "Ginza lunch & shopping", ko: "긴자 점심 & 쇼핑" }, description: { en: "Luxury brands, Uniqlo flagship, and Mitsukoshi.", ko: "명품, 유니클로 플래그십, 미쓰코시." }, type: "shopping", location: { lat: 35.6712, lng: 139.7649 } },
  ], center: { lat: 35.6637, lng: 139.7747 }, tags: ["sushi", "market", "luxury", "art"], coverGradient: "from-amber-400 to-yellow-600" },

  { id: "tokyo-ueno-yanaka", city: "tokyo", title: { en: "Ueno Park & Yanaka Old Town", ko: "우에노 공원 & 야나카" }, summary: { en: "Museums, zoo, and a nostalgic old Tokyo neighborhood.", ko: "박물관, 동물원, 옛 도쿄 느낌의 야나카." }, styles: ["relaxed"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "09:00", title: { en: "Ueno Park & Toshogu Shrine", ko: "우에노 공원 & 도쇼구 신사" }, description: { en: "Green oasis with shrines, ponds, and museums.", ko: "신사, 연못, 박물관이 있는 녹색 오아시스." }, type: "sightseeing", location: { lat: 35.7146, lng: 139.7730 } },
    { time: "11:00", title: { en: "Tokyo National Museum", ko: "도쿄 국립 박물관" }, description: { en: "Japan's oldest and largest museum.", ko: "일본에서 가장 오래되고 큰 박물관." }, type: "sightseeing", location: { lat: 35.7189, lng: 139.7766 } },
    { time: "14:00", title: { en: "Yanaka Ginza shopping street", ko: "야나카 긴자 상가" }, description: { en: "Retro shopping street with local snacks and cat statues.", ko: "현지 간식과 고양이 조각이 있는 레트로 상가." }, type: "shopping", location: { lat: 35.7270, lng: 139.7660 } },
    { time: "16:00", title: { en: "Yanaka Cemetery sunset walk", ko: "야나카 묘지 산책" }, description: { en: "Peaceful cherry-tree-lined paths in old Tokyo.", ko: "옛 도쿄의 벚꽃 가로수 산책." }, type: "free", location: { lat: 35.7250, lng: 139.7700 } },
  ], center: { lat: 35.7214, lng: 139.7714 }, tags: ["museum", "park", "retro", "peaceful"], coverGradient: "from-green-400 to-emerald-500" },

  { id: "tokyo-odaiba-bay", city: "tokyo", title: { en: "Odaiba Bay & Rainbow Bridge", ko: "오다이바 & 레인보우 브릿지" }, summary: { en: "Futuristic waterfront with Gundam, onsen, and bay views.", ko: "건담, 온천, 만 전경의 미래형 해안." }, styles: ["activity-focused", "relaxed"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "11:00", title: { en: "Unicorn Gundam statue", ko: "유니콘 건담 입상" }, description: { en: "Life-size 19.7m Gundam that transforms every few hours.", ko: "19.7m 실물 크기 건담. 매 몇 시간마다 변신." }, type: "sightseeing", location: { lat: 35.6250, lng: 139.7750 } },
    { time: "12:30", title: { en: "Aqua City lunch", ko: "아쿠아시티 점심" }, description: { en: "Mall with ramen stadium and bay view restaurants.", ko: "라멘 스타디움과 만 전경 레스토랑이 있는 몰." }, type: "dining", location: { lat: 35.6268, lng: 139.7750 } },
    { time: "14:30", title: { en: "TeamLab Borderless", ko: "팀랩 보더리스" }, description: { en: "Immersive art museum — no borders between art and visitor.", ko: "몰입형 아트 — 예술과 관람객 사이 경계가 없음." }, type: "sightseeing", location: { lat: 35.6260, lng: 139.7810 } },
    { time: "18:00", title: { en: "Oedo Onsen Monogatari", ko: "오에도 온천 모노가타리" }, description: { en: "Edo-themed onsen theme park. Yukata included.", ko: "에도 테마 온천 테마파크. 유카타 포함." }, type: "free", location: { lat: 35.6240, lng: 139.7770 } },
  ], center: { lat: 35.6255, lng: 139.7770 }, tags: ["futuristic", "gundam", "onsen", "bay"], coverGradient: "from-blue-500 to-purple-600" },

  // ════════════════════════════════════════════════════
  // OSAKA (5 courses)
  // ════════════════════════════════════════════════════
  { id: "osaka-dotonbori-shinsekai", city: "osaka", title: { en: "Dotonbori & Shinsekai", ko: "도톤보리 & 신세카이" }, summary: { en: "Osaka's iconic food street and retro tower district.", ko: "오사카 상징적 먹거리 거리와 레트로 타워 지구." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "11:00", title: { en: "Dotonbori food crawl", ko: "도톤보리 먹방 투어" }, description: { en: "Takoyaki, okonomiyaki, gyoza — Osaka is Japan's kitchen.", ko: "타코야키, 오코노미야키, 교자 — 오사카는 일본의 부엌." }, type: "dining", location: { lat: 34.6687, lng: 135.5032 } },
    { time: "13:00", title: { en: "Glico sign & canal walk", ko: "글리코 간판 & 운하 산책" }, description: { en: "Take a photo with the famous running man sign.", ko: "유명한 달리기 남자 간판과 사진 촬영." }, type: "sightseeing", location: { lat: 34.6687, lng: 135.5012 } },
    { time: "15:00", title: { en: "Shinsekai & Tsutenkaku Tower", ko: "신세카이 & 쓰텐카쿠 타워" }, description: { en: "Retro neighborhood with kushikatsu (fried skewers).", ko: "꼬치 튀김이 유명한 레트로 동네." }, type: "sightseeing", location: { lat: 34.6524, lng: 135.5063 } },
    { time: "17:00", title: { en: "Kushikatsu dinner", ko: "꼬치 튀김 저녁" }, description: { en: "Deep-fried skewers — no double-dipping the sauce!", ko: "꼬치 튀김 — 소스에 두 번 찍기 금지!" }, type: "dining", location: { lat: 34.6520, lng: 135.5060 } },
  ], center: { lat: 34.6605, lng: 135.5042 }, tags: ["food", "neon", "retro", "street-food"], coverGradient: "from-red-500 to-orange-600" },

  { id: "osaka-castle-park", city: "osaka", title: { en: "Osaka Castle & Park", ko: "오사카 성 & 공원" }, summary: { en: "Japan's most famous castle, park, and Osaka Museum of History.", ko: "일본 최고의 성, 공원, 오사카 역사 박물관." }, styles: ["relaxed", "efficient"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "09:00", title: { en: "Osaka Castle", ko: "오사카 성" }, description: { en: "Toyotomi Hideyoshi's castle. 8-floor museum inside.", ko: "도요토미 히데요시의 성. 내부 8층 박물관." }, type: "sightseeing", location: { lat: 34.6873, lng: 135.5262 } },
    { time: "11:30", title: { en: "Castle park walk", ko: "성 공원 산책" }, description: { en: "Moat, plum grove, and cherry blossom trees.", ko: "해자, 매화원, 벚꽃 나무." }, type: "free", location: { lat: 34.6850, lng: 135.5240 } },
    { time: "13:00", title: { en: "Lunch at Tenmabashi", ko: "덴마바시 점심" }, description: { en: "Local udon or curry rice near the castle.", ko: "성 근처 현지 우동 또는 카레라이스." }, type: "dining", location: { lat: 34.6900, lng: 135.5200 } },
  ], center: { lat: 34.6874, lng: 135.5234 }, tags: ["castle", "history", "park", "cherry-blossom"], coverGradient: "from-amber-400 to-yellow-600" },

  { id: "osaka-universal-studios", city: "osaka", title: { en: "Universal Studios Japan", ko: "유니버설 스튜디오 재팬" }, summary: { en: "Full day at USJ — Harry Potter, Nintendo World, rides.", ko: "USJ 종일 — 해리포터, 닌텐도 월드, 놀이기구." }, styles: ["activity-focused"], travelerTypes: ["family", "friends", "couple"], activities: [
    { time: "08:30", title: { en: "Early entry to USJ", ko: "USJ 조기 입장" }, description: { en: "Get the Express Pass for popular rides.", ko: "인기 놀이기구 익스프레스 패스 구매 추천." }, type: "tour", location: { lat: 34.6654, lng: 135.4323 } },
    { time: "10:00", title: { en: "Super Nintendo World", ko: "슈퍼 닌텐도 월드" }, description: { en: "Mario Kart ride, coin blocks, and Toadstool Cafe.", ko: "마리오 카트, 코인 블록, 버섯 카페." }, type: "tour", location: { lat: 34.6660, lng: 135.4310 } },
    { time: "14:00", title: { en: "Wizarding World of Harry Potter", ko: "해리포터 마법사 세계" }, description: { en: "Hogwarts Castle, butterbeer, and wand shopping.", ko: "호그와트 성, 버터비어, 지팡이 쇼핑." }, type: "tour", location: { lat: 34.6665, lng: 135.4330 } },
    { time: "18:00", title: { en: "Night parade & dinner", ko: "야간 퍼레이드 & 저녁" }, description: { en: "Evening spectacular with character dinner.", ko: "캐릭터 디너와 함께하는 야간 공연." }, type: "tour", location: { lat: 34.6658, lng: 135.4325 } },
  ], center: { lat: 34.6659, lng: 135.4322 }, tags: ["theme-park", "harry-potter", "nintendo"], coverGradient: "from-blue-500 to-indigo-700" },

  { id: "osaka-namba-amerikamura", city: "osaka", title: { en: "Namba & Amerikamura", ko: "난바 & 아메리카무라" }, summary: { en: "Youth culture, vintage shops, and street style.", ko: "청소년 문화, 빈티지 숍, 스트리트 스타일." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "11:00", title: { en: "Amerikamura vintage shops", ko: "아메리카무라 빈티지 숍" }, description: { en: "Osaka's Harajuku — secondhand fashion and indie stores.", ko: "오사카의 하라주쿠 — 중고 패션과 인디 상점." }, type: "shopping", location: { lat: 34.6720, lng: 135.4985 } },
    { time: "13:00", title: { en: "Flat White Coffee", ko: "플랫 화이트 커피" }, description: { en: "Specialty coffee in Amemura's hip cafes.", ko: "아메무라 힙한 카페에서 스페셜티 커피." }, type: "dining", location: { lat: 34.6725, lng: 135.4990 } },
    { time: "15:00", title: { en: "Namba Parks & shopping", ko: "난바 파크스 & 쇼핑" }, description: { en: "Terraced garden mall with unique architecture.", ko: "계단식 정원이 있는 독특한 건축의 몰." }, type: "shopping", location: { lat: 34.6620, lng: 135.5020 } },
    { time: "19:00", title: { en: "Namba area izakaya", ko: "난바 이자카야" }, description: { en: "Traditional Japanese pub — order yakitori and highball.", ko: "전통 일본 술집 — 야키토리와 하이볼 주문." }, type: "dining", location: { lat: 34.6665, lng: 135.5010 } },
  ], center: { lat: 34.6683, lng: 135.5001 }, tags: ["vintage", "fashion", "youth-culture"], coverGradient: "from-pink-400 to-red-500" },

  { id: "osaka-kuromon-tenma", city: "osaka", title: { en: "Kuromon Market & Tenma", ko: "구로몬 시장 & 텐마" }, summary: { en: "Osaka's kitchen market and Tenma's hidden izakaya alleys.", ko: "오사카의 부엌 시장과 텐마 숨은 이자카야 골목." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "09:00", title: { en: "Kuromon Market", ko: "구로몬 시장" }, description: { en: "'Osaka's Kitchen' — fresh sashimi, sea urchin, wagyu on a stick.", ko: "'오사카의 부엌' — 회, 성게, 꼬치 와규." }, type: "dining", location: { lat: 34.6620, lng: 135.5070 } },
    { time: "11:30", title: { en: "Hozenji Yokocho alley", ko: "호젠지 요코초 골목" }, description: { en: "Atmospheric stone-paved alley near Dotonbori.", ko: "도톤보리 근처 분위기 있는 돌길 골목." }, type: "sightseeing", location: { lat: 34.6690, lng: 135.5020 } },
    { time: "18:00", title: { en: "Tenjinbashisuji shopping arcade", ko: "텐진바시스지 상가" }, description: { en: "Japan's longest shopping street — 2.6km.", ko: "일본에서 가장 긴 상가 — 2.6km." }, type: "shopping", location: { lat: 34.7050, lng: 135.5130 } },
    { time: "20:00", title: { en: "Tenma izakaya hopping", ko: "텐마 이자카야 투어" }, description: { en: "Working-class district with 100+ standing bars.", ko: "100개 이상 스탠딩 바가 있는 서민 지구." }, type: "free", location: { lat: 34.7040, lng: 135.5120 } },
  ], center: { lat: 34.6850, lng: 135.5085 }, tags: ["market", "izakaya", "food", "local"], coverGradient: "from-orange-500 to-amber-600" },

  // ════════════════════════════════════════════════════
  // KYOTO (5 courses)
  // ════════════════════════════════════════════════════
  { id: "kyoto-kinkakuji-arashiyama", city: "kyoto", title: { en: "Golden Pavilion & Arashiyama Bamboo", ko: "금각사 & 아라시야마 대나무숲" }, summary: { en: "Kyoto's two most iconic sights in one day.", ko: "교토의 가장 상징적인 두 명소를 하루에." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "08:00", title: { en: "Kinkaku-ji (Golden Pavilion)", ko: "금각사" }, description: { en: "Gold-leafed pavilion reflected in a mirror lake.", ko: "거울 연못에 비치는 금박 사원." }, type: "sightseeing", location: { lat: 35.0394, lng: 135.7292 } },
    { time: "10:30", title: { en: "Arashiyama Bamboo Grove", ko: "아라시야마 대나무숲" }, description: { en: "Walk through towering bamboo — arrive early to avoid crowds.", ko: "우뚝 솟은 대나무 사이를 걸어보세요. 일찍 도착 추천." }, type: "sightseeing", location: { lat: 35.0170, lng: 135.6713 } },
    { time: "12:00", title: { en: "Togetsu-kyo Bridge lunch", ko: "도게쓰쿄 다리 점심" }, description: { en: "Tofu cuisine or soba near the iconic bridge.", ko: "상징적인 다리 근처 두부 요리 또는 소바." }, type: "dining", location: { lat: 35.0094, lng: 135.6780 } },
    { time: "14:00", title: { en: "Monkey Park Iwatayama", ko: "원숭이 공원 이와타야마" }, description: { en: "Hilltop monkey park with city views.", ko: "도시 전경이 보이는 언덕 위 원숭이 공원." }, type: "sightseeing", location: { lat: 35.0086, lng: 135.6780 } },
  ], center: { lat: 35.0186, lng: 135.6891 }, tags: ["temple", "bamboo", "golden", "iconic"], coverGradient: "from-yellow-400 to-amber-600" },

  { id: "kyoto-fushimi-gion", city: "kyoto", title: { en: "Fushimi Inari & Gion Geisha District", ko: "후시미 이나리 & 기온 게이샤 지구" }, summary: { en: "Thousand red gates and Kyoto's famous geisha quarter.", ko: "천 개의 빨간 도리이와 교토 게이샤 거리." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "07:00", title: { en: "Fushimi Inari early morning", ko: "후시미 이나리 이른 아침" }, description: { en: "10,000 vermillion torii gates up the mountain. Go at dawn.", ko: "산 위로 이어지는 1만 개 주홍색 도리이. 새벽에 방문." }, type: "sightseeing", location: { lat: 34.9671, lng: 135.7727 } },
    { time: "10:00", title: { en: "Kiyomizu-dera Temple", ko: "기요미즈데라 사원" }, description: { en: "Wooden stage temple with panoramic views of Kyoto.", ko: "교토 전경의 목조 무대 사원." }, type: "sightseeing", location: { lat: 34.9949, lng: 135.7850 } },
    { time: "13:00", title: { en: "Nishiki Market lunch", ko: "니시키 시장 점심" }, description: { en: "'Kyoto's Kitchen' — pickles, matcha, and street food.", ko: "'교토의 부엌' — 절임, 말차, 길거리 음식." }, type: "dining", location: { lat: 35.0050, lng: 135.7650 } },
    { time: "17:00", title: { en: "Gion geisha walk", ko: "기온 게이샤 산책" }, description: { en: "Spot geiko (geisha) heading to evening appointments.", ko: "저녁 약속으로 향하는 게이코(게이샤)를 찾아보세요." }, type: "sightseeing", location: { lat: 35.0036, lng: 135.7756 } },
  ], center: { lat: 34.9927, lng: 135.7746 }, tags: ["torii", "geisha", "temple", "iconic"], coverGradient: "from-red-500 to-rose-700" },

  { id: "kyoto-tea-ceremony-zen", city: "kyoto", title: { en: "Zen Gardens & Tea Ceremony", ko: "선 정원 & 다도 체험" }, summary: { en: "Ryoan-ji rock garden, Zen meditation, and matcha tea.", ko: "료안지 돌 정원, 선 명상, 말차 다도." }, styles: ["relaxed"], travelerTypes: ["couple", "solo"], activities: [
    { time: "09:00", title: { en: "Ryoan-ji Zen rock garden", ko: "료안지 선 돌 정원" }, description: { en: "Japan's most famous rock garden — 15 stones, infinite meaning.", ko: "일본에서 가장 유명한 돌 정원 — 15개 돌, 무한한 의미." }, type: "sightseeing", location: { lat: 35.0345, lng: 135.7185 } },
    { time: "11:00", title: { en: "Tea ceremony experience", ko: "다도 체험" }, description: { en: "Private matcha ceremony in a traditional tea house.", ko: "전통 찻집에서 프라이빗 말차 다도." }, type: "tour", location: { lat: 35.0100, lng: 135.7700 } },
    { time: "14:00", title: { en: "Philosopher's Path walk", ko: "철학자의 길 산책" }, description: { en: "2km canal-side path lined with cherry trees.", ko: "벚꽃 가로수가 있는 2km 운하 산책로." }, type: "free", location: { lat: 35.0227, lng: 135.7943 } },
  ], center: { lat: 35.0224, lng: 135.7609 }, tags: ["zen", "tea", "garden", "meditation"], coverGradient: "from-green-400 to-emerald-600" },

  { id: "kyoto-nara-daytrip", city: "kyoto", title: { en: "Nara Day Trip (Deer Park)", ko: "나라 당일 여행 (사슴 공원)" }, summary: { en: "45 minutes from Kyoto — friendly deer, giant Buddha, ancient shrines.", ko: "교토에서 45분 — 사슴, 거대 불상, 고대 신사." }, styles: ["efficient", "activity-focused"], travelerTypes: ["family", "couple", "friends"], activities: [
    { time: "09:00", title: { en: "Train to Nara", ko: "나라행 기차" }, description: { en: "45-minute JR train from Kyoto Station.", ko: "교토역에서 JR 기차 45분." }, type: "transport", location: { lat: 34.9858, lng: 135.7588 } },
    { time: "10:00", title: { en: "Nara Park & deer", ko: "나라 공원 & 사슴" }, description: { en: "1,200 free-roaming sacred deer. Buy deer crackers (shika senbei).", ko: "1,200마리 자유 방목 신성한 사슴. 사슴 과자 구매." }, type: "sightseeing", location: { lat: 34.6851, lng: 135.8430 } },
    { time: "11:30", title: { en: "Todai-ji (Great Buddha)", ko: "도다이지 (대불)" }, description: { en: "World's largest wooden building housing a 15m bronze Buddha.", ko: "15m 청동 불상이 있는 세계 최대 목조 건물." }, type: "sightseeing", location: { lat: 34.6890, lng: 135.8399 } },
    { time: "14:00", title: { en: "Mochi & return to Kyoto", ko: "모치 & 교토 귀환" }, description: { en: "Try Nara's famous yomogi mochi before heading back.", ko: "귀환 전 나라 명물 쑥 모치를 맛보세요." }, type: "dining", location: { lat: 34.6845, lng: 135.8400 } },
  ], center: { lat: 34.7611, lng: 135.8204 }, tags: ["deer", "buddha", "day-trip", "nature"], coverGradient: "from-lime-400 to-green-600" },

  { id: "kyoto-higashiyama-pottery", city: "kyoto", title: { en: "Higashiyama & Pottery Street", ko: "히가시야마 & 도자기 거리" }, summary: { en: "Stone-paved streets, traditional shops, and Kiyomizu pottery.", ko: "돌길, 전통 가게, 기요미즈 도자기." }, styles: ["relaxed", "efficient"], travelerTypes: ["couple", "solo"], activities: [
    { time: "10:00", title: { en: "Ninenzaka & Sannenzaka", ko: "니넨자카 & 산넨자카" }, description: { en: "Beautifully preserved stone-paved lanes with traditional shops.", ko: "전통 가게가 있는 아름다운 돌길." }, type: "sightseeing", location: { lat: 34.9980, lng: 135.7810 } },
    { time: "12:00", title: { en: "Matcha parfait lunch", ko: "말차 파르페 점심" }, description: { en: "Kyoto's matcha desserts are legendary.", ko: "교토의 말차 디저트는 전설적." }, type: "dining", location: { lat: 34.9990, lng: 135.7800 } },
    { time: "14:00", title: { en: "Gojo-zaka pottery street", ko: "고조자카 도자기 거리" }, description: { en: "Browse and buy Kiyomizu-yaki ceramics.", ko: "기요미즈야키 도자기 감상과 구매." }, type: "shopping", location: { lat: 34.9960, lng: 135.7820 } },
    { time: "16:00", title: { en: "Kodai-ji Temple evening", ko: "고다이지 사원 저녁" }, description: { en: "Zen temple with beautiful moss garden.", ko: "아름다운 이끼 정원이 있는 선 사원." }, type: "sightseeing", location: { lat: 35.0003, lng: 135.7805 } },
  ], center: { lat: 34.9983, lng: 135.7809 }, tags: ["pottery", "traditional", "stone-streets"], coverGradient: "from-slate-400 to-gray-600" },

  // ════════════════════════════════════════════════════
  // NAGOYA (3 courses)
  // ════════════════════════════════════════════════════
  { id: "nagoya-castle-osu", city: "nagoya", title: { en: "Nagoya Castle & Osu District", ko: "나고야 성 & 오스 지구" }, summary: { en: "Gold shachi castle and Nagoya's retro shopping district.", ko: "금빛 샤치 성과 나고야 레트로 상가." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "09:00", title: { en: "Nagoya Castle", ko: "나고야 성" }, description: { en: "Tokugawa's castle with golden dolphins on the roof.", ko: "지붕 위 금빛 돌고래가 있는 도쿠가와의 성." }, type: "sightseeing", location: { lat: 35.1856, lng: 136.8997 } },
    { time: "12:00", title: { en: "Misokatsu lunch", ko: "미소카쓰 점심" }, description: { en: "Nagoya's signature red miso pork cutlet.", ko: "나고야 명물 빨간 미소 돈까스." }, type: "dining", location: { lat: 35.1700, lng: 136.9020 } },
    { time: "14:00", title: { en: "Osu Shopping District", ko: "오스 상가" }, description: { en: "Retro arcade, vintage shops, and street food.", ko: "레트로 오락실, 빈티지 숍, 길거리 음식." }, type: "shopping", location: { lat: 35.1580, lng: 136.9010 } },
  ], center: { lat: 35.1712, lng: 136.9009 }, tags: ["castle", "shopping", "retro"], coverGradient: "from-yellow-500 to-amber-600" },

  { id: "nagoya-atsuta-sakae", city: "nagoya", title: { en: "Atsuta Shrine & Sakae Nightlife", ko: "아쓰타 신궁 & 사카에" }, summary: { en: "Sacred shrine, then Nagoya's entertainment district.", ko: "신성한 신궁 후 나고야 번화가." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "friends"], activities: [
    { time: "09:00", title: { en: "Atsuta Shrine", ko: "아쓰타 신궁" }, description: { en: "One of Japan's most sacred Shinto shrines.", ko: "일본에서 가장 신성한 신토 신궁 중 하나." }, type: "sightseeing", location: { lat: 35.1283, lng: 136.9084 } },
    { time: "11:30", title: { en: "Hitsumabushi eel lunch", ko: "히쓰마부시 장어 점심" }, description: { en: "Nagoya-style grilled eel — eat it three ways.", ko: "나고야식 장어구이 — 3가지 방법으로." }, type: "dining", location: { lat: 35.1290, lng: 136.9090 } },
    { time: "15:00", title: { en: "Sakae & Oasis 21", ko: "사카에 & 오아시스 21" }, description: { en: "Futuristic glass roof building and shopping.", ko: "미래형 유리 지붕 건물과 쇼핑." }, type: "shopping", location: { lat: 35.1706, lng: 136.9079 } },
  ], center: { lat: 35.1426, lng: 136.9084 }, tags: ["shrine", "eel", "nightlife"], coverGradient: "from-indigo-400 to-blue-600" },

  { id: "nagoya-legoland-port", city: "nagoya", title: { en: "Legoland & Port Area", ko: "레고랜드 & 항구 지역" }, summary: { en: "Legoland Japan and the port's aquarium.", ko: "레고랜드 재팬과 항구 수족관." }, styles: ["activity-focused"], travelerTypes: ["family", "friends"], activities: [
    { time: "09:00", title: { en: "Legoland Japan", ko: "레고랜드 재팬" }, description: { en: "40+ rides and shows for families.", ko: "40개 이상 놀이기구와 공연." }, type: "tour", location: { lat: 35.0450, lng: 136.8430 } },
    { time: "14:00", title: { en: "Sea Life Nagoya", ko: "시라이프 나고야" }, description: { en: "Adjacent aquarium with tunnel tanks.", ko: "인접한 수족관과 터널 수조." }, type: "sightseeing", location: { lat: 35.0455, lng: 136.8440 } },
    { time: "16:00", title: { en: "Maker's Pier shopping", ko: "메이커스 피어 쇼핑" }, description: { en: "Waterfront shopping and dining complex.", ko: "해변 쇼핑 및 다이닝 단지." }, type: "shopping", location: { lat: 35.0460, lng: 136.8420 } },
  ], center: { lat: 35.0455, lng: 136.8430 }, tags: ["legoland", "family", "aquarium"], coverGradient: "from-yellow-400 to-red-500" },

  // ════════════════════════════════════════════════════
  // FUKUOKA (3 courses)
  // ════════════════════════════════════════════════════
  { id: "fukuoka-yatai-canal", city: "fukuoka", title: { en: "Yatai Street Stalls & Canal City", ko: "야타이 포장마차 & 캐널시티" }, summary: { en: "Fukuoka's legendary ramen stalls and riverside mall.", ko: "후쿠오카 전설의 라멘 포장마차와 하천 쇼핑몰." }, styles: ["efficient", "relaxed"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "11:00", title: { en: "Canal City Hakata", ko: "캐널시티 하카타" }, description: { en: "Unique canal-themed shopping complex.", ko: "독특한 운하 테마 쇼핑 단지." }, type: "shopping", location: { lat: 33.5893, lng: 130.4114 } },
    { time: "13:00", title: { en: "Hakata ramen lunch", ko: "하카타 라멘 점심" }, description: { en: "Ichiran or Shin Shin — milky pork bone broth.", ko: "이치란 또는 신신 — 유백색 돼지뼈 국물." }, type: "dining", location: { lat: 33.5900, lng: 130.4100 } },
    { time: "19:00", title: { en: "Nakasu yatai food stalls", ko: "나카스 야타이 포장마차" }, description: { en: "Open-air ramen, oden, and yakitori stalls along the river.", ko: "강변 야외 라멘, 오뎅, 야키토리." }, type: "dining", location: { lat: 33.5930, lng: 130.4060 } },
  ], center: { lat: 33.5908, lng: 130.4091 }, tags: ["ramen", "yatai", "food", "shopping"], coverGradient: "from-orange-400 to-red-500" },

  { id: "fukuoka-ohori-park-tower", city: "fukuoka", title: { en: "Ohori Park & Fukuoka Tower", ko: "오호리 공원 & 후쿠오카 타워" }, summary: { en: "Lake garden and Japan's tallest seaside tower.", ko: "호수 정원과 일본 최고의 해변 타워." }, styles: ["relaxed"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "09:00", title: { en: "Ohori Park walk", ko: "오호리 공원 산책" }, description: { en: "2km loop around the lake, Japanese garden included.", ko: "호수 주변 2km 산책, 일본 정원 포함." }, type: "free", location: { lat: 33.5850, lng: 130.3780 } },
    { time: "11:00", title: { en: "Fukuoka Tower observation", ko: "후쿠오카 타워 전망대" }, description: { en: "234m tower with 360° city and sea views.", ko: "234m 타워에서 360도 도시와 바다 전망." }, type: "sightseeing", location: { lat: 33.5930, lng: 130.3510 } },
    { time: "13:00", title: { en: "Momochi beach lunch", ko: "모모치 해변 점심" }, description: { en: "Beachside cafes near the tower.", ko: "타워 근처 해변 카페." }, type: "dining", location: { lat: 33.5920, lng: 130.3530 } },
  ], center: { lat: 33.5900, lng: 130.3607 }, tags: ["park", "tower", "lake", "beach"], coverGradient: "from-sky-400 to-blue-500" },

  { id: "fukuoka-dazaifu-shrine", city: "fukuoka", title: { en: "Dazaifu Tenmangu Shrine", ko: "다자이후 텐만구 신사" }, summary: { en: "Study god shrine with plum trees and mochi.", ko: "학업의 신 신사, 매화나무와 모치." }, styles: ["efficient"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "09:00", title: { en: "Train to Dazaifu", ko: "다자이후행 기차" }, description: { en: "30-minute private railway from Tenjin.", ko: "텐진에서 사철 30분." }, type: "transport", location: { lat: 33.5900, lng: 130.3990 } },
    { time: "10:00", title: { en: "Tenmangu Shrine", ko: "텐만구 신사" }, description: { en: "Shrine to the god of learning — students come for exam success.", ko: "학문의 신 신사 — 시험 성공을 기원하는 학생들." }, type: "sightseeing", location: { lat: 33.5197, lng: 130.5347 } },
    { time: "11:30", title: { en: "Umegae mochi & Starbucks", ko: "우메가에 모치 & 스타벅스" }, description: { en: "Famous plum mochi. Kengo Kuma's unique Starbucks design.", ko: "유명 매화 모치. 쿠마 켄고의 독특한 스타벅스." }, type: "dining", location: { lat: 33.5200, lng: 130.5340 } },
    { time: "13:00", title: { en: "Kyushu National Museum", ko: "규슈 국립 박물관" }, description: { en: "Modern museum behind the shrine.", ko: "신사 뒤편 현대적 박물관." }, type: "sightseeing", location: { lat: 33.5180, lng: 130.5370 } },
  ], center: { lat: 33.5369, lng: 130.5012 }, tags: ["shrine", "mochi", "study", "museum"], coverGradient: "from-pink-400 to-purple-500" },

  // ════════════════════════════════════════════════════
  // PARIS (5 courses)
  // ════════════════════════════════════════════════════
  { id: "paris-eiffel-seine", city: "paris", title: { en: "Eiffel Tower & Seine Cruise", ko: "에펠탑 & 센강 크루즈" }, summary: { en: "Paris's icon by day, romantic Seine cruise at sunset.", ko: "파리의 상징 에펠탑, 선셋 센강 크루즈." }, styles: ["relaxed", "efficient"], travelerTypes: ["couple", "family"], activities: [
    { time: "10:00", title: { en: "Eiffel Tower", ko: "에펠탑" }, description: { en: "Book summit tickets online in advance.", ko: "정상 티켓은 온라인 사전 예매 필수." }, type: "sightseeing", location: { lat: 48.8584, lng: 2.2945 } },
    { time: "13:00", title: { en: "Lunch on Rue Cler", ko: "뤼 클레르에서 점심" }, description: { en: "Charming market street near the tower.", ko: "타워 근처 매력적인 시장 거리." }, type: "dining", location: { lat: 48.8570, lng: 2.3060 } },
    { time: "18:00", title: { en: "Seine River sunset cruise", ko: "센강 선셋 크루즈" }, description: { en: "1-hour Bateaux Mouches cruise past Notre-Dame.", ko: "노트르담을 지나는 1시간 바토무슈 크루즈." }, type: "tour", location: { lat: 48.8610, lng: 2.3060 } },
  ], center: { lat: 48.8588, lng: 2.3022 }, tags: ["eiffel", "cruise", "romantic", "iconic"], coverGradient: "from-blue-400 to-indigo-600" },

  { id: "paris-louvre-marais", city: "paris", title: { en: "Louvre & Le Marais", ko: "루브르 & 르 마레" }, summary: { en: "World's greatest art museum, then Paris's trendiest neighborhood.", ko: "세계 최고의 미술관, 파리에서 가장 트렌디한 동네." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "09:00", title: { en: "Louvre Museum", ko: "루브르 박물관" }, description: { en: "Mona Lisa, Venus de Milo — allow 3 hours minimum.", ko: "모나리자, 밀로의 비너스 — 최소 3시간 필요." }, type: "sightseeing", location: { lat: 48.8606, lng: 2.3376 } },
    { time: "13:00", title: { en: "Falafel lunch on Rue des Rosiers", ko: "로지에 거리 팔라펠 점심" }, description: { en: "L'As du Fallafel — best falafel in Paris.", ko: "라스 뒤 팔라펠 — 파리 최고의 팔라펠." }, type: "dining", location: { lat: 48.8565, lng: 2.3582 } },
    { time: "15:00", title: { en: "Le Marais galleries & vintage", ko: "르 마레 갤러리 & 빈티지" }, description: { en: "Art galleries, vintage shops, and trendy cafes.", ko: "갤러리, 빈티지 숍, 트렌디한 카페." }, type: "shopping", location: { lat: 48.8570, lng: 2.3600 } },
    { time: "18:00", title: { en: "Place des Vosges sunset", ko: "보주 광장 선셋" }, description: { en: "Paris's oldest planned square — perfect for an evening drink.", ko: "파리에서 가장 오래된 계획 광장." }, type: "free", location: { lat: 48.8553, lng: 2.3655 } },
  ], center: { lat: 48.8574, lng: 2.3553 }, tags: ["museum", "art", "trendy", "shopping"], coverGradient: "from-amber-400 to-orange-500" },

  { id: "paris-montmartre", city: "paris", title: { en: "Montmartre & Sacré-Cœur", ko: "몽마르트르 & 사크레쾨르" }, summary: { en: "Artist hill, Sacré-Cœur basilica, and street performers.", ko: "예술가의 언덕, 사크레쾨르 성당, 거리 공연." }, styles: ["relaxed"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "10:00", title: { en: "Sacré-Cœur Basilica", ko: "사크레쾨르 성당" }, description: { en: "White-domed basilica on the highest point in Paris.", ko: "파리 최고 높은 지점의 하얀 돔 성당." }, type: "sightseeing", location: { lat: 48.8867, lng: 2.3431 } },
    { time: "11:30", title: { en: "Place du Tertre artists", ko: "테르트르 광장 예술가" }, description: { en: "Watch artists paint portraits and street performers.", ko: "예술가들의 초상화와 거리 공연 관람." }, type: "free", location: { lat: 48.8863, lng: 2.3408 } },
    { time: "13:00", title: { en: "French bistro lunch", ko: "프랑스 비스트로 점심" }, description: { en: "Classic French onion soup and croque monsieur.", ko: "프랑스 양파 수프와 크로크 무슈." }, type: "dining", location: { lat: 48.8850, lng: 2.3420 } },
    { time: "15:00", title: { en: "Moulin Rouge area walk", ko: "물랑 루즈 주변 산책" }, description: { en: "See the famous cabaret and nearby vintage shops.", ko: "유명 카바레와 근처 빈티지 숍 구경." }, type: "sightseeing", location: { lat: 48.8842, lng: 2.3322 } },
  ], center: { lat: 48.8856, lng: 2.3395 }, tags: ["art", "basilica", "artists", "bohemian"], coverGradient: "from-rose-400 to-pink-600" },

  { id: "paris-versailles", city: "paris", title: { en: "Versailles Day Trip", ko: "베르사유 당일 여행" }, summary: { en: "Palace of Versailles, Hall of Mirrors, and vast gardens.", ko: "베르사유 궁전, 거울의 방, 광대한 정원." }, styles: ["efficient", "activity-focused"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "08:30", title: { en: "RER C to Versailles", ko: "RER C로 베르사유 이동" }, description: { en: "40 minutes from central Paris.", ko: "파리 중심에서 40분." }, type: "transport", location: { lat: 48.8566, lng: 2.3522 } },
    { time: "10:00", title: { en: "Palace of Versailles", ko: "베르사유 궁전" }, description: { en: "Hall of Mirrors, King's apartments, Chapel.", ko: "거울의 방, 왕의 아파트먼트, 예배당." }, type: "sightseeing", location: { lat: 48.8049, lng: 2.1204 } },
    { time: "13:00", title: { en: "Garden picnic", ko: "정원 피크닉" }, description: { en: "Buy baguette and cheese for a garden picnic.", ko: "바게트와 치즈를 사서 정원 피크닉." }, type: "dining", location: { lat: 48.8050, lng: 2.1150 } },
    { time: "14:30", title: { en: "Grand Trianon & Marie-Antoinette's Estate", ko: "그랑 트리아농 & 마리 앙투아네트 별장" }, description: { en: "Queen's private hamlet and gardens.", ko: "왕비의 사적 마을과 정원." }, type: "sightseeing", location: { lat: 48.8140, lng: 2.1050 } },
  ], center: { lat: 48.8201, lng: 2.1232 }, tags: ["palace", "garden", "royalty", "day-trip"], coverGradient: "from-yellow-300 to-amber-500" },

  { id: "paris-latin-quarter-notredame", city: "paris", title: { en: "Latin Quarter & Notre-Dame", ko: "라탱 지구 & 노트르담" }, summary: { en: "Student quarter, Shakespeare & Co, and the famous cathedral.", ko: "학생 지구, 셰익스피어 앤 코, 유명 성당." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "couple"], activities: [
    { time: "10:00", title: { en: "Notre-Dame Cathedral (exterior)", ko: "노트르담 성당 (외부)" }, description: { en: "Under restoration — still stunning from outside.", ko: "복원 중이지만 외부에서도 여전히 장관." }, type: "sightseeing", location: { lat: 48.8530, lng: 2.3499 } },
    { time: "11:00", title: { en: "Shakespeare & Company bookshop", ko: "셰익스피어 앤 컴퍼니 서점" }, description: { en: "Legendary English-language bookshop since 1919.", ko: "1919년부터의 전설적인 영어 서점." }, type: "shopping", location: { lat: 48.8526, lng: 2.3471 } },
    { time: "13:00", title: { en: "Crêpe lunch on Rue de la Huchette", ko: "위셰트 거리 크레이프 점심" }, description: { en: "Sweet and savory crêpes in the Latin Quarter.", ko: "라탱 지구에서 달콤한 크레이프와 짭조름한 크레이프." }, type: "dining", location: { lat: 48.8527, lng: 2.3463 } },
    { time: "15:00", title: { en: "Luxembourg Gardens", ko: "뤽상부르 정원" }, description: { en: "Beautiful formal gardens — sit by the pond.", ko: "아름다운 정원 — 연못 옆에 앉으세요." }, type: "free", location: { lat: 48.8462, lng: 2.3372 } },
  ], center: { lat: 48.8511, lng: 2.3451 }, tags: ["cathedral", "bookshop", "garden", "student"], coverGradient: "from-slate-400 to-gray-600" },

  // ════════════════════════════════════════════════════
  // ROME (4 courses), FLORENCE (3), VENICE (3)
  // LONDON (4), BARCELONA (4)
  // SHANGHAI (3), BEIJING (3)
  // LA (4), LAS VEGAS (3), NEW YORK (5), SEATTLE (3), BOSTON (3)
  // ISTANBUL (4), CAPPADOCIA (3), ANTALYA (3)
  // ════════════════════════════════════════════════════
  // These remaining cities will use the same compact format.
  // For brevity, adding 3-4 courses per city with realistic GPS.

  // ROME
  { id: "rome-colosseum-forum", city: "rome", title: { en: "Colosseum & Roman Forum", ko: "콜로세움 & 로마 포럼" }, summary: { en: "Ancient Rome's greatest hits in one morning.", ko: "고대 로마의 핵심을 한 아침에." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "08:30", title: { en: "Colosseum guided tour", ko: "콜로세움 가이드 투어" }, description: { en: "Skip the line with pre-booked tickets.", ko: "사전 예매 티켓으로 줄 건너뛰기." }, type: "sightseeing", location: { lat: 41.8902, lng: 12.4922 } },
    { time: "11:00", title: { en: "Roman Forum & Palatine Hill", ko: "로마 포럼 & 팔라티노 언덕" }, description: { en: "Walk where Caesar walked.", ko: "카이사르가 걸었던 곳을 걸어보세요." }, type: "sightseeing", location: { lat: 41.8925, lng: 12.4853 } },
    { time: "13:30", title: { en: "Pasta lunch at Rione Monti", ko: "리오네 몬티에서 파스타 점심" }, description: { en: "Carbonara or cacio e pepe in Rome's hippest neighborhood.", ko: "로마에서 가장 트렌디한 동네에서 카르보나라." }, type: "dining", location: { lat: 41.8950, lng: 12.4950 } },
  ], center: { lat: 41.8926, lng: 12.4908 }, tags: ["ancient", "colosseum", "history"], coverGradient: "from-amber-500 to-orange-700" },

  { id: "rome-vatican-trastevere", city: "rome", title: { en: "Vatican & Trastevere", ko: "바티칸 & 트라스테베레" }, summary: { en: "Sistine Chapel, St Peter's, then dinner in Trastevere.", ko: "시스티나 예배당, 성 베드로 대성당, 트라스테베레 저녁." }, styles: ["efficient", "relaxed"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "08:00", title: { en: "Vatican Museums & Sistine Chapel", ko: "바티칸 박물관 & 시스티나 예배당" }, description: { en: "Book the first entry slot. Allow 3 hours.", ko: "첫 번째 입장 시간 예약. 3시간 소요." }, type: "sightseeing", location: { lat: 41.9065, lng: 12.4536 } },
    { time: "12:00", title: { en: "St. Peter's Basilica", ko: "성 베드로 대성당" }, description: { en: "Free entry. Climb the dome for city views.", ko: "무료 입장. 돔에 올라가면 도시 전경." }, type: "sightseeing", location: { lat: 41.9022, lng: 12.4539 } },
    { time: "19:00", title: { en: "Trastevere dinner & gelato", ko: "트라스테베레 저녁 & 젤라토" }, description: { en: "Cobblestone streets, trattorias, and the best gelato.", ko: "자갈길, 트라토리아, 최고의 젤라토." }, type: "dining", location: { lat: 41.8899, lng: 12.4700 } },
  ], center: { lat: 41.8995, lng: 12.4592 }, tags: ["vatican", "art", "church", "gelato"], coverGradient: "from-sky-400 to-blue-600" },

  { id: "rome-trevi-spanish-steps", city: "rome", title: { en: "Trevi Fountain & Spanish Steps", ko: "트레비 분수 & 스페인 계단" }, summary: { en: "Baroque fountains, piazzas, and espresso in Rome's center.", ko: "바로크 분수, 광장, 로마 중심의 에스프레소." }, styles: ["relaxed"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "09:00", title: { en: "Trevi Fountain (early)", ko: "트레비 분수 (이른 아침)" }, description: { en: "Go at 7am for no crowds. Throw a coin.", ko: "새벽 7시에 가면 혼잡하지 않음. 동전 던지기." }, type: "sightseeing", location: { lat: 41.9009, lng: 12.4833 } },
    { time: "10:30", title: { en: "Pantheon", ko: "판테온" }, description: { en: "2,000-year-old temple with the world's largest unreinforced dome.", ko: "2천 년 된 신전. 세계 최대 비보강 돔." }, type: "sightseeing", location: { lat: 41.8986, lng: 12.4769 } },
    { time: "12:00", title: { en: "Piazza Navona lunch", ko: "나보나 광장 점심" }, description: { en: "Beautiful baroque square with fountain sculptures.", ko: "분수 조각이 있는 바로크 광장." }, type: "dining", location: { lat: 41.8992, lng: 12.4731 } },
    { time: "14:00", title: { en: "Spanish Steps & Via Condotti", ko: "스페인 계단 & 비아 콘도티" }, description: { en: "Famous staircase and luxury shopping street.", ko: "유명 계단과 럭셔리 쇼핑 거리." }, type: "sightseeing", location: { lat: 41.9060, lng: 12.4828 } },
  ], center: { lat: 41.9012, lng: 12.4790 }, tags: ["fountain", "baroque", "piazza", "romantic"], coverGradient: "from-rose-400 to-red-500" },

  { id: "rome-borghese-aperitivo", city: "rome", title: { en: "Villa Borghese & Aperitivo", ko: "보르게세 공원 & 아페리티보" }, summary: { en: "Art gallery in the park, then Roman-style sunset drinks.", ko: "공원 속 갤러리, 로마식 선셋 드링크." }, styles: ["relaxed", "hotel-focused"], travelerTypes: ["couple", "solo"], activities: [
    { time: "09:00", title: { en: "Galleria Borghese", ko: "보르게세 갤러리" }, description: { en: "Bernini and Caravaggio masterpieces. Must pre-book.", ko: "베르니니와 카라바조 걸작. 사전 예약 필수." }, type: "sightseeing", location: { lat: 41.9142, lng: 12.4921 } },
    { time: "12:00", title: { en: "Villa Borghese park walk", ko: "보르게세 공원 산책" }, description: { en: "Rent a rowboat on the lake or walk the gardens.", ko: "호수에서 보트를 빌리거나 정원 산책." }, type: "free", location: { lat: 41.9130, lng: 12.4870 } },
    { time: "18:00", title: { en: "Aperitivo at Pincio Terrace", ko: "핀치오 테라스 아페리티보" }, description: { en: "Sunset cocktails overlooking Piazza del Popolo.", ko: "포폴로 광장을 내려다보며 선셋 칵테일." }, type: "dining", location: { lat: 41.9117, lng: 12.4768 } },
  ], center: { lat: 41.9130, lng: 12.4853 }, tags: ["gallery", "park", "aperitivo", "sunset"], coverGradient: "from-violet-400 to-purple-600" },

  // FLORENCE
  { id: "florence-duomo-uffizi", city: "florence", title: { en: "Duomo & Uffizi Gallery", ko: "두오모 & 우피치 갤러리" }, summary: { en: "Brunelleschi's dome and Renaissance masterpieces.", ko: "브루넬레스키의 돔과 르네상스 걸작." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "08:30", title: { en: "Climb the Duomo dome", ko: "두오모 돔 등반" }, description: { en: "463 steps to the top. Pre-book required.", ko: "463계단. 사전 예약 필수." }, type: "sightseeing", location: { lat: 43.7731, lng: 11.2560 } },
    { time: "11:00", title: { en: "Uffizi Gallery", ko: "우피치 갤러리" }, description: { en: "Botticelli, Da Vinci, Raphael. Allow 2-3 hours.", ko: "보티첼리, 다빈치, 라파엘. 2~3시간 소요." }, type: "sightseeing", location: { lat: 43.7677, lng: 11.2553 } },
    { time: "14:00", title: { en: "Bistecca fiorentina lunch", ko: "비스테카 피오렌티나 점심" }, description: { en: "Florence's famous T-bone steak.", ko: "피렌체 명물 티본 스테이크." }, type: "dining", location: { lat: 43.7700, lng: 11.2500 } },
  ], center: { lat: 43.7703, lng: 11.2538 }, tags: ["dome", "art", "renaissance", "gallery"], coverGradient: "from-orange-400 to-red-500" },

  { id: "florence-ponte-vecchio-oltrarno", city: "florence", title: { en: "Ponte Vecchio & Oltrarno", ko: "베키오 다리 & 올트라르노" }, summary: { en: "Goldsmith bridge and artisan neighborhood across the Arno.", ko: "금세공 다리와 아르노강 건너 장인의 동네." }, styles: ["relaxed"], travelerTypes: ["couple", "solo"], activities: [
    { time: "10:00", title: { en: "Ponte Vecchio walk", ko: "베키오 다리 산책" }, description: { en: "Medieval bridge with goldsmith and jewelry shops.", ko: "금세공과 보석 가게가 있는 중세 다리." }, type: "sightseeing", location: { lat: 43.7680, lng: 11.2531 } },
    { time: "11:30", title: { en: "Palazzo Pitti", ko: "피티 궁전" }, description: { en: "Medici palace with vast Boboli Gardens behind.", ko: "뒤에 보볼리 정원이 있는 메디치 궁전." }, type: "sightseeing", location: { lat: 43.7650, lng: 11.2500 } },
    { time: "14:00", title: { en: "Oltrarno artisan workshops", ko: "올트라르노 장인 공방" }, description: { en: "Leather craftsmen, bookbinders, and framers.", ko: "가죽 장인, 제본공, 액자 장인." }, type: "shopping", location: { lat: 43.7660, lng: 11.2450 } },
    { time: "16:00", title: { en: "Gelato at Piazzale Michelangelo", ko: "미켈란젤로 광장 젤라토" }, description: { en: "Best viewpoint in Florence — bring gelato for sunset.", ko: "피렌체 최고 전망 — 젤라토와 함께 선셋." }, type: "free", location: { lat: 43.7629, lng: 11.2650 } },
  ], center: { lat: 43.7655, lng: 11.2533 }, tags: ["bridge", "artisan", "sunset", "gardens"], coverGradient: "from-amber-400 to-yellow-600" },

  { id: "florence-tuscan-wine", city: "florence", title: { en: "Tuscan Wine & Countryside", ko: "투스카니 와인 & 시골" }, summary: { en: "Half-day wine tasting in Chianti hills.", ko: "키안티 언덕에서 반나절 와인 테이스팅." }, styles: ["relaxed", "hotel-focused"], travelerTypes: ["couple", "friends"], activities: [
    { time: "10:00", title: { en: "Drive to Chianti", ko: "키안티로 이동" }, description: { en: "30-minute drive through cypress-lined roads.", ko: "사이프러스 가로수길을 따라 30분 이동." }, type: "transport", location: { lat: 43.7696, lng: 11.2558 } },
    { time: "11:00", title: { en: "Wine estate tour", ko: "와인 에스테이트 투어" }, description: { en: "Tour vineyards and cellars, taste 4-5 wines.", ko: "포도원과 셀러 투어, 4~5종 와인 시음." }, type: "tour", location: { lat: 43.5500, lng: 11.2300 } },
    { time: "13:00", title: { en: "Tuscan farm lunch", ko: "투스카니 팜 런치" }, description: { en: "Bruschetta, pasta, olive oil — all from the estate.", ko: "브루스케타, 파스타, 올리브 오일 — 모두 농장산." }, type: "dining", location: { lat: 43.5510, lng: 11.2310 } },
  ], center: { lat: 43.6235, lng: 11.2389 }, tags: ["wine", "countryside", "tuscany", "tasting"], coverGradient: "from-green-400 to-emerald-600" },

  // VENICE
  { id: "venice-san-marco-rialto", city: "venice", title: { en: "San Marco & Rialto Bridge", ko: "산 마르코 & 리알토 다리" }, summary: { en: "St. Mark's Basilica, Doge's Palace, and the iconic bridge.", ko: "성 마르코 대성당, 도제 궁전, 상징적인 다리." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "09:00", title: { en: "St. Mark's Basilica", ko: "성 마르코 대성당" }, description: { en: "Gold mosaic interior. Free entry, skip-line tickets available.", ko: "금 모자이크 내부. 무료 입장, 스킵라인 가능." }, type: "sightseeing", location: { lat: 45.4345, lng: 12.3397 } },
    { time: "10:30", title: { en: "Doge's Palace", ko: "도제 궁전" }, description: { en: "Bridge of Sighs and Gothic architecture.", ko: "탄식의 다리와 고딕 건축." }, type: "sightseeing", location: { lat: 45.4337, lng: 12.3408 } },
    { time: "13:00", title: { en: "Rialto Market lunch", ko: "리알토 시장 점심" }, description: { en: "Fresh cicchetti (Venetian tapas) near Rialto Bridge.", ko: "리알토 다리 근처 치케티(베네치안 타파스)." }, type: "dining", location: { lat: 45.4381, lng: 12.3358 } },
  ], center: { lat: 45.4354, lng: 12.3388 }, tags: ["basilica", "palace", "bridge", "historic"], coverGradient: "from-blue-400 to-cyan-600" },

  { id: "venice-gondola-murano", city: "venice", title: { en: "Gondola Ride & Murano Glass", ko: "곤돌라 & 무라노 유리" }, summary: { en: "Classic gondola through canals, then glass-blowing on Murano.", ko: "운하 곤돌라, 무라노 섬 유리 공예." }, styles: ["relaxed"], travelerTypes: ["couple", "family"], activities: [
    { time: "10:00", title: { en: "Gondola ride", ko: "곤돌라 탑승" }, description: { en: "30-minute ride through hidden canals. Book ahead.", ko: "숨겨진 운하 30분 탑승. 사전 예약." }, type: "tour", location: { lat: 45.4340, lng: 12.3360 } },
    { time: "12:00", title: { en: "Vaporetto to Murano", ko: "바포레토로 무라노 이동" }, description: { en: "Water bus to the glass island.", ko: "수상버스로 유리 섬 이동." }, type: "transport", location: { lat: 45.4400, lng: 12.3350 } },
    { time: "13:00", title: { en: "Glass-blowing demo", ko: "유리 공예 시연" }, description: { en: "Watch master artisans create glass art.", ko: "장인 예술가들의 유리 공예 관람." }, type: "tour", location: { lat: 45.4580, lng: 12.3520 } },
    { time: "15:00", title: { en: "Murano shopping & gelato", ko: "무라노 쇼핑 & 젤라토" }, description: { en: "Buy glass souvenirs and enjoy island gelato.", ko: "유리 기념품 구매와 섬 젤라토." }, type: "shopping", location: { lat: 45.4570, lng: 12.3510 } },
  ], center: { lat: 45.4473, lng: 12.3435 }, tags: ["gondola", "glass", "murano", "romantic"], coverGradient: "from-teal-400 to-blue-500" },

  { id: "venice-burano-colors", city: "venice", title: { en: "Burano Colorful Island", ko: "부라노 알록달록 섬" }, summary: { en: "Most colorful island in Venice — lace, photos, and seafood.", ko: "베네치아에서 가장 알록달록한 섬 — 레이스, 사진, 해산물." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["couple", "friends", "solo"], activities: [
    { time: "09:00", title: { en: "Vaporetto to Burano", ko: "바포레토로 부라노 이동" }, description: { en: "45-minute water bus from Fondamente Nove.", ko: "폰다멘테 노베에서 수상버스 45분." }, type: "transport", location: { lat: 45.4430, lng: 12.3380 } },
    { time: "10:00", title: { en: "Rainbow houses walk", ko: "무지개 집 산책" }, description: { en: "Every house is painted a different color. Photographer's paradise.", ko: "모든 집이 다른 색. 사진 작가의 천국." }, type: "sightseeing", location: { lat: 45.4856, lng: 12.4173 } },
    { time: "12:00", title: { en: "Burano lace museum & shopping", ko: "부라노 레이스 박물관 & 쇼핑" }, description: { en: "Traditional lace-making and handmade souvenirs.", ko: "전통 레이스 공예와 수제 기념품." }, type: "shopping", location: { lat: 45.4860, lng: 12.4180 } },
    { time: "13:30", title: { en: "Fresh seafood risotto lunch", ko: "해산물 리조또 점심" }, description: { en: "Burano is famous for its fresh seafood risotto.", ko: "부라노는 신선한 해산물 리조또로 유명." }, type: "dining", location: { lat: 45.4855, lng: 12.4170 } },
  ], center: { lat: 45.4750, lng: 12.3976 }, tags: ["colorful", "lace", "island", "photography"], coverGradient: "from-pink-400 to-yellow-400" },

  // LONDON
  { id: "london-westminster-southbank", city: "london", title: { en: "Westminster & South Bank", ko: "웨스트민스터 & 사우스뱅크" }, summary: { en: "Big Ben, Parliament, London Eye, and Thames walk.", ko: "빅벤, 국회의사당, 런던아이, 템즈강 산책." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "09:00", title: { en: "Westminster Abbey & Big Ben", ko: "웨스트민스터 사원 & 빅벤" }, description: { en: "Gothic abbey and the iconic clock tower.", ko: "고딕 사원과 상징적인 시계탑." }, type: "sightseeing", location: { lat: 51.4994, lng: -0.1275 } },
    { time: "11:00", title: { en: "London Eye", ko: "런던 아이" }, description: { en: "30-minute rotation with Thames and city panorama.", ko: "30분 회전, 템즈강과 도시 파노라마." }, type: "sightseeing", location: { lat: 51.5033, lng: -0.1196 } },
    { time: "13:00", title: { en: "South Bank food market", ko: "사우스뱅크 음식 시장" }, description: { en: "Street food stalls along the Thames.", ko: "템즈강변 길거리 음식 노점." }, type: "dining", location: { lat: 51.5055, lng: -0.1150 } },
    { time: "15:00", title: { en: "Tate Modern", ko: "테이트 모던" }, description: { en: "Free modern art museum in a former power station.", ko: "옛 발전소의 무료 현대 미술관." }, type: "sightseeing", location: { lat: 51.5076, lng: -0.0994 } },
  ], center: { lat: 51.5040, lng: -0.1154 }, tags: ["parliament", "eye", "thames", "iconic"], coverGradient: "from-blue-500 to-indigo-700" },

  { id: "london-british-museum-covent", city: "london", title: { en: "British Museum & Covent Garden", ko: "대영박물관 & 코벤트 가든" }, summary: { en: "World's greatest museum and London's liveliest piazza.", ko: "세계 최고의 박물관과 런던에서 가장 활기찬 광장." }, styles: ["efficient", "relaxed"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "10:00", title: { en: "British Museum", ko: "대영박물관" }, description: { en: "Rosetta Stone, Egyptian mummies, Parthenon marbles. Free.", ko: "로제타석, 이집트 미라, 파르테논 대리석. 무료." }, type: "sightseeing", location: { lat: 51.5194, lng: -0.1270 } },
    { time: "13:00", title: { en: "Covent Garden lunch", ko: "코벤트 가든 점심" }, description: { en: "Street performers, market hall, and restaurants.", ko: "거리 공연, 마켓 홀, 레스토랑." }, type: "dining", location: { lat: 51.5117, lng: -0.1223 } },
    { time: "15:00", title: { en: "Seven Dials & Neal's Yard", ko: "세븐 다이얼스 & 닐스 야드" }, description: { en: "Colorful courtyard and indie shops.", ko: "알록달록한 안마당과 인디 숍." }, type: "shopping", location: { lat: 51.5131, lng: -0.1266 } },
  ], center: { lat: 51.5147, lng: -0.1253 }, tags: ["museum", "free", "market", "culture"], coverGradient: "from-amber-400 to-orange-500" },

  { id: "london-tower-shoreditch", city: "london", title: { en: "Tower of London & Shoreditch", ko: "런던 타워 & 쇼디치" }, summary: { en: "Crown Jewels, Tower Bridge, then East London street art.", ko: "왕관 보석, 타워 브릿지, 이스트 런던 스트리트 아트." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "09:00", title: { en: "Tower of London", ko: "런던 타워" }, description: { en: "Crown Jewels, Beefeaters, 1,000 years of history.", ko: "왕관 보석, 비프이터, 1000년 역사." }, type: "sightseeing", location: { lat: 51.5081, lng: -0.0759 } },
    { time: "12:00", title: { en: "Tower Bridge walk", ko: "타워 브릿지 산책" }, description: { en: "Walk across the glass floor high above the Thames.", ko: "템즈강 위 유리 바닥을 걸어보세요." }, type: "sightseeing", location: { lat: 51.5055, lng: -0.0754 } },
    { time: "14:00", title: { en: "Shoreditch street art", ko: "쇼디치 스트리트 아트" }, description: { en: "Brick Lane, Banksy murals, and vintage markets.", ko: "브릭 레인, 뱅크시 벽화, 빈티지 마켓." }, type: "sightseeing", location: { lat: 51.5240, lng: -0.0720 } },
    { time: "19:00", title: { en: "Curry on Brick Lane", ko: "브릭 레인 커리" }, description: { en: "London's best curry street — Bangladeshi and Indian.", ko: "런던 최고의 커리 거리." }, type: "dining", location: { lat: 51.5215, lng: -0.0720 } },
  ], center: { lat: 51.5148, lng: -0.0738 }, tags: ["tower", "bridge", "street-art", "curry"], coverGradient: "from-red-500 to-rose-600" },

  { id: "london-notting-hill-hyde", city: "london", title: { en: "Notting Hill & Hyde Park", ko: "노팅힐 & 하이드 파크" }, summary: { en: "Pastel houses, Portobello Market, and London's great park.", ko: "파스텔 집, 포토벨로 마켓, 런던의 대공원." }, styles: ["relaxed"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "09:00", title: { en: "Portobello Road Market", ko: "포토벨로 마켓" }, description: { en: "Antiques, vintage, and street food. Best on Saturday.", ko: "골동품, 빈티지, 길거리 음식. 토요일이 최고." }, type: "shopping", location: { lat: 51.5153, lng: -0.2054 } },
    { time: "12:00", title: { en: "Notting Hill pastel houses", ko: "노팅힐 파스텔 집" }, description: { en: "Instagram-famous pastel-colored terraces.", ko: "인스타그램에서 유명한 파스텔 테라스 하우스." }, type: "sightseeing", location: { lat: 51.5150, lng: -0.2050 } },
    { time: "14:00", title: { en: "Hyde Park & Kensington Gardens", ko: "하이드 파크 & 켄싱턴 가든" }, description: { en: "Serpentine Lake, Diana Memorial, and green space.", ko: "서펜타인 호수, 다이애나 기념관, 녹지." }, type: "free", location: { lat: 51.5073, lng: -0.1657 } },
    { time: "16:00", title: { en: "Afternoon tea", ko: "애프터눈 티" }, description: { en: "Classic English afternoon tea near Kensington.", ko: "켄싱턴 근처 클래식 영국 애프터눈 티." }, type: "dining", location: { lat: 51.5010, lng: -0.1780 } },
  ], center: { lat: 51.5097, lng: -0.1885 }, tags: ["pastel", "market", "park", "tea"], coverGradient: "from-pink-300 to-purple-400" },

  // BARCELONA
  { id: "barcelona-sagrada-gothic", city: "barcelona", title: { en: "Sagrada Família & Gothic Quarter", ko: "사그라다 파밀리아 & 고딕 지구" }, summary: { en: "Gaudí's masterpiece and Barcelona's medieval heart.", ko: "가우디의 걸작과 바르셀로나 중세 심장부." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "09:00", title: { en: "Sagrada Família", ko: "사그라다 파밀리아" }, description: { en: "Book tower access months ahead. Allow 2 hours.", ko: "타워 입장은 몇 달 전에 예약. 2시간 소요." }, type: "sightseeing", location: { lat: 41.4036, lng: 2.1744 } },
    { time: "12:00", title: { en: "Gothic Quarter walk", ko: "고딕 지구 산책" }, description: { en: "2,000 years of history in narrow medieval lanes.", ko: "좁은 중세 골목의 2천 년 역사." }, type: "sightseeing", location: { lat: 41.3833, lng: 2.1761 } },
    { time: "13:30", title: { en: "Tapas lunch on Carrer de Blai", ko: "블라이 거리 타파스 점심" }, description: { en: "Barcelona's best tapas street — pintxos and vermouth.", ko: "바르셀로나 최고 타파스 거리." }, type: "dining", location: { lat: 41.3740, lng: 2.1660 } },
    { time: "16:00", title: { en: "La Rambla & Boqueria Market", ko: "라 람블라 & 보케리아 시장" }, description: { en: "Famous boulevard and the best food market in Spain.", ko: "유명 대로와 스페인 최고 식품 시장." }, type: "shopping", location: { lat: 41.3817, lng: 2.1720 } },
  ], center: { lat: 41.3857, lng: 2.1721 }, tags: ["gaudi", "gothic", "tapas", "market"], coverGradient: "from-orange-400 to-red-600" },

  { id: "barcelona-park-guell-gracia", city: "barcelona", title: { en: "Park Güell & Gràcia", ko: "구엘 공원 & 그라시아" }, summary: { en: "Gaudí's colorful park and Barcelona's local neighborhood.", ko: "가우디의 알록달록 공원과 현지인 동네." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["couple", "friends", "solo"], activities: [
    { time: "08:00", title: { en: "Park Güell (early entry)", ko: "구엘 공원 (조기 입장)" }, description: { en: "Mosaic terraces, dragon fountain, city views. Book first slot.", ko: "모자이크 테라스, 도마뱀 분수, 도시 전경." }, type: "sightseeing", location: { lat: 41.4145, lng: 2.1527 } },
    { time: "11:00", title: { en: "Gràcia neighborhood", ko: "그라시아 동네" }, description: { en: "Local squares, indie shops, and no tourist crowds.", ko: "현지 광장, 인디 숍, 관광객 없음." }, type: "free", location: { lat: 41.4022, lng: 2.1568 } },
    { time: "13:00", title: { en: "Lunch at Plaça del Sol", ko: "솔 광장 점심" }, description: { en: "Sunny square with terrace restaurants.", ko: "테라스 레스토랑이 있는 햇살 좋은 광장." }, type: "dining", location: { lat: 41.4028, lng: 2.1570 } },
  ], center: { lat: 41.4065, lng: 2.1555 }, tags: ["gaudi", "mosaic", "local", "park"], coverGradient: "from-green-400 to-teal-500" },

  { id: "barcelona-beach-barceloneta", city: "barcelona", title: { en: "Barceloneta Beach Day", ko: "바르셀로네타 해변" }, summary: { en: "Mediterranean beach, seafood, and waterfront bars.", ko: "지중해 해변, 해산물, 해변 바." }, styles: ["relaxed"], travelerTypes: ["couple", "friends", "family"], activities: [
    { time: "10:00", title: { en: "Barceloneta Beach", ko: "바르셀로네타 해변" }, description: { en: "City beach on the Mediterranean. Swim and sunbathe.", ko: "지중해 도시 해변. 수영과 일광욕." }, type: "beach", location: { lat: 41.3785, lng: 2.1924 } },
    { time: "13:00", title: { en: "Paella lunch", ko: "빠에야 점심" }, description: { en: "Seafood paella at a beachfront restaurant.", ko: "해변 레스토랑에서 해산물 빠에야." }, type: "dining", location: { lat: 41.3790, lng: 2.1930 } },
    { time: "16:00", title: { en: "Port Olímpic walk", ko: "올림픽 항구 산책" }, description: { en: "Marina, Gehry's fish sculpture, and chiringuito bars.", ko: "마리나, 게리의 물고기 조각, 치링기토 바." }, type: "free", location: { lat: 41.3863, lng: 2.1968 } },
    { time: "19:00", title: { en: "Sunset rooftop cocktails", ko: "선셋 루프탑 칵테일" }, description: { en: "W Hotel or Eclipse bar rooftop sunset.", ko: "W 호텔 또는 이클립스 바 루프탑 선셋." }, type: "free", location: { lat: 41.3686, lng: 2.1897 } },
  ], center: { lat: 41.3781, lng: 2.1930 }, tags: ["beach", "paella", "mediterranean", "sunset"], coverGradient: "from-cyan-400 to-blue-500" },

  { id: "barcelona-montjuic-flamenco", city: "barcelona", title: { en: "Montjuïc & Flamenco Night", ko: "몬주이크 & 플라멩코 나이트" }, summary: { en: "Castle, Olympic park, Magic Fountain, and live flamenco.", ko: "성, 올림픽 공원, 매직 분수, 라이브 플라멩코." }, styles: ["efficient", "activity-focused"], travelerTypes: ["couple", "friends"], activities: [
    { time: "10:00", title: { en: "Montjuïc Castle", ko: "몬주이크 성" }, description: { en: "17th-century fortress with harbor views.", ko: "항구 전경의 17세기 요새." }, type: "sightseeing", location: { lat: 41.3637, lng: 2.1660 } },
    { time: "12:00", title: { en: "Joan Miró Foundation", ko: "호안 미로 재단" }, description: { en: "Catalan artist's colorful works in a modernist building.", ko: "모더니스트 건물에 있는 카탈루냐 작가의 작품." }, type: "sightseeing", location: { lat: 41.3690, lng: 2.1600 } },
    { time: "21:00", title: { en: "Magic Fountain light show", ko: "매직 분수 쇼" }, description: { en: "Free water, light, and music show (check schedule).", ko: "무료 물, 빛, 음악 쇼 (일정 확인)." }, type: "sightseeing", location: { lat: 41.3713, lng: 2.1517 } },
    { time: "22:00", title: { en: "Flamenco show", ko: "플라멩코 공연" }, description: { en: "Authentic flamenco at Tablao Cordobes or Tarantos.", ko: "타블라오 코르도베스에서 정통 플라멩코." }, type: "tour", location: { lat: 41.3810, lng: 2.1740 } },
  ], center: { lat: 41.3713, lng: 2.1629 }, tags: ["castle", "art", "fountain", "flamenco"], coverGradient: "from-red-500 to-purple-600" },

  // NEW YORK (4 courses)
  { id: "newyork-midtown-times-square", city: "newyork", title: { en: "Midtown Manhattan & Times Square", ko: "미드타운 맨해튼 & 타임스 스퀘어" }, summary: { en: "Empire State, Central Park, Broadway, and the bright lights.", ko: "엠파이어 스테이트, 센트럴 파크, 브로드웨이." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "09:00", title: { en: "Empire State Building", ko: "엠파이어 스테이트 빌딩" }, description: { en: "86th floor observation deck. Go at opening for fewer crowds.", ko: "86층 전망대. 오픈 시간에 가면 혼잡 적음." }, type: "sightseeing", location: { lat: 40.7484, lng: -73.9856 } },
    { time: "11:00", title: { en: "Central Park walk", ko: "센트럴 파크 산책" }, description: { en: "Bethesda Fountain, Bow Bridge, Strawberry Fields.", ko: "베데스다 분수, 보우 브릿지, 스트로베리 필즈." }, type: "free", location: { lat: 40.7829, lng: -73.9654 } },
    { time: "14:00", title: { en: "Times Square & TKTS booth", ko: "타임스 스퀘어 & TKTS 부스" }, description: { en: "Get discounted Broadway tickets for tonight's show.", ko: "오늘 밤 브로드웨이 할인 티켓 구매." }, type: "sightseeing", location: { lat: 40.7580, lng: -73.9855 } },
    { time: "20:00", title: { en: "Broadway show", ko: "브로드웨이 공연" }, description: { en: "World-class theater — Hamilton, Wicked, or Lion King.", ko: "세계적인 공연 — 해밀턴, 위키드, 라이온 킹." }, type: "tour", location: { lat: 40.7590, lng: -73.9845 } },
  ], center: { lat: 40.7621, lng: -73.9803 }, tags: ["skyline", "broadway", "park", "iconic"], coverGradient: "from-blue-500 to-indigo-700" },

  { id: "newyork-downtown-liberty", city: "newyork", title: { en: "Statue of Liberty & Downtown", ko: "자유의 여신상 & 다운타운" }, summary: { en: "Liberty Island, Wall Street, 9/11 Memorial, Brooklyn Bridge.", ko: "리버티 섬, 월스트리트, 9/11 메모리얼, 브루클린 브릿지." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "08:30", title: { en: "Ferry to Statue of Liberty", ko: "자유의 여신상 페리" }, description: { en: "Book pedestal or crown access weeks ahead.", ko: "기단 또는 왕관 접근은 몇 주 전 예약." }, type: "tour", location: { lat: 40.6892, lng: -74.0445 } },
    { time: "12:00", title: { en: "9/11 Memorial & Museum", ko: "9/11 메모리얼 & 박물관" }, description: { en: "Reflecting pools and underground museum.", ko: "반사 풀과 지하 박물관." }, type: "sightseeing", location: { lat: 40.7115, lng: -74.0134 } },
    { time: "15:00", title: { en: "Walk Brooklyn Bridge", ko: "브루클린 브릿지 걷기" }, description: { en: "1.3-mile walk with Manhattan skyline views.", ko: "맨해튼 스카이라인을 보며 1.3마일 도보." }, type: "sightseeing", location: { lat: 40.7061, lng: -73.9969 } },
    { time: "17:00", title: { en: "DUMBO sunset & pizza", ko: "덤보 선셋 & 피자" }, description: { en: "Best skyline views from Brooklyn. Grimaldi's pizza.", ko: "브루클린에서 최고의 스카이라인. 그리말디 피자." }, type: "dining", location: { lat: 40.7033, lng: -73.9894 } },
  ], center: { lat: 40.7025, lng: -74.0111 }, tags: ["liberty", "memorial", "bridge", "skyline"], coverGradient: "from-slate-500 to-gray-700" },

  { id: "newyork-soho-chelsea", city: "newyork", title: { en: "SoHo, Chelsea & High Line", ko: "소호, 첼시 & 하이라인" }, summary: { en: "Cast-iron architecture, galleries, and elevated park.", ko: "주철 건축물, 갤러리, 공중 공원." }, styles: ["relaxed"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "10:00", title: { en: "SoHo shopping & brunch", ko: "소호 쇼핑 & 브런치" }, description: { en: "Designer boutiques and trendy brunch spots.", ko: "디자이너 부티크와 트렌디한 브런치." }, type: "shopping", location: { lat: 40.7233, lng: -73.9985 } },
    { time: "13:00", title: { en: "Chelsea Market", ko: "첼시 마켓" }, description: { en: "Food hall in a former Nabisco factory.", ko: "옛 나비스코 공장의 푸드 홀." }, type: "dining", location: { lat: 40.7425, lng: -74.0060 } },
    { time: "14:30", title: { en: "High Line elevated park", ko: "하이라인 공중 공원" }, description: { en: "Walk the converted elevated railway through Chelsea.", ko: "옛 고가 철로를 공원으로 만든 첼시 산책로." }, type: "free", location: { lat: 40.7480, lng: -74.0048 } },
    { time: "16:30", title: { en: "Chelsea galleries", ko: "첼시 갤러리" }, description: { en: "Free contemporary art galleries — dozens to choose from.", ko: "무료 현대 미술 갤러리 — 수십 곳." }, type: "sightseeing", location: { lat: 40.7460, lng: -74.0050 } },
  ], center: { lat: 40.7400, lng: -74.0036 }, tags: ["shopping", "gallery", "park", "art"], coverGradient: "from-pink-400 to-rose-500" },

  { id: "newyork-harlem-museum-mile", city: "newyork", title: { en: "Museum Mile & Harlem", ko: "뮤지엄 마일 & 할렘" }, summary: { en: "Met Museum, Guggenheim, and Harlem soul food.", ko: "메트 뮤지엄, 구겐하임, 할렘 소울 푸드." }, styles: ["efficient", "relaxed"], travelerTypes: ["solo", "couple"], activities: [
    { time: "10:00", title: { en: "Metropolitan Museum of Art", ko: "메트로폴리탄 미술관" }, description: { en: "One of the world's greatest museums. Allow 3+ hours.", ko: "세계 최고의 미술관 중 하나. 3시간 이상." }, type: "sightseeing", location: { lat: 40.7794, lng: -73.9632 } },
    { time: "14:00", title: { en: "Guggenheim Museum", ko: "구겐하임 미술관" }, description: { en: "Frank Lloyd Wright's spiral building.", ko: "프랭크 로이드 라이트의 나선형 건물." }, type: "sightseeing", location: { lat: 40.7830, lng: -73.9590 } },
    { time: "16:00", title: { en: "Harlem walk", ko: "할렘 산책" }, description: { en: "Apollo Theater, brownstones, and street culture.", ko: "아폴로 극장, 브라운스톤, 거리 문화." }, type: "sightseeing", location: { lat: 40.8100, lng: -73.9500 } },
    { time: "18:00", title: { en: "Soul food dinner", ko: "소울 푸드 저녁" }, description: { en: "Sylvia's or Red Rooster — fried chicken and waffles.", ko: "실비아스 또는 레드 루스터 — 프라이드 치킨." }, type: "dining", location: { lat: 40.8090, lng: -73.9520 } },
  ], center: { lat: 40.7954, lng: -73.9561 }, tags: ["museum", "art", "soul-food", "harlem"], coverGradient: "from-amber-400 to-orange-600" },

  // ISTANBUL (4 courses)
  { id: "istanbul-sultanahmet", city: "istanbul", title: { en: "Sultanahmet Historic Center", ko: "술탄아흐메트 역사 지구" }, summary: { en: "Hagia Sophia, Blue Mosque, and Grand Bazaar.", ko: "아야 소피아, 블루 모스크, 그랜드 바자르." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "09:00", title: { en: "Hagia Sophia", ko: "아야 소피아" }, description: { en: "1,500-year-old architectural marvel. Now a mosque again.", ko: "1500년 된 건축 경이. 현재 다시 모스크." }, type: "sightseeing", location: { lat: 41.0086, lng: 28.9802 } },
    { time: "11:00", title: { en: "Blue Mosque", ko: "블루 모스크" }, description: { en: "Six minarets and blue Iznik tiles. Free entry, dress modestly.", ko: "6개 미나렛과 파란 이즈닉 타일. 무료, 복장 주의." }, type: "sightseeing", location: { lat: 41.0055, lng: 28.9769 } },
    { time: "13:00", title: { en: "Turkish lunch", ko: "터키 점심" }, description: { en: "Kebab, pide, and ayran near the Hippodrome.", ko: "히포드롬 근처에서 케밥, 피데, 아이란." }, type: "dining", location: { lat: 41.0070, lng: 28.9760 } },
    { time: "15:00", title: { en: "Grand Bazaar", ko: "그랜드 바자르" }, description: { en: "4,000+ shops. Carpets, ceramics, spices, gold.", ko: "4000개 이상 상점. 카펫, 도자기, 향신료, 금." }, type: "shopping", location: { lat: 41.0107, lng: 28.9682 } },
  ], center: { lat: 41.0080, lng: 28.9753 }, tags: ["mosque", "bazaar", "historic", "iconic"], coverGradient: "from-blue-500 to-indigo-700" },

  { id: "istanbul-bosphorus-cruise", city: "istanbul", title: { en: "Bosphorus Cruise & Asian Side", ko: "보스포러스 크루즈 & 아시아 사이드" }, summary: { en: "Boat between Europe and Asia, then Kadıköy food market.", ko: "유럽과 아시아를 잇는 보트, 카드쿄이 먹거리." }, styles: ["relaxed"], travelerTypes: ["couple", "family"], activities: [
    { time: "10:00", title: { en: "Bosphorus cruise", ko: "보스포러스 크루즈" }, description: { en: "1.5-hour cruise with palaces, mosques, and bridges.", ko: "궁전, 모스크, 다리를 보며 1.5시간 크루즈." }, type: "tour", location: { lat: 41.0256, lng: 28.9744 } },
    { time: "13:00", title: { en: "Ferry to Kadıköy", ko: "카드쿄이 페리" }, description: { en: "Quick ferry to Istanbul's Asian side.", ko: "이스탄불 아시아 쪽 페리로 빠르게 이동." }, type: "transport", location: { lat: 41.0230, lng: 28.9780 } },
    { time: "14:00", title: { en: "Kadıköy market & fish sandwiches", ko: "카드쿄이 시장 & 고등어 샌드위치" }, description: { en: "Local market, balik ekmek, and Turkish tea.", ko: "현지 시장, 발릭 에크멕, 터키 차." }, type: "dining", location: { lat: 40.9909, lng: 29.0250 } },
    { time: "17:00", title: { en: "Çamlıca Hill sunset", ko: "참리자 언덕 선셋" }, description: { en: "Istanbul's highest point — panoramic city views.", ko: "이스탄불 최고점 — 파노라마 도시 전경." }, type: "sightseeing", location: { lat: 41.0270, lng: 29.0710 } },
  ], center: { lat: 41.0166, lng: 29.0121 }, tags: ["cruise", "bosphorus", "asia", "sunset"], coverGradient: "from-cyan-400 to-teal-600" },

  { id: "istanbul-spice-bazaar-galata", city: "istanbul", title: { en: "Spice Bazaar & Galata Tower", ko: "스파이스 바자르 & 갈라타 타워" }, summary: { en: "Aromatic spice market, Galata views, and Istiklal Avenue.", ko: "향신료 시장, 갈라타 전망, 이스티클랄 거리." }, styles: ["efficient", "relaxed"], travelerTypes: ["solo", "friends"], activities: [
    { time: "09:00", title: { en: "Spice Bazaar (Egyptian Bazaar)", ko: "스파이스 바자르" }, description: { en: "Turkish delight, saffron, dried fruits, teas.", ko: "터키 딜라이트, 사프란, 건과일, 차." }, type: "shopping", location: { lat: 41.0163, lng: 28.9706 } },
    { time: "11:00", title: { en: "Galata Tower", ko: "갈라타 타워" }, description: { en: "Medieval stone tower with 360° city views.", ko: "360도 도시 전경의 중세 석탑." }, type: "sightseeing", location: { lat: 41.0256, lng: 28.9741 } },
    { time: "13:00", title: { en: "Meyhane lunch on Nevizade", ko: "네비자데 메이하네 점심" }, description: { en: "Traditional Turkish tavern — meze and raki.", ko: "전통 터키 선술집 — 메제와 라키." }, type: "dining", location: { lat: 41.0340, lng: 28.9770 } },
    { time: "15:00", title: { en: "Istiklal Avenue walk", ko: "이스티클랄 거리 산책" }, description: { en: "Istanbul's main pedestrian street with nostalgic tram.", ko: "노스탤지 트램이 다니는 이스탄불 메인 보행자 거리." }, type: "sightseeing", location: { lat: 41.0340, lng: 28.9780 } },
  ], center: { lat: 41.0275, lng: 28.9749 }, tags: ["spices", "tower", "avenue", "meze"], coverGradient: "from-amber-500 to-orange-600" },

  { id: "istanbul-topkapi-hammam", city: "istanbul", title: { en: "Topkapi Palace & Turkish Hammam", ko: "톱카프 궁전 & 터키 하맘" }, summary: { en: "Ottoman sultan's palace, then a traditional bath experience.", ko: "오스만 술탄의 궁전, 전통 목욕 체험." }, styles: ["efficient", "relaxed"], travelerTypes: ["couple", "solo"], activities: [
    { time: "09:00", title: { en: "Topkapi Palace", ko: "톱카프 궁전" }, description: { en: "Harem, treasury, and Bosphorus views. Allow 3 hours.", ko: "하렘, 보물관, 보스포러스 전경. 3시간 소요." }, type: "sightseeing", location: { lat: 41.0115, lng: 28.9834 } },
    { time: "13:00", title: { en: "Ottoman lunch", ko: "오스만 점심" }, description: { en: "Try Ottoman-era recipes at Asitane restaurant.", ko: "아시타네 레스토랑에서 오스만 시대 요리." }, type: "dining", location: { lat: 41.0100, lng: 28.9400 } },
    { time: "16:00", title: { en: "Traditional Turkish hammam", ko: "전통 터키 하맘" }, description: { en: "Çemberlitaş or Kılıç Ali Paşa hammam. Full scrub and massage.", ko: "쳄베를리타시 또는 클르츠 알리 파샤 하맘." }, type: "tour", location: { lat: 41.0082, lng: 28.9710 } },
  ], center: { lat: 41.0099, lng: 28.9648 }, tags: ["palace", "ottoman", "hammam", "bath"], coverGradient: "from-rose-400 to-red-600" },

  // CAPPADOCIA (3 courses)
  { id: "cappadocia-balloon-valleys", city: "cappadocia", title: { en: "Hot Air Balloon & Fairy Chimneys", ko: "열기구 & 요정 굴뚝" }, summary: { en: "Sunrise balloon flight over fairy chimneys and cave valleys.", ko: "요정 굴뚝과 동굴 계곡 위로 선라이즈 열기구 비행." }, styles: ["activity-focused", "relaxed"], travelerTypes: ["couple", "friends"], activities: [
    { time: "05:00", title: { en: "Hot air balloon flight", ko: "열기구 비행" }, description: { en: "1-hour sunrise flight over Göreme. Book weeks ahead.", ko: "괴레메 위 1시간 선라이즈 비행. 몇 주 전 예약." }, type: "tour", location: { lat: 38.6431, lng: 34.8296 } },
    { time: "10:00", title: { en: "Göreme Open Air Museum", ko: "괴레메 오픈 에어 뮤지엄" }, description: { en: "Cave churches with Byzantine frescoes.", ko: "비잔틴 프레스코화가 있는 동굴 교회." }, type: "sightseeing", location: { lat: 38.6430, lng: 34.8390 } },
    { time: "13:00", title: { en: "Pottery lunch in Avanos", ko: "아바노스 도자기 마을 점심" }, description: { en: "Pottery town — try making your own.", ko: "도자기 마을 — 직접 만들어보세요." }, type: "dining", location: { lat: 38.7150, lng: 34.8470 } },
    { time: "15:00", title: { en: "Pasabag fairy chimneys", ko: "파샤바 요정 굴뚝" }, description: { en: "Multi-headed fairy chimneys — most dramatic in Cappadocia.", ko: "카파도키아에서 가장 극적인 다두 요정 굴뚝." }, type: "sightseeing", location: { lat: 38.6600, lng: 34.8620 } },
  ], center: { lat: 38.6653, lng: 34.8444 }, tags: ["balloon", "fairy-chimney", "cave", "sunrise"], coverGradient: "from-orange-400 to-amber-600" },

  { id: "cappadocia-underground-city", city: "cappadocia", title: { en: "Underground City & Ihlara Valley", ko: "지하도시 & 이흘라라 계곡" }, summary: { en: "8-story underground city and a canyon hike.", ko: "8층 지하도시와 협곡 하이킹." }, styles: ["activity-focused", "efficient"], travelerTypes: ["solo", "friends", "couple"], activities: [
    { time: "09:00", title: { en: "Derinkuyu Underground City", ko: "데린쿠유 지하도시" }, description: { en: "8 levels deep — housed 20,000 people in ancient times.", ko: "8층 깊이 — 고대에 2만 명 수용." }, type: "sightseeing", location: { lat: 38.3740, lng: 34.7340 } },
    { time: "12:00", title: { en: "Ihlara Valley hike", ko: "이흘라라 계곡 하이킹" }, description: { en: "3.5km canyon walk with rock-cut churches.", ko: "3.5km 협곡 하이킹과 바위 교회." }, type: "tour", location: { lat: 38.2570, lng: 34.2920 } },
    { time: "15:00", title: { en: "Selime Monastery", ko: "셀리메 수도원" }, description: { en: "Cathedral-sized cave monastery carved into rock.", ko: "바위에 깎아 만든 대성당 크기의 동굴 수도원." }, type: "sightseeing", location: { lat: 38.2950, lng: 34.2730 } },
  ], center: { lat: 38.3087, lng: 34.4330 }, tags: ["underground", "canyon", "hike", "cave"], coverGradient: "from-slate-500 to-gray-700" },

  { id: "cappadocia-sunset-horseback", city: "cappadocia", title: { en: "Sunset Horse Ride & Cave Hotel", ko: "선셋 승마 & 동굴 호텔" }, summary: { en: "Horseback ride through valleys at sunset, then cave hotel.", ko: "선셋 계곡 승마, 동굴 호텔 체험." }, styles: ["relaxed", "hotel-focused"], travelerTypes: ["couple"], activities: [
    { time: "10:00", title: { en: "Love Valley walk", ko: "러브 밸리 산책" }, description: { en: "Phallic-shaped rock formations. Easy hiking trail.", ko: "독특한 모양의 바위 지형. 쉬운 하이킹." }, type: "sightseeing", location: { lat: 38.6580, lng: 34.8150 } },
    { time: "13:00", title: { en: "Cave restaurant lunch", ko: "동굴 레스토랑 점심" }, description: { en: "Testi kebab (pottery kebab) in a cave restaurant.", ko: "동굴 레스토랑에서 테스티 케밥 (항아리 케밥)." }, type: "dining", location: { lat: 38.6440, lng: 34.8300 } },
    { time: "16:00", title: { en: "Sunset horseback ride", ko: "선셋 승마" }, description: { en: "2-hour ride through Red and Rose Valleys at golden hour.", ko: "레드 & 로즈 밸리에서 2시간 골든 아워 승마." }, type: "tour", location: { lat: 38.6380, lng: 34.8250 } },
  ], center: { lat: 38.6467, lng: 34.8233 }, tags: ["horseback", "sunset", "valley", "cave-hotel"], coverGradient: "from-rose-400 to-orange-500" },

  // ANTALYA (3 courses)
  { id: "antalya-old-town-waterfall", city: "antalya", title: { en: "Old Town & Düden Waterfalls", ko: "올드타운 & 뒤든 폭포" }, summary: { en: "Roman-era old town and waterfalls dropping into the sea.", ko: "로마 시대 구시가지와 바다로 떨어지는 폭포." }, styles: ["efficient", "relaxed"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "09:00", title: { en: "Kaleiçi Old Town", ko: "칼레이치 올드타운" }, description: { en: "Ottoman houses, Roman gate, and narrow alleys.", ko: "오스만 가옥, 로마 문, 좁은 골목." }, type: "sightseeing", location: { lat: 36.8841, lng: 30.7056 } },
    { time: "11:00", title: { en: "Antalya Museum", ko: "안탈리아 박물관" }, description: { en: "One of Turkey's best archaeological museums.", ko: "터키 최고의 고고학 박물관 중 하나." }, type: "sightseeing", location: { lat: 36.8850, lng: 30.6830 } },
    { time: "14:00", title: { en: "Lower Düden Waterfall", ko: "하부 뒤든 폭포" }, description: { en: "40m waterfall cascading directly into the Mediterranean.", ko: "지중해로 직접 떨어지는 40m 폭포." }, type: "sightseeing", location: { lat: 36.8510, lng: 30.7870 } },
  ], center: { lat: 36.8734, lng: 30.7252 }, tags: ["old-town", "waterfall", "roman", "museum"], coverGradient: "from-teal-400 to-cyan-600" },

  { id: "antalya-beach-resort", city: "antalya", title: { en: "Konyaaltı Beach & Resort Day", ko: "코냘르 해변 & 리조트" }, summary: { en: "Blue-flag beach, mountain backdrop, and resort relaxation.", ko: "블루 플래그 해변, 산 배경, 리조트 휴식." }, styles: ["relaxed", "hotel-focused"], travelerTypes: ["couple", "family"], activities: [
    { time: "09:00", title: { en: "Konyaaltı Beach morning", ko: "코냘르 해변 아침" }, description: { en: "Pebble beach with stunning Taurus mountain backdrop.", ko: "타우러스 산을 배경으로 한 자갈 해변." }, type: "beach", location: { lat: 36.8680, lng: 30.6340 } },
    { time: "12:00", title: { en: "Beach club lunch", ko: "비치 클럽 점심" }, description: { en: "Mediterranean cuisine with sea views.", ko: "바다 전망의 지중해 요리." }, type: "dining", location: { lat: 36.8685, lng: 30.6350 } },
    { time: "15:00", title: { en: "Antalya Aquarium", ko: "안탈리아 수족관" }, description: { en: "World's longest tunnel aquarium. Great for families.", ko: "세계에서 가장 긴 터널 수족관." }, type: "sightseeing", location: { lat: 36.8670, lng: 30.6530 } },
  ], center: { lat: 36.8678, lng: 30.6407 }, tags: ["beach", "resort", "aquarium", "mountain"], coverGradient: "from-sky-400 to-blue-500" },

  { id: "antalya-aspendos-perge", city: "antalya", title: { en: "Aspendos & Perge Ancient Cities", ko: "아스펜도스 & 페르게 고대 도시" }, summary: { en: "Best-preserved Roman theater and ancient Pamphylian city.", ko: "가장 잘 보존된 로마 극장과 고대 팜필리아 도시." }, styles: ["efficient", "activity-focused"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "09:00", title: { en: "Perge ancient city", ko: "페르게 고대 도시" }, description: { en: "Hellenistic gate, Roman baths, and colonnaded street.", ko: "헬레니즘 문, 로마 욕장, 주랑 거리." }, type: "sightseeing", location: { lat: 36.9610, lng: 30.8540 } },
    { time: "12:00", title: { en: "Local gözleme lunch", ko: "현지 괴즐레메 점심" }, description: { en: "Handmade Turkish flatbread with cheese and spinach.", ko: "수제 터키 플랫브레드와 치즈, 시금치." }, type: "dining", location: { lat: 36.9600, lng: 30.8550 } },
    { time: "14:00", title: { en: "Aspendos Theater", ko: "아스펜도스 극장" }, description: { en: "2nd-century Roman theater seating 15,000. Still used for concerts.", ko: "15,000석 2세기 로마 극장. 아직 콘서트에 사용." }, type: "sightseeing", location: { lat: 36.9389, lng: 31.1722 } },
  ], center: { lat: 36.9533, lng: 31.0271 }, tags: ["roman", "theater", "ancient", "ruins"], coverGradient: "from-amber-400 to-orange-600" },

  // LA (3 courses)
  { id: "la-hollywood-beverly-hills", city: "la", title: { en: "Hollywood & Beverly Hills", ko: "할리우드 & 비벌리 힐스" }, summary: { en: "Walk of Fame, Griffith Observatory, and Rodeo Drive.", ko: "명예의 거리, 그리피스 천문대, 로데오 드라이브." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends", "family"], activities: [
    { time: "09:00", title: { en: "Hollywood Walk of Fame", ko: "할리우드 명예의 거리" }, description: { en: "2,700+ stars on the sidewalk. TCL Chinese Theatre.", ko: "인도 위 2700개 이상의 별. TCL 차이니스 시어터." }, type: "sightseeing", location: { lat: 34.1017, lng: -118.3408 } },
    { time: "11:00", title: { en: "Griffith Observatory", ko: "그리피스 천문대" }, description: { en: "Free entry. Hollywood Sign views and city panorama.", ko: "무료 입장. 할리우드 사인과 도시 파노라마." }, type: "sightseeing", location: { lat: 34.1184, lng: -118.3004 } },
    { time: "14:00", title: { en: "Rodeo Drive window shopping", ko: "로데오 드라이브 윈도우 쇼핑" }, description: { en: "Beverly Hills' famous luxury shopping street.", ko: "비벌리 힐스의 유명 럭셔리 쇼핑 거리." }, type: "shopping", location: { lat: 34.0675, lng: -118.4005 } },
    { time: "17:00", title: { en: "Sunset at Santa Monica Pier", ko: "산타 모니카 피어 선셋" }, description: { en: "Pacific Park Ferris wheel and Route 66 endpoint.", ko: "태평양 공원 관람차와 루트 66 종점." }, type: "sightseeing", location: { lat: 34.0096, lng: -118.4974 } },
  ], center: { lat: 34.0743, lng: -118.3848 }, tags: ["hollywood", "celebrity", "sunset", "iconic"], coverGradient: "from-yellow-400 to-orange-500" },

  { id: "la-venice-malibu", city: "la", title: { en: "Venice Beach & Malibu", ko: "베니스 비치 & 말리부" }, summary: { en: "Boardwalk, Muscle Beach, Abbot Kinney, and Malibu coast.", ko: "보드워크, 머슬 비치, 애봇 키니, 말리부 해안." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["solo", "friends", "couple"], activities: [
    { time: "09:00", title: { en: "Venice Beach boardwalk", ko: "베니스 비치 보드워크" }, description: { en: "Street performers, skate park, Muscle Beach.", ko: "거리 공연, 스케이트 파크, 머슬 비치." }, type: "beach", location: { lat: 33.9850, lng: -118.4695 } },
    { time: "11:00", title: { en: "Abbot Kinney Blvd", ko: "애봇 키니 대로" }, description: { en: "LA's coolest street — boutiques, cafes, galleries.", ko: "LA에서 가장 핫한 거리 — 부티크, 카페, 갤러리." }, type: "shopping", location: { lat: 33.9920, lng: -118.4620 } },
    { time: "14:00", title: { en: "Drive to Malibu", ko: "말리부 드라이브" }, description: { en: "Pacific Coast Highway — one of the world's best drives.", ko: "퍼시픽 코스트 하이웨이 — 세계 최고의 드라이브 중 하나." }, type: "transport", location: { lat: 34.0259, lng: -118.7798 } },
    { time: "15:00", title: { en: "Malibu beach walk", ko: "말리부 해변 산책" }, description: { en: "El Matador Beach — dramatic cliff beach.", ko: "엘 마타도르 비치 — 극적인 절벽 해변." }, type: "beach", location: { lat: 34.0382, lng: -118.8760 } },
  ], center: { lat: 34.0103, lng: -118.6468 }, tags: ["beach", "boardwalk", "malibu", "drive"], coverGradient: "from-cyan-400 to-blue-500" },

  { id: "la-dtla-arts-food", city: "la", title: { en: "Downtown LA & Arts District", ko: "다운타운 LA & 아트 디스트릭트" }, summary: { en: "Grand Central Market, The Broad, and street art.", ko: "그랜드 센트럴 마켓, 더 브로드, 스트리트 아트." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "10:00", title: { en: "The Broad museum", ko: "더 브로드 미술관" }, description: { en: "Free contemporary art museum — book timed entry.", ko: "무료 현대 미술관 — 시간제 입장 예약." }, type: "sightseeing", location: { lat: 34.0545, lng: -118.2505 } },
    { time: "12:00", title: { en: "Grand Central Market lunch", ko: "그랜드 센트럴 마켓 점심" }, description: { en: "Historic food hall — tacos, Thai, ramen, egg sandwiches.", ko: "역사적 푸드 홀 — 타코, 태국, 라멘, 에그 샌드위치." }, type: "dining", location: { lat: 34.0508, lng: -118.2491 } },
    { time: "14:00", title: { en: "Arts District walk", ko: "아트 디스트릭트 산책" }, description: { en: "Murals, craft breweries, and converted warehouse galleries.", ko: "벽화, 수제 양조장, 창고 개조 갤러리." }, type: "sightseeing", location: { lat: 34.0400, lng: -118.2330 } },
  ], center: { lat: 34.0484, lng: -118.2442 }, tags: ["art", "food-hall", "murals", "downtown"], coverGradient: "from-violet-400 to-purple-600" },

  // LAS VEGAS (3 courses)
  { id: "lasvegas-strip-shows", city: "lasvegas", title: { en: "The Strip & Shows", ko: "스트립 & 쇼" }, summary: { en: "Bellagio fountains, casino walk, and a live show.", ko: "벨라지오 분수, 카지노 산책, 라이브 쇼." }, styles: ["efficient", "activity-focused"], travelerTypes: ["couple", "friends"], activities: [
    { time: "11:00", title: { en: "Walk the Strip", ko: "스트립 산책" }, description: { en: "Bellagio, Venetian, Caesars — world-famous casino boulevard.", ko: "벨라지오, 베네시안, 시저스 — 세계적인 카지노 대로." }, type: "sightseeing", location: { lat: 36.1147, lng: -115.1728 } },
    { time: "14:00", title: { en: "Buffet lunch", ko: "뷔페 점심" }, description: { en: "Bacchanal (Caesars) or Wicked Spoon (Cosmopolitan).", ko: "바카날(시저스) 또는 위키드 스푼(코스모폴리탄)." }, type: "dining", location: { lat: 36.1162, lng: -115.1745 } },
    { time: "20:00", title: { en: "Bellagio fountain show", ko: "벨라지오 분수 쇼" }, description: { en: "Free water and light show every 15 minutes after dark.", ko: "어둠 후 15분마다 무료 분수 쇼." }, type: "sightseeing", location: { lat: 36.1126, lng: -115.1767 } },
    { time: "21:30", title: { en: "Cirque du Soleil show", ko: "태양의 서커스 공연" }, description: { en: "O, Mystère, or KÀ — world-class performances.", ko: "오, 미스테르, 카 — 세계적인 공연." }, type: "tour", location: { lat: 36.1130, lng: -115.1750 } },
  ], center: { lat: 36.1141, lng: -115.1748 }, tags: ["casino", "show", "fountain", "neon"], coverGradient: "from-yellow-400 to-red-500" },

  { id: "lasvegas-grand-canyon-daytrip", city: "lasvegas", title: { en: "Grand Canyon Day Trip", ko: "그랜드 캐년 당일 투어" }, summary: { en: "Helicopter or bus to the Grand Canyon West Rim.", ko: "헬리콥터 또는 버스로 그랜드 캐년 웨스트 림." }, styles: ["activity-focused"], travelerTypes: ["couple", "family", "friends"], activities: [
    { time: "07:00", title: { en: "Depart Las Vegas", ko: "라스베가스 출발" }, description: { en: "2.5-hour drive or 45-minute helicopter flight.", ko: "2시간 30분 운전 또는 45분 헬리콥터." }, type: "transport", location: { lat: 36.1699, lng: -115.1398 } },
    { time: "10:00", title: { en: "Grand Canyon Skywalk", ko: "그랜드 캐년 스카이워크" }, description: { en: "Glass-bottom walkway 4,000ft above the canyon floor.", ko: "협곡 바닥 4000피트 위 유리 바닥 산책로." }, type: "sightseeing", location: { lat: 36.0126, lng: -113.8109 } },
    { time: "13:00", title: { en: "Rim viewpoints", ko: "림 전망대" }, description: { en: "Eagle Point, Guano Point — stunning canyon views.", ko: "이글 포인트, 구아노 포인트 — 장엄한 협곡." }, type: "sightseeing", location: { lat: 36.0100, lng: -113.8100 } },
  ], center: { lat: 36.0642, lng: -113.9202 }, tags: ["grand-canyon", "skywalk", "nature", "day-trip"], coverGradient: "from-orange-500 to-red-700" },

  { id: "lasvegas-fremont-downtown", city: "lasvegas", title: { en: "Fremont Street & Downtown", ko: "프리몬트 스트리트 & 다운타운" }, summary: { en: "Old Vegas neon, Fremont Experience, and craft cocktails.", ko: "올드 베가스 네온, 프리몬트 체험, 크래프트 칵테일." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "friends", "couple"], activities: [
    { time: "11:00", title: { en: "Downtown Container Park", ko: "다운타운 컨테이너 파크" }, description: { en: "Shops and restaurants in repurposed shipping containers.", ko: "재활용 선박 컨테이너의 상점과 레스토랑." }, type: "shopping", location: { lat: 36.1675, lng: -115.1370 } },
    { time: "13:00", title: { en: "Mob Museum", ko: "마피아 박물관" }, description: { en: "History of organized crime and law enforcement.", ko: "조직 범죄와 법 집행의 역사." }, type: "sightseeing", location: { lat: 36.1728, lng: -115.1411 } },
    { time: "20:00", title: { en: "Fremont Street Experience", ko: "프리몬트 스트리트 체험" }, description: { en: "LED canopy light show, live music, zip line.", ko: "LED 캐노피 라이트 쇼, 라이브 음악, 짚라인." }, type: "sightseeing", location: { lat: 36.1700, lng: -115.1430 } },
  ], center: { lat: 36.1701, lng: -115.1404 }, tags: ["neon", "old-vegas", "nightlife", "museum"], coverGradient: "from-purple-500 to-indigo-600" },

  // SEATTLE (3 courses)
  { id: "seattle-pike-space-needle", city: "seattle", title: { en: "Pike Place Market & Space Needle", ko: "파이크 플레이스 마켓 & 스페이스 니들" }, summary: { en: "Seattle's iconic market, original Starbucks, and the Needle.", ko: "시애틀 상징 시장, 오리지널 스타벅스, 스페이스 니들." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "08:00", title: { en: "Pike Place Market", ko: "파이크 플레이스 마켓" }, description: { en: "Fish throwing, flowers, craft stalls. Original Starbucks.", ko: "생선 던지기, 꽃, 공예 노점. 오리지널 스타벅스." }, type: "shopping", location: { lat: 47.6097, lng: -122.3425 } },
    { time: "11:00", title: { en: "Chowder & coffee", ko: "차우더 & 커피" }, description: { en: "Clam chowder bread bowl and artisan coffee.", ko: "클램 차우더 브레드 볼과 수제 커피." }, type: "dining", location: { lat: 47.6090, lng: -122.3420 } },
    { time: "14:00", title: { en: "Space Needle", ko: "스페이스 니들" }, description: { en: "Rotating glass floor at 500ft. Mt. Rainier views on clear days.", ko: "500피트 회전 유리 바닥. 맑은 날 레이니어 산 조망." }, type: "sightseeing", location: { lat: 47.6205, lng: -122.3493 } },
    { time: "16:00", title: { en: "Chihuly Garden & Glass", ko: "치훌리 가든 & 글라스" }, description: { en: "Stunning blown glass art installation next to the Needle.", ko: "스페이스 니들 옆 유리 공예 설치 미술." }, type: "sightseeing", location: { lat: 47.6206, lng: -122.3509 } },
  ], center: { lat: 47.6150, lng: -122.3462 }, tags: ["market", "needle", "starbucks", "glass"], coverGradient: "from-emerald-400 to-teal-600" },

  { id: "seattle-waterfront-ferry", city: "seattle", title: { en: "Waterfront & Bainbridge Ferry", ko: "워터프론트 & 베인브리지 페리" }, summary: { en: "Seattle's waterfront, aquarium, and scenic ferry ride.", ko: "시애틀 워터프론트, 수족관, 경치 좋은 페리." }, styles: ["relaxed"], travelerTypes: ["couple", "family"], activities: [
    { time: "10:00", title: { en: "Seattle Aquarium", ko: "시애틀 수족관" }, description: { en: "Pacific Northwest marine life on the waterfront.", ko: "태평양 북서부 해양 생물." }, type: "sightseeing", location: { lat: 47.6076, lng: -122.3432 } },
    { time: "12:30", title: { en: "Ferry to Bainbridge Island", ko: "베인브리지 섬 페리" }, description: { en: "35-minute scenic ferry with Seattle skyline views.", ko: "시애틀 스카이라인을 보며 35분 페리." }, type: "transport", location: { lat: 47.6024, lng: -122.3382 } },
    { time: "14:00", title: { en: "Bainbridge Island walk", ko: "베인브리지 섬 산책" }, description: { en: "Cute town, bakeries, and waterfront park.", ko: "예쁜 마을, 베이커리, 워터프론트 파크." }, type: "free", location: { lat: 47.6257, lng: -122.5107 } },
  ], center: { lat: 47.6119, lng: -122.3974 }, tags: ["ferry", "aquarium", "island", "skyline"], coverGradient: "from-blue-400 to-sky-500" },

  { id: "seattle-capitol-hill-coffee", city: "seattle", title: { en: "Capitol Hill & Coffee Culture", ko: "캐피톨 힐 & 커피 문화" }, summary: { en: "Seattle's hippest neighborhood and its legendary coffee scene.", ko: "시애틀에서 가장 힙한 동네와 전설적인 커피 문화." }, styles: ["relaxed", "activity-focused"], travelerTypes: ["solo", "friends"], activities: [
    { time: "09:00", title: { en: "Specialty coffee crawl", ko: "스페셜티 커피 투어" }, description: { en: "Victrola, Elm, Storyville — Seattle's best roasters.", ko: "빅트롤라, 엘름, 스토리빌 — 시애틀 최고 로스터." }, type: "dining", location: { lat: 47.6149, lng: -122.3204 } },
    { time: "12:00", title: { en: "Broadway & Pike Pine corridor", ko: "브로드웨이 & 파이크-파인 지구" }, description: { en: "Indie shops, bookstores, and vinyl record stores.", ko: "인디 숍, 서점, 바이닐 레코드 상점." }, type: "shopping", location: { lat: 47.6155, lng: -122.3210 } },
    { time: "14:00", title: { en: "Volunteer Park & Asian Art Museum", ko: "볼런티어 파크 & 아시안 아트 뮤지엄" }, description: { en: "Beautiful park with conservatory and art museum.", ko: "온실과 미술관이 있는 아름다운 공원." }, type: "sightseeing", location: { lat: 47.6304, lng: -122.3157 } },
  ], center: { lat: 47.6203, lng: -122.3190 }, tags: ["coffee", "indie", "hipster", "art"], coverGradient: "from-amber-400 to-brown-500" },

  // BOSTON (3 courses)
  { id: "boston-freedom-trail", city: "boston", title: { en: "Freedom Trail Walk", ko: "프리덤 트레일 산책" }, summary: { en: "2.5-mile walk through 16 historic Revolutionary War sites.", ko: "16개 독립 전쟁 유적지를 잇는 4km 도보." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family"], activities: [
    { time: "09:00", title: { en: "Boston Common start", ko: "보스턴 커먼 출발" }, description: { en: "America's oldest public park. Follow the red line.", ko: "미국에서 가장 오래된 공공 공원. 빨간 선을 따라가세요." }, type: "sightseeing", location: { lat: 42.3551, lng: -71.0656 } },
    { time: "11:00", title: { en: "Faneuil Hall & Quincy Market", ko: "패뉴얼 홀 & 퀸시 마켓" }, description: { en: "Historic market hall — clam chowder and lobster rolls.", ko: "역사적 시장 — 클램 차우더와 랍스터 롤." }, type: "dining", location: { lat: 42.3600, lng: -71.0550 } },
    { time: "13:00", title: { en: "Paul Revere House & Old North Church", ko: "폴 리비어 하우스 & 올드 노스 교회" }, description: { en: "Where the American Revolution began.", ko: "미국 독립 전쟁이 시작된 곳." }, type: "sightseeing", location: { lat: 42.3637, lng: -71.0536 } },
    { time: "15:00", title: { en: "USS Constitution", ko: "USS 컨스티튜션" }, description: { en: "World's oldest commissioned naval vessel (1797).", ko: "세계에서 가장 오래된 현역 군함(1797년)." }, type: "sightseeing", location: { lat: 42.3726, lng: -71.0562 } },
  ], center: { lat: 42.3629, lng: -71.0576 }, tags: ["history", "revolution", "trail", "American"], coverGradient: "from-red-500 to-blue-600" },

  { id: "boston-harvard-cambridge", city: "boston", title: { en: "Harvard & Cambridge", ko: "하버드 & 케임브리지" }, summary: { en: "Harvard campus, MIT, and Cambridge's bookshops and cafes.", ko: "하버드 캠퍼스, MIT, 케임브리지 서점과 카페." }, styles: ["relaxed", "efficient"], travelerTypes: ["solo", "couple", "friends"], activities: [
    { time: "09:00", title: { en: "Harvard Yard tour", ko: "하버드 야드 투어" }, description: { en: "Student-led tour of America's oldest university.", ko: "미국에서 가장 오래된 대학교 학생 가이드 투어." }, type: "tour", location: { lat: 42.3744, lng: -71.1169 } },
    { time: "11:30", title: { en: "Harvard Square shops & cafes", ko: "하버드 스퀘어 쇼핑 & 카페" }, description: { en: "The Coop bookstore, indie shops, and street performers.", ko: "쿱 서점, 인디 숍, 거리 공연." }, type: "shopping", location: { lat: 42.3736, lng: -71.1190 } },
    { time: "13:30", title: { en: "Walk to MIT", ko: "MIT까지 걷기" }, description: { en: "30-minute walk along the Charles River.", ko: "찰스 강변을 따라 30분 도보." }, type: "free", location: { lat: 42.3601, lng: -71.0942 } },
    { time: "15:00", title: { en: "MIT campus & Stata Center", ko: "MIT 캠퍼스 & 스타타 센터" }, description: { en: "Frank Gehry's wild building and tech culture.", ko: "프랭크 게리의 기발한 건물과 기술 문화." }, type: "sightseeing", location: { lat: 42.3616, lng: -71.0909 } },
  ], center: { lat: 42.3674, lng: -71.1053 }, tags: ["university", "harvard", "MIT", "academic"], coverGradient: "from-red-600 to-rose-800" },

  { id: "boston-waterfront-seaport", city: "boston", title: { en: "Waterfront & Seaport District", ko: "워터프론트 & 시포트 지구" }, summary: { en: "New England Aquarium, harbor walk, and seafood feast.", ko: "뉴잉글랜드 수족관, 항구 산책, 해산물 잔치." }, styles: ["relaxed"], travelerTypes: ["couple", "family"], activities: [
    { time: "10:00", title: { en: "New England Aquarium", ko: "뉴잉글랜드 수족관" }, description: { en: "Giant ocean tank, penguins, and sea turtle rehab.", ko: "거대 해양 수조, 펭귄, 바다 거북 재활." }, type: "sightseeing", location: { lat: 42.3592, lng: -71.0497 } },
    { time: "12:30", title: { en: "Lobster roll lunch", ko: "랍스터 롤 점심" }, description: { en: "Legal Sea Foods or Row 34 — fresh New England lobster.", ko: "리갈 시푸드 또는 로우 34 — 신선한 랍스터." }, type: "dining", location: { lat: 42.3530, lng: -71.0430 } },
    { time: "14:00", title: { en: "Seaport District walk", ko: "시포트 지구 산책" }, description: { en: "Boston's newest neighborhood — galleries, bars, harbor views.", ko: "보스턴 최신 동네 — 갤러리, 바, 항구 전경." }, type: "free", location: { lat: 42.3481, lng: -71.0440 } },
    { time: "17:00", title: { en: "Harbor sunset cruise", ko: "항구 선셋 크루즈" }, description: { en: "1-hour harbor cruise with skyline views.", ko: "스카이라인을 보며 1시간 항구 크루즈." }, type: "tour", location: { lat: 42.3563, lng: -71.0485 } },
  ], center: { lat: 42.3542, lng: -71.0463 }, tags: ["aquarium", "lobster", "harbor", "seaport"], coverGradient: "from-blue-400 to-cyan-500" },

  // SHANGHAI (3 courses)
  { id: "shanghai-bund-pudong", city: "shanghai", title: { en: "The Bund & Pudong Skyline", ko: "와이탄 & 푸동 스카이라인" }, summary: { en: "Colonial-era waterfront facing the futuristic Pudong towers.", ko: "미래형 푸동 타워를 마주한 식민지 시대 해안." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "10:00", title: { en: "The Bund walk", ko: "와이탄 산책" }, description: { en: "1.5km waterfront promenade with 52 heritage buildings.", ko: "52개 유산 건물이 있는 1.5km 해안 산책로." }, type: "sightseeing", location: { lat: 31.2400, lng: 121.4900 } },
    { time: "12:00", title: { en: "Xiaolongbao lunch", ko: "샤오롱바오 점심" }, description: { en: "Shanghai's famous soup dumplings at Jia Jia Tang Bao.", ko: "가가탕바오에서 상하이 유명 소룡포." }, type: "dining", location: { lat: 31.2350, lng: 121.4800 } },
    { time: "14:00", title: { en: "Shanghai Tower observation", ko: "상하이 타워 전망대" }, description: { en: "World's 2nd tallest building — 632m. 118th floor observatory.", ko: "세계 2위 높이 건물 — 632m. 118층 전망대." }, type: "sightseeing", location: { lat: 31.2355, lng: 121.5055 } },
    { time: "19:00", title: { en: "Bund night views", ko: "와이탄 야경" }, description: { en: "Pudong skyline lit up — best views from the Bund.", ko: "푸동 스카이라인 조명 — 와이탄에서 최고 야경." }, type: "sightseeing", location: { lat: 31.2400, lng: 121.4900 } },
  ], center: { lat: 31.2376, lng: 121.4914 }, tags: ["skyline", "bund", "tower", "night-view"], coverGradient: "from-blue-500 to-purple-600" },

  { id: "shanghai-french-concession", city: "shanghai", title: { en: "French Concession & Tianzifang", ko: "프랑스 조계지 & 톈쯔팡" }, summary: { en: "Tree-lined boulevards, art deco villas, and creative lanes.", ko: "가로수 대로, 아르데코 빌라, 창의적 골목." }, styles: ["relaxed"], travelerTypes: ["couple", "solo", "friends"], activities: [
    { time: "10:00", title: { en: "French Concession walk", ko: "프랑스 조계지 산책" }, description: { en: "Plane tree-lined streets, colonial villas, boutiques.", ko: "플라타너스 가로수, 식민지 빌라, 부티크." }, type: "sightseeing", location: { lat: 31.2100, lng: 121.4500 } },
    { time: "12:00", title: { en: "Brunch at a café", ko: "카페 브런치" }, description: { en: "Many excellent cafes along Yongkang Road.", ko: "용강 로드의 훌륭한 카페들." }, type: "dining", location: { lat: 31.2090, lng: 121.4550 } },
    { time: "14:00", title: { en: "Tianzifang art lanes", ko: "톈쯔팡 아트 골목" }, description: { en: "Narrow shikumen lanes converted into galleries and shops.", ko: "갤러리와 상점으로 바뀐 좁은 석고문 골목." }, type: "shopping", location: { lat: 31.2093, lng: 121.4685 } },
  ], center: { lat: 31.2094, lng: 121.4578 }, tags: ["colonial", "art", "cafe", "concession"], coverGradient: "from-green-400 to-emerald-500" },

  { id: "shanghai-yuyuan-nanjing", city: "shanghai", title: { en: "Yu Garden & Nanjing Road", ko: "위위안 정원 & 난징로" }, summary: { en: "Classical Chinese garden, bazaar, and main shopping street.", ko: "중국 고전 정원, 시장, 메인 쇼핑 거리." }, styles: ["efficient"], travelerTypes: ["family", "solo", "friends"], activities: [
    { time: "09:00", title: { en: "Yu Garden", ko: "위위안 정원" }, description: { en: "400-year-old classical Chinese garden.", ko: "400년 된 중국 고전 정원." }, type: "sightseeing", location: { lat: 31.2274, lng: 121.4926 } },
    { time: "11:00", title: { en: "Yuyuan Bazaar", ko: "위위안 시장" }, description: { en: "Traditional market selling snacks, tea, and souvenirs.", ko: "간식, 차, 기념품을 파는 전통 시장." }, type: "shopping", location: { lat: 31.2280, lng: 121.4930 } },
    { time: "13:00", title: { en: "Nanjing Road pedestrian street", ko: "난징로 보행자 거리" }, description: { en: "Shanghai's busiest shopping street.", ko: "상하이에서 가장 바쁜 쇼핑 거리." }, type: "shopping", location: { lat: 31.2352, lng: 121.4737 } },
  ], center: { lat: 31.2302, lng: 121.4864 }, tags: ["garden", "bazaar", "shopping", "traditional"], coverGradient: "from-red-400 to-orange-500" },

  // BEIJING (3 courses)
  { id: "beijing-forbidden-city-tiananmen", city: "beijing", title: { en: "Forbidden City & Tiananmen", ko: "자금성 & 천안문" }, summary: { en: "Imperial palace complex and China's most famous square.", ko: "황궁 단지와 중국 최대 광장." }, styles: ["efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "08:00", title: { en: "Tiananmen Square", ko: "천안문 광장" }, description: { en: "World's largest public square. Flag ceremony at sunrise.", ko: "세계 최대 공공 광장. 일출 국기 게양식." }, type: "sightseeing", location: { lat: 39.9042, lng: 116.3974 } },
    { time: "09:00", title: { en: "Forbidden City", ko: "자금성" }, description: { en: "980 buildings, 9,999 rooms. Allow 3-4 hours.", ko: "980개 건물, 9999개 방. 3~4시간 소요." }, type: "sightseeing", location: { lat: 39.9163, lng: 116.3972 } },
    { time: "13:00", title: { en: "Peking duck lunch", ko: "베이징 덕 점심" }, description: { en: "Quanjude or Da Dong — Beijing's signature dish.", ko: "취안쥐더 또는 다동 — 베이징 명물 오리구이." }, type: "dining", location: { lat: 39.9120, lng: 116.4030 } },
    { time: "15:00", title: { en: "Jingshan Park viewpoint", ko: "경산 공원 전망대" }, description: { en: "Climb the hill for perfect Forbidden City aerial views.", ko: "언덕에 올라 자금성 조감도." }, type: "sightseeing", location: { lat: 39.9250, lng: 116.3960 } },
  ], center: { lat: 39.9144, lng: 116.3984 }, tags: ["imperial", "palace", "square", "history"], coverGradient: "from-red-600 to-orange-600" },

  { id: "beijing-great-wall", city: "beijing", title: { en: "Great Wall Day Trip (Mutianyu)", ko: "만리장성 당일 (무티엔위)" }, summary: { en: "Mutianyu section — less crowded, cable car, toboggan ride.", ko: "무티엔위 구간 — 덜 혼잡, 케이블카, 터보건 슬라이드." }, styles: ["activity-focused", "efficient"], travelerTypes: ["solo", "couple", "family", "friends"], activities: [
    { time: "07:00", title: { en: "Drive to Mutianyu", ko: "무티엔위로 이동" }, description: { en: "1.5-hour drive north from Beijing.", ko: "베이징에서 북쪽으로 1시간 30분." }, type: "transport", location: { lat: 39.9042, lng: 116.4074 } },
    { time: "09:00", title: { en: "Cable car up", ko: "케이블카 탑승" }, description: { en: "Skip the 4,000 steps — take the cable car up.", ko: "4000계단 건너뛰기 — 케이블카로 올라가세요." }, type: "transport", location: { lat: 40.4319, lng: 116.5704 } },
    { time: "09:30", title: { en: "Walk the Wall", ko: "만리장성 걷기" }, description: { en: "2-3 hours walking the restored wall with mountain views.", ko: "산 전경을 보며 복원된 성벽 2~3시간 도보." }, type: "sightseeing", location: { lat: 40.4319, lng: 116.5704 } },
    { time: "12:30", title: { en: "Toboggan slide down", ko: "터보건 슬라이드 하산" }, description: { en: "Fun alternative descent — metal slide down the mountain.", ko: "재미있는 하산 — 금속 슬라이드로 산 아래로." }, type: "tour", location: { lat: 40.4310, lng: 116.5700 } },
  ], center: { lat: 40.4312, lng: 116.5703 }, tags: ["great-wall", "hiking", "cable-car", "day-trip"], coverGradient: "from-gray-500 to-slate-700" },

  { id: "beijing-temple-hutong", city: "beijing", title: { en: "Temple of Heaven & Hutong Rickshaw", ko: "천단 & 후통 릭샤" }, summary: { en: "Ming dynasty temple and traditional alley rickshaw tour.", ko: "명나라 사원과 전통 골목 릭샤 투어." }, styles: ["relaxed", "efficient"], travelerTypes: ["couple", "family", "solo"], activities: [
    { time: "08:00", title: { en: "Temple of Heaven", ko: "천단" }, description: { en: "Where emperors prayed for harvests. Tai chi in the park.", ko: "황제가 풍년을 기원한 곳. 공원에서 태극권." }, type: "sightseeing", location: { lat: 39.8822, lng: 116.4066 } },
    { time: "11:00", title: { en: "Hutong rickshaw tour", ko: "후통 릭샤 투어" }, description: { en: "Traditional alley tour by pedicab through old Beijing.", ko: "옛 베이징 전통 골목 삼륜차 투어." }, type: "tour", location: { lat: 39.9370, lng: 116.3900 } },
    { time: "13:00", title: { en: "Hutong home-style lunch", ko: "후통 가정식 점심" }, description: { en: "Jianbing (Chinese crepe), dumplings, and noodles.", ko: "젠빙(중국 크레이프), 만두, 국수." }, type: "dining", location: { lat: 39.9380, lng: 116.3910 } },
    { time: "15:00", title: { en: "Nanluoguxiang lane", ko: "난루오구샹 골목" }, description: { en: "Trendy hutong with cafes, shops, and street food.", ko: "카페, 상점, 길거리 음식이 있는 트렌디 후통." }, type: "shopping", location: { lat: 39.9370, lng: 116.4020 } },
  ], center: { lat: 39.9236, lng: 116.3974 }, tags: ["temple", "hutong", "rickshaw", "traditional"], coverGradient: "from-amber-500 to-red-600" },
];
