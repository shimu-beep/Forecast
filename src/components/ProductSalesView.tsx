/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Boxes, 
  Layers, 
  ShoppingCart, 
  PlusCircle, 
  Clipboard, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { Product, Sale, Category, Branch } from "../types";

interface ProductSalesViewProps {
  products: Product[];
  sales: Sale[];
  categories: Category[];
  branches: Branch[];
  currentRole: string;
  onRefresh: () => void;
}

export default function ProductSalesView({ products, sales, categories, branches, currentRole, onRefresh }: ProductSalesViewProps) {
  // New Product state
  const [newProdName, setNewProdName] = useState<string>("");
  const [newCategoryId, setNewCategoryId] = useState<string>("1");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newCost, setNewCost] = useState<string>("");
  const [newStock, setNewStock] = useState<string>("");
  const [newMinStock, setNewMinStock] = useState<string>("10");
  const [newLocation, setNewLocation] = useState<string>("");
  const [newSeasonal, setNewSeasonal] = useState<string>("All Season");
  const [prodSuccessMsg, setProdSuccessMsg] = useState<string | null>(null);

  // New Transaction state
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("1");
  const [saleQty, setSaleQty] = useState<string>("1");
  const [saleDiscount, setSaleDiscount] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");
  const [saleError, setSaleError] = useState<string | null>(null);
  const [saleSuccessMsg, setSaleSuccessMsg] = useState<string | null>(null);

  const selectedProdObj = products.find(p => p.id === parseInt(selectedProductId));

  // Handle Product Insertion
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newPrice || !newCost || !newStock) return;
    
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          categoryId: parseInt(newCategoryId),
          price: parseFloat(newPrice),
          cost: parseFloat(newCost),
          stock: parseInt(newStock),
          minStock: parseInt(newMinStock),
          location: newLocation,
          seasonalTrigger: newSeasonal
        }),
      });
      const data = await response.json();
      if (data.success) {
        setProdSuccessMsg(`SKU ${data.product.sku} successfully added to database!`);
        // Reset state values
        setNewProdName("");
        setNewPrice("");
        setNewCost("");
        setNewStock("");
        setNewLocation("");
        setTimeout(() => setProdSuccessMsg(null), 3000);
        onRefresh(); // Refresh parent database matrices
      }
    } catch (err) {
      console.error("Failed to insert product record:", err);
    }
  };

  // Handle transaction processing
  const handleProcessSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !saleQty) return;
    setSaleError(null);
    setSaleSuccessMsg(null);

    const qty = parseInt(saleQty);
    if (selectedProdObj && selectedProdObj.stock < qty) {
      setSaleError(`Critical Deficit: In-stock level is ${selectedProdObj.stock} units while sale demands ${qty}.`);
      return;
    }

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: parseInt(selectedProductId),
          quantity: qty,
          discount: parseFloat(saleDiscount),
          branchId: parseInt(selectedBranchId),
          paymentMethod
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSaleSuccessMsg(`Transaction synchronized! Total: $${data.sale.totalAmount.toFixed(2)}`);
        setSaleQty("1");
        setSaleDiscount("0");
        setTimeout(() => setSaleSuccessMsg(null), 3500);
        onRefresh(); // Pull new matrix levels immediately
      } else {
        setSaleError(data.error || "Failed to finalize sale transaction.");
      }
    } catch (err) {
      console.error("Failed executing sales trigger against express backend:", err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 flex flex-col gap-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Boxes className="h-6 w-6 text-indigo-400" />
          POS Registers & ERP Inventory Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Create new product stock codes, and verify active POS register terminals routing sales transactions in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module A: Process Live POS Transaction */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShoppingCart className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Register POS Transaction</h3>
          </div>

          <form onSubmit={handleProcessSale} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">Product SKU Selection</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                <option value="">-- Choose Product Listing --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    ({p.sku}) {p.name} - ${p.price.toFixed(2)} [Stock: {p.stock}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">POS Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={saleQty}
                  onChange={(e) => setSaleQty(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">Discount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={saleDiscount}
                  onChange={(e) => setSaleDiscount(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">Target Sale Branch</label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                required
                className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                <option value="Credit Card">Credit Card Terminal</option>
                <option value="Mobile POS">Mobile POS Tap-to-Pay</option>
                <option value="Debit Card">Debit Card Swipe</option>
                <option value="Cash">Cash Ledger</option>
                <option value="Bank Transfer">Bank Transfer Wire</option>
              </select>
            </div>

            {/* Calculations widget */}
            {selectedProdObj && (
              <div className="p-3 bg-[#020617] border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-405">
                <div className="flex justify-between">
                  <span>Unit Subtotal:</span>
                  <span className="text-slate-300 font-bold">${(selectedProdObj.price * parseInt(saleQty || "0")).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-indigo-400">
                  <span>Applied Discount deductions:</span>
                  <span>- ${parseFloat(saleDiscount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-1.5 text-white font-extrabold text-[12px]">
                  <span>Estimated Total Amount:</span>
                  <span className="text-emerald-400 font-extrabold">
                    ${Math.max(0, (selectedProdObj.price * parseInt(saleQty || "0")) - parseFloat(saleDiscount || "0")).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Success and Error Indicators */}
            {saleError && (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/25 text-rose-400 text-xs flex gap-2 items-start font-mono leading-snug animate-pulse">
                <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                <span>{saleError}</span>
              </div>
            )}
            {saleSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/25 text-emerald-400 text-xs flex gap-2 items-start font-mono leading-snug">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{saleSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedProductId}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d946ef] via-[#a855f7] to-[#ec4899] hover:from-[#e879f9] hover:to-[#f43f5e] text-white flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10 transition disabled:opacity-50 cursor-pointer"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>Finalize & Sync Transaction Ledger</span>
            </button>
          </form>
        </div>

        {/* Module B: Add Product Listing to DB */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <PlusCircle className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Onboard Product Listing (ERP)</h3>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Product Listing Name</label>
              <input
                type="text"
                placeholder="Product name..."
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                required
                className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Category Group</label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none cursor-pointer appearance-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Seasonal trigger</label>
                <select
                  value={newSeasonal}
                  onChange={(e) => setNewSeasonal(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-205 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="All Season">All Season</option>
                  <option value="Ramadan/Eid">Ramadan & Eid</option>
                  <option value="Durga Puja">Durga Puja</option>
                  <option value="Winter">Winter Season</option>
                  <option value="Summer">Summer Season</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price..."
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Cost..."
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Stock Count</label>
                <input
                  type="number"
                  placeholder="Stock..."
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  required
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-550 uppercase">Min Stock Threshold</label>
                <input
                  type="number"
                  value={newMinStock}
                  onChange={(e) => setNewMinStock(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-555 uppercase">Location Shelf</label>
                <input
                  type="text"
                  placeholder="e.g. Aisle H3..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {prodSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/25 text-emerald-400 text-xs flex gap-2 items-start font-mono leading-snug">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{prodSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 transition cursor-pointer"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>SaaS SQL Inserting Record</span>
            </button>
          </form>
        </div>

        {/* Module C: Ledger Display Block */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Clipboard className="h-4.5 w-4.5 text-indigo-400" />
                Live POS Sales Ledger
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest animate-pulse font-bold">
                Auto Sync active
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {sales.map((sale, index) => (
                <div key={index} className="bg-[#020617] border border-slate-850 p-3 rounded-xl hover:border-slate-705 cursor-pointer transition duration-150">
                  <div className="flex justify-between items-start text-[10px]">
                    <span className="text-slate-450 font-mono font-semibold">{sale.productSku || "SKU_STAL"}</span>
                    <span className="text-slate-500 font-mono">#{sale.id || "LOCAL"}</span>
                  </div>
                  
                  <h5 className="font-bold text-xs text-white truncate mt-1">{sale.productName}</h5>
                  
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-850 text-[10px] font-mono">
                    <span className="text-slate-500">{sale.branchName || "Main Gate Register"}</span>
                    <span className="text-emerald-400 font-extrabold">${sale.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                    <span>Qty: {sale.quantity} | Disc: ${sale.discount}</span>
                    <span>{sale.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-4 font-mono text-[10px] text-slate-500 flex justify-between">
            <span>Total Sales entries:</span>
            <span className="text-indigo-400 font-bold">{sales.length} logs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
