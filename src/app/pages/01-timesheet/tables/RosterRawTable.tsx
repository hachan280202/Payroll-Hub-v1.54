/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../../../components/DataTable";
import { DETAIL_COLUMNS } from "../../../constants/timesheet-columns";

interface RosterRawTableProps {
  data: Record<string, unknown>[];
}

export function RosterRawTable({ data }: RosterRawTableProps) {
  return (
    <DataTable
      columns={DETAIL_COLUMNS as any}
      data={data as any}
      isEditable={false}
      showRowNumber={true}
      selectable={false}
      striped={false}
      storageKey="timesheet_roster_raw"
      className="rounded-[40px]"
      headerClassName="bg-pink-100 text-pink-900 border-pink-200"
      footerClassName="bg-pink-200 text-pink-950 font-black"
      showFooter={false}
    />
  );
}
