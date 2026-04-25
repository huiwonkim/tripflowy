import { fetchDashboard, type Counter } from "@/lib/analytics/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ date?: string }>;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { date } = await searchParams;
  const data = await fetchDashboard(date);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            UTC 기준 일별 집계. raw 30일 / 일별 톱-라인 365일 보관.
          </p>
        </div>
        <DateSelector
          current={data.date}
          dates={data.recentDates}
          fallbackDate={data.date}
        />
      </header>

      {!data.redisConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Upstash Redis 미연결.</strong> 환경변수{" "}
          <code className="px-1 rounded bg-amber-100">KV_REST_API_URL</code> +{" "}
          <code className="px-1 rounded bg-amber-100">KV_REST_API_TOKEN</code>이
          주입되면 대시보드가 자동으로 활성화됩니다. 그 전엔 0으로 표시됨.
        </div>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total" value={data.totals.total} tone="slate" />
        <Stat label="AI 크롤러" value={data.totals.bot} tone="violet" />
        <Stat label="AI Referrals" value={data.totals.llm} tone="emerald" />
        <Stat label="UTM Hits" value={data.totals.utm} tone="amber" />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <CounterCard
          title="AI 크롤러 Top 10"
          empty="오늘 AI 크롤러 트래픽 없음."
          rows={data.bots.slice(0, 10)}
        />
        <CounterCard
          title="AI Assistant Referrals Top 10"
          empty="오늘 LLM referrer 없음."
          rows={data.llms.slice(0, 10)}
        />
        <CounterCard
          title="랜딩 Path Top 10"
          empty="오늘 트래픽 없음."
          rows={data.paths.slice(0, 10)}
          mono
        />
        <CounterCard
          title="UTM Campaigns Top 10"
          empty="오늘 UTM 캠페인 없음."
          rows={data.utms.slice(0, 10)}
          mono
        />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "violet" | "emerald" | "amber";
}) {
  const tones: Record<string, string> = {
    slate: "border-slate-200",
    violet: "border-violet-200 bg-violet-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
    amber: "border-amber-200 bg-amber-50/40",
  };
  return (
    <div className={`rounded-lg border ${tones[tone]} bg-white p-4`}>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function CounterCard({
  title,
  rows,
  empty,
  mono = false,
}: {
  title: string;
  rows: Counter[];
  empty: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3 font-medium">{title}</div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 px-4 py-2 text-sm"
            >
              <span
                className={`truncate ${mono ? "font-mono text-xs text-slate-700" : ""}`}
                title={row.key}
              >
                {row.key}
              </span>
              <span className="tabular-nums font-medium">
                {row.count.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DateSelector({
  current,
  dates,
  fallbackDate,
}: {
  current: string;
  dates: string[];
  fallbackDate: string;
}) {
  const options = dates.length > 0 ? dates : [fallbackDate];
  const includesCurrent = options.includes(current);
  const finalOptions = includesCurrent ? options : [current, ...options];
  return (
    <form method="get" className="flex items-center gap-2 text-sm">
      <label htmlFor="date" className="text-slate-600">
        날짜
      </label>
      <select
        id="date"
        name="date"
        defaultValue={current}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-xs"
      >
        {finalOptions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-3 py-1 text-white hover:bg-slate-700"
      >
        조회
      </button>
    </form>
  );
}
