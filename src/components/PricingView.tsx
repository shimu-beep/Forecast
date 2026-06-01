/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Percent, 
  Tag, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  Coins, 
  Activity, 
  Copy, 
  Check, 
  Info,
  ChevronRight
} from "lucide-react";
import { Product, PricingSuggestion } from "../types";

interface PricingViewProps {
  products: Product[];
  onRefresh: () => void;
}

export default function PricingView({ products, onRefresh }: PricingViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [promoType, setPromoType] = useState<string>("Seasonal Markdown");
  const [suggestion, setSuggestion] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));

  const handleFetchSuggestion = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    try {
      const response = await fetch("/api/pricing/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: parseInt(selectedProductId),
          promoType 
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuggestion(data);
        onRefresh(); // Refresh dashboard parameters inside parent scope
      }
    } catch (err) {
      console.error("Error executing smart pricing API query:", err);
    } finally {
      setLoading(false);
    }
  };

  const pricingPolicyCode = `
# ====================================================================
# Enterprise Smart Pricing AI Core Module - RetailAI SaaS (Scikit-Learn)
# ====================================================================
import numpy as np
from sklearn.linear_model import LinearRegression
from scipy.optimize import minimize

class ElasticityPricingOptimizer:
    def __init__(self, price_points: list, quantity_sold: list):
        """Fits demand curves using logged price-sales records."""
        self.price_points = np.array(price_points).reshape(-1, 1)
        self.quantity_sold = np.array(quantity_sold)
        self.model = LinearRegression()
        self.model.fit(self.price_points, self.quantity_sold)
        self.slope = self.model.coef_[0]
        self.intercept = self.model.intercept_

    def predict_demand(self, price: float) -> float:
        """Determines expected item sales at hypothetical pricing bounds."""
        return max(0, self.slope * price + self.intercept)

    def optimize_revenue(self, item_cost: float) -> dict:
        """Optimizes total profit margins against price demand curves."""
        # Objective function: -1 * (Price - Cost) * Demand
        def objective(price):
            demand = self.slope * price[0] + self.intercept
            if demand <= 0:
                return 1e10 # Penalize low sales bounds
            profit = (price[0] - item_cost) * demand
            return -1.0 * profit

        # Bound pricing optimization boundaries (between 1x cost and 5x cost)
        bounds = [(item_cost * 1.05, item_cost * 5.0)]
        initial_guess = [item_cost * 1.5]
        
        result = minimize(objective, initial_guess, bounds=bounds, method='SLSQP')
        optimized_price = float(result.x[0])
        expected_sales = self.predict_demand(optimized_price)
        max_profit = (optimized_price - item_cost) * expected_sales

        return {
            "optimized_selling_price": round(optimized_price, 2),
            "projected_velocity": round(expected_sales, 1),
            "calculated_revenue_yield": round(max_profit, 2),
            "suggested_markdown_percentage": round((1.0 - (optimized_price / (item_cost * 2.0))) * 100, 1)
        }

# Execution test for integration pipelines
if __name__ == "__main__":
    # Historical telemetry: Price lists vs sales velocity
    prices = [18.0, 17.5, 16.0, 15.0, 19.0, 14.5]
    sales = [34, 40, 56, 70, 25, 82]
    
    optimizer = ElasticityPricingOptimizer(prices, sales)
    suggestion = optimizer.optimize_revenue(item_cost=11.20)
    print(f"[Pricing optimization fitted]: Suggested price is \${suggestion['optimized_selling_price']}")
  `.trim();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pricingPolicyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 flex flex-col gap-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Percent className="h-6 w-6 text-indigo-400" />
            Dynamic smart Pricing AI Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Harness real-time elasticity curves & multi-competitor indices to discover optimal promotional values.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-405 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Activity className="h-3.5 w-3.5 text-indigo-400" />
          <span>Active Pricing Policy: Adaptive Cost + Elasticity Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Parameters Tuner Card */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Tag className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Elasticity Evaluation</h3>
          </div>

          <div className="space-y-4">
            {/* Product Select parameter */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Select Target Product SKU</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setSuggestion(null);
                }}
                className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer appearance-none"
              >
                <option value="">-- Choose Product Listing --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    ({p.sku}) {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Prompt Type Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Promotional Markdown Strategy</label>
              <select
                value={promoType}
                onChange={(e) => {
                  setPromoType(e.target.value);
                  setSuggestion(null);
                }}
                className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer appearance-none"
              >
                <option value="Seasonal Clearance">Clearance Liquidation (Zero Out Stalled Inventory)</option>
                <option value="Festival Spark">Festival Campaign (Eid/Puja/National Holidays)</option>
                <option value="Margin Protector">Preserve Maximum Margin Utility</option>
                <option value="Volume Stimulator">Velocity Stimulator (Fast Turnaround)</option>
              </select>
            </div>

            {/* Selected Product Context Metadata Tracker */}
            {selectedProduct && (
              <div className="bg-[#020617]/60 rounded-xl p-4 border border-slate-800 text-xs font-mono space-y-2.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1.5">Live Database Context</span>
                <div className="flex justify-between">
                  <span className="text-slate-500">List Price:</span>
                  <span className="text-slate-300 font-bold">${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Acquisition Cost:</span>
                  <span className="text-slate-300 font-bold">${selectedProduct.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stock Count:</span>
                  <span className={`font-bold ${selectedProduct.stock <= selectedProduct.minStock ? "text-rose-400" : "text-emerald-400"}`}>
                    {selectedProduct.stock} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stagnancy Class:</span>
                  <span className={selectedProduct.deadStockPotential ? "text-amber-400 font-bold" : "text-slate-400"}>
                    {selectedProduct.deadStockPotential ? "Dead Stock Alert" : "Healthy Velocity"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleFetchSuggestion}
            disabled={loading || !selectedProductId}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition duration-200 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>Executing Microsegment Models...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Suggest Markdown AI Model</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: AI Analytics suggestion board */}
        <div className="bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-3 flex flex-col justify-between min-h-80">
          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center gap-3 text-slate-400 py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="text-xs font-mono">Running Azure SQL Optimizer & evaluating residual demand elasticity curves...</p>
            </div>
          ) : suggestion ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                    Decision Matrix Node
                  </span>
                  <h3 className="font-bold text-white text-md mt-2">Suggested pricing & profit margin targets</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase text-right mt-1">
                  Module: <span className="text-indigo-400 font-bold">{suggestion.source}</span>
                </div>
              </div>

              {/* Suggestions Cards Block */}
              <div className="grid grid-cols-3 gap-4">
                {/* SUGG 1 */}
                <div className="bg-[#020617]/60 p-4 rounded-xl border border-slate-850 text-center hover:border-indigo-500/25 transition duration-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">Suggested markdown</span>
                  <span className="text-2xl font-black text-indigo-400 block mt-1.5">{suggestion.suggestion.suggestedDiscount}%</span>
                  <span className="text-[9px] text-slate-500 mt-1 block font-mono font-medium">Discount suggested</span>
                </div>

                {/* SUGG 2 */}
                <div className="bg-[#020617]/60 p-4 rounded-xl border border-slate-850 text-center hover:border-indigo-500/25 transition duration-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">Adjusted Price</span>
                  <span className="text-2xl font-black text-emerald-400 block mt-1.5">${suggestion.suggestion.newSellingPrice.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-500 mt-1 block font-mono font-medium">Suggested Retail</span>
                </div>

                {/* SUGG 3 */}
                <div className="bg-[#020617]/60 p-4 rounded-xl border border-slate-850 text-center hover:border-indigo-500/25 transition duration-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">Calculated Margin</span>
                  <span className={`text-2xl font-black block mt-1.5 ${suggestion.suggestion.calculatedMargin >= 30 ? "text-indigo-400" : "text-amber-400"}`}>
                    {suggestion.suggestion.calculatedMargin}%
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 block font-mono font-semibold">Healthy yield</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Rationale bullet boxes */}
                <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-800/85">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Promotional Schedule & Timing</span>
                  <p className="text-xs text-[#a5b4fc] mt-1.5 font-medium">{suggestion.suggestion.promotionalTiming}</p>
                </div>

                <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-800/85">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Markdown Rationalization & Strategy</span>
                  <p className="text-xs text-slate-350 mt-1.5 leading-relaxed font-normal">{suggestion.suggestion.rationalization}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center py-16 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-[#020617]/20">
              <Coins className="h-10 w-10 text-slate-700 animate-bounce mb-3" />
              <p className="text-xs font-mono max-w-sm text-center">Please select a product listing on the left to compute Dynamic Elasticity curves.</p>
            </div>
          )}

          <div className="border-t border-slate-800/85 pt-4 mt-6 text-[10px] text-slate-550 leading-normal flex items-start gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-slate-600 mt-0.5 shrink-0" />
            <p className="flex-1">
              Suggestions adjust dynamically based on inventory levels, stagnancy labels, wholesale margins, and candidate campaign strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Copyable code blocks code */}
      <div className="bg-[#0f172a]/40 border border-slate-800/85 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-white text-md">Pricing Elasticity Optimization Engine</h3>
              <p className="text-[10px] text-slate-500 leading-normal font-medium animate-pulse">Optimizes margins dynamically using price points vs sales volumes demand matrices.</p>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020617] border border-slate-800 text-xs text-slate-305 hover:text-white hover:border-slate-700 font-mono transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied script!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-300">Copy Python Script</span>
              </>
            )}
          </button>
        </div>

        {/* Code Frame */}
        <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 bg-[#020617]/50 border-b border-slate-800 text-[10px] font-mono text-slate-500">
            <span>pricing_optimizer.py</span>
            <span className="text-indigo-400">Python 3.10+ • numpy • scipy</span>
          </div>
          <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-76 select-text whitespace-pre border-dashed">
            <code>{pricingPolicyCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
