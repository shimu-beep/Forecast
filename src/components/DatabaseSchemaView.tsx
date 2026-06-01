/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Hash, 
  Link, 
  ShieldAlert, 
  CheckCircle2,
  Table,
  Cpu,
  Bookmark
} from "lucide-react";

export default function DatabaseSchemaView() {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<string>("tables");

  const tables = [
    { name: "Users", columns: "Id (PK, INT), Email (NVARCHAR(150), UNIQUE), Name (NVARCHAR(100)), RoleId (FK), BranchId (FK, NULL), PasswordHash (NVARCHAR(MAX))" },
    { name: "Roles", columns: "Id (PK, INT), Name (NVARCHAR(50)), Code (NVARCHAR(20))" },
    { name: "Branches", columns: "Id (PK, INT), Name (NVARCHAR(100)), Location (NVARCHAR(250)), ManagerName (NVARCHAR(100))" },
    { name: "Products", columns: "Id (PK, INT), Name (NVARCHAR(150)), SKU (NVARCHAR(50), UNIQUE), CategoryId (FK), Price (DECIMAL(18,2)), Cost (DECIMAL(18,2)), Stock (INT), MinStock (INT), Location (NVARCHAR(50)), SeasonalTrigger (NVARCHAR(50))" },
    { name: "Categories", columns: "Id (PK, INT), Name (NVARCHAR(100)), Code (NVARCHAR(10))" },
    { name: "Sales", columns: "Id (PK, INT), SaleDate (DATETIME2), ProductId (FK), Quantity (INT), UnitPrice (DECIMAL(18,2)), Discount (DECIMAL(18,2)), TotalAmount (DECIMAL(18,2)), BranchId (FK), PaymentMethod (NVARCHAR(50))" },
    { name: "Purchases", columns: "Id (PK, INT), PurchaseDate (DATETIME2), ProductId (FK), Quantity (INT), UnitCost (DECIMAL(18,2)), TotalAmount (DECIMAL(18,2)), SupplierId (FK)" },
    { name: "Inventory", columns: "Id (PK, INT), ProductId (FK), QuantityChanged (INT), CurrentStock (INT), Notes (NVARCHAR(200)), CreatedAt (DATETIME2)" },
    { name: "Customers", columns: "Id (PK, INT), Name (NVARCHAR(100)), Email (NVARCHAR(150)), Phone (NVARCHAR(20)), RewardPoints (INT)" },
    { name: "Suppliers", columns: "Id (PK, INT), CompanyName (NVARCHAR(150)), ContactName (NVARCHAR(100)), Phone (NVARCHAR(30))" },
    { name: "ForecastResults", columns: "Id (PK, INT), ProductId (FK), PeriodDate (DATETIME2), PointEstimate (DECIMAL(18,2)), ConfidenceLower (DECIMAL(18,2)), ConfidenceUpper (DECIMAL(18,2)), SourceEngine (NVARCHAR(50))" },
    { name: "SmartPricing", columns: "Id (PK, INT), ProductId (FK), BasePrice (DECIMAL(18,2)), SuggestedDiscount (DECIMAL(4,2)), CalculatedPrice (DECIMAL(18,2)), Rationale (NVARCHAR(MAX))" },
    { name: "Notifications", columns: "Id (PK, INT), Message (NVARCHAR(500)), Type (NVARCHAR(50)), IsRead (BIT), UserRole (NVARCHAR(50)), CreatedAt (DATETIME2)" },
    { name: "SubscriptionPlans", columns: "Id (PK, INT), Name (NVARCHAR(50)), PriceMonthly (DECIMAL(18,2)), TenantLimit (INT), SKU (NVARCHAR(20))" },
    { name: "AuditLogs", columns: "Id (PK, INT), UserId (FK, NULL), Action (NVARCHAR(150)), EntityName (NVARCHAR(100)), RequestIP (NVARCHAR(50)), CreatedAt (DATETIME2)" }
  ];

  const fullSqlScript = `
-- ====================================================================
-- RETAILAI SAAS ENTERPRISE ENGINE - Azure SQL Server Database Migration
-- Target: SQL Server 2022+ / Azure SQL Database Pool
-- Author: Senior SQL Server Database Architect & EF Core Specialist
-- ====================================================================

CREATE DATABASE RetailAiSaaS;
GO
USE RetailAiSaaS;
GO

-- 1. SubscriptionPlans (Subscription Matrices)
CREATE TABLE SubscriptionPlans (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    PriceMonthly DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    TenantLimit INT NOT NULL DEFAULT 5,
    SKU NVARCHAR(20) NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 2. Branches Schema
CREATE TABLE Branches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Location NVARCHAR(250) NOT NULL,
    ManagerName NVARCHAR(100) NOT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 3. Roles System
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Code NVARCHAR(20) NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 4. Users System (JWT Targets)
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Name NVARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    BranchId INT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id),
    CONSTRAINT FK_Users_Branches FOREIGN KEY (BranchId) REFERENCES Branches(Id)
);

-- 5. Categories
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(10) NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 6. Products Master (SKU Indexes)
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    SKU NVARCHAR(50) NOT NULL UNIQUE,
    CategoryId INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Cost DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    MinStock INT NOT NULL DEFAULT 10,
    Location NVARCHAR(50) NULL DEFAULT 'Aisle A1',
    SeasonalTrigger NVARCHAR(50) NOT NULL DEFAULT 'All Season',
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- 7. Sales Register (POS Sales ledger)
CREATE TABLE Sales (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SaleDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Discount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    TotalAmount DECIMAL(18,2) NOT NULL,
    BranchId INT NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL DEFAULT 'Credit Card',
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Sales_Products FOREIGN KEY (ProductId) REFERENCES Products(Id),
    CONSTRAINT FK_Sales_Branches FOREIGN KEY (BranchId) REFERENCES Branches(Id)
);

-- 8. SmartPricing Suggested Log
CREATE TABLE SmartPricing (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    BasePrice DECIMAL(18,2) NOT NULL,
    SuggestedDiscount DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    CalculatedPrice DECIMAL(18,2) NOT NULL,
    Rationale NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_SmartPricing_Products FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- 9. ForecastResults Cache Log
CREATE TABLE ForecastResults (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    PeriodDate DATETIME2 NOT NULL,
    PointEstimate DECIMAL(18,2) NOT NULL,
    ConfidenceLower DECIMAL(18,2) NOT NULL,
    ConfidenceUpper DECIMAL(18,2) NOT NULL,
    SourceEngine NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ForecastResults_Products FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- 10. AuditLogs
CREATE TABLE AuditLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    Action NVARCHAR(150) NOT NULL,
    EntityName NVARCHAR(100) NOT NULL,
    RequestIP NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- ====================================================================
-- CREATING OPTIMIZED INDEXES FOR HIGH-THROUGHPUT POLLING
-- ====================================================================
CREATE NONCLUSTERED INDEX IX_Products_SKU ON Products(SKU) WHERE IsDeleted = 0;
CREATE NONCLUSTERED INDEX IX_Sales_ProductId_SaleDate ON Sales(ProductId, SaleDate);
CREATE NONCLUSTERED INDEX IX_Sales_BranchId ON Sales(BranchId);
CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email) WHERE IsDeleted = 0;

-- ====================================================================
-- SEED DATA CONFIGURATION
-- ====================================================================
INSERT INTO SubscriptionPlans (Name, PriceMonthly, TenantLimit, SKU)
VALUES ('Starter Basic', 59.00, 3, 'PLAN-START'),
       ('Enterprise Scale', 149.00, 10, 'PLAN-SCALE'),
       ('Enterprise Elite', 499.00, 200, 'PLAN-ELITE');

INSERT INTO Roles (Name, Code)
VALUES ('Super Admin', 'ROLE-SADM'),
       ('Admin', 'ROLE-ADM'),
       ('Manager', 'ROLE-MGR'),
       ('Staff', 'ROLE-STF');

INSERT INTO Categories (Name, Code)
VALUES ('Grocery & Staples', 'GRC'),
       ('Fashion & Apparels', 'FSH'),
       ('Electronics & Tech', 'ELC');

INSERT INTO Branches (Name, Location, ManagerName)
VALUES ('Dhaka HQ', 'Banani, Dhaka', 'Anisur Rahman'),
       ('Chittagong Outlet', 'GEC, Chittagong', 'Nasir Uddin');

INSERT INTO Products (Name, SKU, CategoryId, Price, Cost, Stock, MinStock, Location, SeasonalTrigger)
VALUES ('Premium Basmati Rice 5kg', 'GRC-BAS-01', 1, 18.50, 13.20, 240, 50, 'Aisle A1', 'Ramadan/Eid'),
       ('Classic Comfort Denim Jeans', 'FSH-DNM-04', 2, 45.00, 22.00, 190, 40, 'Aisle F2', 'All Season');
`.trim();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617] text-slate-100 flex flex-col gap-8 font-sans">
      {/* View Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Database className="h-6 w-6 text-indigo-400" />
            Azure SQL Server Data Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Examine relational schemas, secondary non-clustered composite indexes, and database integrity models built for Azure pools.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-550 text-white font-bold text-xs shadow-lg transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>DDL Copied Successfully!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy SQL DDL Script</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schema tables visualizer list */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Table className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Table Architecture List ({tables.length} tables)</h3>
          </div>
          
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {tables.map(table => (
              <div key={table.name} className="p-3 bg-[#020617]/50 border border-slate-850 rounded-xl hover:border-slate-700 hover:bg-[#020617]/20 transition duration-150">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-xs font-mono font-extrabold text-white">{table.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-mono leading-relaxed bg-[#020617]/50 p-2 rounded-lg border border-slate-850 break-words">
                  {table.columns}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic SQL Editor panel on the right */}
        <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Target SQL Server Migration Schema DDL</h3>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 uppercase font-bold animate-pulse">
                Enterprise Seeded
              </span>
            </div>

            {/* Script Box */}
            <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-500">
                <span>azure_db_migration.sql</span>
                <span className="text-indigo-400">T-SQL • Clustered Indexes • Keys</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed h-[360px] select-text whitespace-pre">
                <code>{fullSqlScript}</code>
              </pre>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500">
            <div className="p-2 bg-[#020617] rounded-xl border border-slate-800/80">
              <span className="text-indigo-400 font-bold block mb-0.5">Relations Constraints</span>
              <span>12 Key Declarations</span>
            </div>
            <div className="p-2 bg-[#020617] rounded-xl border border-slate-800/80">
              <span className="text-indigo-400 font-bold block mb-0.5">Optimized Indexes</span>
              <span>Composite Search b-tree</span>
            </div>
            <div className="p-2 bg-[#020617] rounded-xl border border-slate-800/80">
              <span className="text-indigo-400 font-bold block mb-0.5">Soft Delete Enabled</span>
              <span>"IsDeleted" flag checks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
