import React from "react";

export const ROSTER_RAW_COLUMNS = [
  { key: "center", label: "Center", type: "text" as const, width: 120 },
  { key: "l07", label: "L07", type: "text" as const, width: 140 },
  { key: "chargeToCenterMkt", label: "Charge to Center MKT", type: "text" as const, width: 160 },
  { key: "business", label: "Business", type: "text" as const, width: 100 },
  { key: "ma_nv", label: "ID Number", type: "text" as const, width: 120 },
  { key: "full_name", label: "Full Name", type: "text" as const, width: 180 },
  { key: "ngay", label: "Date", type: "date" as const, width: 100 },
  { key: "type", label: "Type", type: "text" as const, width: 120 },
  { key: "class", label: "Class", type: "text" as const, width: 140 },
  { key: "gio_vao", label: "From", type: "text" as const, width: 90 },
  { key: "gio_ra", label: "To", type: "text" as const, width: 90 },
  { key: "duration", label: "Duration", type: "number" as const, width: 90 },
  { 
    key: "overlap_check", 
    label: "Check", 
    type: "text" as const, 
    width: 120,
    render: (val: string) => (
      <span className={`font-bold ${val === "Trùng lịch" ? "text-rose-600" : val === "Không trùng" ? "text-emerald-600" : ""}`}>
        {val}
      </span>
    )
  },
  { key: "notes", label: "Notes", type: "text" as const, width: 250, cellClassName: "text-slate-800 whitespace-pre-wrap leading-relaxed font-medium" },
];
