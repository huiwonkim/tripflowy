"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import type { Locale } from "@/types";

export function ShareButton({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-100 flex justify-center">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
        {copied
          ? (locale === "ko" ? "링크가 복사되었어요" : "Link copied")
          : (locale === "ko" ? "공유하기" : "Share")}
      </button>
    </div>
  );
}
