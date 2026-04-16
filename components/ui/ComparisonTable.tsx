import type { ComparisonTable as ComparisonTableType, Locale } from "@/types";

interface Props {
  table: ComparisonTableType;
  locale: Locale;
}

/**
 * Structured comparison table embedded in posts via `{{compare:N}}` marker.
 * AEO-friendly: semantic <table> with <thead>/<tbody>/<th scope>.
 */
export function ComparisonTable({ table, locale }: Props) {
  const { title, columns, rows, caption, ...rest } = table;
  void rest;

  return (
    <figure className="my-8 not-prose">
      {title && (
        <figcaption className="text-[15px] font-semibold text-gray-900 mb-3">
          {title[locale]}
        </figcaption>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-left text-[14px]">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold"></th>
              {columns.map((col, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-semibold text-gray-700">
                  {col[locale]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="bg-white">
                <th scope="row" className="px-4 py-3 font-medium text-gray-500 bg-gray-50/40 whitespace-nowrap align-top">
                  {row.label[locale]}
                </th>
                {row.values.map((val, colIdx) => (
                  <td
                    key={colIdx}
                    className={
                      "px-4 py-3 text-gray-800 leading-[1.6] align-top " +
                      (row.highlight === colIdx ? "bg-blue-50/60 text-blue-900 font-medium" : "")
                    }
                  >
                    {val[locale]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{caption[locale]}</p>
      )}
    </figure>
  );
}
