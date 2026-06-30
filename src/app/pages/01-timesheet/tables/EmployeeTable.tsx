/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../../../components/DataTable";
import { getDynamicEmployeeColumns } from "../../../constants/timesheet-columns";
import { useMemo } from "react";

interface EmployeeTableProps {
  data: Record<string, unknown>[];
  calculatedRosterData: Record<string, unknown>[];
  onFilteredDataChange?: (data: any[]) => void;
}

export function EmployeeTable({ data, calculatedRosterData, onFilteredDataChange }: EmployeeTableProps) {
  const columns = useMemo(() => {
    return getDynamicEmployeeColumns(calculatedRosterData as any);
  }, [calculatedRosterData]);

  return (
    <DataTable
      columns={columns as any}
      data={data as any}
      isEditable={true}
      showRowNumber={true}
      selectable={false}
      striped={false}
      storageKey="timesheet_employee"
      className="rounded-[40px]"
      headerClassName="bg-emerald-50 text-emerald-900 border-emerald-100"
      footerClassName="bg-emerald-100 text-emerald-950 font-black"
      showFooter={true}
      onFilteredDataChange={onFilteredDataChange}
    />
  );
}
