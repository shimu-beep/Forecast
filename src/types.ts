/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  location: string;
  deadStockPotential: boolean;
  seasonalTrigger: string;
  categoryName?: string;
  categoryCode?: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  Manager: string;
}

export interface Sale {
  id: number;
  saleDate: string;
  productId: number;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalAmount: number;
  branchId: number;
  branchName?: string;
  paymentMethod: string;
}

export interface LowStockAlert {
  productId: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  severity: "CRITICAL" | "WARN";
  recommendedRestock: number;
}

export interface DeadStockAlert {
  productId: number;
  name: string;
  sku: string;
  stock: number;
  lastActivity: string;
  capitalLocked: number;
}

export interface BranchData {
  branchId: number;
  name: string;
  sales: number;
  itemsSold: number;
}

export interface BestSeller {
  productId: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardMetrics {
  totalSales: number;
  totalProfit: number;
  profitMarginPercent: number;
  activeProductsCount: number;
  activeBranchesCount: number;
  lowStockAlerts: LowStockAlert[];
  deadStockAlerts: DeadStockAlert[];
  branchData: BranchData[];
  bestSellers: BestSeller[];
}

export interface PricingSuggestion {
  suggestedDiscount: number;
  newSellingPrice: number;
  calculatedMargin: number;
  promotionalTiming: string;
  rationalization: string;
}

export interface ForecastPoint {
  period: string;
  pointEstimate: number;
  lowerBound: number;
  upperBound: number;
}

export interface ForecastAnalysis {
  summaryStatement: string;
  insightsList: string[];
  modelConfidence: number;
  festivalSurgeIndicator: string;
  reorderingPriority: string;
}

export interface ForecastResponse {
  success: boolean;
  source: string;
  forecastPoints: ForecastPoint[];
  analysis: ForecastAnalysis;
}
