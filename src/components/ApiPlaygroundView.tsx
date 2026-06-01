/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileCode, 
  Terminal, 
  Play, 
  RotateCw, 
  Send, 
  CheckCircle, 
  Globe, 
  Unlock, 
  PlusCircle, 
  BarChart, 
  DollarSign 
} from "lucide-react";

export default function ApiPlaygroundView() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("get-health");
  const [requestPayload, setRequestPayload] = useState<string>("{}");
  const [apiResponse, setApiResponse] = useState<string>(`// Execute API request to populate response JSON...`);
  const [executing, setExecuting] = useState<boolean>(false);

  const endpoints = [
    { id: "get-health", method: "GET", path: "/api/health", label: "Check API Health Status", category: "System", defaultPayload: "{}" },
    { id: "post-login", method: "POST", path: "/api/auth/login", label: "Authenticate User (JWT)", category: "Authentication", defaultPayload: '{\n  "email": "admin@retailai.com",\n  "password": "SuperSecurePassword123"\n}' },
    { id: "get-products", method: "GET", path: "/api/products", label: "Fetch Tenant Products", category: "Product Database", defaultPayload: "{}" },
    { id: "post-product", method: "POST", path: "/api/products", label: "Register New Product", category: "Product Database", defaultPayload: '{\n  "name": "Cozy Winter Blanket Extra Warm",\n  "categoryId": 1,\n  "price": 35.00,\n  "cost": 18.50,\n  "stock": 100,\n  "minStock": 15,\n  "location": "Aisle D3",\n  "seasonalTrigger": "Winter"\n}' },
    { id: "get-sales", method: "GET", path: "/api/sales", label: "Fetch Sales Ledger", category: "POS Sales ledger", defaultPayload: "{}" },
    { id: "post-sale", method: "POST", path: "/api/sales", label: "Submit Retail Sale Transaction", category: "POS Sales ledger", defaultPayload: '{\n  "productId": 101,\n  "quantity": 5,\n  "discount": 0.00,\n  "branchId": 1,\n  "paymentMethod": "Mobile POS"\n}' },
    { id: "post-forecast", method: "POST", path: "/api/forecast/analyze", label: "Execute Demand Forecast", category: "Predictive AI Core", defaultPayload: '{\n  "days": 30,\n  "branchId": 1\n}' },
    { id: "post-pricing", method: "POST", path: "/api/pricing/suggest", label: "Smart Dynamic Pricing Suggestion", category: "Predictive AI Core", defaultPayload: '{\n  "productId": 103,\n  "promoType": "Seasonal Clearance"\n}' }
  ];

  const activeEndpointObj = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const handleEndpointSelect = (id: string) => {
    setSelectedEndpoint(id);
    const target = endpoints.find(e => e.id === id);
    if (target) {
      setRequestPayload(target.defaultPayload);
    }
  };

  const executeApiCall = async () => {
    setExecuting(true);
    setApiResponse("// Directing request to active node...");
    
    try {
      const config: RequestInit = {
        method: activeEndpointObj.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer SimulatedJWTClaimToken_Admin"
        }
      };

      if (activeEndpointObj.method === "POST") {
        config.body = requestPayload;
      }

      const response = await fetch(activeEndpointObj.path, config);
      const jsonOutput = await response.json();
      
      setApiResponse(JSON.stringify(jsonOutput, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({
        success: false,
        error: "Sandbox Endpoint Routing Error",
        details: err.message || "Failed to parse API payload content."
      }, null, 2));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 flex flex-col gap-8 font-sans">
      {/* View Title */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-sans">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileCode className="h-6 w-6 text-indigo-400" />
            REST API Swagger Playground
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Directly probe, edit, and test live server endpoints configured in our Express routing framework.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0f172a]/40 border border-slate-800/80 text-xs font-mono text-slate-300 py-1.5 px-3 rounded-xl shadow-md">
          <Globe className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span>Dev Node: <span className="text-indigo-400">http://localhost:3000/api</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Endpoint Selector panel */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Unlock className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Endpoint Registry</h3>
          </div>

          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            {endpoints.map(ep => {
              const isActive = selectedEndpoint === ep.id;
              const isPost = ep.method === "POST";
              
              return (
                <button
                  key={ep.id}
                  onClick={() => handleEndpointSelect(ep.id)}
                  className={`w-full p-3 rounded-xl border text-left cursor-pointer transition duration-150 ${
                    isActive 
                      ? "bg-[#020617] border-indigo-500/80 text-white shadow-lg" 
                      : "bg-[#020617]/40 border-slate-800/85 text-slate-450 hover:border-slate-700 hover:bg-[#020617]/60"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isPost 
                        ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/25" 
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-medium">{ep.category}</span>
                  </div>
                  
                  <span className="text-xs font-semibold block text-slate-200 truncate">{ep.label}</span>
                  <span className="text-[10px] font-mono text-slate-400 break-all block mt-1">{ep.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playground Client simulator */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-3 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                <h3 className="font-bold text-white text-sm">Interactive Client Console</h3>
              </div>
              <button
                onClick={executeApiCall}
                disabled={executing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-650 to-indigo-700 hover:from-indigo-600 hover:to-indigo-650 text-white font-extrabold text-xs shadow disabled:opacity-50 transition cursor-pointer"
              >
                {executing ? (
                  <>
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Querying Node...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Input payload for POST methods */}
            {activeEndpointObj.method === "POST" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">JSON Request Parameter Body</label>
                  <span className="text-[9px] font-mono text-indigo-400 font-semibold">Content-Type: application/json</span>
                </div>
                <textarea
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  rows={6}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-xs font-mono text-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                />
              </div>
            )}

            {/* Response Output JSON Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Rest response JSON payload</label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-medium text-emerald-450">200 - Action Success</span>
                </div>
              </div>
              
              <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-850 shadow-inner">
                <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed h-64 select-text whitespace-pre">
                  <code>{apiResponse}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-4 text-[10px] text-slate-500 italic flex items-center gap-1 font-medium">
            <span>● Secured using mock bearer claims holding permissions parameters.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
