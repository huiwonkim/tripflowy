"use client";

import { FileDown } from "lucide-react";
import type { Locale, GeneratedDay, CityBasicInfo } from "@/types";
import { countries } from "@/data/destinations";
import { getCityInfo } from "@/data/city-info";
import { getFlightEstimate, getHotelEstimate } from "@/lib/price-api";
import { sumLocalCosts } from "@/lib/itinerary-builder";
import { formatCurrency, convertToDisplay } from "@/lib/currency";

interface DownloadPDFButtonProps {
  locale: Locale;
  days: GeneratedDay[];
  duration: string;
  itinerary: import("@/types").GeneratedItinerary;
}

export function DownloadPDFButton({ locale, days, duration, itinerary }: DownloadPDFButtonProps) {

  function handlePrint() {
    const allCities = countries.flatMap((c) => c.cities);
    const cityNames = [...new Set(days.map((d) => {
      const city = allCities.find((c) => c.id === d.city);
      return city?.label[locale] ?? d.city;
    }))].join(" + ");

    const title = locale === "ko"
      ? `${cityNames} ${duration}박${Number(duration) + 1}일 여행 일정`
      : `${cityNames} ${Number(duration) + 1}-Day Itinerary`;

    // Budget data
    const primaryCity = itinerary.cities[0];
    const flight = getFlightEstimate(primaryCity);
    const hotel = getHotelEstimate(primaryCity);
    const localCosts = sumLocalCosts(itinerary, locale);
    const nights = Number(duration);

    // City info
    const cityInfos = [...new Set(itinerary.cities)].map(getCityInfo).filter(Boolean);

    // Booking items
    const tourNames = new Set<string>();
    for (const day of days) {
      for (const act of day.course.activities) {
        if ((act.type === "tour" || act.type === "sightseeing") && !tourNames.has(act.title[locale])) {
          tourNames.add(act.title[locale]);
        }
      }
    }

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, "Malgun Gothic", "맑은 고딕", sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.7; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 16px; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #2563EB; color: #1a1a1a; }
        h3 { font-size: 14px; margin: 16px 0 8px; color: #333; }
        .subtitle { color: #999; font-size: 11px; margin-bottom: 24px; }
        .divider { border: none; border-top: 1px solid #eee; margin: 16px 0; }
        .day-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; margin-top: 20px; }
        .day-num { background: #2563EB; color: white; font-weight: 700; font-size: 11px; width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .day-title { font-size: 15px; font-weight: 700; }
        .day-city { color: #aaa; font-size: 11px; margin-bottom: 10px; }
        .activity { margin-bottom: 8px; padding-left: 12px; }
        .act-time { font-weight: 700; color: #444; }
        .act-desc { color: #666; font-size: 12px; }
        .tip { color: #b45309; font-size: 11px; margin-top: 2px; }
        .cost-row { background: #f8f9fa; padding: 8px 12px; border-radius: 8px; font-size: 11px; color: #666; margin-top: 6px; }
        .section-box { background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
        .budget-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
        .budget-label { color: #666; }
        .budget-value { font-weight: 600; color: #1a1a1a; }
        .budget-total { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; font-weight: 700; border-top: 1px solid #ddd; margin-top: 6px; color: #059669; }
        .info-row { display: flex; gap: 8px; padding: 4px 0; font-size: 12px; }
        .info-label { color: #999; width: 50px; flex-shrink: 0; }
        .info-value { color: #444; }
        .checklist-item { padding: 4px 0; font-size: 12px; color: #444; }
        .checklist-item::before { content: "☐ "; color: #999; }
        .footer { color: #ccc; font-size: 10px; margin-top: 32px; text-align: center; }
        .overview-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
        .overview-num { background: #2563EB; color: white; font-weight: 700; font-size: 10px; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .overview-title { font-size: 13px; font-weight: 600; }
        .overview-summary { font-size: 11px; color: #999; }
        img { max-width: 100%; height: auto; }
        @media print { body { padding: 20px; } img { page-break-inside: avoid; } }
      </style>
    </head><body>`;

    // Title
    html += `<h1>${title}</h1>`;
    html += `<p class="subtitle">TripFlowy — tripflowy.com</p>`;

    // Overview
    html += `<h2>${locale === "ko" ? "📋 전체 일정 요약" : "📋 Itinerary Overview"}</h2>`;
    for (const day of days) {
      html += `<div class="overview-item">
        <div class="overview-num">${day.dayNumber}</div>
        <div>
          <div class="overview-title">${day.course.title[locale]}</div>
          <div class="overview-summary">${day.course.summary[locale]}</div>
        </div>
      </div>`;
    }

    // Day details
    html += `<h2>${locale === "ko" ? "📍 일자별 상세 일정" : "📍 Day-by-Day Details"}</h2>`;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    for (const day of days) {
      const cityLabel = allCities.find((c) => c.id === day.city)?.label[locale] ?? day.city;
      html += `<div class="day-header"><div class="day-num">${day.dayNumber}</div><div class="day-title">${day.course.title[locale]}</div></div>`;
      html += `<div class="day-city">${cityLabel}</div>`;

      // Day map image (locale-specific, if uploaded)
      const mapImagePath = day.course.mapImage?.[locale];
      if (mapImagePath) {
        const absoluteUrl = mapImagePath.startsWith("http") ? mapImagePath : `${origin}${mapImagePath}`;
        html += `<img src="${absoluteUrl}" style="width: 100%; max-width: 700px; border-radius: 8px; margin: 8px 0; border: 1px solid #eee;" />`;
      }

      for (const act of day.course.activities) {
        html += `<div class="activity">`;
        html += `<span class="act-time">${act.time}</span> <strong>${act.title[locale]}</strong><br>`;
        html += `<span class="act-desc">${act.description[locale]}</span>`;
        if (act.tips) {
          for (const tip of act.tips) {
            html += `<div class="tip">💡 ${tip[locale]}</div>`;
          }
        }
        html += `</div>`;
      }

      if (day.course.costs) {
        const c = day.course.costs;
        const costText = locale === "ko"
          ? `식비 ${c.food.toLocaleString()}원 · 투어 ${c.activity.toLocaleString()}원 · 교통 ${c.transport.toLocaleString()}원 · 기타 ${c.etc.toLocaleString()}원`
          : `Food ${c.food} · Tour ${c.activity} · Transport ${c.transport} · Etc ${c.etc} (${c.currency})`;
        html += `<div class="cost-row">${costText}</div>`;
      }
      html += `<hr class="divider">`;
    }

    // Budget
    html += `<h2>${locale === "ko" ? "💰 예상 경비" : "💰 Estimated Budget"}</h2>`;
    html += `<div class="section-box">`;

    if (flight) {
      html += `<h3>${locale === "ko" ? "✈️ 항공권 (왕복)" : "✈️ Flights (round trip)"}</h3>`;
      html += `<div class="budget-row"><span class="budget-label">FSC</span><span class="budget-value">${formatCurrency(convertToDisplay(flight.fsc.min, flight.currency, locale), locale)} ~ ${formatCurrency(convertToDisplay(flight.fsc.max, flight.currency, locale), locale)}</span></div>`;
      html += `<div class="budget-row"><span class="budget-label">LCC</span><span class="budget-value">${formatCurrency(convertToDisplay(flight.lcc.min, flight.currency, locale), locale)} ~ ${formatCurrency(convertToDisplay(flight.lcc.max, flight.currency, locale), locale)}</span></div>`;
    }

    if (hotel) {
      html += `<h3>${locale === "ko" ? "🏨 숙소 (1박)" : "🏨 Hotels (per night)"}</h3>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "가성비" : "Budget"}</span><span class="budget-value">${formatCurrency(convertToDisplay(hotel.budget.min, hotel.currency, locale), locale)} ~ ${formatCurrency(convertToDisplay(hotel.budget.max, hotel.currency, locale), locale)}</span></div>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "일반" : "Standard"}</span><span class="budget-value">${formatCurrency(convertToDisplay(hotel.standard.min, hotel.currency, locale), locale)} ~ ${formatCurrency(convertToDisplay(hotel.standard.max, hotel.currency, locale), locale)}</span></div>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "럭셔리" : "Luxury"}</span><span class="budget-value">${formatCurrency(convertToDisplay(hotel.luxury.min, hotel.currency, locale), locale)} ~ ${formatCurrency(convertToDisplay(hotel.luxury.max, hotel.currency, locale), locale)}</span></div>`;
    }

    if (localCosts.food + localCosts.activity + localCosts.transport + localCosts.etc > 0) {
      html += `<h3>${locale === "ko" ? "🗺️ 현지 경비 (합산)" : "🗺️ Local Expenses (total)"}</h3>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "식비" : "Food"}</span><span class="budget-value">${formatCurrency(localCosts.food, locale)}</span></div>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "투어" : "Tours"}</span><span class="budget-value">${formatCurrency(localCosts.activity, locale)}</span></div>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "교통" : "Transport"}</span><span class="budget-value">${formatCurrency(localCosts.transport, locale)}</span></div>`;
      html += `<div class="budget-row"><span class="budget-label">${locale === "ko" ? "기타" : "Etc"}</span><span class="budget-value">${formatCurrency(localCosts.etc, locale)}</span></div>`;
    }
    html += `</div>`;

    // City info
    for (const ci of cityInfos) {
      if (!ci?.info) continue;
      const cityLabel = allCities.find((c) => c.id === ci.cityId)?.label[locale] ?? ci.cityId;
      html += `<h2>${locale === "ko" ? `🌏 ${cityLabel} 기본 정보` : `🌏 ${cityLabel} Essentials`}</h2>`;
      html += `<div class="section-box">`;
      html += `<div class="info-row"><span class="info-label">${locale === "ko" ? "비자" : "Visa"}</span><span class="info-value">${ci.info.visa[locale]}</span></div>`;
      html += `<div class="info-row"><span class="info-label">${locale === "ko" ? "시차" : "Time"}</span><span class="info-value">${ci.info.timezone[locale]}</span></div>`;
      html += `<div class="info-row"><span class="info-label">${locale === "ko" ? "통화" : "Currency"}</span><span class="info-value">${ci.info.currency[locale]}</span></div>`;
      html += `<div class="info-row"><span class="info-label">${locale === "ko" ? "언어" : "Language"}</span><span class="info-value">${ci.info.language[locale]}</span></div>`;
      html += `<div class="info-row"><span class="info-label">${locale === "ko" ? "전압" : "Voltage"}</span><span class="info-value">${ci.info.voltage[locale]}</span></div>`;
      html += `</div>`;
    }

    // Booking checklist
    html += `<h2>${locale === "ko" ? "✅ 예약 체크리스트" : "✅ Booking Checklist"}</h2>`;
    html += `<div class="section-box">`;
    html += `<div class="checklist-item">${locale === "ko" ? `✈️ ${cityNames} 항공권` : `✈️ Flights to ${cityNames}`}</div>`;
    for (const city of itinerary.cities) {
      const label = allCities.find((c) => c.id === city)?.label[locale] ?? city;
      html += `<div class="checklist-item">${locale === "ko" ? `🏨 ${label} 숙소` : `🏨 ${label} Hotels`}</div>`;
    }
    let tourCount = 0;
    for (const name of tourNames) {
      if (tourCount >= 5) break;
      html += `<div class="checklist-item">🎟️ ${name}</div>`;
      tourCount++;
    }
    html += `</div>`;

    // Footer
    html += `<p class="footer">Generated by TripFlowy — tripflowy.com</p>`;
    html += `</body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => { printWindow.print(); };
    }
  }

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <FileDown className="w-4 h-4" />
      {locale === "ko" ? "PDF 다운로드" : "Download PDF"}
    </button>
  );
}
