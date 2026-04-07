export type Locale = "en" | "ko";

export type LocaleString = {
  en: string;
  ko: string;
};

export type TravelerType = "couple" | "solo" | "family" | "friends";
export type TravelStyle = "relaxed" | "efficient" | "activity-focused" | "hotel-focused";
export type PriceRange = "$" | "$$" | "$$$" | "$$$$";
export type ActivityType =
  | "transport"
  | "sightseeing"
  | "dining"
  | "accommodation"
  | "tour"
  | "free"
  | "beach"
  | "shopping";

export type Activity = {
  time?: string;
  title: LocaleString;
  description: LocaleString;
  type: ActivityType;
};

export type DayPlan = {
  day: number;
  title: LocaleString;
  subtitle?: LocaleString;
  activities: Activity[];
};

export type BudgetItem = {
  category: LocaleString;
  min: number;
  max: number;
  currency: string;
  note?: LocaleString;
};

export type FAQ = {
  question: LocaleString;
  answer: LocaleString;
};

export type Itinerary = {
  id: string;
  slug: string;
  title: LocaleString;
  summary: LocaleString;
  destination: string;
  destinationLabel: LocaleString;
  countryCode: string;
  duration: number; // nights
  travelerType: TravelerType[];
  style: TravelStyle;
  bestFor: LocaleString[];
  notIdealFor: LocaleString[];
  overview: LocaleString;
  days: DayPlan[];
  tourIds: string[];
  hotelIds: string[];
  coverGradient: string;
  featured: boolean;
  tags: string[];
  budget?: BudgetItem[];
  faq?: FAQ[];
};

export type Hotel = {
  id: string;
  slug: string;
  name: string;
  destination: string;
  destinationLabel: LocaleString;
  style: TravelStyle[];
  priceRange: PriceRange;
  description: LocaleString;
  bestFor: LocaleString[];
  affiliateUrl: string;
  coverGradient: string;
  rating: number;
  reviewCount: number;
  location: LocaleString;
};

export type Tour = {
  id: string;
  slug: string;
  title: LocaleString;
  destination: string;
  destinationLabel: LocaleString;
  durationLabel: LocaleString;
  price: number;
  currency: string;
  style: TravelStyle[];
  description: LocaleString;
  highlights: LocaleString[];
  affiliateUrl: string;
  coverGradient: string;
  rating: number;
  reviewCount: number;
};

export type PlannerInput = {
  destinations: string[];
  duration: string;
  travelerType: TravelerType | "";
  style: TravelStyle | "";
};

export type Destination = {
  id: string;
  label: LocaleString;
  countryId: string;
};

export type Country = {
  id: string;
  label: LocaleString;
  emoji: string;
  cities: Destination[];
};
