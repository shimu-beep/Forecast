/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  CreditCard, 
  Check, 
  Cpu, 
  Users, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  HardDrive 
} from "lucide-react";

export default function SaaSPlansView() {
  const plans = [
    {
      name: "Starter Basic",
      price: "$59",
      billing: "/month",
      sku: "PLAN-START",
      color: "border-slate-800 bg-slate-900/40 hover:border-sky-500/30 transition duration-300 relative overflow-hidden",
      features: [
        "Up to 3 ERP Branch Nodes",
        "10,000 POS Transactions /mo",
        "FBProphet Heuristic Local Forecasting",
        "Standard Chat Support",
        "1 GB Relational SQL Database Storage"
      ],
      cta: "Current Tier (Trial)",
      active: true,
      btnClass: "bg-[#020617] border-slate-800 text-sky-450 cursor-default"
    },
    {
      name: "Enterprise Scale",
      price: "$149",
      billing: "/month",
      sku: "PLAN-SCALE",
      color: "border-purple-500/65 bg-gradient-to-b from-[#131130] to-[#040212] shadow-xl shadow-purple-500/10 relative overflow-hidden hover:border-purple-400 transition duration-300 transform hover:-translate-y-1",
      badge: "POPULAR OPTION",
      features: [
        "Up to 10 Branch Nodes",
        "100,000 POS Transactions /mo",
        "Azure Spark Cluster AI Forecasting",
        "Gemini Smart Dynamic Pricing Model",
        "Companion Flutter Mobile App Sync",
        "Dedicated Multi-pool SQL Support"
      ],
      cta: "Upgrade Sandbox",
      active: false,
      btnClass: "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 border-transparent text-white hover:opacity-90 shadow-md shadow-pink-550/10 hover:shadow-pink-500/20"
    },
    {
      name: "Enterprise Elite",
      price: "$499",
      billing: "/month",
      sku: "PLAN-ELITE",
      color: "border-amber-500/40 bg-gradient-to-b from-[#251b0f] to-[#050302] hover:border-amber-300 transition duration-300 relative overflow-hidden transform hover:-translate-y-1",
      features: [
        "Unlimited Branch Nodes",
        "Uncapped Transactions Ledger",
        "XGBoost + LSTM Hybrid Deep Learning",
        "Raw database stream replication",
        "Dedicated Enterprise support channels",
        "Dedicated DB Pool Cluster Allocations"
      ],
      cta: "Purchase Elite License",
      active: false,
      btnClass: "bg-gradient-to-r from-amber-500 to-orange-550 border-transparent text-white hover:opacity-90 shadow-md shadow-amber-550/10 hover:shadow-amber-500/20"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 flex flex-col gap-8 font-sans">
      {/* Intro Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <CreditCard className="h-6 w-6 text-indigo-400" />
          Multi-Tenant Subscription & Tenant Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Monitor your active subscription tier parameters, evaluate usage limits, and monitor cloud database shard performance.
        </p>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={index} className={`rounded-2xl border p-6 flex flex-col justify-between ${plan.color}`}>
            {plan.badge && (
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-md text-[8px] font-mono font-extrabold bg-indigo-600 text-white border border-indigo-500 uppercase tracking-widest leading-none">
                {plan.badge}
              </span>
            )}
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">SKU Code: {plan.sku}</span>
                <h3 className="text-lg font-extrabold text-white mt-1">{plan.name}</h3>
              </div>

              <div className="flex items-baseline gap-1 py-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.billing}</span>
              </div>

              <ul className="space-y-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className={`w-full mt-8 py-3 rounded-xl font-bold text-xs border transition duration-300 cursor-pointer ${plan.btnClass}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Database Shared Shards Metrics */}
      <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h3 className="font-bold text-white text-sm">Tenant Shard Data Pools</h3>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 uppercase font-bold animate-pulse">
            Active Load Balancer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400 font-mono">
          <div className="p-4 bg-[#020617]/50 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Active Shards</span>
              <span className="text-lg font-black text-white mt-1 block">4 Active Pools</span>
            </div>
            <Database className="h-5 w-5 text-indigo-405" />
          </div>

          <div className="p-4 bg-[#020617]/50 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Tenant SQL Rows</span>
              <span className="text-lg font-black text-white mt-1 block">5,420 entries</span>
            </div>
            <HardDrive className="h-5 w-5 text-indigo-450" />
          </div>

          <div className="p-4 bg-[#020617]/50 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Cloud Memory</span>
              <span className="text-lg font-black text-white mt-1 block">128 MB Alloc</span>
            </div>
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="p-4 bg-[#020617]/50 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Gateway Audit IP</span>
              <span className="text-lg font-black text-white mt-1 block">127.0.0.1 (Local)</span>
            </div>
            <ShieldCheck className="h-5 w-5 text-teal-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
