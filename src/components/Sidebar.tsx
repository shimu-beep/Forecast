/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Percent, 
  Database, 
  FileCode, 
  Smartphone, 
  Boxes, 
  CreditCard,
  Building2,
  Users,
  Terminal,
  ShieldCheck,
  Zap,
  Globe2
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentRole, setCurrentRole }: SidebarProps) {
  const roles = ["Super Admin", "Admin", "Manager", "Staff"];
  
  const menuItems = [
    { 
      id: "dashboard", 
      label: "Executive Dashboard", 
      icon: LayoutDashboard, 
      roles: ["Super Admin", "Admin", "Manager", "Staff"],
      activeColor: "from-rose-500/15 to-rose-600/5 text-rose-400 border-rose-500/30",
      iconColor: "text-rose-400",
      hoverClass: "hover:bg-rose-500/5 hover:text-rose-300"
    },
    { 
      id: "forecasting", 
      label: "Demand Forecaster AI", 
      icon: TrendingUp, 
      roles: ["Super Admin", "Admin", "Manager"],
      activeColor: "from-amber-400/15 to-amber-500/5 text-amber-400 border-amber-550/30",
      iconColor: "text-amber-400",
      hoverClass: "hover:bg-amber-400/5 hover:text-amber-300"
    },
    { 
      id: "pricing", 
      label: "Dynamic Pricing AI", 
      icon: Percent, 
      roles: ["Super Admin", "Admin", "Manager"],
      activeColor: "from-emerald-400/15 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
      iconColor: "text-emerald-400",
      hoverClass: "hover:bg-emerald-400/5 hover:text-emerald-305"
    },
    { 
      id: "database", 
      label: "Azure SQL Architect", 
      icon: Database, 
      roles: ["Super Admin", "Admin"],
      activeColor: "from-cyan-400/15 to-cyan-500/5 text-cyan-400 border-cyan-550/30",
      iconColor: "text-cyan-400",
      hoverClass: "hover:bg-cyan-400/5 hover:text-cyan-305"
    },
    { 
      id: "api", 
      label: "REST API Swagger", 
      icon: FileCode, 
      roles: ["Super Admin", "Admin", "Manager", "Staff"],
      activeColor: "from-violet-400/15 to-violet-500/5 text-violet-400 border-violet-500/30",
      iconColor: "text-violet-400",
      hoverClass: "hover:bg-violet-400/5 hover:text-violet-305"
    },
    { 
      id: "flutter", 
      label: "Flutter Mobile App", 
      icon: Smartphone, 
      roles: ["Super Admin", "Admin", "Manager", "Staff"],
      activeColor: "from-sky-400/15 to-sky-500/5 text-sky-450 border-sky-500/30",
      iconColor: "text-sky-400",
      hoverClass: "hover:bg-sky-400/5 hover:text-sky-305"
    },
    { 
      id: "inventory", 
      label: "POS Sales & ERP Products", 
      icon: Boxes, 
      roles: ["Super Admin", "Admin", "Manager", "Staff"],
      activeColor: "from-pink-400/15 to-pink-500/5 text-pink-400 border-pink-500/30",
      iconColor: "text-pink-400",
      hoverClass: "hover:bg-pink-400/5 hover:text-pink-305"
    },
    { 
      id: "saas", 
      label: "Subscription & Tenants", 
      icon: CreditCard, 
      roles: ["Super Admin"],
      activeColor: "from-orange-400/15 to-orange-550/5 text-orange-400 border-orange-500/30",
      iconColor: "text-orange-450",
      hoverClass: "hover:bg-orange-400/5 hover:text-orange-305"
    }
  ];

  return (
    <aside className="w-64 bg-[#070b19] border-r border-slate-800 text-slate-200 flex flex-col h-full overflow-hidden select-none">
      {/* SaaS Logo Block */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-550 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <span className="text-white font-black text-xl leading-none">R</span>
        </div>
        <div>
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">RetailAI</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
              v8.2 Active
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox Panel */}
      <div className="p-4 mx-4 my-4 rounded-2xl bg-gradient-to-b from-[#0f172a]/80 to-[#020617]/90 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-sans">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-450" />
            <span>Authorization Core</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#020617] text-indigo-400 border border-indigo-550/30">
            JWT
          </span>
        </div>
        
        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="w-full bg-[#020617] text-slate-300 border border-slate-850 text-xs rounded-xl p-2 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-slate-700 transition"
        >
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
          Switch role to test JWT claim controls.
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map(item => {
          const isAllowed = item.roles.includes(currentRole);
          const isActive = activeTab === item.id;
          
          if (!isAllowed) return null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition duration-200 group text-left border cursor-pointer ${
                isActive 
                  ? `bg-gradient-to-r ${item.activeColor} font-bold shadow-md` 
                  : `text-slate-400 border-transparent ${item.hoverClass}`
              }`}
            >
              <item.icon className={`h-4.5 w-4.5 transition-transform duration-300 ${
                isActive ? `${item.iconColor} scale-110 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]` : "text-slate-500 group-hover:text-slate-300"
              }`} />
              <span className="flex-1 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Plan Status Indicator Card matching Design Theme */}
      <div className="p-4 mb-4 mx-4 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-pink-600/10 rounded-2xl border border-indigo-500/20 shadow-md">
        <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1.5">Consolidated Node</p>
        <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 mb-2.5">Enterprise Pro Matrix</p>
        <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
          <div className="bg-gradient-to-r from-[#4f46e5] via-[#a855f7] to-[#ec4899] h-full w-4/5 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]"></div>
        </div>
      </div>
    </aside>
  );
}
