/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { DataTable } from "../../../components/DataTable";
import { DETAIL_COLUMNS } from "../../../constants/timesheet-columns";

interface RosterRawTableProps {
  data: Record<string, unknown>[];
  onFilteredDataChange?: (data: any[]) => void;
  onCellChange?: (row: any, colKey: string, value: any) => void;
}

export function RosterRawTable({ data, onFilteredDataChange, onCellChange }: RosterRawTableProps) {
  const sanitizedData = useMemo(() => {
    return data.map(row => ({
      ...row,
      ma_nv: row.ma_nv !== undefined && row.ma_nv !== null ? String(row.ma_nv) : row.ma_nv,
    }));
  }, [data]);

  return (
    <DataTable
      columns={DETAIL_COLUMNS as any}
      data={sanitizedData as any}
      isEditable={true}
      showRowNumber={true}
      selectable={false}
      striped={false}
      storageKey="timesheet_roster_raw"
      className="rounded-[40px]"
      headerClassName="bg-pink-100 text-pink-900 border-pink-200"
      footerClassName="bg-pink-200 text-pink-950 font-black"
      showFooter={true}
      onFilteredDataChange={onFilteredDataChange}
      onCellChange={onCellChange}
    />
  );
}
