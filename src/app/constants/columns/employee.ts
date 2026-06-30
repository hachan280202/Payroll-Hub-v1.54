import { BASE_TASK_COLUMNS } from "./base-task";

export const EMPLOYEE_COLUMNS = [
  { key: "center", label: "L07", type: "text" as const, width: 100 },
  {
    key: "employeeId",
    label: "ID Number",
    type: "text" as const,
    width: 120,
    headerClassName: "leading-[16.4px]",
  },
  { key: "fullName", label: "Name", type: "text" as const, width: 220 },
  { key: "bankAccountNumber", label: "Bank Account", type: "text" as const, width: 140 },
  {
    key: "salaryScale",
    label: "Salary Scale",
    type: "text" as const,
    width: 120,
  },
  { key: "from", label: "From", type: "date" as const, width: 100 },
  { key: "to", label: "To", type: "date" as const, width: 100 },
  ...BASE_TASK_COLUMNS,
  { key: "className", label: "Class Name", type: "text" as const, width: 150 },
  { key: "noteDays", label: "Note", type: "text" as const, width: 220, cellClassName: "text-slate-800 whitespace-pre-wrap leading-relaxed font-medium" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDynamicEmployeeColumns(_rosterData: Record<string, unknown>[]) {
  const found = new Set<string>();
  
  const standards = ["LPAR01", "LRET01", "LDEM01", "LDEC01"];
  const extras = Array.from(found).filter(x => !standards.includes(x));
  extras.sort();

  const extraCols = extras.map(type => ({
    key: type.toLowerCase(),
    label: type,
    type: "number" as const,
    width: 90,
    headerSpanClassName: "text-[0.7rem] font-bold text-slate-800",
  }));

  const baseTaskCols: Record<string, unknown>[] = [];
  BASE_TASK_COLUMNS.forEach(col => {
    if (col.key === "totalHours") {
      baseTaskCols.push(...extraCols);
    }
    baseTaskCols.push(col);
  });

  return [
    { key: "business", label: "Business", type: "text" as const, width: 100 },
    { key: "center", label: "L07", type: "text" as const, width: 100 },
    {
      key: "employeeId",
      label: "ID Number",
      type: "text" as const,
      width: 120,
      headerClassName: "leading-[16.4px]",
    },
    { key: "fullName", label: "Name", type: "text" as const, width: 220 },
    { key: "bankAccountNumber", label: "Bank Account", type: "text" as const, width: 140 },
    {
      key: "salaryScale",
      label: "Salary Scale",
      type: "text" as const,
      width: 120,
    },
    { key: "from", label: "From", type: "date" as const, width: 100 },
    { key: "to", label: "To", type: "date" as const, width: 100 },
    ...baseTaskCols,
    { key: "className", label: "Class Name", type: "text" as const, width: 150 },
    { key: "noteDays", label: "Note", type: "text" as const, width: 220, cellClassName: "text-slate-800 whitespace-pre-wrap leading-relaxed font-medium" },
  ];
}
