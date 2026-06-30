/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useLocation } from "react-router";
import {
  CircleDollarSign,
  Building2,
  Database,
  ShieldCheck,
  CreditCard,
  Table2,
  Bell,
  User,
  Settings,
  Settings2,
  Trash2,
  Menu,
  ListChecks,
  Users,
  BarChart3,
  Coins,
  Wallet,
  CalendarIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAppData } from "../../lib/contexts/AppDataContext";
import { PuppyLogo } from "../shared/PuppyLogo";
import { MonthPicker } from "../shared/MonthPicker";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const navigationItems = [
  { id: "centers", label: "Timesheet", icon: BarChart3, path: "/centers" },
  { id: "audit", label: "Audit", icon: ShieldCheck, path: "/audit" },
  { id: "master-ae", label: "Master", icon: Database, path: "/master-ae" },
  { id: "hold-dashboard", label: "Balance", icon: Wallet, path: "/hold-dashboard" },
];

const configItems = [
  { to: "/config/centers", icon: ListChecks, label: "Centers Data" },
  { to: "/config/ae", icon: Users, label: "AE Data" },
];

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenSettings: () => void;
}

export function Navbar({ onToggleMobileMenu, onOpenSettings }: NavbarProps) {
  const location = useLocation();
  const { appData, updateAppData } = useAppData();

  const showMonthCard = location.pathname === "/master-ae" || location.pathname === "/hold-dashboard";
  const currentMonth = appData.globalMonth || "03.2026";

  const parseToInputMonth = (m: string) => {
    if (!m) return "";
    const parts = m.split(".");
    if (parts.length === 2) {
      const [month, year] = parts;
      if (month.length === 2 && year.length === 4) {
        return `${year}-${month}`;
      }
    }
    return "";
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [year, month] = val.split("-");
      if (year && month) {
        updateAppData((prev) => ({ ...prev, globalMonth: `${month}.${year}` }));
      }
    }
  };

  return (
    <div className="h-[48px] flex items-center px-0 gap-6 bg-transparent shrink-0">

      {/* Nav items - Hidden on mobile */}
      <nav className="hidden lg:flex items-center justify-center gap-3 flex-1 pl-0 pt-0 pb-0 relative">

        <div className="flex items-center gap-8 md:gap-10">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/centers');
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex items-center justify-center min-w-[84px] h-[28px] px-3.5 text-[0.72rem] font-bold tracking-[0.12em] transition-all duration-300 whitespace-nowrap lowercase rounded-full font-main backdrop-blur-md ${
                  isActive
                    ? "bg-primary/25 text-[#2d1912] shadow-sm scale-102"
                    : "bg-white/40 text-[#705850]/90 hover:bg-white/85 hover:text-[#2d1912] hover:-translate-y-0.5 hover:shadow-sm"
                }`}
                title={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Right side items */}
      <div className="flex items-center gap-2 pr-4 ml-auto">
        {showMonthCard && (
          <div className="flex items-center gap-2">
            <span
              className="font-black uppercase tracking-widest hidden md:inline-block"
              style={{ fontSize: "11px", color: "#a95a74" }}
            >
              Tháng:
            </span>
            <MonthPicker
              value={currentMonth}
              onChange={(newVal) => {
                if (newVal) {
                  updateAppData((prev) => ({ ...prev, globalMonth: newVal }));
                }
              }}
              align="end"
            />
          </div>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/50 text-foreground transition-colors"
          title="Cài đặt"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
