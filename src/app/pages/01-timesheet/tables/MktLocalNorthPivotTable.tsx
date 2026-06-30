import React from "react";
import { formatMoneyVND } from "../../../lib/utils/data-utils";

interface MktLocalNorthPivotTableRow {
  business: string;
  center: string;
  chargeToCenterMkt: string;
  values: Record<string, number>;
  total: number;
  [key: string]: unknown;
}

interface MktLocalNorthPivotTableProps {
  rows: MktLocalNorthPivotTableRow[];
  types: string[];
  grandTotals: {
    totals: Record<string, number>;
    grandTotal: number;
  };
}

export const MktLocalNorthPivotTable: React.FC<MktLocalNorthPivotTableProps> = ({
  rows,
  types,
  grandTotals,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Header Info - As requested in screenshot style */}
      <div 
        className="bg-orange-50/50 border-b border-orange-100 flex items-center justify-between"
        style={{ height: "74.2824px", paddingLeft: "12px", paddingRight: "12px", paddingTop: "0px", paddingBottom: "0px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <h3 
            className="font-black uppercase tracking-widest text-orange-900/70"
            style={{ fontFamily: "Nunito", fontSize: "13px" }}
          >
            BẢNG PIVOT PHÍ MKT LOCAL NORTH (ĐƠN GIÁ: SỐ GIỜ LÀM * 20.000Đ)
          </h3>
        </div>
        <div 
          className="flex items-center gap-8"
          style={{ height: "42.3614px" }}
        >
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">SỐ DÒNG</span>
            <span className="text-sm font-black text-slate-700">{rows.length}</span>
          </div>
          <div className="flex flex-col items-end border-l border-slate-200 pl-8">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">LOẠI CÔNG VIỆC</span>
            <span className="text-sm font-black text-slate-700">{types.length}</span>
          </div>
          <div className="flex flex-col items-end border-l border-slate-200 pl-8">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">TỔNG PHÍ</span>
            <div className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                <span className="text-sm font-black text-rose-600 tracking-tight">{formatMoneyVND(grandTotals.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50 shadow-sm">
              <th className="px-4 py-3 text-left font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/95 backdrop-blur sticky left-0 z-30 min-w-[120px]">
                BUSINESS
              </th>
              <th className="px-4 py-3 text-left font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/95 backdrop-blur min-w-[150px]">
                L07 (REGION)
              </th>
              <th className="px-4 py-3 text-left font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/95 backdrop-blur min-w-[200px]">
                CHARGE TO CENTER MKT
              </th>
              {types.map((type) => (
                <th key={type} className="px-4 py-3 text-right font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/95 backdrop-blur min-w-[100px]">
                  {type}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/95 backdrop-blur min-w-[120px]">
                GRAND TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-3 font-bold text-slate-600 bg-white group-hover:bg-slate-50/50 sticky left-0 z-10 border-r border-slate-50 transition-colors">
                  {row.business}
                </td>
                <td className="px-4 py-3 font-medium text-slate-500 italic">
                  {row.center}
                </td>
                <td className="px-4 py-3 font-bold text-slate-700">
                  {row.chargeToCenterMkt}
                </td>
                {types.map((type) => (
                  <td key={type} className={`px-4 py-3 text-right font-medium ${row.values[type] ? "text-slate-600" : "text-slate-300"}`}>
                    {row.values[type] ? formatMoneyVND(row.values[type]) : "0"}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-black text-slate-900 bg-slate-50/20">
                  {formatMoneyVND(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 z-20">
            <tr className="bg-rose-50/90 backdrop-blur font-black uppercase tracking-widest text-[11px] border-t-2 border-rose-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <td colSpan={3} className="px-6 py-4 text-rose-800">
                TỔNG CỘNG / GRAND TOTAL
              </td>
              {types.map((type) => (
                <td key={type} className="px-4 py-4 text-right text-rose-700">
                  {formatMoneyVND(grandTotals.totals[type] || 0)}
                </td>
              ))}
              <td className="px-4 py-4 text-right text-rose-900 underline decoration-rose-300 decoration-2 underline-offset-4">
                {formatMoneyVND(grandTotals.grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
