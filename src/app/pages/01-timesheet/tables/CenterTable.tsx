/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../../../components/DataTable";
import { CENTER_COLUMNS } from "../../../constants/timesheet-columns";

interface CenterTableProps {
  data: Record<string, unknown>[];
}

export function CenterTable({ data }: CenterTableProps) {
  return (
    <DataTable
      columns={CENTER_COLUMNS as any}
      data={data as any}
      isEditable={false}
      showRowNumber={true}
      selectable={false}
      striped={false}
      storageKey="timesheet_center"
      className="rounded-[40px]"
      headerClassName="bg-indigo-50 text-indigo-900 border-indigo-100"
      footerClassName="bg-indigo-100 text-indigo-950 font-black"
      showFooter={true}
    />
  );
}
