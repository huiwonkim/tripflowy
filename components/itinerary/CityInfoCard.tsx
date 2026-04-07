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
      <div className="mb-4">
        <p className="text-sm font-medium text-sky-600 mb-1">{locale === "ko" ? "여행 기본 정보" : "Travel Essentials"}</p>
        <h2 className="text-xl font-bold text-gray-900">{cityName}</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
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
            <div className="flex items-end gap-1 h-32">
              {months.map((month, i) => {
                const rainPct = (info.climate.rain[i] / maxRain) * 100;
                const tempPct = ((info.climate.tempHigh[i] + 10) / (maxTemp + 20)) * 100; // offset for below-zero
                const isBest = info.bestMonths.includes(i + 1);

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 relative group">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {info.climate.tempHigh[i]}° / {info.climate.tempLow[i]}° · {info.climate.rain[i]}mm
                    </div>
                    {/* Rain bar */}
                    <div className="w-full flex justify-center">
                      <div
                        className={`w-full max-w-[18px] rounded-t-sm ${isBest ? "bg-blue-500" : "bg-blue-300"}`}
                        style={{ height: `${Math.max(rainPct, 2)}%` }}
                      />
                    </div>
                    {/* Temp dot */}
                    <div
                      className="absolute w-2 h-2 rounded-full bg-red-400 border border-white"
                      style={{ bottom: `${tempPct}%` }}
                    />
                    {/* Month label */}
                    <span className={`text-[9px] mt-1 ${isBest ? "text-emerald-600 font-bold" : "text-gray-400"}`}>
                      {month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
