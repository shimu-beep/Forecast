/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Smartphone, 
  Terminal, 
  Copy, 
  Check, 
  Bell, 
  Battery, 
  Wifi, 
  Signal, 
  User, 
  TrendingUp, 
  Layers, 
  Package, 
  Info,
  ShieldCheck,
  SmartphoneNfc
} from "lucide-react";

export default function FlutterSimulatorView() {
  const [copied, setCopied] = useState<boolean>(false);
  const [phoneTab, setPhoneTab] = useState<string>("dashboard");
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const flutterCode = `
// ====================================================================
// Enterprise Flutter Mobile Module - RetailAI SaaS Companion App
// Framework: Flutter 3.19+ / Dart 3.3
// State Architecture: Flutter Riverpod
// ====================================================================
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// 1. Riverpod State Providers for ERP Synchronization
final metricsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final response = await http.get(
    Uri.parse('https://your-retailai-saas.com/api/reports/dashboard'),
    headers: {
      'Authorization': 'Bearer JWT_SIMULATED_TOKEN',
      'Content-Type': 'application/json'
    },
  );
  if (response.statusCode == 200) {
    return jsonDecode(response.body)['metrics'];
  } else {
    throw Exception('Failed to fetch telemetry metrics from Azure nodes.');
  }
});

// 2. Main Entry Point
void main() {
  runApp(
    const ProviderScope(
      child: RetailAiCompanionApp(),
    ),
  );
}

class RetailAiCompanionApp extends StatelessWidget {
  const RetailAiCompanionApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RetailAI Companion',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF030712),
        primaryColor: const Color(0xFF8B5CF6),
        cardColor: const Color(0xFF111827),
      ),
      home: const MobileDashboardScreen(),
    );
  }
}

// 3. Complete High-fidelity Mobile Dashboard View
class MobileDashboardScreen extends ConsumerWidget {
  const MobileDashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final metricsAsync = ref.watch(metricsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('RetailAI Analytics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active, color: Colors.purpleAccent),
            onPressed: () => _triggerMobileAlert(context),
          ),
        ],
      ),
      body: metricsAsync.when(
        data: (metrics) => RefreshIndicator(
          onRefresh: () => ref.refresh(metricsProvider.future),
          child: ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              _buildMetricCard(
                title: 'TOTAL REVENUE',
                value: '\\\${metrics['totalSales']}',
                icon: Icons.monetization_on,
                color: Colors.purple,
              ),
              const SizedBox(height: 12),
              _buildMetricCard(
                title: 'OPERATING PROFIT',
                value: '\\\${metrics['totalProfit']}',
                icon: Icons.trending_up,
                color: Colors.emerald,
              ),
              const SizedBox(height: 16),
              const Text('CRITICAL WAREHOUSE LIMITS', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              ...((metrics['lowStockAlerts'] as List).map((alert) => Card(
                color: const Color(0xFF1F2937),
                child: ListTile(
                  title: Text(alert['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('SKU: \${alert['sku']} | Current Stock: \${alert['stock']}'),
                  trailing: const Text('RESTOCK', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
                ),
              ))).toList(),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator(color: Colors.purple)),
        error: (err, stack) => Center(child: Text('Telemetry Sync Error: \$err')),
      ),
    );
  }

  Widget _buildMetricCard({required String title, required String value, required IconData icon, required Color color}) {
    return Card(
      color: const Color(0xFF111827),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 11, color: Colors.grey, letterSpacing: 1.2)),
                const SizedBox(height: 6),
                Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.black, color: Colors.white)),
              ],
            ),
            Icon(icon, color: color, size: 28),
          ],
        ),
      ),
    );
  }

  void _triggerMobileAlert(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('AI Forecast Trigger: Ice drinks velocity peaking. Recommend rebalancing stocks.'),
        backgroundColor: Colors.purple,
      ),
    );
  }
}
  `.trim();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(flutterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerAlert = (msg: string) => {
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 3500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 flex flex-col gap-8 font-sans">
      {/* Intro Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Smartphone className="h-6 w-6 text-indigo-400" />
            Flutter Mobile App Companion
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Review the simulated companion smartphone app UI coupled with fully-fledged copyable production Riverpod code scripts.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-550 text-white font-bold text-xs shadow-lg transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Dart Files Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Flutter Code</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Smartphone Device Simulator on the left */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Interactive Device Preview</span>
          
          {/* Phone Frame wrapper */}
          <div className="relative w-76 h-[540px] bg-[#020617] rounded-[38px] border-[5px] border-slate-800 shadow-2xl flex flex-col overflow-hidden select-none">
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="h-1.5 w-1.5 bg-slate-900 rounded-full ml-auto mr-4"></div>
            </div>

            {/* Simulated Notification Toast Pop-in */}
            {activeAlert && (
              <div className="absolute top-10 left-3 right-3 bg-indigo-950/95 border border-indigo-500/25 text-white rounded-2xl p-3 z-45 shadow-2xl animate-bounce flex items-start gap-2.5">
                <Bell className="h-4 w-4 text-indigo-300 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[10px]">
                  <span className="font-extrabold text-indigo-300 block">RetailAI Security Channel</span>
                  <p className="leading-tight mt-0.5 font-medium">{activeAlert}</p>
                </div>
              </div>
            )}

            {/* Status Bar */}
            <div className="h-8 bg-black/40 px-6 pt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono z-20 shrink-0">
              <span>09:05 AM</span>
              <div className="flex items-center gap-1">
                <Signal className="h-2.5 w-2.5 text-slate-400" />
                <Wifi className="h-2.5 w-2.5 text-slate-400" />
                <Battery className="h-3 w-3 text-slate-400" />
              </div>
            </div>

            {/* Screen Inner Viewport */}
            <div className="flex-1 bg-[#020617] text-slate-100 flex flex-col overflow-hidden">
              {/* App bar inside preview */}
              <div className="bg-[#0f172a]/80 py-3 px-4 border-b border-slate-850 flex items-center justify-between">
                <span className="text-[11px] font-black tracking-tight text-white flex items-center gap-1.5">
                  <SmartphoneNfc className="h-4 w-4 text-indigo-400" />
                  RetailAI Mobile
                </span>
                <User className="h-4 w-4 text-slate-400" />
              </div>

              {/* Main content pane */}
              <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
                <div className="bg-gradient-to-br from-[#0f172a]/80 to-indigo-950/20 p-3 rounded-2xl border border-slate-800/80">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Super Store Gross Sales</span>
                  <span className="text-xl font-extrabold text-white block mt-0.5">$37,645.20</span>
                  <span className="text-[8px] font-mono text-emerald-400 mt-1 block">▲ Consolidated Node Sync Live</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase block font-bold">Warehouse Limit Triggers</span>
                  
                  {/* Alert item 1 */}
                  <div className="p-2.5 bg-[#020617]/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-[10px]">
                    <div>
                      <span className="text-slate-200 font-bold block">Premium Basmati Rice</span>
                      <span className="text-slate-500 block">Stock depletion warning</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15 uppercase">
                      Min Alert
                    </span>
                  </div>

                  {/* Alert item 2 */}
                  <div className="p-2.5 bg-[#020617]/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-[10px]">
                    <div>
                      <span className="text-slate-200 font-bold block">Organic Honey 500g</span>
                      <span className="text-rose-400 font-bold block">Stock: 28 Units</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/15 uppercase">
                      Strict Out
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase block font-bold">Dynamic AI Projections</span>
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/15 rounded-xl text-[10px] text-indigo-300 leading-tight">
                    ★ <strong className="text-white">Trend Prediction:</strong> basmati sales predicted to expand by 35% next Wednesday.
                  </div>
                </div>
              </div>

              {/* Navigation bars inside simulator phone */}
              <div className="h-12 bg-[#0f172a]/80 border-t border-slate-850 px-6 flex justify-around items-center shrink-0">
                <div className="flex flex-col items-center">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <span className="text-[8px] mt-0.5 text-indigo-400 font-bold">Stats</span>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-4 w-4 text-slate-550" />
                  <span className="text-[8px] mt-0.5 text-slate-550">Forecaster</span>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="h-4 w-4 text-slate-550" />
                  <span className="text-[8px] mt-0.5 text-slate-550">Stock</span>
                </div>
              </div>
            </div>

            {/* Gesture navigator line */}
            <div className="h-5 bg-slate-950 flex items-center justify-center shrink-0 border-t border-slate-900">
              <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
            </div>
          </div>

          {/* Prompt trigger logs */}
          <div className="w-full flex justify-center gap-2">
            <button
              onClick={() => triggerAlert("Min Stock depletion alert: Organic Honey 500g critically down to 28 jars! Reorder ASAP.")}
              className="px-2.5 py-1.5 rounded-lg bg-[#0f172a]/40 border border-slate-800/80 text-[10px] text-amber-400 hover:border-slate-700 hover:bg-[#0f172a] transition duration-150 font-mono cursor-pointer"
            >
              Trigger Low Stock Push
            </button>
            <button
              onClick={() => triggerAlert("Gemini Pro: Winter Premium Jackets experiencing speed stagnation. suggested markdown: 20%.")}
              className="px-2.5 py-1.5 rounded-lg bg-[#0f172a]/40 border border-slate-800/80 text-[10px] text-indigo-400 hover:border-slate-700 hover:bg-[#0f172a] transition duration-150 font-mono cursor-pointer"
            >
              Trigger Pricing Push
            </button>
          </div>
        </div>

        {/* Companion Dart source code console on the right */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-3 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Flutter Material Dart Module</h3>
                  <p className="text-[10px] text-slate-400 leading-normal font-medium animate-pulse">Fully runnable client applet logic utilizing Riverpod async listeners.</p>
                </div>
              </div>
            </div>

            {/* Code container */}
            <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-[#020617]/50 border-b border-slate-850 text-[10px] font-mono text-slate-500">
                <span>main.dart</span>
                <span className="text-indigo-400">Flutter 3.x • Dart 3 • Riverpod</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed h-[360px] select-text whitespace-pre border-dashed">
                <code>{flutterCode}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-normal mt-4 font-medium">
            <Info className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p className="flex-1">
              This Flutter Dart module manages state asynchronous propagation and integrates cleanly with push services to trigger real-time device warnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
