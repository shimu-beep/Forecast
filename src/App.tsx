/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ForecastingView from "./components/ForecastingView";
import PricingView from "./components/PricingView";
import DatabaseSchemaView from "./components/DatabaseSchemaView";
import ApiPlaygroundView from "./components/ApiPlaygroundView";
import FlutterSimulatorView from "./components/FlutterSimulatorView";
import ProductSalesView from "./components/ProductSalesView";
import SaaSPlansView from "./components/SaaSPlansView";

import { Product, Sale, Category, Branch, DashboardMetrics } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentRole, setCurrentRole] = useState<string>("Super Admin");

  // In-memory synced states fetched from our custom server
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize master database streams from Express REST APIs
  const synchronizeDatabase = async () => {
    try {
      const [prodRes, saleRes, catRes, branchRes, metricsRes] = await Promise.all([
        fetch("/api/products").then(r => r.json()),
        fetch("/api/sales").then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
        fetch("/api/branches").then(r => r.json()),
        fetch("/api/reports/dashboard").then(r => r.json())
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (saleRes.success) setSales(saleRes.sales);
      if (catRes.success) setCategories(catRes.categories);
      if (branchRes.success) setBranches(branchRes.branches);
      if (metricsRes.success) setMetrics(metricsRes.metrics);

    } catch (err) {
      console.error("Critical Cloud ERP Desynchronization Alert:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    synchronizeDatabase();
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView 
            metrics={metrics} 
            loading={loading} 
            onRefresh={synchronizeDatabase}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case "forecasting":
        return (
          <ForecastingView 
            onRefresh={synchronizeDatabase}
          />
        );
      case "pricing":
        return (
          <PricingView 
            products={products}
            onRefresh={synchronizeDatabase}
          />
        );
      case "database":
        return <DatabaseSchemaView />;
      case "api":
        return <ApiPlaygroundView />;
      case "flutter":
        return <FlutterSimulatorView />;
      case "inventory":
        return (
          <ProductSalesView 
            products={products}
            sales={sales}
            categories={categories}
            branches={branches}
            currentRole={currentRole}
            onRefresh={synchronizeDatabase}
          />
        );
      case "saas":
        return <SaaSPlansView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-mono">
            404: View Context Stale
          </div>
        );
    }
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 w-screen h-screen overflow-hidden">
      {/* SaaS Sidebar controller */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          // Auto route check to prevent stale tab states when changing role permissions
          const allowedTabsMapByRole: Record<string, string[]> = {
            "Super Admin": ["dashboard", "forecasting", "pricing", "database", "api", "flutter", "inventory", "saas"],
            "Admin": ["dashboard", "forecasting", "pricing", "database", "api", "flutter", "inventory"],
            "Manager": ["dashboard", "forecasting", "pricing", "api", "flutter", "inventory"],
            "Staff": ["dashboard", "api", "flutter", "inventory"]
          };
          const allowed = allowedTabsMapByRole[role] || ["dashboard"];
          if (!allowed.includes(activeTab)) {
            setActiveTab("dashboard"); // Fallback trigger safely
          }
        }}
      />

      {/* Primary viewport framing */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {renderActiveView()}
      </main>
    </div>
  );
}
