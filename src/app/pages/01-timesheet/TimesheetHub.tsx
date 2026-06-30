import appLogo from "@/assets/images/regenerated_image_1782801979718.png";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useMemo, useRef, useState, useEffect, useTransition, useCallback } from "react";
import { useLocation } from "react-router";
import { useAppData } from "../../lib/contexts/AppDataContext";
import { useTimesheetCalculations } from "../../hooks/useTimesheetCalculations";
import { prepareDataForExport } from "../../lib/utils/data-utils";
import {
  FileText,
  Users,
  Building2,
  Settings,
  Download,
  Search,
  ChevronDown,
  ArrowLeft,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Save,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Copy } from "lucide-react";
import { RosterRawTable } from "./tables/RosterRawTable";
import { EmployeeTable } from "./tables/EmployeeTable";
import { CenterTable } from "./tables/CenterTable";
import { MktLocalNorthPivotTable } from "./tables/MktLocalNorthPivotTable";
import TimesheetSummaryPage from "./TimesheetSummary";
import { useNavigate } from "react-router";
import { isSupabaseConfigured } from "../../lib/supabase";
import { syncRosterToSupabase, SQL_SETUP_SCRIPT } from "../../lib/supabase-sync-utils";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import * as XLSX from "xlsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

function MonthPickerPopover({
  selectedMonth,
  handleMonthChange
}: {
  selectedMonth: string;
  handleMonthChange: (v: string) => void;
}) {
  const currentYear = new Date().getFullYear();
  const [pickerYear, setPickerYear] = useState(
    selectedMonth ? parseInt(selectedMonth.split("-")[0], 10) : currentYear
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedMonth) {
      setPickerYear(parseInt(selectedMonth.split("-")[0], 10));
    }
  }, [selectedMonth]);

  const onSelectMonth = (monthStr: string) => {
    handleMonthChange(`${pickerYear}-${monthStr}`);
    setOpen(false);
  };

  const onClear = () => {
    handleMonthChange("");
    setOpen(false);
  };

  const onThisMonth = () => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    handleMonthChange(`${now.getFullYear()}-${mm}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          style={{ marginBottom: "0px", width: "140px" }}
          className="flex items-center gap-2 px-1 h-full text-[15px] leading-[14px] relative group/month cursor-pointer"
        >
          <div className="w-6 h-6 bg-primary/5 rounded-md flex items-center justify-center text-primary shrink-0 group-hover/month:bg-primary group-hover/month:text-white transition-all duration-500 group-hover/month:rotate-3 shadow-inner">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col justify-center">
            <label
              className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 leading-none mb-0.5 group-hover/month:text-primary/50 transition-colors pointer-events-none"
            >
              Data Period
            </label>
            <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-primary leading-none pointer-events-none">
              {selectedMonth
                ? `${selectedMonth.split("-")[1]}.${selectedMonth.split("-")[0]}`
                : "MM.YYYY"}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-3 bg-white rounded-xl shadow-lg border border-slate-200" align="start">
        <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg mb-3 border border-slate-100">
          <button onClick={() => setPickerYear(y => y - 1)} className="p-1 px-3 hover:bg-white rounded hover:shadow-sm text-slate-500 hover:text-slate-800 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[14px] font-semibold text-slate-800 font-mono tracking-tight">{pickerYear}</span>
          <button onClick={() => setPickerYear(y => y + 1)} className="p-1 px-3 hover:bg-white rounded hover:shadow-sm text-slate-500 hover:text-slate-800 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"].map((m, i) => {
             const monthNum = String(i + 1).padStart(2, "0");
             const val = `${pickerYear}-${monthNum}`;
             const isSelected = selectedMonth === val;
             
             return (
               <button 
                 key={i}
                 onClick={() => onSelectMonth(monthNum)}
                 className={`py-2 text-[13px] rounded-lg transition-all
                   ${isSelected ? "bg-primary text-white shadow font-bold" : "text-slate-600 font-medium hover:bg-primary/10 hover:text-primary"}
                 `}
               >
                 {m}
               </button>
             )
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 px-1">
          <button 
            onClick={onClear}
            className="text-[13px] font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-1.5 rounded-md transition-colors"
          >
            Xóa
          </button>
          <button 
            onClick={onThisMonth}
            className="text-[13px] font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-1.5 rounded-md transition-colors"
          >
            Tháng này
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const timesheetSearchCache = new WeakMap<any, string>();

export function TimesheetHub() {
  const { appData, updateAppData } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<
    "roster_raw" | "employee" | "center" | "mkt_local_north"
  >("roster_raw");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [view, setView] = useState<"final" | "upload">("final");
  const [fromDate, setFromDate] = useState(appData.Timesheet_Dates?.from || "");
  const [toDate, setToDate] = useState(appData.Timesheet_Dates?.to || "");
  const [debouncedFromDate, setDebouncedFromDate] = useState(appData.Timesheet_Dates?.from || "");
  const [debouncedToDate, setDebouncedToDate] = useState(appData.Timesheet_Dates?.to || "");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [totalSyncRows, setTotalSyncRows] = useState(0);
  const [syncedRowsCount, setSyncedRowsCount] = useState(0);
  const [showSqlDialog, setShowSqlDialog] = useState(false);
  const [tableFilteredCount, setTableFilteredCount] = useState<number | null>(null);

  const fromAudit =
    location.state &&
    ((location.state as any).from === "audit" ||
      (location.state as any).from === "audit_applied");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [targetDate, setTargetDate] = useState("");
  const [targetCenter, setTargetCenter] = useState("");

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setTargetDate("");
    setTargetCenter("");
    navigate(location.pathname, {
      replace: true,
      state: { from: "cleared" },
    });
    if (tableRef.current) {
      tableRef.current.clearAllFilters();
    }
  }, [navigate, location.pathname]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle deep linking and navigation resets
  useEffect(() => {
    const state = location.state as any;
    if (state && state.from === "audit") {
      // Apply filters
      if (state.activeTab) setActiveTab(state.activeTab);
      if (state.searchTerm) {
        setSearchTerm(state.searchTerm);
        setDebouncedSearchTerm(state.searchTerm);
      }
      if (state.filterDate) setTargetDate(state.filterDate);
      if (state.filterCenter) setTargetCenter(state.filterCenter);

      // Scroll to the table after a brief delay to ensure rendering
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      // Clear location state but DO NOT trigger cleanup
      navigate(location.pathname, {
        replace: true,
        state: { ...state, from: "audit_applied" },
      });
    }
  }, [location.state, navigate, location.pathname]);

  // Separate effect for clearing filters when navigating NOT from audit
  useEffect(() => {
    const state = location.state as any;
    // Only clear if the user manually changed the URL, not because we cleared the state internally
    if (
      !state ||
      (state.from !== "audit" &&
        state.from !== "audit_applied" &&
        state.from !== "cleared")
    ) {
      handleClearFilters();
      setActiveTab("roster_raw");
      setView("final");
    }
  }, [location.state, handleClearFilters]);

  const handleBackToAudit = () => {
    navigate("/audit", { state: { activeTab: "detail" } });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const v = typeof e === "string" ? e : e.target.value;
    setSelectedMonth(v);
    if (v) {
      const [yearStr, monthStr] = v.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      let prevYear = year;
      let prevMonth = month - 1;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear--;
      }
      const pmStr = String(prevMonth).padStart(2, "0");
      const cmStr = String(month).padStart(2, "0");

      const newFrom = `${prevYear}-${pmStr}-21`;
      const newTo = `${year}-${cmStr}-20`;

      startTransition(() => {
        setFromDate(newFrom);
        setToDate(newTo);
        setTargetDate("");
        setTargetCenter("");
      });
      
      // Remove syncing to globalMonth
    } else {
      startTransition(() => {
        setFromDate("");
        setToDate("");
      });
    }
  };

  // Remove effect syncing globalMonth down to local selectedMonth
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFromDate(fromDate);
      setDebouncedToDate(toDate);
    }, 500);
    setTableFilteredCount(null);
    return () => clearTimeout(timer);
  }, [fromDate, toDate]);

  useEffect(() => {
    setTableFilteredCount(null);
  }, [activeTab, searchTerm, targetDate, targetCenter]);

  useEffect(() => {
    updateAppData((prev) => {
      if (
        prev.Timesheet_Dates?.from === debouncedFromDate &&
        prev.Timesheet_Dates?.to === debouncedToDate
      ) {
        return prev;
      }

      return {
        ...prev,
        Timesheet_Dates: { from: debouncedFromDate, to: debouncedToDate },
      };
    }, false);
  }, [debouncedFromDate, debouncedToDate, updateAppData]);

  const calculatedRosterData = useMemo(() => appData.Q_Roster || [], [appData.Q_Roster]);
  const calculatedSalaryScaleData = useMemo(() => appData.Q_Salary_Scale || [], [appData.Q_Salary_Scale]);
  const calculatedStaffData = useMemo(() => appData.Q_Staff || [], [appData.Q_Staff]);
  const calculatedCacheData = useMemo(() => appData.Q_Cache || [], [appData.Q_Cache]);

  const { processedRosterData, employeeSummary, centerSummary, isCalculating } =
    useTimesheetCalculations(
      calculatedRosterData,
      calculatedSalaryScaleData,
      calculatedStaffData,
      calculatedCacheData,
      appData.Timesheet_Dates?.from || debouncedFromDate,
      appData.Timesheet_Dates?.to || debouncedToDate,
    );

  const tabs = useMemo(
    () =>
      [
        { id: "roster_raw", label: "Roster Gốc", icon: FileText },
        { id: "employee", label: "Số Giờ Làm Việc", icon: Users },
        { id: "center", label: "Roster Center", icon: Building2 },
        { id: "mkt_local_north", label: "Phí MKT Local North", icon: FileText },
      ] as const,
    [],
  );

  const mktLocalNorthData = useMemo(() => {
    return processedRosterData.filter((r: any) => {
      const cUpper = String(r.center || "").toUpperCase();
      const isMkt = cUpper === "MKT LOCAL NORTH" || cUpper.startsWith("MKT LOCAL NORTH_");
      // Phải loại bỏ các ca trùng lịch (overlap) khỏi bảng Pivot
      return isMkt && r.overlap_check !== "Trùng lịch";
    });
  }, [processedRosterData]);

  const currentData = useMemo(() => {
    if (activeTab === "roster_raw") return processedRosterData;
    if (activeTab === "employee") return employeeSummary;
    if (activeTab === "center") return centerSummary;
    if (activeTab === "mkt_local_north") return mktLocalNorthData;
    return [];
  }, [activeTab, processedRosterData, employeeSummary, centerSummary, mktLocalNorthData]);

  const searchData = useMemo(() => {
    let data = currentData;

    // 1. If we have a target date (from audit or manually set), filter by date first
    if (targetDate) {
      data = data.filter((row: any) => {
        const rowDate = String(row.date || "").trim();
        const tDate = String(targetDate).trim();
        return rowDate === tDate || rowDate.includes(tDate);
      });
    }

    // 2. If we have a target center (from audit), filter by center
    if (targetCenter) {
      data = data.filter((row: any) => {
        const rowCenter = String(row.center || "")
          .trim()
          .toUpperCase();
        const tCenter = String(targetCenter).trim().toUpperCase();
        return rowCenter === tCenter || rowCenter.includes(tCenter);
      });
    }

    // 3. If we have a search term (class name)
    if (debouncedSearchTerm) {
      const normalizeStr = (s: string) => {
        if (!s) return "";
        let normalized = s.toLowerCase();
        normalized = normalized.replace(/đ/g, "d");
        return normalized
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "");
      };

      const lowerSearch = normalizeStr(debouncedSearchTerm);
      const lowerSearchTrimmedZero = lowerSearch.replace(/^0+/, "");

      const searchCache = timesheetSearchCache;

      data = data.filter((row: any) => {
        // Use precomputed _searchStr if available
        let rowSearchStr = searchCache.get(row);
        
        if (rowSearchStr !== undefined) {
          if (rowSearchStr.includes(lowerSearch)) return true;
          if (lowerSearchTrimmedZero && rowSearchStr.includes(lowerSearchTrimmedZero)) return true;
          return false;
        }

        rowSearchStr = "";
        
        // Optimize search to only search in keys that might be displayed
        for (const [key, value] of Object.entries(row)) {
          if (value == null) continue;
          
          if (key === "employeeId" || key === "ma_nv" || key.toLowerCase().includes("business") || key.toLowerCase().includes("center") || key.toLowerCase().includes("class") || key.toLowerCase().includes("name")) {
              rowSearchStr += `|${normalizeStr(String(value))}`;
          }
        }
        
        // Cache it for future filtering
        searchCache.set(row, rowSearchStr);

        return rowSearchStr.includes(lowerSearch) || rowSearchStr.includes(lowerSearchTrimmedZero);
      });
    }

    return data;
  }, [currentData, debouncedSearchTerm, targetDate, targetCenter]);

  // 1. Get unique non-empty type values for Pivot Table columns (excluding empty key values as requested)
  const mktPivotUniqueTypes = useMemo(() => {
    if (activeTab !== "mkt_local_north") return [];
    const typesSet = new Set<string>();
    searchData.forEach((r: any) => {
      const type = String(r.taskType || "").trim().toUpperCase();
      if (type) {
        typesSet.add(type);
      }
    });
    return Array.from(typesSet).sort();
  }, [activeTab, searchData]);

  // 2. Aggregate row data by business -> center -> chargeToCenterMkt
  const mktPivotRows = useMemo(() => {
    if (activeTab !== "mkt_local_north") return [];
    
    const map = new Map<string, {
      business: string;
      center: string;
      chargeToCenterMkt: string;
      values: Record<string, number>;
      total: number;
    }>();

    searchData.forEach((r: any) => {
      const type = String(r.taskType || "").trim().toUpperCase();
      if (!type) return; // skip empty data as requested

      const bus = String(r.business || "").trim();
      const charge = String(r.chargeToCenterMkt || "").trim();
      const key = `${bus}||${charge}`;

      if (!map.has(key)) {
        map.set(key, {
          business: bus,
          center: "", // No longer grouping by center as requested
          chargeToCenterMkt: charge,
          values: {},
          total: 0,
        });
      }

      const item = map.get(key)!;
      const hours = Number(r.duration ?? r.workingHours) || 0;
      // Value: working hours * 20,000 as requested
      const value = hours * 20000;

      item.values[type] = (item.values[type] || 0) + value;
      item.total += value;
    });

    return Array.from(map.values()).sort((a, b) => {
      const comp1 = a.business.localeCompare(b.business);
      if (comp1 !== 0) return comp1;
      return a.chargeToCenterMkt.localeCompare(b.chargeToCenterMkt);
    });
  }, [activeTab, searchData]);

  // 3. Compute column and grand totals for the Pivot Grid
  const mktPivotGrandTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    
    mktPivotRows.forEach((row) => {
      mktPivotUniqueTypes.forEach((type) => {
        totals[type] = (totals[type] || 0) + (row.values[type] || 0);
      });
      grandTotal += row.total;
    });

    return { totals, grandTotal };
  }, [mktPivotRows, mktPivotUniqueTypes]);

  const handleExportExcel = () => {
    if (currentData.length === 0) return;

    if (activeTab === "mkt_local_north") {
      const rows = mktPivotRows.map((row) => {
        const item: any = {
          "Business": row.business,
          "Charge To Center MKT": row.chargeToCenterMkt,
        };
        mktPivotUniqueTypes.forEach((type) => {
          item[type] = row.values[type] || 0;
        });
        item["Grand Total"] = row.total;
        return item;
      });

      // Add Grand Totals Row
      const totalsRow: any = {
        "Business": "TỔNG CỘNG",
        "L07 (Region)": "",
        "Charge To Center MKT": "",
      };
      mktPivotUniqueTypes.forEach((type) => {
        totalsRow[type] = mktPivotGrandTotals.totals[type] || 0;
      });
      totalsRow["Grand Total"] = mktPivotGrandTotals.grandTotal;
      rows.push(totalsRow);

      const ws = XLSX.utils.json_to_sheet(prepareDataForExport(rows));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Phí MKT Local North (Pivot)");
      XLSX.writeFile(wb, `Pivot_Phi_MKT_Local_North.xlsx`);
      return;
    }

    const ws = XLSX.utils.json_to_sheet(prepareDataForExport(currentData));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab);
    XLSX.writeFile(wb, `Timesheet_Hub_${activeTab}.xlsx`);
  };

  const handleSyncToSupabase = async () => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase chưa được cấu hình! Vui lòng cài đặt URL và Anon Key trong phần cấu hình.");
      return;
    }

    const rosterData = appData.Q_Roster || [];

    if (!rosterData || rosterData.length === 0) {
      toast.warning("Không có dữ liệu Roster để đồng bộ.");
      return;
    }

    setIsSyncing(true);
    setTotalSyncRows(rosterData.length);
    setSyncedRowsCount(0);
    setSyncProgress(0);

    try {
      const { successCount, totalRows } = await syncRosterToSupabase(
        rosterData,
        (current, total) => {
          setSyncedRowsCount(current);
          setTotalSyncRows(total);
          setSyncProgress(Math.round((current / total) * 100));
        }
      );

      toast.success(`Đồng bộ thành công ${successCount.toLocaleString()}/${totalRows.toLocaleString()} dòng lên Supabase.`);
      
      updateAppData((prev: any) => ({
        ...prev,
        updatedAt: new Date().toISOString()
      }), true);
      toast.success("Đã tự động lưu cứng dữ liệu trên web.");
    } catch (err: unknown) {
      console.error("Supabase Sync Error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      toast.error(`Đồng bộ thất bại: ${errMsg}`);
      if (errMsg.includes("Bảng 'roster_cham_cong' chưa tồn tại") || errMsg.includes("Thiếu cột 'charge_to_center_mkt'")) {
        setShowSqlDialog(true);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const tableRef = useRef<any>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden p-8">
      <AnimatePresence initial={false}>
        {view === "final" && (
          <motion.div
            key="final"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ y: "100%", opacity: 0 }}
            className="absolute inset-0 flex flex-col min-h-0 bg-transparent px-3 pt-3 pb-0 m-5 gap-4 items-center overflow-hidden"
            style={{ borderRadius: "54px" }}
          >
            <div ref={containerRef} className="bg-white soft-card force-light flex-1 flex flex-col min-h-0 relative z-10 w-full p-0 mt-2 ml-0 mb-0 shadow-sm rounded-[48px] overflow-hidden border border-border/50" style={{ borderStyle: "solid" }}>
              <div className="absolute inset-0 striped-pattern opacity-[0.03] pointer-events-none rounded-[48px] overflow-hidden" />
              {isSyncing && (
                <div className="absolute top-0 left-0 right-0 bg-sky-50 border-b border-sky-200 px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-50 animate-in fade-in slide-in-from-top duration-300 rounded-t-[48px]">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-sky-600 animate-spin" />
                    <div>
                      <p className="text-xs font-black text-sky-950 uppercase tracking-wider">
                        Đang đồng bộ dữ liệu lên Supabase...
                      </p>
                      <p className="text-[10px] font-bold text-sky-700 uppercase mt-0.5">
                        Đã lưu thành công: {syncedRowsCount.toLocaleString()} / {totalSyncRows.toLocaleString()} dòng ({syncProgress}%)
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-64 bg-sky-200/50 rounded-full h-2.5 overflow-hidden relative">
                    <div 
                      className="bg-sky-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div style={{ height: "94.894px", borderColor: "#ffffff" }} className="px-7 py-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b rounded-[48px] bg-muted/10 shrink-0 relative">
                <div className="absolute inset-0 pattern-dots opacity-[0.05] pointer-events-none rounded-[48px]" />
                <div className="flex items-center gap-3 relative z-10 shrink-0" style={{ width: "300px" }}>
                  {fromAudit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleBackToAudit}
                          className="w-8 h-8 bg-white border border-border rounded-[40px] flex items-center justify-center text-primary hover:bg-primary/5 transition-all shadow-sm hover:scale-105 active:scale-95 group shrink-0"
                          style={{ borderRadius: "40px" }}
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Quay lại Bảng Đối Soát</TooltipContent>
                    </Tooltip>
                  )}
                  <div className="w-10 h-10 bg-transparent rounded-none shrink-0 hidden sm:block relative overflow-hidden">
                    <img src={appLogo} alt="Logo" className="w-full h-full object-contain rounded-none" style={{ imageRendering: '-webkit-optimize-contrast' }} />
                  </div>
                  <div className="min-w-0 flex flex-col items-start gap-1" style={{ width: "250px" }}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex items-center gap-2 sm:gap-3 px-4 h-9 border border-primary/20 rounded-[40px] bg-primary/5 text-primary hover:bg-primary/10 transition-all group justify-center relative shadow-sm"
                          style={{ borderRadius: "40px" }}
                          title="Chuyển bảng dữ liệu"
                        >
                              {(() => {
                                const active = tabs.find(
                                  (t) => t.id === activeTab,
                                );
                                const Icon = active?.icon || FileText;
                                return (
                                  <>
                                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-[0.75rem] font-bold uppercase tracking-widest whitespace-nowrap">
                                      {active?.label}
                                    </span>
                                  </>
                                );
                              })()}
                              <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-56 border border-primary/10 shadow-2xl p-1.5 bg-white rounded-xl"
                      >
                        <DropdownMenuLabel className="font-bold uppercase text-[0.6rem] tracking-widest text-primary/60 px-2 py-1.5">
                          Chọn bảng dữ liệu
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-primary/10 mx-1" />
                        {tabs.map((tab) => (
                          <DropdownMenuItem
                            key={tab.id}
                            onSelect={() => {
                              startTransition(() => {
                                setActiveTab(tab.id as any);
                                setTargetDate("");
                                setTargetCenter("");
                                setSearchTerm("");
                                navigate(location.pathname, {
                                  replace: true,
                                  state: { from: "cleared" },
                                });
                              });
                            }}
                            className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                              activeTab === tab.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-primary/5"
                            }`}
                          >
                            <tab.icon className="w-3.5 h-3.5" />
                            <span className="text-[0.65rem] font-bold uppercase tracking-wider">
                              {tab.label}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10 shrink-0 justify-start sm:justify-end flex-wrap xl:flex-nowrap p-3" style={{ width: "700px" }}>
                  {/* TAB CHỌN NGÀY VÀ ĐƯỢC CHUYỂN LÊN TRÊN ĐÂY */}
                  <div 
                    style={{ marginBottom: "0px", width: "378.985px" }}
                    className="flex items-center flex-wrap sm:flex-nowrap bg-white/50 border border-slate-200 rounded-xl p-1 shadow-sm px-2 hover:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-500 group/month h-9 gap-y-2"
                  >
                    <MonthPickerPopover 
                      selectedMonth={selectedMonth} 
                      handleMonthChange={(v) => handleMonthChange({ target: { value: v } } as any)} 
                    />

                    <div className="w-[1px] h-4 bg-border/50 mx-1 hidden sm:block" />

                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          id="fromDate"
                          name="fromDate"
                          style={{
                            width: "100px"
                          }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-transparent text-[11px] font-bold outline-none uppercase tracking-wider transition-colors h-full leading-[13px] ${fromDate ? "text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                        >
                          <CalendarIcon className="w-3 h-3 opacity-70" />
                          {fromDate
                            ? format(
                                new Date(`${fromDate}T00:00:00`),
                                "dd/MM/yyyy",
                              )
                            : "Từ ngày"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[10000] border-border/50 shadow-2xl rounded-2xl overflow-hidden"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          defaultMonth={
                            fromDate
                              ? new Date(`${fromDate}T00:00:00`)
                              : undefined
                          }
                          selected={
                            fromDate
                              ? new Date(`${fromDate}T00:00:00`)
                              : undefined
                          }
                          onSelect={(d) => {
                            startTransition(() => {
                              const newDate = d ? format(d, "yyyy-MM-dd") : "";
                              setFromDate(newDate);
                              setTargetDate("");
                              setTargetCenter("");
                            });
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto bg-white"
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="w-[1px] h-4 bg-border/50 mx-1 hidden sm:block" />

                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          id="toDate"
                          name="toDate"
                          style={{ paddingRight: "8px" }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-transparent text-[11px] font-bold outline-none uppercase tracking-wider transition-colors h-full leading-[13px] ${toDate ? "text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                        >
                          <CalendarIcon className="w-3 h-3 opacity-70" />
                          {toDate
                            ? format(
                                new Date(`${toDate}T00:00:00`),
                                "dd/MM/yyyy",
                              )
                            : "Đến ngày"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[10000] border-border/50 shadow-2xl rounded-2xl overflow-hidden"
                        align="end"
                      >
                        <Calendar
                          mode="single"
                          defaultMonth={
                            toDate ? new Date(`${toDate}T00:00:00`) : undefined
                          }
                          selected={
                            toDate ? new Date(`${toDate}T00:00:00`) : undefined
                          }
                          onSelect={(d) => {
                            startTransition(() => {
                              const newDate = d ? format(d, "yyyy-MM-dd") : "";
                              setToDate(newDate);
                              setTargetDate("");
                              setTargetCenter("");
                            });
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <button
                    onClick={() => setView("upload")}
                    className="flex items-center gap-2 px-5 h-9 border border-primary/20 rounded-xl bg-primary/5 text-primary font-bold text-[0.625rem] uppercase tracking-widest hover:bg-primary/10 transition-colors shadow-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Cấu hình Roster
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        style={{ width: "35.9965px" }}
                        className="flex w-9 h-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-primary transition-all group shadow-sm"
                        title="Cài đặt & Thao tác"
                      >
                        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 border border-primary/10 shadow-2xl p-2 bg-white rounded-xl"
                    >
                      <div className="p-2 pb-3 mb-1 border-b border-primary/5">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="TÌM KIẾM..."
                            value={searchTerm}
                            onClick={(e) => { e.stopPropagation(); }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="w-full bg-primary/5 border border-primary/10 rounded-xl pl-9 pr-3 py-2 text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner h-9 text-foreground"
                            autoFocus
                          />
                          <Search className="w-3.5 h-3.5 text-primary/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      <DropdownMenuLabel className="text-[0.6rem] font-bold uppercase tracking-widest text-primary/60 px-2 py-1.5">
                        Thao tác nâng cao
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-primary/5 mx-1" />
                      <div className="p-1">
                        <DropdownMenuItem
                          onSelect={() => {
                            (
                              document.querySelector(
                                '[data-action="save-data"]'
                              ) as HTMLElement
                            )?.click();
                          }}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors text-emerald-600"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span className="text-[0.65rem] font-bold uppercase tracking-wider">
                            Lưu dữ liệu
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary/5 mx-1 my-1" />
                        <DropdownMenuItem
                          onSelect={handleSyncToSupabase}
                          disabled={isSyncing}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                          <span className="text-[0.65rem] font-bold uppercase tracking-wider">
                            Đồng bộ lên Supabase
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary/5 mx-1 my-1" />
                        <DropdownMenuItem
                          onSelect={handleExportExcel}
                          disabled={currentData.length === 0}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[0.65rem] font-bold uppercase tracking-wider">
                            Xuất Excel
                          </span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full overflow-hidden p-0">
                {currentData.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-primary/10 p-12">
                    <div className="w-28 h-28 bg-white mb-8 relative">
                      <img src={appLogo} alt="Logo" className="w-full h-full object-cover opacity-30 grayscale rounded-[30px] border-solid border-primary/20 scale-[1.3]" style={{ imageRendering: '-webkit-optimize-contrast', borderWidth: '10px' }} />
                    </div>
                    <p className="font-bold uppercase text-xl tracking-tight text-primary/40">
                      Chưa có dữ liệu{" "}
                      {tabs.find((t) => t.id === activeTab)?.label}
                    </p>
                    <p className="text-[0.625rem] font-bold uppercase opacity-40 tracking-widest mt-2 text-center max-w-md">
                      Vui lòng vào phần Summary để tải lên dữ liệu.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                    {/* Search Result Feedback when empty */}
                    {searchTerm && searchData.length === 0 && (
                      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-500 rounded-3xl overflow-hidden">
                        <div className="bg-white p-8 rounded-2xl border-2 border-primary/10 shadow-2xl flex flex-col items-center text-center max-w-lg scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 pattern-dots opacity-[0.03] pointer-events-none" />
                          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100 text-rose-500 shadow-inner relative z-10">
                            <XCircle className="w-10 h-10" />
                          </div>
                          <h3 className="text-2xl font-normal font-serif text-foreground tracking-tight mb-3 relative z-10">
                            Không tìm thấy{" "}
                            <span className="font-bold font-script text-primary text-3xl lowercase">
                              dữ liệu
                            </span>
                          </h3>
                          <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed mb-8 relative z-10 px-4">
                            Lớp{" "}
                            <span className="text-primary font-black px-2 py-0.5 bg-primary/5 rounded-md border border-primary/10">
                              {searchTerm}
                            </span>{" "}
                            {targetCenter ? `tại ${targetCenter}` : ""}{" "}
                            {targetDate ? `ngày ${targetDate}` : ""} không có
                            bản ghi nào trong{" "}
                            {tabs.find((t) => t.id === activeTab)?.label} cho
                            khoảng thời gian này.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10">
                            <button
                              onClick={handleClearFilters}
                              className="flex-1 py-3.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
                            >
                              Xóa Lọc & Xem Tất Cả
                            </button>
                            {fromAudit && (
                              <button
                                onClick={handleBackToAudit}
                                className="flex-1 py-3.5 bg-slate-100 border border-border text-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-95"
                              >
                                Quay lại Đối Soát
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Search Info Banner when results found */}
                    {searchTerm && searchData.length > 0 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="bg-primary/10 border border-primary/20 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <span
                            className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap"
                            style={{ fontFamily: "system-ui" }}
                          >
                            Đang tìm: {searchTerm}{" "}
                            {targetCenter ? `[${targetCenter}]` : ""}{" "}
                            {targetDate ? `(${targetDate})` : ""}
                          </span>
                          <button
                            onClick={handleClearFilters}
                            className="p-1 hover:bg-primary/20 rounded-full text-primary transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {isCalculating || isPending ? (
                      <div className="flex-1 flex flex-col items-center justify-center bg-white/50 relative z-10 p-12">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <div className="w-8 h-8 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-inner" />
                        </div>
                        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-primary/70 animate-pulse">
                          {isPending ? "Đang chuyển bảng..." : `Đang xử lý ${appData.Q_Roster?.length || 0} dòng dữ liệu...`}
                        </p>
                        <p className="mt-2 text-[10px] uppercase font-bold text-slate-400">
                          Sẽ mất vài giây
                        </p>
                      </div>
                    ) : activeTab === "mkt_local_north" ? (
                      <MktLocalNorthPivotTable 
                        rows={mktPivotRows} 
                        types={mktPivotUniqueTypes} 
                        grandTotals={mktPivotGrandTotals}
                      />
                    ) : activeTab === "roster_raw" ? (
                      <RosterRawTable 
                        data={searchData} 
                        onFilteredDataChange={(d) => setTableFilteredCount(d.length)}
                      />
                    ) : activeTab === "employee" ? (
                      <EmployeeTable 
                        data={searchData} 
                        calculatedRosterData={calculatedRosterData} 
                        onFilteredDataChange={(d) => setTableFilteredCount(d.length)}
                      />
                    ) : activeTab === "center" ? (
                      <CenterTable 
                        data={searchData} 
                        onFilteredDataChange={(d) => setTableFilteredCount(d.length)}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {view === "upload" && (
          <motion.div
            key="upload"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 flex flex-col p-0"
          >
            <TimesheetSummaryPage onBack={() => setView("final")} />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showSqlDialog} onOpenChange={setShowSqlDialog}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-sky-600 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-wider">Thiết lập Bảng Supabase</DialogTitle>
              <DialogDescription className="text-sky-100 font-medium">
                Bảng 'roster_cham_cong' chưa tồn tại hoặc thiếu cột dữ liệu. Vui lòng copy script bên dưới và chạy trong SQL Editor của Supabase để cập nhật cấu trúc bảng.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8">
            <div className="relative group">
              <pre className="bg-slate-950 text-sky-400 p-6 rounded-2xl text-[10px] font-mono leading-relaxed overflow-x-auto max-h-[300px] border border-slate-800 shadow-inner custom-scrollbar">
                {SQL_SETUP_SCRIPT}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 border-white/20 text-white gap-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
                  toast.success("Đã copy script SQL!");
                }}
              >
                <Copy className="w-3.5 h-3.5" />
                SAO CHÉP
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Các bước thực hiện:</h4>
              <ol className="text-[11px] font-bold text-slate-600 space-y-2 list-decimal pl-4">
                <li>Truy cập vào Dashboard Supabase của bạn.</li>
                <li>Chọn dự án và vào phần <span className="text-sky-600">SQL Editor</span>.</li>
                <li>Bấm <span className="text-sky-600">New Query</span> và dán nội dung script trên vào.</li>
                <li>Bấm <span className="text-sky-600">Run</span> để tạo bảng và cấu hình quyền truy cập (RLS).</li>
                <li>Quay lại đây và thử Đồng bộ lại.</li>
              </ol>
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
            <Button 
              onClick={() => setShowSqlDialog(false)}
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-8 font-black uppercase tracking-widest text-[10px]"
            >
              Tôi đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
