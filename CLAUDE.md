@AGENTS.md

# TripFlowy Project Rules

## Blog Guide Writing Rules

When the user provides a Korean travel guide, produce BOTH Korean and English versions following these rules. If the provided content is missing key information (prices, hours, how to get there, etc.), ask the user before writing.

### This is a GUIDE, not a blog essay
The goal is practical, experience-based travel information. NOT poetry, NOT emotional storytelling, NOT AI-style inspirational writing. Readers come for answers — give them answers.

### Priority Order (strict)
1. Practical, useful information (prices, hours, how-to, what to skip)
2. Natural, native-level writing (NOT AI-generated tone)
3. Readability and flow
4. SEO/AEO/GEO optimization (do NOT sacrifice quality for keywords)

### Writing Style
- First-person voice ("I", "we") — based on real visit experience
- Tone: knowledgeable friend giving advice, not a travel writer performing emotions
- NO generic phrases: "one of the best", "highly recommend", "perfect for", "great experience"
- NO filler: "in a way", "a kind of", "something like"
- NO fake-deep emotional sentences: "I wasn't looking at the city. I was inside it." — this reads as AI poetry, not a guide
- Share experience through facts and observations, not feelings
  - Bad: "The wind hit me before the view did. It was breathtaking."
  - Good: "The wind at 230m is no joke — they ban hats, scarves, and tripods for a reason."
- Start with a useful observation or context, not a manufactured moment
- End naturally — don't force a poetic conclusion

### SEO Rules
- Focus keyphrase: provided by user (not AI-generated — needs search volume validation)
- SEO title: include keyphrase, max ~60 characters
- Meta description: 140–155 characters, include keyphrase
- Keyphrase in: first paragraph, at least one H2, used naturally
- ~50% of H2/H3 should include keyphrase or synonyms
- Internal links: /planner?destinations={city}, /posts/{related-slug}, /tours?destination={city}
- External links: 2–3 verifiable sources

### AEO Rules (AI Engine Optimization)
- FAQ section: 3–5 real search queries with direct answers (answer first, then context)
- Key Facts box near top: Location / Hours / Price / How to get there
- After each major section, one concise summary sentence (answer first, not context)
- Bad: "When we visited, we found that the ticket was about $30"
- Good: "Tickets cost ~$30 (2026). We bought ours online for a discount."

### Currency Rules
- **Korean version:** 원(KRW) + 현지 통화 (엔, 동, 바트 등)
- **English version:** USD + 현지 통화만. KRW 절대 사용 금지
  - Good: "~$60–65 on Klook / ¥9,400 official"
  - Bad: "~85,000–90,000 KRW on Klook"

### GEO Rules (Generative Engine Optimization)
- First mention of any place: full name + city + country (e.g., "Golden Bridge at Ba Na Hills, Da Nang, Vietnam")
- Include 2–3 verifiable facts (altitude, records, distances) — AI models cite articles with specific data
- Prices/hours/distances in consistent format: "Open: 08:00–17:00 daily", "Distance: 25km (~40 min)"
- Include at least one comparison for context: "Unlike most theme parks in Southeast Asia..."

### Structure
- Flow: intro (what this place is + why it matters) → key facts → how to book/get there → what to expect → tips → FAQ
- Include {{cta}} marker after booking/price section
- Key facts box near top: bullet points of practical info (NO emotional sentences)
- Suggest 5–8 images with: position, description, alt_text, filename

### Output Format
Output must match `data/posts.ts` structure:
- slug, city, title(ko/en), excerpt(ko/en), content(ko/en)
- categories, faq[{question:{ko,en}, answer:{ko,en}}], coverImage, images, publishedAt

### What to Ask the User If Missing
- Specific prices and currency
- Opening hours / seasonal availability
- How to get there (from city center)
- Personal experience details (what surprised you, what you'd skip)
- Focus keyphrase (don't guess — needs search volume data)
