"use client";

import { useTranslations } from "next-intl";
import { Globe, Clock, Coins, Languages, Zap, Sun } from "lucide-react";
import type { CityBasicInfo, Locale } from "@/types";

interface CityInfoCardProps {
  info: CityBasicInfo;
  cityName: string;
  locale: Locale;
}

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_KO = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export function CityInfoCard({ info, cityName, locale }: CityInfoCardProps) {
  const months = locale === "ko" ? MONTHS_KO : MONTHS_EN;
  const maxRain = Math.max(...info.climate.rain, 1);
  const maxTemp = Math.max(...info.climate.tempHigh, 1);

  const rows = [
    { icon: Globe, label: locale === "ko" ? "비자" : "Visa", value: info.visa[locale] },
    { icon: Clock, label: locale === "ko" ? "시차" : "Timezone", value: info.timezone[locale] },
    { icon: Coins, label: locale === "ko" ? "통화" : "Currency", value: info.currency[locale] },
    { icon: Languages, label: locale === "ko" ? "언어" : "Language", value: info.language[locale] },
    { icon: Zap, label: locale === "ko" ? "전압" : "Voltage", value: info.voltage[locale] },
  ];

  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600 mb-1.5">{locale === "ko" ? "여행 기본 정보" : "Travel Essentials"}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{cityName}</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card">
        {/* Info rows */}
        <div className="divide-y divide-gray-100">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 px-5 py-3.5">
              <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                <p className="text-sm text-gray-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Climate chart */}
        <div className="px-5 py-5 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-900">{locale === "ko" ? "연중 날씨" : "Annual Climate"}</span>
          </div>

          {/* Best months */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-xs text-gray-500">{locale === "ko" ? "추천 시기:" : "Best months:"}</span>
            {info.bestMonths.map((m) => (
              <span key={m} className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {months[m - 1]}
              </span>
            ))}
          </div>

          {/* Chart */}
          <div className="relative">
            {/* Legend */}
            <div className="flex gap-4 mb-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> {locale === "ko" ? "기온 (°C)" : "Temp (°C)"}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" /> {locale === "ko" ? "강수량 (mm)" : "Rain (mm)"}</span>
            </div>

            {/* Bar + line chart */}
            <div className="relative" style={{ height: "160px" }}>
              {/* Rain bars */}
              <div className="absolute inset-0 flex items-end gap-1 pb-5">
                {months.map((month, i) => {
                  const barH = Math.max((info.climate.rain[i] / maxRain) * 120, 3);
                  const isBest = info.bestMonths.includes(i + 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {info.climate.tempHigh[i]}° / {info.climate.tempLow[i]}°C · {info.climate.rain[i]}mm
                      </div>
                      <div
                        className={`w-3 sm:w-4 rounded-t-sm ${isBest ? "bg-blue-500" : "bg-blue-300"}`}
                        style={{ height: `${barH}px` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Temp line (SVG overlay) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${12 * 30} 160`} preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={info.climate.tempHigh.map((t, i) => {
                    const x = i * 30 + 15;
                    const y = 130 - ((t + 10) / (maxTemp + 20)) * 120;
                    return `${x},${y}`;
                  }).join(" ")}
                />
                {info.climate.tempHigh.map((t, i) => {
                  const x = i * 30 + 15;
                  const y = 130 - ((t + 10) / (maxTemp + 20)) * 120;
                  return <circle key={i} cx={x} cy={y} r="3" fill="#F87171" stroke="white" strokeWidth="1.5" />;
                })}
              </svg>

              {/* Month labels */}
              <div className="absolute bottom-0 left-0 right-0 flex gap-1">
                {months.map((month, i) => {
                  const isBest = info.bestMonths.includes(i + 1);
                  return (
                    <div key={i} className="flex-1 text-center">
                      <span className={`text-[9px] ${isBest ? "text-emerald-600 font-bold" : "text-gray-400"}`}>{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
