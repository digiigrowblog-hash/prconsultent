import React from "react";

type Column<T> = {
  key: keyof T;
  label: string;
};

type ReusableTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
};

export function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
}: ReusableTableProps<T>) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border bg-white rounded shadow mb-4">
        <thead>
          <tr className="bg-[#e6f7fa] text-[#09879a]">
            {columns.map((col) => (
              <th key={String(col.key)} className="py-2 px-4 text-left font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-[#f4fafc] transition">
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-2 px-4 border-t">
                    {row[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
