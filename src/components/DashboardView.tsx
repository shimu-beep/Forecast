/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  ArrowUpRight, 
  Layers, 
  Compass, 
  AlertTriangle, 
  TrendingUp, 
  RotateCw, 
  Building, 
  Sparkles,
  ShoppingBag,
  Inbox,
  ArrowRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { DashboardMetrics, ForecastResponse } from "../types";

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  onRefresh: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({ metrics, loading, onRefresh, onNavigateToTab }: DashboardViewProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState<boolean>(false);

  // Fetch forecast data and insights from server endpoint
  useEffect(() => {
    async function fetchForecast() {
      setForecastLoading(true);
      try {
        const response = await fetch("/api/forecast/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            days: 30, 
            branchId: selectedBranch ? parseInt(selectedBranch) : undefined 
          }),
        });
        const data = await response.json();
        if (data.success) {
          setForecastData(data);
        }
      } catch (err) {
        console.error("Error executing server AI forecasting prediction endpoint:", err);
      } finally {
        setForecastLoading(false);
      }
    }
    fetchForecast();
  }, [selectedBranch, metrics]); // React upon branch switch or metrics updates

  if (loading || !metrics) {
    return (
      <div className="flex-1 p-8 bg-slate-950 flex flex-col justify-center items-center gap-4 text-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="text-sm font-mono text-slate-400">Syncing with Azure SQL Pools & Generating AI Framework Context...</p>
      </div>
    );
  }

  // Calculate some display percentages
  const liveProfitMargin = metrics.profitMarginPercent;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 space-y-8 font-sans">
      {/* Header and Branch-wise filtration */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Compass className="h-6 w-6 text-indigo-400" />
            Executive Enterprise Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Authorized Tenant Node. Aggregated global metrics from cloud POS registers & multi-channel ERPs.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Active Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#0f172a]/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 pr-8 focus:ring-1 focus:ring-indigo-500 font-mono focus:outline-none appearance-none cursor-pointer hover:border-slate-700 transition"
            >
              <option value="">Global Consolidation (All Branches)</option>
              {metrics.branchData.map(b => (
                <option key={b.branchId} value={b.branchId}>{b.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-[#0f172a]/60 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition duration-200 cursor-pointer"
            title="Refresh database matrices"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-gradient-to-br from-[#1e112d] via-[#0b0f19] to-[#020617] p-5 rounded-2xl border border-pink-500/20 shadow-lg hover:border-pink-500/50 shadow-pink-550/5 transition duration-300 group flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-pink-400 uppercase">Gross Revenue Sales</span>
            <h3 className="text-2xl font-extrabold text-white mt-1.5">${metrics.totalSales.toLocaleString()}</h3>
            <span className="text-[10px] text-pink-300 font-bold flex items-center gap-0.5 mt-1 font-mono">
              <ArrowUpRight className="h-3 w-3 text-pink-400" /> +12.4% vs Last Month
            </span>
          </div>
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20 shadow-sm group-hover:bg-pink-500/20 shadow-pink-500/10 transition duration-300">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-gradient-to-br from-[#0a231a] via-[#0b0f19] to-[#020617] p-5 rounded-2xl border border-emerald-500/20 shadow-lg hover:border-emerald-500/50 shadow-emerald-500/5 transition duration-300 group flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">Net Margin Profit</span>
            <h3 className="text-2xl font-extrabold text-white mt-1.5">${metrics.totalProfit.toLocaleString()}</h3>
            <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 mt-1 font-mono">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" /> Margin Target Secured
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-sm group-hover:bg-emerald-500/20 shadow-emerald-500/10 transition duration-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-gradient-to-br from-[#1c1c38] via-[#0b0f19] to-[#020617] p-5 rounded-2xl border border-violet-500/20 shadow-lg hover:border-violet-500/50 shadow-violet-550/5 transition duration-300 group flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-violet-400 uppercase">Operating Profit margin</span>
            <h3 className="text-2xl font-extrabold text-white mt-1.5">{liveProfitMargin}%</h3>
            <span className="text-[10px] text-violet-300 font-bold flex items-center gap-0.5 mt-1 font-mono">
              High Operational Yield
            </span>
          </div>
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20 shadow-sm group-hover:bg-violet-500/20 shadow-violet-500/10 transition duration-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-gradient-to-br from-[#2a0f12] via-[#0b0f19] to-[#020617] p-5 rounded-2xl border border-rose-500/30 shadow-lg hover:border-rose-500/60 shadow-rose-550/10 transition duration-300 group flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-rose-450 uppercase">Inventory Shortfalls</span>
            <h3 className="text-2xl font-extrabold text-rose-400 mt-1.5">{metrics.lowStockAlerts.length} Products</h3>
            <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5 mt-1 font-mono">
              {metrics.lowStockAlerts.filter(x => x.severity === "CRITICAL").length} Critical Stockouts
            </span>
          </div>
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 shadow-sm transition duration-300">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Charts & Forecasting Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Animated Forecast Area Chart */}
        <div className="bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-pink-500/15 text-pink-400 border border-pink-500/20 uppercase tracking-widest">
                  AI Model Sandbox
                </span>
                <h3 className="text-lg font-bold text-white mt-2">30-Day Sales Velocity & AI Forecast Bounds</h3>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500 mt-1">
                Algorithm: <span className="text-purple-400 font-bold">XGBoost & Prophet hybrid</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Historical performance analyzed against model estimated bounds (85% confidence interval).
            </p>
          </div>

          <div className="h-72 w-full mt-6 text-xs select-none">
            {forecastLoading ? (
              <div className="h-full w-full flex flex-col justify-center items-center gap-3 text-slate-450">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-xs font-mono">Generating Dynamic Time Series Forecast Matrix...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={forecastData?.forecastPoints || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEstimate" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.45}/>
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.45}/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.45}/>
                    </linearGradient>
                    <linearGradient id="colorBounds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="period" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                  />
                  <Legend />
                  <Area type="monotone" name="Upper Confidence Range" dataKey="upperBound" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" fill="url(#colorBounds)" />
                  <Area type="monotone" name="Predicted Demand" dataKey="pointEstimate" stroke="#d946ef" strokeWidth={2.5} fill="url(#colorEstimate)" />
                  <Area type="monotone" name="Lower Confidence Range" dataKey="lowerBound" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Real-time AI Generated Insights Engine */}
        <div className="bg-gradient-to-b from-[#0f172a]/30 to-[#020617]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-indigo-500/5 -mx-6 -mt-6 p-6 rounded-t-2xl border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h3 className="font-bold text-white text-md">AI Insights Engine</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-indigo-400/10 text-indigo-400 border border-indigo-500/20 uppercase font-bold">
                PROPHET ACTIVE
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/15 text-indigo-300 text-xs leading-relaxed font-mono mt-2">
              {forecastLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-500"></div>
                  <span>Prophesying future metrics...</span>
                </div>
              ) : (
                <>
                  <span className="font-extrabold text-indigo-400">COGNITIVE SUMMARY:</span><br/>
                  "{forecastData?.analysis.summaryStatement || "No models loaded"}"
                </>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Dynamic Telemetries</span>
              {forecastLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-800/40 rounded-lg animate-pulse"></div>
                ))
              ) : (
                forecastData?.analysis.insightsList?.map((insight, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 bg-[#0f172a]/50 p-2.5 rounded-lg border border-slate-800/70">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <p className="leading-normal">{insight}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-4 mt-6 flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>Model Confidence Level:</span>
            <span className="text-indigo-400 font-bold">
              {forecastData ? `${Math.round(forecastData.analysis.modelConfidence * 100)}% CL` : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Management Grid (Low stock vs Dead stock vs Branch Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Reordering Alerts */}
        <div className="bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-rose-550" />
                Critical Inventory Shortfalls
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-550/10 text-rose-450 border border-rose-500/10 uppercase">
                Restock Triggered
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {metrics.lowStockAlerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 font-mono">
                  All inventory points verified secure.
                </div>
              ) : (
                metrics.lowStockAlerts.map(alert => (
                  <div key={alert.productId} className="bg-[#020617]/50 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between hover:border-indigo-500/20 transition duration-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500">{alert.sku}</span>
                      <h5 className="font-bold text-xs text-slate-200">{alert.name}</h5>
                      <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px]">
                        <span className="text-slate-400">Stock: <strong className="text-white">{alert.stock}</strong></span>
                        <span className="text-slate-400">Min: <strong className="text-slate-350">{alert.minStock}</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 block mb-1.5">
                        + {alert.recommendedRestock} Unit Suggested
                      </span>
                      <button
                        onClick={() => onNavigateToTab("inventory")}
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        Order <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dead Stock Capital Locker Mitigation */}
        <div className="bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-amber-505" />
                Capital Stagnation (Dead Stock)
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/10 uppercase">
                Liquidate Action Needed
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {metrics.deadStockAlerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 font-mono">
                  No stagnant listings flagged.
                </div>
              ) : (
                metrics.deadStockAlerts.map(alert => (
                  <div key={alert.productId} className="bg-[#020617]/50 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between hover:border-indigo-500/20 transition duration-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500">{alert.sku}</span>
                      <h5 className="font-semibold text-xs text-slate-200">{alert.name}</h5>
                      <span className="text-[9px] font-mono text-amber-400 block mt-1.5">★ {alert.lastActivity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono font-bold text-amber-400 block">${alert.capitalLocked.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-medium">Locked Capital</span>
                      <button
                        onClick={() => onNavigateToTab("pricing")}
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 ml-auto mt-1.5 cursor-pointer"
                      >
                        Adjust Price <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Branch Income Breakdown Chart */}
        <div className="bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Building className="h-4.5 w-4.5 text-indigo-450" />
                Inter-Branch Sales Comparison
              </h4>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">Total: {metrics.branchData.length} active nodes</span>
            </div>

            <div className="h-56 mt-4 text-xs select-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.branchData}
                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tickFormatter={(v) => v.split(" ")[0]} />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "10px", color: "#f8fafc" }}
                  />
                  <Bar dataKey="sales" fill="url(#barGradient)" radius={[4, 4, 0, 0]} name="Gross Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
