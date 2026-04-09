"use client";

import { useState } from "react";
import { Bookmark, Check, Link2 } from "lucide-react";
import type { Locale } from "@/types";

export function SaveItineraryButton({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          copied
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {locale === "ko" ? "링크가 복사되었어요!" : "Link copied!"}
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            {locale === "ko" ? "이 일정 저장하기" : "Save this itinerary"}
          </>
        )}
      </button>
      {!copied && (
        <span className="text-xs text-gray-400">
          {locale === "ko" ? "링크를 저장하면 이 일정을 다시 볼 수 있어요" : "Save the link to revisit this itinerary"}
        </span>
      )}
    </div>
  );
}
