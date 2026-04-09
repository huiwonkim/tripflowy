"use client";

import { useState } from "react";
import { Bookmark, Link2, FileDown, Check, ChevronDown } from "lucide-react";
import type { Locale, GeneratedDay, GeneratedItinerary } from "@/types";
import { countries } from "@/data/destinations";
import { getCityInfo } from "@/data/city-info";
import { getFlightEstimate, getHotelEstimate } from "@/lib/price-api";
import { sumLocalCosts } from "@/lib/itinerary-builder";
import { formatCurrency, convertToDisplay } from "@/lib/currency";

interface Props {
  locale: Locale;
  days: GeneratedDay[];
  duration: string;
  itinerary: GeneratedItinerary;
}

export function SaveItineraryDropdown({ locale, days, duration, itinerary }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    const params = new URLSearchParams(window.location.search);
    params.set("courses", days.map((d) => d.course.id).join(","));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  }

  function handlePDF() {
    setOpen(false);
    const allCities = countries.flatMap((c) => c.cities);
    const cityNames = [...new Set(days.map((d) => allCities.find((c) => c.id === d.city)?.label[locale] ?? d.city))].join(" + ");
    const title = locale === "ko"
      ? `${cityNames} ${duration}박${Number(duration) + 1}일 여행 일정`
      : `${cityNames} ${Number(duration) + 1}-Day Itinerary`;

    const primaryCity = itinerary.cities[0];
    const flight = getFlightEstimate(primaryCity);
    const hotel = getHotelEstimate(primaryCity);
    const localCosts = sumLocalCosts(itinerary, locale);
    const cityInfos = [...new Set(itinerary.cities)].map(getCityInfo).filter(Boolean);
    const tourNames = new Set<string>();
    for (const day of days) for (const act of day.course.activities) if ((act.type === "tour" || act.type === "sightseeing") && tourNames.size < 5) tourNames.add(act.title[locale]);

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,"Malgun Gothic","맑은 고딕",sans-serif;color:#1a1a1a;padding:40px;max-width:800px;margin:0 auto;font-size:13px;line-height:1.7}h1{font-size:22px;margin-bottom:4px}h2{font-size:16px;margin:28px 0 12px;padding-bottom:6px;border-bottom:2px solid #2563EB}h3{font-size:14px;margin:16px 0 8px;color:#333}.subtitle{color:#999;font-size:11px;margin-bottom:24px}.divider{border:none;border-top:1px solid #eee;margin:16px 0}.day-header{display:flex;align-items:center;gap:10px;margin:20px 0 4px}.day-num{background:#2563EB;color:white;font-weight:700;font-size:11px;width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center}.day-title{font-size:15px;font-weight:700}.day-city{color:#aaa;font-size:11px;margin-bottom:10px}.activity{margin-bottom:8px;padding-left:12px}.act-desc{color:#666;font-size:12px}.tip{color:#b45309;font-size:11px;margin-top:2px}.cost-row{background:#f8f9fa;padding:8px 12px;border-radius:8px;font-size:11px;color:#666;margin-top:6px}.section-box{background:#f8f9fa;border-radius:10px;padding:16px;margin-bottom:12px}.budget-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px}.budget-label{color:#666}.budget-value{font-weight:600}.info-row{display:flex;gap:8px;padding:4px 0;font-size:12px}.info-label{color:#999;width:50px;flex-shrink:0}.info-value{color:#444}.checklist-item{padding:4px 0;font-size:12px;color:#444}.checklist-item::before{content:"☐ ";color:#999}.footer{color:#ccc;font-size:10px;margin-top:32px;text-align:center}.overview-item{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0f0f0}.overview-num{background:#2563EB;color:white;font-weight:700;font-size:10px;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center}.overview-title{font-size:13px;font-weight:600}.overview-summary{font-size:11px;color:#999}@media print{body{padding:20px}}</style></head><body>`;

    html += `<h1>${title}</h1><p class="subtitle">Tripflowy — tripflowy.com</p>`;

    // Overview
    html += `<h2>${locale === "ko" ? "📋 전체 일정 요약" : "📋 Overview"}</h2>`;
    for (const d of days) html += `<div class="overview-item"><div class="overview-num">${d.dayNumber}</div><div><div class="overview-title">${d.course.title[locale]}</div><div class="overview-summary">${d.course.summary[locale]}</div></div></div>`;

    // Day details
    html += `<h2>${locale === "ko" ? "📍 일자별 상세 일정" : "📍 Details"}</h2>`;
    for (const d of days) {
      const cl = allCities.find((c) => c.id === d.city)?.label[locale] ?? d.city;
      html += `<div class="day-header"><div class="day-num">${d.dayNumber}</div><div class="day-title">${d.course.title[locale]}</div></div><div class="day-city">${cl}</div>`;
      for (const a of d.course.activities) {
        html += `<div class="activity"><strong>${a.time}</strong> ${a.title[locale]}<br><span class="act-desc">${a.description[locale]}</span>`;
        if (a.tips) for (const t of a.tips) html += `<div class="tip">💡 ${t[locale]}</div>`;
        html += `</div>`;
      }
      if (d.course.costs) { const c = d.course.costs; html += `<div class="cost-row">${locale==="ko"?`식비 ${c.food.toLocaleString()}원 · 투어 ${c.activity.toLocaleString()}원 · 교통 ${c.transport.toLocaleString()}원 · 기타 ${c.etc.toLocaleString()}원`:`Food ${c.food} · Tour ${c.activity} · Transport ${c.transport} · Etc ${c.etc} (${c.currency})`}</div>`; }
      html += `<hr class="divider">`;
    }

    // Budget
    html += `<h2>${locale==="ko"?"💰 예상 경비":"💰 Budget"}</h2><div class="section-box">`;
    if (flight) { html += `<h3>✈️ ${locale==="ko"?"항공권":"Flights"}</h3><div class="budget-row"><span class="budget-label">FSC</span><span class="budget-value">${formatCurrency(convertToDisplay(flight.fsc.min,flight.currency,locale),locale)}~${formatCurrency(convertToDisplay(flight.fsc.max,flight.currency,locale),locale)}</span></div><div class="budget-row"><span class="budget-label">LCC</span><span class="budget-value">${formatCurrency(convertToDisplay(flight.lcc.min,flight.currency,locale),locale)}~${formatCurrency(convertToDisplay(flight.lcc.max,flight.currency,locale),locale)}</span></div>`; }
    if (hotel) { html += `<h3>🏨 ${locale==="ko"?"숙소 (1박)":"Hotels"}</h3><div class="budget-row"><span class="budget-label">${locale==="ko"?"가성비":"Budget"}</span><span class="budget-value">${formatCurrency(convertToDisplay(hotel.budget.min,hotel.currency,locale),locale)}~${formatCurrency(convertToDisplay(hotel.budget.max,hotel.currency,locale),locale)}</span></div><div class="budget-row"><span class="budget-label">${locale==="ko"?"일반":"Standard"}</span><span class="budget-value">${formatCurrency(convertToDisplay(hotel.standard.min,hotel.currency,locale),locale)}~${formatCurrency(convertToDisplay(hotel.standard.max,hotel.currency,locale),locale)}</span></div><div class="budget-row"><span class="budget-label">${locale==="ko"?"럭셔리":"Luxury"}</span><span class="budget-value">${formatCurrency(convertToDisplay(hotel.luxury.min,hotel.currency,locale),locale)}~${formatCurrency(convertToDisplay(hotel.luxury.max,hotel.currency,locale),locale)}</span></div>`; }
    const lt = localCosts.food+localCosts.activity+localCosts.transport+localCosts.etc;
    if (lt>0) { html += `<h3>🗺️ ${locale==="ko"?"현지 경비":"Local"}</h3><div class="budget-row"><span class="budget-label">${locale==="ko"?"식비":"Food"}</span><span class="budget-value">${formatCurrency(localCosts.food,locale)}</span></div><div class="budget-row"><span class="budget-label">${locale==="ko"?"투어":"Tours"}</span><span class="budget-value">${formatCurrency(localCosts.activity,locale)}</span></div><div class="budget-row"><span class="budget-label">${locale==="ko"?"교통":"Transport"}</span><span class="budget-value">${formatCurrency(localCosts.transport,locale)}</span></div><div class="budget-row"><span class="budget-label">${locale==="ko"?"기타":"Etc"}</span><span class="budget-value">${formatCurrency(localCosts.etc,locale)}</span></div>`; }
    html += `</div>`;

    // City info
    for (const ci of cityInfos) { if (!ci?.info) continue; const cl = allCities.find((c) => c.id === ci.cityId)?.label[locale] ?? ci.cityId; html += `<h2>🌏 ${cl}</h2><div class="section-box"><div class="info-row"><span class="info-label">${locale==="ko"?"비자":"Visa"}</span><span class="info-value">${ci.info.visa[locale]}</span></div><div class="info-row"><span class="info-label">${locale==="ko"?"시차":"Time"}</span><span class="info-value">${ci.info.timezone[locale]}</span></div><div class="info-row"><span class="info-label">${locale==="ko"?"통화":"Currency"}</span><span class="info-value">${ci.info.currency[locale]}</span></div><div class="info-row"><span class="info-label">${locale==="ko"?"언어":"Language"}</span><span class="info-value">${ci.info.language[locale]}</span></div><div class="info-row"><span class="info-label">${locale==="ko"?"전압":"Voltage"}</span><span class="info-value">${ci.info.voltage[locale]}</span></div></div>`; }

    // Checklist
    html += `<h2>✅ ${locale==="ko"?"예약 체크리스트":"Booking Checklist"}</h2><div class="section-box"><div class="checklist-item">✈️ ${locale==="ko"?`${cityNames} 항공권`:`Flights to ${cityNames}`}</div>`;
    for (const city of itinerary.cities) { const l = allCities.find((c) => c.id === city)?.label[locale] ?? city; html += `<div class="checklist-item">🏨 ${l} ${locale==="ko"?"숙소":"Hotels"}</div>`; }
    for (const n of tourNames) html += `<div class="checklist-item">🎟️ ${n}</div>`;
    html += `</div><p class="footer">Generated by Tripflowy — tripflowy.com</p></body></html>`;

    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.onload = () => w.print(); }
  }

  return (
    <div className="px-5 py-3 border-t border-gray-100 relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors"
      >
        <Bookmark className="w-4 h-4" />
        {locale === "ko" ? "이 일정 저장하기" : "Save this itinerary"}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <button onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4 text-gray-400" />}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {copied ? (locale === "ko" ? "링크가 복사되었어요!" : "Link copied!") : (locale === "ko" ? "링크 복사" : "Copy link")}
              </p>
              {!copied && <p className="text-xs text-gray-400">{locale === "ko" ? "이 링크로 같은 일정을 다시 볼 수 있어요" : "Revisit this exact itinerary later"}</p>}
            </div>
          </button>
          <button onClick={handlePDF}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
            <FileDown className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{locale === "ko" ? "PDF 다운로드" : "Download PDF"}</p>
              <p className="text-xs text-gray-400">{locale === "ko" ? "오프라인에서도 일정을 확인할 수 있어요" : "View your itinerary offline"}</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
