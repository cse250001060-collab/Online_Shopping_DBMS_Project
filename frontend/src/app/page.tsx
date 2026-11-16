// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from 'react';

type IconProps = {
  className?: string;
  children?: React.ReactNode;
};

type IconComponent = React.ComponentType<IconProps>;

// ============================================================================
// ZERO-DEPENDENCY INLINE SVG ICONS (Replaces lucide-react to prevent forwardRef errors)
// ============================================================================
const SvgIcon = ({ className = 'w-4 h-4', children }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Search = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </SvgIcon>
);

const ShoppingBag = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </SvgIcon>
);

const Truck = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </SvgIcon>
);

const RotateCcw = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </SvgIcon>
);

const Warehouse = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
    <path d="M6 18h12" />
    <path d="M6 14h12" />
  </SvgIcon>
);

const CheckCircle2 = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </SvgIcon>
);

const AlertTriangle = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </SvgIcon>
);

const Plus = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </SvgIcon>
);

const Minus = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M5 12h14" />
  </SvgIcon>
);

const Trash2 = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </SvgIcon>
);

const User = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SvgIcon>
);

const Package = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </SvgIcon>
);

const SlidersHorizontal = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </SvgIcon>
);

const Sparkles = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </SvgIcon>
);

const ChevronDown = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="m6 9 6 6 6-6" />
  </SvgIcon>
);

const X = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </SvgIcon>
);

const Wifi = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M12 20h.01" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <path d="M5 12.859a10 10 0 0 1 14 0" />
    <path d="M8.5 16.429a5 5 0 0 1 7 0" />
  </SvgIcon>
);

const WifiOff = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <line x1="2" x2="22" y1="2" y2="22" />
    <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
    <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
    <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
    <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
    <path d="M12 20h.01" />
  </SvgIcon>
);

const MoreHorizontal = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </SvgIcon>
);

const Folder = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </SvgIcon>
);

const Smartphone = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </SvgIcon>
);

const BookOpen = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </SvgIcon>
);

const Home = ({ className }: IconProps) => (
  <SvgIcon className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </SvgIcon>
);

// ============================================================================
// EXACT DATABASE SEED DATA (sql/03_seed.sql)
// ============================================================================
const INITIAL_CUSTOMERS = [
  { customer_id: 1, first_name: 'Raunak', last_name: 'Singh', email: 'raunak@example.com', street: '12 MG Road', city: 'Indore', state: 'MP', pincode: '452001', dob: '2004-05-14', phone: '9000000001' },
  { customer_id: 2, first_name: 'Mayank', last_name: 'Khoria', email: 'mayank@example.com', street: '8 Vijay Nagar', city: 'Indore', state: 'MP', pincode: '452010', dob: '2004-08-02', phone: '9000000002' },
  { customer_id: 3, first_name: 'Sarthak', last_name: 'Pandey', email: 'sarthak@example.com', street: '3 Palasia', city: 'Indore', state: 'MP', pincode: '452001', dob: '2003-11-21', phone: '9000000003' },
  { customer_id: 4, first_name: 'Sufiyan', last_name: 'Ahmad', email: 'sufiyan@example.com', street: 'IIT Indore, Simrol', city: 'Indore', state: 'MP', pincode: '453552', dob: '2005-08-10', phone: '9000000004' }
];

const INITIAL_CATEGORIES = [
  { category_id: 1, category_name: 'Electronics', description: 'Phones, laptops and accessories', accent: 'orange' },
  { category_id: 2, category_name: 'Books', description: 'Textbooks and novels', accent: 'cyan' },
  { category_id: 3, category_name: 'Home', description: 'Kitchen and home essentials', accent: 'purple' }
];

const INITIAL_PRODUCTS = [
  { product_id: 1, category_id: 1, product_name: 'Wireless Mouse', price: 499.00, description: 'Ergonomic 2.4GHz mouse with silent optical sensor', brand: 'Logitech', stock_quantity: 50, accent: 'orange' },
  { product_id: 2, category_id: 1, product_name: 'USB-C Cable', price: 299.00, description: '1 metre braided fast-charge 100W cable', brand: 'Anker', stock_quantity: 100, accent: 'cyan' },
  { product_id: 3, category_id: 1, product_name: 'Mechanical Keyboard', price: 3499.00, description: 'Hot-swappable tactile RGB mechanical keyboard', brand: 'Keychron', stock_quantity: 5, accent: 'pink' },
  { product_id: 4, category_id: 2, product_name: 'Database System Concepts', price: 1250.00, description: 'Silberschatz, Korth & Sudarshan — 7th Edition', brand: 'McGraw Hill', stock_quantity: 12, accent: 'purple' },
  { product_id: 5, category_id: 3, product_name: 'Steel Water Bottle', price: 649.00, description: '1 litre double-wall vacuum insulated bottle', brand: 'Milton', stock_quantity: 50, accent: 'green' },
  { product_id: 6, category_id: 3, product_name: 'Desk Lamp', price: 899.00, description: 'Touch LED architectural lamp with 5-step dimmer', brand: 'Philips', stock_quantity: 8, accent: 'orange' }
];

const INITIAL_LOCATIONS = [
  { location_id: 1, warehouse_name: 'Indore Central', street: '5 Industrial Area', city: 'Indore', state: 'MP', pincode: '452010', capacity: 1000 },
  { location_id: 2, warehouse_name: 'Pithampur Hub', street: '22 Sector 3', city: 'Pithampur', state: 'MP', pincode: '454775', capacity: 500 }
];

const INITIAL_PRODUCT_INVENTORY = [
  { product_id: 1, location_id: 1, stock_level: 30 },
  { product_id: 1, location_id: 2, stock_level: 20 },
  { product_id: 2, location_id: 1, stock_level: 100 },
  { product_id: 3, location_id: 1, stock_level: 5 },
  { product_id: 4, location_id: 2, stock_level: 12 },
  { product_id: 5, location_id: 1, stock_level: 40 },
  { product_id: 5, location_id: 2, stock_level: 10 },
  { product_id: 6, location_id: 2, stock_level: 8 }
];

const INITIAL_DELIVERY_PERSONS = [
  { delivery_person_id: 1, name: 'Vikram Yadav', phone_no: '9998887771', vehicle_no: 'MP09AB1234', area_assigned: 'Indore Central' },
  { delivery_person_id: 2, name: 'Anita Verma', phone_no: '9998887772', vehicle_no: 'MP09CD5678', area_assigned: 'Pithampur' }
];

const ALLOWED_RETURN_REASONS = [
  'Damaged item',
  'Defective item',
  'Wrong item delivered',
  'Not as described',
  'Missing parts'
];

const DELIVERY_STEPS = ['Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'];
const DEMO_DATE = '2026-11-15';

// ============================================================================
// NEON ACCENT PALETTE TOKENS (MATCHING image_a3d322.jpg)
// ============================================================================
const NEON_THEMES = {
  orange: {
    border: 'border-[#ff9e64]/65 hover:border-[#ff9e64]',
    glow: 'shadow-[8px_8px_20px_#161825,-4px_-4px_14px_#30344f,inset_0_1px_1px_rgba(255,158,100,0.3)]',
    tabBorder: 'border-[#ff9e64]/70',
    leftBar: 'from-[#ff9e64] to-[#f7768e]',
    iconBox: 'bg-[#212437] text-[#ff9e64] shadow-[inset_2px_2px_5px_#141622,inset_-2px_-2px_5px_#2e324c]',
    pillBtn: 'border-[#ff9e64]/60 text-[#ff9e64] hover:bg-[#ff9e64]/15'
  },
  cyan: {
    border: 'border-[#7dcfff]/65 hover:border-[#7dcfff]',
    glow: 'shadow-[8px_8px_20px_#161825,-4px_-4px_14px_#30344f,inset_0_1px_1px_rgba(125,207,255,0.3)]',
    tabBorder: 'border-[#7dcfff]/70',
    leftBar: 'from-[#7dcfff] to-[#7aa2f7]',
    iconBox: 'bg-[#212437] text-[#7dcfff] shadow-[inset_2px_2px_5px_#141622,inset_-2px_-2px_5px_#2e324c]',
    pillBtn: 'border-[#7dcfff]/60 text-[#7dcfff] hover:bg-[#7dcfff]/15'
  },
  purple: {
    border: 'border-[#bb9af7]/65 hover:border-[#bb9af7]',
    glow: 'shadow-[8px_8px_20px_#161825,-4px_-4px_14px_#30344f,inset_0_1px_1px_rgba(187,154,247,0.3)]',
    tabBorder: 'border-[#bb9af7]/70',
    leftBar: 'from-[#bb9af7] to-[#7aa2f7]',
    iconBox: 'bg-[#212437] text-[#bb9af7] shadow-[inset_2px_2px_5px_#141622,inset_-2px_-2px_5px_#2e324c]',
    pillBtn: 'border-[#bb9af7]/60 text-[#bb9af7] hover:bg-[#bb9af7]/15'
  },
  pink: {
    border: 'border-[#f7768e]/65 hover:border-[#f7768e]',
    glow: 'shadow-[8px_8px_20px_#161825,-4px_-4px_14px_#30344f,inset_0_1px_1px_rgba(247,118,142,0.3)]',
    tabBorder: 'border-[#f7768e]/70',
    leftBar: 'from-[#f7768e] to-[#bb9af7]',
    iconBox: 'bg-[#212437] text-[#f7768e] shadow-[inset_2px_2px_5px_#141622,inset_-2px_-2px_5px_#2e324c]',
    pillBtn: 'border-[#f7768e]/60 text-[#f7768e] hover:bg-[#f7768e]/15'
  },
  green: {
    border: 'border-[#9ece6a]/65 hover:border-[#9ece6a]',
    glow: 'shadow-[8px_8px_20px_#161825,-4px_-4px_14px_#30344f,inset_0_1px_1px_rgba(158,206,106,0.3)]',
    tabBorder: 'border-[#9ece6a]/70',
    leftBar: 'from-[#9ece6a] to-[#73daca]',
    iconBox: 'bg-[#212437] text-[#9ece6a] shadow-[inset_2px_2px_5px_#141622,inset_-2px_-2px_5px_#2e324c]',
    pillBtn: 'border-[#9ece6a]/60 text-[#9ece6a] hover:bg-[#9ece6a]/15'
  }
};

// ============================================================================
// REUSABLE UI COMPONENT 1: NOTCHED FOLDER CARD (FROM REFERENCE IMAGE)
// ============================================================================
const NotchedFolderCard = ({
  accent = 'orange',
  icon: Icon = Folder,
  title,
  subtitle,
  rightBadge,
  active = false,
  onClick,
  children,
  className = ''
}: {
  accent?: string;
  icon?: IconComponent;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  rightBadge?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}) => {
  const theme = NEON_THEMES[accent] || NEON_THEMES.orange;

  return (
    <div
      onClick={onClick}
      className={`relative pt-3.5 transition-all duration-300 select-none ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${className}`}
    >
      {/* Back Folder Layer Shadow */}
      <div className="absolute top-1.5 left-2 right-4 h-8 rounded-t-2xl bg-[#202336] border border-white/5 opacity-80 z-0" />

      {/* Top-Left Notched Folder Tab */}
      <div
        className={`absolute top-0 left-0 w-24 h-5 rounded-tl-2xl rounded-tr-xl bg-[#2a2d43] border-t border-l border-r ${theme.tabBorder} z-10`}
      />

      {/* Glowing Left Vertical Neon Accent Spine */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b ${theme.leftBar} z-20 opacity-90`}
      />

      {/* Main Folder Body */}
      <div
        className={`relative z-10 rounded-2xl rounded-tl-none bg-gradient-to-br from-[#2c3049] to-[#23263a] border ${
          theme.border
        } ${theme.glow} p-4 transition-all ${
          active ? 'ring-2 ring-[#7dcfff] ring-offset-2 ring-offset-[#1e2030]' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/5 bg-[#212437] shadow-[inset_2px_2px_5px_#151724,inset_-2px_-2px_5px_#2d314b]">
            <Icon className={`w-4 h-4 ${theme.iconBox.split(' ')[1]}`} />
          </div>
          {rightBadge && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#1d2030]/90 text-slate-300 border border-white/10">
              {rightBadge}
            </span>
          )}
        </div>

        {title && <h3 className="text-sm font-semibold text-white tracking-wide leading-snug">{title}</h3>}
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// REUSABLE UI COMPONENT 2: HORIZONTAL NEON PILL ROW (LIKE IMAGE/DOCUMENT/MUSIC)
// ============================================================================
const NeonPillRow = ({
  accent = 'cyan',
  icon: Icon = Package,
  title,
  subtitle,
  rightContent,
  onClick,
  expanded = false,
  children
}: {
  accent?: string;
  icon?: IconComponent;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  expanded?: boolean;
  children?: React.ReactNode;
}) => {
  const theme = NEON_THEMES[accent] || NEON_THEMES.cyan;

  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-[#2b2f47] to-[#23263a] border ${theme.border} ${theme.glow} transition-all duration-300 overflow-hidden`}
    >
      <div
        onClick={onClick}
        className={`p-4 flex flex-wrap items-center justify-between gap-4 ${
          onClick ? 'cursor-pointer hover:bg-white/[0.02]' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border border-white/5 ${theme.iconBox}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">{title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {rightContent}
          {onClick && (
            <div className="w-8 h-8 rounded-xl bg-[#202336] flex items-center justify-center text-slate-400 hover:text-white">
              {expanded ? <ChevronDown className="w-4 h-4" /> : <MoreHorizontal className="w-4 h-4" />}
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-[#1d2032]/70">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// REUSABLE UI COMPONENT 3: CONCENTRIC RADIAL RING GAUGE (FROM REFERENCE IMAGE)
// ============================================================================
const ConcentricRadialWidget = ({
  outerPct = 68,
  innerPct = 42,
  outerTitle = 'Indore Central',
  outerSubtitle = 'Used 175 || Free 825',
  innerTitle = 'Pithampur Hub',
  innerSubtitle = 'Used 50 || Free 450',
  centerLabel = '225'
}: {
  outerPct?: number;
  innerPct?: number;
  outerTitle?: string;
  outerSubtitle?: string;
  innerTitle?: string;
  innerSubtitle?: string;
  centerLabel?: string;
}) => {
  const rOuter = 54;
  const rInner = 39;
  const cOuter = 2 * Math.PI * rOuter;
  const cInner = 2 * Math.PI * rInner;

  const offOuter = cOuter - (Math.min(100, Math.max(5, outerPct)) / 100) * cOuter;
  const offInner = cInner - (Math.min(100, Math.max(5, innerPct)) / 100) * cInner;

  return (
    <div className="rounded-3xl bg-[#24273a] p-5 border border-white/10 shadow-[8px_8px_20px_#161825,-6px_-6px_16px_#30344f] flex flex-col sm:flex-row items-center gap-6">
      {/* Recessed Neumorphic Dial */}
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        {/* Outer Neumorphic Well */}
        <div className="absolute inset-1 rounded-full bg-[#202334] shadow-[inset_6px_6px_12px_#151722,inset_-4px_-4px_10px_#2d3148]" />
        {/* Inner Neumorphic Ring Well */}
        <div className="absolute inset-5 rounded-full bg-[#232638] shadow-[4px_4px_10px_#151722,-3px_-3px_8px_#2f334c]" />

        <svg className="w-36 h-36 -rotate-90 relative z-10" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={rOuter} stroke="#1b1e2e" strokeWidth="6" fill="transparent" />
          <circle
            cx="68"
            cy="68"
            r={rOuter}
            stroke="#f7768e"
            strokeWidth="6"
            strokeDasharray={cOuter}
            strokeDashoffset={offOuter}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700"
            style={{ filter: 'drop-shadow(0 0 6px rgba(247, 118, 142, 0.7))' }}
          />

          <circle cx="68" cy="68" r={rInner} stroke="#1b1e2e" strokeWidth="6" fill="transparent" />
          <circle
            cx="68"
            cy="68"
            r={rInner}
            stroke="#7dcfff"
            strokeWidth="6"
            strokeDasharray={cInner}
            strokeDashoffset={offInner}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700"
            style={{ filter: 'drop-shadow(0 0 6px rgba(125, 207, 255, 0.7))' }}
          />
        </svg>

        {/* Raised Center Knob */}
        <div className="absolute w-11 h-11 rounded-full bg-gradient-to-br from-[#2f334d] to-[#1e2132] shadow-[4px_4px_10px_#131520,-2px_-2px_6px_#353a58] flex items-center justify-center z-20">
          <span className="text-[11px] font-bold text-slate-200">{centerLabel}</span>
        </div>
      </div>

      {/* Right Legend matching Phone memory / External memory */}
      <div className="flex-1 space-y-3.5 w-full">
        <div className="border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#7dcfff] shadow-[0_0_8px_#7dcfff]" />
            <span className="text-xs font-semibold text-slate-200">{innerTitle}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 pl-4 font-medium">{innerSubtitle}</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#f7768e] shadow-[0_0_8px_#f7768e]" />
            <span className="text-xs font-semibold text-slate-200">{outerTitle}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 pl-4 font-medium">{outerSubtitle}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN STOREFRONT & CUSTOMER PORTAL APPLICATION
// ============================================================================
export default function App() {
  // Navigation & Active User (Default to Sufiyan Ahmad = 4 or Raunak = 1)
  const [activeView, setActiveView] = useState('store'); // 'store' | 'orders' | 'admin'
  const [activeCustomerId, setActiveCustomerId] = useState(4);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // FastAPI Connection Config (Matches main.py routes 1:1)
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8000');
  const [useLiveApi, setUseLiveApi] = useState(true);
  const [apiStatus, setApiStatus] = useState('standby'); // 'connected' | 'standby'
  const [showApiModal, setShowApiModal] = useState(false);
  const [lastApiCall, setLastApiCall] = useState('GET /health');

  // Relational State (Exact mirror of the 13 MySQL tables)
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [productInventory, setProductInventory] = useState(INITIAL_PRODUCT_INVENTORY);
  const [deliveryPersons, setDeliveryPersons] = useState(INITIAL_DELIVERY_PERSONS);
  const [selectedDriverByOrder, setSelectedDriverByOrder] = useState({});
  const [selectedDriverByReturn, setSelectedDriverByReturn] = useState({});

  // Pre-seed 1 delivered order for Customer #1 so 'My Orders' looks rich immediately
  const [orderCart, setOrderCart] = useState([
    {
      cart_id: 1,
      serial_no: 1,
      order_id: 1,
      customer_id: 1,
      product_id: 1,
      quantity: 2,
      unit_price: 499.00,
      subtotal: 998.00
    },
    {
      cart_id: 1,
      serial_no: 2,
      order_id: 1,
      customer_id: 1,
      product_id: 4,
      quantity: 1,
      unit_price: 1250.00,
      subtotal: 1250.00
    }
  ]);

  const [orders, setOrders] = useState([
    {
      order_id: 1,
      customer_id: 1,
      delivery_person_id: 1,
      order_date: DEMO_DATE,
      order_status: 'Delivered',
      delivery_date: DEMO_DATE,
      delivery_status: 'Delivered',
      total_amount: 2248.00,
      cart_id: 1
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      invoice_id: 1,
      order_id: 1,
      invoice_date: DEMO_DATE,
      total_amount: 2248.00,
      tax_amount: 404.64,
      payment_status: 'Paid'
    }
  ]);

  const [payments, setPayments] = useState([
    {
      payment_id: 1,
      invoice_id: 1,
      payment_date: DEMO_DATE,
      payment_mode: 'UPI',
      amount: 2652.64,
      payment_status: 'Success'
    }
  ]);

  const [feedbacks, setFeedbacks] = useState([
    {
      order_id: 1,
      feedback_id: 1,
      rating: 5,
      comments: 'Super fast delivery to MG Road Indore!',
      feedback_date: DEMO_DATE
    }
  ]);

  const [returns, setReturns] = useState([]);
  const [customerReturns, setCustomerReturns] = useState([]);

  // Storefront Filters (Tx #1)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(4000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cardQuantities, setCardQuantities] = useState({});

  // Payment Gateway Modal State (Tx #5, #6, #7)
  const [checkoutModalInvoice, setCheckoutModalInvoice] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('UPI');
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Order Expansion, Feedback & Return Modals (Tx #8-#13)
  const [expandedOrderId, setExpandedOrderId] = useState(1);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [returnModalItem, setReturnModalItem] = useState(null); // { cart_id, serial_no, product_name, subtotal }
  const [selectedReturnReason, setSelectedReturnReason] = useState(ALLOWED_RETURN_REASONS[0]);

  // Store Manager / Admin Inputs (Tx #14, #15)
  const [adminStockProduct, setAdminStockProduct] = useState(1);
  const [adminStockLocation, setAdminStockLocation] = useState(1);
  const [adminStockLevel, setAdminStockLevel] = useState(35);
  const [newProductForm, setNewProductForm] = useState({
    category_id: 1,
    product_name: '',
    brand: '',
    price: '',
    description: '',
    initial_stock: 15,
    location_id: 1
  });
  const [newCategoryForm, setNewCategoryForm] = useState({
    category_name: '',
    description: ''
  });
  const [newLocationForm, setNewLocationForm] = useState({
    warehouse_name: '',
    street: '',
    city: 'Indore',
    state: 'MP',
    pincode: '452001',
    capacity: 600
  });
  const [editPriceForm, setEditPriceForm] = useState({
    product_id: 1,
    price: 499
  });

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const notify = (type, title, detail) => {
    setNotification({ type, title, detail });
    setTimeout(() => {
      setNotification((prev) => (prev?.title === title ? null : prev));
    }, 4500);
  };

  // ============================================================================
  // UNIFIED FASTAPI HTTP HELPER (MATCHING main.py ROUTES & 404/409 HANDLERS)
  // ============================================================================
  const apiRequest = async (method, path, body = undefined) => {
    const cleanBase = apiBaseUrl.replace(/\/+$/, '');
    setLastApiCall(`${method} ${path}`);
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${cleanBase}${path}`, options);
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        typeof data?.detail === 'string'
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail.map((e) => e.msg).join(', ')
          : `HTTP ${res.status} Error`;
      throw new Error(msg);
    }
    return data;
  };

  const fetchReturnQueue = async () => {
    const rows = await apiRequest('GET', '/manager/returns');
    const queue = (Array.isArray(rows) ? rows : []).map((row) => ({
      ...row,
      cart_id: Number(row.cart_id),
      serial_no: Number(row.serial_no),
      return_cart_id: Number(row.return_cart_id),
      delivery_person_id: row.delivery_person_id == null ? null : Number(row.delivery_person_id)
    }));
    setReturns(queue);
    return queue;
  };

  const fetchCustomerReturns = async (customerId) => {
    const rows = await apiRequest('GET', `/customers/${customerId}/returns`);
    const ownReturns = (Array.isArray(rows) ? rows : []).map((row) => ({
      ...row,
      cart_id: Number(row.cart_id),
      serial_no: Number(row.serial_no),
      return_cart_id: Number(row.return_cart_id),
      refund_amount: Number(row.refund_amount || 0),
      delivery_person_id: row.delivery_person_id == null ? null : Number(row.delivery_person_id)
    }));
    setCustomerReturns(ownReturns);
    return ownReturns;
  };

  const fetchOrders = async () => {
    const rows = await apiRequest('GET', '/orders');
    const liveOrders = (Array.isArray(rows) ? rows : []).map((row) => ({
      ...row,
      order_id: Number(row.order_id),
      customer_id: Number(row.customer_id),
      delivery_person_id: row.delivery_person_id == null ? null : Number(row.delivery_person_id),
      total_amount: Number(row.total_amount),
      order_date: String(row.order_date).slice(0, 10)
    }));
    setOrders(liveOrders);
    return liveOrders;
  };

  const fetchCustomerOrders = async (customerId) => {
    const rows = await apiRequest('GET', `/customers/${customerId}/orders`);
    const orderMap = new Map();
    const itemRows = [];
    const invoiceMap = new Map();
    const paymentMap = new Map();
    (Array.isArray(rows) ? rows : []).forEach((row) => {
      const orderId = Number(row.order_id);
      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, {
          order_id: orderId,
          customer_id: Number(row.customer_id),
          delivery_person_id: row.delivery_person_id == null ? null : Number(row.delivery_person_id),
          order_date: String(row.order_date).slice(0, 10),
          order_status: row.order_status,
          delivery_date: row.delivery_date,
          delivery_status: row.delivery_status,
          total_amount: Number(row.total_amount)
        });
      }
      if (row.cart_id != null) itemRows.push({
        cart_id: Number(row.cart_id), serial_no: Number(row.serial_no), order_id: orderId,
        customer_id: Number(row.customer_id), product_id: Number(row.product_id),
        quantity: Number(row.quantity), unit_price: Number(row.unit_price), subtotal: Number(row.subtotal)
      });
      if (row.invoice_id != null && !invoiceMap.has(Number(row.invoice_id))) {
        invoiceMap.set(Number(row.invoice_id), {
          invoice_id: Number(row.invoice_id), order_id: orderId,
          invoice_date: String(row.invoice_date).slice(0, 10),
          total_amount: Number(row.invoice_total), tax_amount: Number(row.tax_amount),
          payment_status: row.invoice_status
        });
      }
      if (row.payment_id != null) paymentMap.set(Number(row.payment_id), {
        payment_id: Number(row.payment_id), invoice_id: Number(row.invoice_id),
        payment_date: row.payment_date, payment_mode: row.payment_mode,
        amount: Number(row.payment_amount), payment_status: row.transaction_status
      });
    });
    const liveOrders = Array.from(orderMap.values());
    setOrders((prev) => [...prev.filter((order) => order.customer_id !== Number(customerId)), ...liveOrders]);
    setOrderCart((prev) => [...prev.filter((item) => item.customer_id !== Number(customerId) || item.order_id == null), ...itemRows]);
    setInvoices((prev) => [...prev.filter((invoice) => !liveOrders.some((order) => order.order_id === invoice.order_id)), ...invoiceMap.values()]);
    const invoiceIds = new Set(invoiceMap.keys());
    setPayments((prev) => [...prev.filter((payment) => !invoiceIds.has(payment.invoice_id)), ...paymentMap.values()]);
    return liveOrders;
  };

  // Sync Catalog, Categories, Locations, Warehouse Stock & Active Cart from FastAPI
  const syncFromFastApi = async (custId = activeCustomerId) => {
    try {
      const cleanBase = apiBaseUrl.replace(/\/+$/, '');
      const healthRes = await fetch(`${cleanBase}/health`);
      if (!healthRes.ok) throw new Error('Health check failed');

      setApiStatus('connected');

      const [catsData, prodsData, locsData, driversData] = await Promise.all([
        apiRequest('GET', '/categories'),
        apiRequest('GET', '/products?limit=200&offset=0'),
        apiRequest('GET', '/locations'),
        apiRequest('GET', '/delivery-people')
      ]);
      await fetchReturnQueue();
      await fetchCustomerReturns(custId);
      await fetchCustomerOrders(custId);

      const accents = ['orange', 'cyan', 'purple', 'pink', 'green'];
      if (Array.isArray(catsData) && catsData.length > 0) {
        setCategories(
          catsData.map((c, idx) => ({
            ...c,
            accent: accents[idx % accents.length]
          }))
        );
      }

      if (Array.isArray(prodsData) && prodsData.length > 0) {
        setProducts(
          prodsData.map((p, idx) => ({
            ...p,
            price: Number(p.price),
            stock_quantity: Number(p.available ?? p.stock_quantity ?? 0),
            accent: accents[idx % accents.length]
          }))
        );
      }

      if (Array.isArray(locsData) && locsData.length > 0) {
        setLocations(locsData);
        // Fetch per-location stock via GET /locations/{location_id}/stock
        const stockLists = await Promise.all(
          locsData.map((l) =>
            apiRequest('GET', `/locations/${l.location_id}/stock`).then((rows) =>
              (rows || []).map((r) => ({
                product_id: Number(r.product_id),
                location_id: Number(l.location_id),
                stock_level: Number(r.stock_level)
              }))
            )
          )
        );
        setProductInventory(stockLists.flat());
      }

      if (Array.isArray(driversData) && driversData.length > 0) {
        setDeliveryPersons(driversData);
      }

      // Fetch active customer's open cart via GET /customers/{customer_id}/cart
      try {
        const cartView = await apiRequest('GET', `/customers/${custId}/cart`);
        if (cartView && Array.isArray(cartView.items)) {
          const openItems = cartView.items.map((item) => ({
            cart_id: Number(item.cart_id),
            serial_no: Number(item.serial_no),
            order_id: null,
            customer_id: Number(custId),
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            subtotal: Number(item.subtotal)
          }));
          setOrderCart((prev) => [
            ...prev.filter((r) =>
              !(r.customer_id === Number(custId) && r.order_id === null) &&
              !openItems.some((item) => item.cart_id === r.cart_id && item.serial_no === r.serial_no)
            ),
            ...openItems
          ]);
        }
      } catch {
        // Customer may not exist in DB yet if 03_seed.sql wasn't re-run with customer 4
      }

    } catch {
      setApiStatus('standby');
    }
  };

  useEffect(() => {
    if (useLiveApi) {
      syncFromFastApi(activeCustomerId);
    } else {
      setApiStatus('standby');
    }
  }, [apiBaseUrl, useLiveApi, activeCustomerId]);

  // Active Customer
  const currentCustomer = useMemo(
    () => customers.find((c) => c.customer_id === Number(activeCustomerId)) || customers[0],
    [customers, activeCustomerId]
  );

  // Filtered Catalog Products (Tx #1: catalog.search_products)
  const filteredProducts = useMemo(() => {
    return products
      .map((p) => {
        const cat = categories.find((c) => c.category_id === p.category_id);
        return {
          ...p,
          category_name: cat?.category_name || 'General',
          accent: p.accent || cat?.accent || 'cyan'
        };
      })
      .filter((p) => {
        if (
          searchQuery &&
          !p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(p.brand || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (selectedCategory !== 'All' && p.category_name !== selectedCategory) return false;
        if (p.price > maxPrice) return false;
        if (inStockOnly && p.stock_quantity <= 0) return false;
        return true;
      });
  }, [products, categories, searchQuery, selectedCategory, maxPrice, inStockOnly]);

  // Active Customer's Open Cart (Order_Cart rows where order_id IS NULL)
  const openCartLines = useMemo(() => {
    return orderCart
      .filter((r) => r.customer_id === activeCustomerId && r.order_id === null)
      .map((r) => {
        const prod = products.find((p) => p.product_id === r.product_id);
        return {
          ...r,
          product_name: prod?.product_name || `Product #${r.product_id}`,
          brand: prod?.brand || '',
          available: prod?.stock_quantity || 0,
          accent: prod?.accent || 'cyan'
        };
      })
      .sort((a, b) => a.serial_no - b.serial_no);
  }, [orderCart, activeCustomerId, products]);

  const openCartTotal = useMemo(
    () => openCartLines.reduce((sum, item) => sum + item.subtotal, 0),
    [openCartLines]
  );

  const openCartItemCount = useMemo(
    () => openCartLines.reduce((sum, item) => sum + item.quantity, 0),
    [openCartLines]
  );

  // Active Customer's Orders
  const customerOrders = useMemo(
    () => orders.filter((o) => o.customer_id === activeCustomerId).sort((a, b) => b.order_id - a.order_id),
    [orders, activeCustomerId]
  );

  // ============================================================================
  // STOREFRONT & ORDER HANDLERS (ALL 15 TRANSACTIONS WIRED TO main.py)
  // ============================================================================

  // Tx #2: Add to Cart -> POST /customers/{customer_id}/cart/items
  const handleAddToCart = async (productId, qtyToAdd = 1) => {
    const prod = products.find((p) => p.product_id === productId);
    if (!prod) return;
    const qty = Math.max(1, Number(qtyToAdd));

    if (useLiveApi && apiStatus === 'connected') {
      try {
        await apiRequest('POST', `/customers/${activeCustomerId}/cart/items`, {
          product_id: Number(productId),
          quantity: qty
        });
        await syncFromFastApi(activeCustomerId);
        notify('success', 'Added to Cart (FastAPI)', `${qty}x ${prod.product_name} added via POST /customers/${activeCustomerId}/cart/items`);
        return;
      } catch (err) {
        notify('error', 'Database Trigger Rejected Action', err.message);
        return;
      }
    }

    const existingCartRow = orderCart.find((r) => r.customer_id === activeCustomerId && r.order_id === null);
    const maxCartId = orderCart.reduce((m, r) => Math.max(m, r.cart_id), 0);
    const cartId = existingCartRow ? existingCartRow.cart_id : maxCartId + 1;

    const alreadyInCart = orderCart
      .filter((r) => r.cart_id === cartId && r.product_id === productId && r.order_id === null)
      .reduce((sum, r) => sum + r.quantity, 0);

    if (alreadyInCart + qty > prod.stock_quantity) {
      notify('error', 'Stock Limit Reached', `Only ${prod.stock_quantity} unit(s) of ${prod.product_name} are available across warehouses.`);
      return;
    }

    const maxSerial = orderCart
      .filter((r) => r.cart_id === cartId)
      .reduce((m, r) => Math.max(m, r.serial_no), 0);

    const newRow = {
      cart_id: cartId,
      serial_no: maxSerial + 1,
      order_id: null,
      customer_id: activeCustomerId,
      product_id: productId,
      quantity: qty,
      unit_price: prod.price,
      subtotal: Number((prod.price * qty).toFixed(2))
    };

    setOrderCart((prev) => [...prev, newRow]);
    notify('success', 'Added to Cart', `${qty}x ${prod.product_name} added at ₹${prod.price} each.`);
  };

  // Tx #3: Update or Remove Cart Item -> PATCH or DELETE /customers/{customer_id}/cart/items/{cart_id}/{serial_no}
  const handleUpdateCartQuantity = async (cartId, serialNo, nextQty) => {
    if (useLiveApi && apiStatus === 'connected') {
      try {
        if (nextQty <= 0) {
          await apiRequest('DELETE', `/customers/${activeCustomerId}/cart/items/${cartId}/${serialNo}`);
          notify('info', 'Item Removed (FastAPI)', `Removed via DELETE /customers/${activeCustomerId}/cart/items/${cartId}/${serialNo}`);
        } else {
          await apiRequest('PATCH', `/customers/${activeCustomerId}/cart/items/${cartId}/${serialNo}`, {
            quantity: Number(nextQty)
          });
        }
        await syncFromFastApi(activeCustomerId);
        return;
      } catch (err) {
        notify('error', 'Cart Update Rejected', err.message);
        return;
      }
    }

    const row = orderCart.find((r) => r.cart_id === cartId && r.serial_no === serialNo);
    if (!row || row.order_id !== null) return;

    if (nextQty <= 0) {
      setOrderCart((prev) => prev.filter((r) => !(r.cart_id === cartId && r.serial_no === serialNo)));
      notify('info', 'Item Removed', 'Item removed from your shopping cart.');
      return;
    }

    const prod = products.find((p) => p.product_id === row.product_id);
    const otherQty = orderCart
      .filter((r) => r.cart_id === cartId && r.product_id === row.product_id && r.serial_no !== serialNo)
      .reduce((s, r) => s + r.quantity, 0);

    if (otherQty + nextQty > (prod?.stock_quantity || 0)) {
      notify('error', 'Insufficient Stock', `Only ${prod?.stock_quantity} unit(s) available.`);
      return;
    }

    setOrderCart((prev) =>
      prev.map((r) =>
        r.cart_id === cartId && r.serial_no === serialNo
          ? { ...r, quantity: nextQty, subtotal: Number((nextQty * r.unit_price).toFixed(2)) }
          : r
      )
    );
  };

  // Tx #5 & #6: Checkout -> POST /customers/{customer_id}/checkout + POST /orders/{order_id}/invoice
  const handleCheckoutAndInvoice = async () => {
    if (openCartLines.length === 0) return;

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const snapshotLines = [...openCartLines];
        const createdOrder = await apiRequest('POST', `/customers/${activeCustomerId}/checkout`);
        const createdInvoice = await apiRequest('POST', `/orders/${createdOrder.order_id}/invoice`);

        const normalizedOrder = {
          ...createdOrder,
          total_amount: Number(createdOrder.total_amount),
          order_date: String(createdOrder.order_date).slice(0, 10)
        };
        const normalizedInvoice = {
          ...createdInvoice,
          total_amount: Number(createdInvoice.total_amount),
          tax_amount: Number(createdInvoice.tax_amount),
          invoice_date: String(createdInvoice.invoice_date).slice(0, 10)
        };

        setOrderCart((prev) => [
          ...prev.filter((r) =>
            r.order_id !== normalizedOrder.order_id &&
            !(r.customer_id === activeCustomerId && r.order_id === null) &&
            !snapshotLines.some((line) => line.cart_id === r.cart_id && line.serial_no === r.serial_no)
          ),
          ...snapshotLines.map((l) => ({ ...l, order_id: normalizedOrder.order_id }))
        ]);
        setOrders((prev) => [normalizedOrder, ...prev.filter((o) => o.order_id !== normalizedOrder.order_id)]);
        setInvoices((prev) => [normalizedInvoice, ...prev.filter((i) => i.invoice_id !== normalizedInvoice.invoice_id)]);

        setIsCartOpen(false);
        setCheckoutModalInvoice(normalizedInvoice);
        setExpandedOrderId(normalizedOrder.order_id);
        await syncFromFastApi(activeCustomerId);
        notify(
          'success',
          `Order #${normalizedOrder.order_id} Checked Out`,
          `Stock allocated across warehouses & 18% GST Invoice #${normalizedInvoice.invoice_id} generated.`
        );
        return;
      } catch (err) {
        notify('error', 'Checkout Failed', err.message);
        return;
      }
    }

    // Validate stock availability across cart
    const wantedByProd = {};
    openCartLines.forEach((l) => {
      wantedByProd[l.product_id] = (wantedByProd[l.product_id] || 0) + l.quantity;
    });

    for (const [pidStr, wanted] of Object.entries(wantedByProd)) {
      const prod = products.find((p) => p.product_id === Number(pidStr));
      if (!prod || wanted > prod.stock_quantity) {
        notify('error', 'Stock Shortage', `Not enough stock for ${prod?.product_name}.`);
        return;
      }
    }

    // Greedy Warehouse Stock Allocation (largest stock warehouse drained first)
    const nextInv = productInventory.map((r) => ({ ...r }));
    openCartLines.forEach((line) => {
      let rem = line.quantity;
      const whRows = nextInv
        .filter((r) => r.product_id === line.product_id && r.stock_level > 0)
        .sort((a, b) => (b.stock_level !== a.stock_level ? b.stock_level - a.stock_level : a.location_id - b.location_id));

      for (const wh of whRows) {
        if (rem <= 0) break;
        const take = Math.min(wh.stock_level, rem);
        wh.stock_level -= take;
        rem -= take;
      }
    });

    const nextProds = products.map((p) => {
      const total = nextInv
        .filter((r) => r.product_id === p.product_id)
        .reduce((s, r) => s + r.stock_level, 0);
      return { ...p, stock_quantity: total };
    });

    const nextOrderId = orders.reduce((m, o) => Math.max(m, o.order_id), 0) + 1;
    const baseTotal = Number(openCartLines.reduce((s, l) => s + l.subtotal, 0).toFixed(2));
    const cartId = openCartLines[0].cart_id;
    const today = new Date().toISOString().slice(0, 10);

    const newOrder = {
      order_id: nextOrderId,
      customer_id: activeCustomerId,
      delivery_person_id: null,
      order_date: today,
      order_status: 'Placed',
      delivery_date: null,
      delivery_status: 'Pending',
      total_amount: baseTotal,
      cart_id: cartId
    };

    const nextInvId = invoices.reduce((m, i) => Math.max(m, i.invoice_id), 0) + 1;
    const gstAmount = Number((baseTotal * 0.18).toFixed(2));
    const newInvoice = {
      invoice_id: nextInvId,
      order_id: nextOrderId,
      invoice_date: today,
      total_amount: baseTotal,
      tax_amount: gstAmount,
      payment_status: 'Unpaid'
    };

    setOrderCart((prev) =>
      prev.map((r) => (r.cart_id === cartId && r.order_id === null ? { ...r, order_id: nextOrderId } : r))
    );
    setProductInventory(nextInv);
    setProducts(nextProds);
    setOrders((prev) => [...prev, newOrder]);
    setInvoices((prev) => [...prev, newInvoice]);

    setIsCartOpen(false);
    setCheckoutModalInvoice(newInvoice);
    setExpandedOrderId(nextOrderId);
  };

  // Tx #7: Process Payment -> POST /invoices/{invoice_id}/payments with { payment_mode }
  const handleProcessPayment = async () => {
    if (!checkoutModalInvoice) return;
    const inv = invoices.find((i) => i.invoice_id === checkoutModalInvoice.invoice_id) || checkoutModalInvoice;

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const payRes = await apiRequest('POST', `/invoices/${inv.invoice_id}/payments`, {
          payment_mode: selectedPaymentMode
        });
        const normalizedPay = {
          ...payRes,
          amount: Number(payRes.amount),
          payment_date: String(payRes.payment_date).slice(0, 10)
        };
        setPayments((prev) => [
          normalizedPay,
          ...prev.filter((p) => p.invoice_id !== inv.invoice_id)
        ]);

        if (normalizedPay.payment_status === 'Success') {
          setInvoices((prev) =>
            prev.map((i) => (i.invoice_id === inv.invoice_id ? { ...i, payment_status: 'Paid' } : i))
          );
          setCheckoutModalInvoice(null);
          setActiveView('orders');
          notify(
            'success',
            'Payment Confirmed (FastAPI)',
            `Paid ₹${normalizedPay.amount} via ${selectedPaymentMode}. Invoice #${inv.invoice_id} is now Paid.`
          );
        } else {
          notify(
            'error',
            'Simulated 10% Gateway Decline!',
            'The backend gateway returned payment_status = "Failed". Click Pay again to retry on the same Payment row!'
          );
        }
        return;
      } catch (err) {
        notify('error', 'Payment Rejected', err.message);
        return;
      }
    }

    const outcome = simulateFailure ? 'Failed' : 'Success';
    const payable = Number((inv.total_amount + inv.tax_amount).toFixed(2));
    const today = new Date().toISOString().slice(0, 10);

    const existingPay = payments.find((p) => p.invoice_id === inv.invoice_id);
    if (!existingPay) {
      const nextPayId = payments.reduce((m, p) => Math.max(m, p.payment_id), 0) + 1;
      setPayments((prev) => [
        ...prev,
        {
          payment_id: nextPayId,
          invoice_id: inv.invoice_id,
          payment_date: today,
          payment_mode: selectedPaymentMode,
          amount: payable,
          payment_status: outcome
        }
      ]);
    } else {
      setPayments((prev) =>
        prev.map((p) =>
          p.invoice_id === inv.invoice_id
            ? { ...p, payment_mode: selectedPaymentMode, payment_status: outcome, payment_date: today }
            : p
        )
      );
    }

    if (outcome === 'Success') {
      setInvoices((prev) =>
        prev.map((i) => (i.invoice_id === inv.invoice_id ? { ...i, payment_status: 'Paid' } : i))
      );
      setCheckoutModalInvoice(null);
      setActiveView('orders');
      notify('success', 'Payment Confirmed!', `Paid ₹${payable} via ${selectedPaymentMode}. Order #${inv.order_id} is ready for dispatch.`);
    } else {
      notify('error', 'Payment Gateway Declined', 'Transaction marked as Failed. Uncheck "Simulate Gateway Failure" and click Retry Payment.');
    }
  };

  // Tx #8 & #9: Assign Delivery Partner & Advance Step-by-Step Status
  // POST /orders/{order_id}/delivery-assignment & PATCH /orders/{order_id}/delivery-status
  const handleAssignDriver = async (orderId, driverId) => {
    if (useLiveApi && apiStatus === 'connected') {
      try {
        const updatedOrd = await apiRequest('POST', `/orders/${orderId}/delivery-assignment`, {
          delivery_person_id: Number(driverId)
        });
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  ...updatedOrd,
                  total_amount: Number(updatedOrd.total_amount),
                  order_date: String(updatedOrd.order_date).slice(0, 10)
                }
              : o
          )
        );
        const driver = deliveryPersons.find((d) => d.delivery_person_id === Number(driverId));
        notify('success', 'Courier Assigned (FastAPI)', `${driver?.name || 'Courier'} assigned to Order #${orderId}.`);
        return;
      } catch (err) {
        notify('error', 'Delivery Assignment Blocked', err.message);
        return;
      }
    }

    const inv = invoices.find((i) => i.order_id === orderId);
    if (!inv || inv.payment_status !== 'Paid') {
      notify('error', 'Payment Required First', 'The order invoice must be Paid before assigning a delivery partner.');
      return;
    }
    const ord = orders.find((o) => o.order_id === orderId);
    if (!ord || ord.delivery_person_id !== null) return;

    const eta = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === orderId
          ? { ...o, delivery_person_id: Number(driverId), delivery_status: 'Assigned', delivery_date: eta }
          : o
      )
    );
    const driver = deliveryPersons.find((d) => d.delivery_person_id === Number(driverId));
    notify('success', 'Delivery Partner Assigned', `${driver?.name} (${driver?.vehicle_no}) assigned to Order #${orderId}.`);
  };

  const handleAdvanceDeliveryStep = async (orderId) => {
    const ord = orders.find((o) => o.order_id === orderId);
    if (!ord) return;

    if (!ord.delivery_person_id) {
      notify('error', 'Assign Courier First', 'Select and assign a courier before advancing delivery.');
      return;
    }

    const currIdx = DELIVERY_STEPS.indexOf(ord.delivery_status);
    if (currIdx < 0 || currIdx >= DELIVERY_STEPS.length - 1) return;
    const nextStep = DELIVERY_STEPS[currIdx + 1];

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const updatedOrd = await apiRequest('PATCH', `/orders/${orderId}/delivery-status`, {
          delivery_status: nextStep
        });
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  ...updatedOrd,
                  total_amount: Number(updatedOrd.total_amount),
                  order_date: String(updatedOrd.order_date).slice(0, 10)
                }
              : o
          )
        );
        notify('success', `Order ${nextStep} (FastAPI)`, `Order #${orderId} status is now ${updatedOrd.order_status}.`);
        return;
      } catch (err) {
        notify('error', 'Delivery Transition Rejected', err.message);
        return;
      }
    }

    let nextOrderStatus = ord.order_status;
    let nextDate = ord.delivery_date;

    if (nextStep === 'Picked Up') nextOrderStatus = 'Shipped';
    if (nextStep === 'Delivered') {
      nextOrderStatus = 'Delivered';
      nextDate = new Date().toISOString().slice(0, 10);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === orderId
          ? { ...o, delivery_status: nextStep, order_status: nextOrderStatus, delivery_date: nextDate }
          : o
      )
    );
    notify('success', `Order ${nextStep}`, `Order #${orderId} moved to "${nextStep}" (${nextOrderStatus}).`);
  };

  // Tx #10: Submit Order Feedback -> POST /orders/{order_id}/feedback?customer_id={customer_id}
  const handleAddFeedback = async (orderId) => {
    const ord = orders.find((o) => o.order_id === orderId);
    if (!ord) return;
    if (!commentInput.trim()) {
      notify('error', 'Comment Required', 'Please write a short review note.');
      return;
    }

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const fbRes = await apiRequest(
          'POST',
          `/orders/${orderId}/feedback?customer_id=${ord.customer_id}`,
          {
            rating: Number(ratingInput),
            comments: commentInput.trim()
          }
        );
        setFeedbacks((prev) => [
          ...prev,
          {
            ...fbRes,
            feedback_date: String(fbRes.feedback_date).slice(0, 10)
          }
        ]);
        setCommentInput('');
        notify('success', 'Review Saved (FastAPI)', `Feedback #${fbRes.feedback_id} recorded on Order #${orderId}.`);
        return;
      } catch (err) {
        notify('error', 'Feedback Rejected', err.message);
        return;
      }
    }

    if (ord.order_status !== 'Delivered') {
      notify('error', 'Not Delivered Yet', 'Feedback can only be submitted after your order is delivered.');
      return;
    }

    const maxFbId = feedbacks
      .filter((f) => f.order_id === orderId)
      .reduce((m, f) => Math.max(m, f.feedback_id), 0);

    setFeedbacks((prev) => [
      ...prev,
      {
        order_id: orderId,
        feedback_id: maxFbId + 1,
        rating: ratingInput,
        comments: commentInput.trim(),
        feedback_date: new Date().toISOString().slice(0, 10)
      }
    ]);
    setCommentInput('');
    notify('success', 'Thank You for Your Review!', `Feedback #${maxFbId + 1} added to Order #${orderId}.`);
  };

  // Tx #11: Request Item Return -> POST /customers/{customer_id}/cart/items/{cart_id}/{serial_no}/returns
  const handleConfirmReturnRequest = async () => {
    if (!returnModalItem) return;
    const { cart_id, serial_no } = returnModalItem;

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const retRes = await apiRequest(
          'POST',
          `/customers/${activeCustomerId}/cart/items/${cart_id}/${serial_no}/returns`,
          { reason: selectedReturnReason }
        );
        setReturns((prev) => [
          ...prev,
          {
            ...retRes,
            product_name: returnModalItem.product_name,
            refund_amount: Number(retRes.refund_amount || 0),
            return_date: String(retRes.return_date).slice(0, 10)
          }
        ]);
        await fetchCustomerReturns(activeCustomerId);
        setReturnModalItem(null);
        notify(
          'success',
          'Return Requested (FastAPI)',
          `Return #${retRes.return_cart_id} created with status "${retRes.return_status}".`
        );
        return;
      } catch (err) {
        notify('error', 'Return Request Rejected', err.message);
        return;
      }
    }

    const activeRet = returns.find(
      (r) => r.cart_id === cart_id && r.serial_no === serial_no && r.return_status !== 'Rejected'
    );
    if (activeRet) {
      notify('error', 'Active Return Exists', 'This item already has an open return request.');
      setReturnModalItem(null);
      return;
    }

    const maxRetId = returns
      .filter((r) => r.cart_id === cart_id && r.serial_no === serial_no)
      .reduce((m, r) => Math.max(m, r.return_cart_id), 0);

    setReturns((prev) => [
      ...prev,
      {
        cart_id,
        serial_no,
        return_cart_id: maxRetId + 1,
        delivery_person_id: null,
        return_date: new Date().toISOString().slice(0, 10),
        reason: selectedReturnReason,
        return_status: 'Requested',
        refund_amount: 0
      }
    ]);
    setCustomerReturns((prev) => [
      {
        cart_id,
        serial_no,
        return_cart_id: maxRetId + 1,
        order_id: orderCart.find((line) => line.cart_id === cart_id && line.serial_no === serial_no)?.order_id,
        product_name: returnModalItem.product_name,
        reason: selectedReturnReason,
        return_status: 'Requested',
        refund_amount: 0
      },
      ...prev
    ]);
    setReturnModalItem(null);
    notify('success', 'Return Requested', `Return request #${maxRetId + 1} submitted for review.`);
  };

  // Tx #12 & #13: Admin Review Return, Assign Pickup Courier, and Refund
  // PATCH /returns/{cart_id}/{serial_no}/{return_cart_id}/review
  // POST /returns/{cart_id}/{serial_no}/{return_cart_id}/pickup-and-refund
  const handleReviewReturn = async (cartId, serialNo, retId, approve) => {
    if (useLiveApi && apiStatus === 'connected') {
      try {
        const updatedRet = await apiRequest(
          'PATCH',
          `/returns/${cartId}/${serialNo}/${retId}/review`,
          { approve: Boolean(approve) }
        );
        setReturns((prev) =>
          prev.map((r) =>
            r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
              ? { ...r, ...updatedRet, refund_amount: Number(updatedRet.refund_amount || 0) }
              : r
          )
        );
        await fetchCustomerReturns(activeCustomerId);
        notify('info', `Return ${updatedRet.return_status} (FastAPI)`, `Updated Return #${retId}.`);
        return;
      } catch (err) {
        notify('error', 'Return Review Rejected', err.message);
        return;
      }
    }

    setReturns((prev) =>
      prev.map((r) =>
        r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
          ? { ...r, return_status: approve ? 'Approved' : 'Rejected' }
          : r
      )
    );
    setCustomerReturns((prev) => prev.map((r) =>
      r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
        ? { ...r, return_status: approve ? 'Approved' : 'Rejected' }
        : r
    ));
    notify('info', `Return ${approve ? 'Approved' : 'Rejected'}`, `Updated status for Return #${retId}.`);
  };

  const handleAssignReturnDriver = async (cartId, serialNo, retId, driverId) => {
    if (!driverId) return;
    if (useLiveApi && apiStatus === 'connected') {
      try {
        const updatedRet = await apiRequest(
          'PATCH',
          `/returns/${cartId}/${serialNo}/${retId}/delivery-assignment`,
          { delivery_person_id: Number(driverId) }
        );
        setReturns((prev) => prev.map((ret) =>
          ret.cart_id === cartId && ret.serial_no === serialNo && ret.return_cart_id === retId
            ? { ...ret, delivery_person_id: Number(updatedRet.delivery_person_id) }
            : ret
        ));
        await fetchCustomerReturns(activeCustomerId);
        notify('success', 'Return Courier Assigned', `Courier #${driverId} will collect Return #${retId}.`);
      } catch (err) {
        notify('error', 'Return Assignment Blocked', err.message);
      }
      return;
    }
    setReturns((prev) => prev.map((ret) =>
      ret.cart_id === cartId && ret.serial_no === serialNo && ret.return_cart_id === retId && ret.return_status === 'Approved'
        ? { ...ret, delivery_person_id: Number(driverId) }
        : ret
    ));
    setCustomerReturns((prev) => prev.map((ret) =>
      ret.cart_id === cartId && ret.serial_no === serialNo && ret.return_cart_id === retId
        ? { ...ret, delivery_person_id: Number(driverId) }
        : ret
    ));
    notify('success', 'Return Courier Assigned', `Courier #${driverId} will collect Return #${retId}.`);
  };

  const handleCompleteRefund = async (cartId, serialNo, retId, driverId) => {
    const line = orderCart.find((l) => l.cart_id === cartId && l.serial_no === serialNo);
    const refundAmt = line ? line.subtotal : undefined;

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const updatedRet = await apiRequest(
          'POST',
          `/returns/${cartId}/${serialNo}/${retId}/pickup-and-refund`,
          {
            delivery_person_id: Number(driverId),
            refund_amount: refundAmt
          }
        );
        setReturns((prev) =>
          prev.map((r) =>
            r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
              ? { ...r, ...updatedRet, refund_amount: Number(updatedRet.refund_amount || 0) }
              : r
          )
        );
        await fetchCustomerReturns(activeCustomerId);
        await syncFromFastApi(activeCustomerId);
        notify('success', 'Refund Completed (FastAPI)', `Refunded ₹${updatedRet.refund_amount} via Courier #${driverId}.`);
        return;
      } catch (err) {
        notify('error', 'Refund Rejected', err.message);
        return;
      }
    }

    const request = returns.find((r) =>
      r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
    );
    if (!line || request?.return_status !== 'Approved') return;

    const nextInventory = productInventory.map((row) => ({ ...row }));
    let remaining = line.quantity;
    for (const location of [...locations].sort((a, b) => a.location_id - b.location_id)) {
      const used = nextInventory.filter((r) => r.location_id === location.location_id)
        .reduce((total, r) => total + r.stock_level, 0);
      const quantity = Math.min(remaining, location.capacity - used);
      if (quantity <= 0) continue;
      const row = nextInventory.find((r) =>
        r.location_id === location.location_id && r.product_id === line.product_id
      );
      if (row) row.stock_level += quantity;
      else nextInventory.push({ product_id: line.product_id, location_id: location.location_id, stock_level: quantity });
      remaining -= quantity;
      if (remaining === 0) break;
    }
    if (remaining > 0) {
      notify('error', 'Refund Rejected', 'Not enough warehouse space for the returned items.');
      return;
    }

    setReturns((prev) =>
      prev.map((r) =>
        r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
          ? { ...r, delivery_person_id: driverId, return_status: 'Refunded', refund_amount: refundAmt || 0 }
          : r
      )
    );
    setCustomerReturns((prev) => prev.map((r) =>
      r.cart_id === cartId && r.serial_no === serialNo && r.return_cart_id === retId
        ? { ...r, return_status: 'Refunded', refund_amount: refundAmt || 0 }
        : r
    ));
    setProductInventory(nextInventory);
    setProducts((prev) => prev.map((product) =>
      product.product_id === line.product_id
        ? { ...product, stock_quantity: product.stock_quantity + line.quantity }
        : product
    ));
    notify('success', 'Pickup Assigned & Refund Issued', `₹${refundAmt || 0} refunded to customer.`);
  };

  // Tx #14 & #15: Admin Add/Update Product, Category, Location & Set Warehouse Stock
  // PUT /products/{product_id}/stock/{location_id}
  const handleAdminSetStock = async (e) => {
    e.preventDefault();
    const pid = Number(adminStockProduct);
    const lid = Number(adminStockLocation);
    const level = Math.max(0, Number(adminStockLevel));

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const res = await apiRequest('PUT', `/products/${pid}/stock/${lid}`, {
          stock_level: level
        });
        await syncFromFastApi(activeCustomerId);
        notify(
          'success',
          'Warehouse Stock Synced (FastAPI)',
          `Location #${lid} stock set to ${res.stock_level}. Trigger updated Product total to ${res.product_total} units.`
        );
        return;
      } catch (err) {
        notify('error', 'Warehouse Capacity Trigger Rejected', err.message);
        return;
      }
    }

    const loc = locations.find((l) => l.location_id === lid);
    const otherUsed = productInventory
      .filter((r) => r.location_id === lid && r.product_id !== pid)
      .reduce((s, r) => s + r.stock_level, 0);

    if (otherUsed + level > loc.capacity) {
      notify('error', 'Warehouse Capacity Exceeded', `${loc.warehouse_name} capacity is ${loc.capacity} units.`);
      return;
    }

    const exists = productInventory.some((r) => r.product_id === pid && r.location_id === lid);
    const nextInv = exists
      ? productInventory.map((r) =>
          r.product_id === pid && r.location_id === lid ? { ...r, stock_level: level } : r
        )
      : [...productInventory, { product_id: pid, location_id: lid, stock_level: level }];

    const newTotal = nextInv
      .filter((r) => r.product_id === pid)
      .reduce((s, r) => s + r.stock_level, 0);

    setProductInventory(nextInv);
    setProducts((prev) => prev.map((p) => (p.product_id === pid ? { ...p, stock_quantity: newTotal } : p)));
    notify('success', 'Inventory Synced', `Warehouse stock updated. Product total is now ${newTotal} units.`);
  };

  // POST /products
  const handleAdminAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.product_name.trim() || !newProductForm.price) return;

    const priceVal = Number(newProductForm.price);
    const initStock = Math.max(0, Number(newProductForm.initial_stock));
    const lid = Number(newProductForm.location_id);

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const created = await apiRequest('POST', '/products', {
          category_id: Number(newProductForm.category_id),
          product_name: newProductForm.product_name.trim(),
          price: priceVal,
          description: newProductForm.description.trim() || 'Premium catalog item',
          brand: newProductForm.brand.trim() || 'Indore Bazaar',
          initial_stock: initStock,
          location_id: initStock > 0 ? lid : null
        });
        await syncFromFastApi(activeCustomerId);
        setNewProductForm({
          category_id: 1,
          product_name: '',
          brand: '',
          price: '',
          description: '',
          initial_stock: 15,
          location_id: 1
        });
        notify('success', 'Product Created (FastAPI)', `${created.product_name} (#${created.product_id}) added via POST /products.`);
        return;
      } catch (err) {
        notify('error', 'Add Product Rejected', err.message);
        return;
      }
    }

    const loc = locations.find((l) => l.location_id === lid);
    const used = productInventory.filter((r) => r.location_id === lid).reduce((s, r) => s + r.stock_level, 0);

    if (used + initStock > loc.capacity) {
      notify('error', 'Capacity Exceeded', `${loc.warehouse_name} does not have enough free capacity.`);
      return;
    }

    const nextPid = products.reduce((m, p) => Math.max(m, p.product_id), 0) + 1;
    const accents = ['orange', 'cyan', 'purple', 'pink', 'green'];
    const newProd = {
      product_id: nextPid,
      category_id: Number(newProductForm.category_id),
      product_name: newProductForm.product_name.trim(),
      brand: newProductForm.brand.trim() || 'Nexus Originals',
      price: priceVal,
      description: newProductForm.description.trim() || 'Premium quality catalog item',
      stock_quantity: initStock,
      accent: accents[nextPid % accents.length]
    };

    setProducts((prev) => [...prev, newProd]);
    if (initStock > 0) {
      setProductInventory((prev) => [
        ...prev,
        { product_id: nextPid, location_id: lid, stock_level: initStock }
      ]);
    }
    setNewProductForm({
      category_id: 1,
      product_name: '',
      brand: '',
      price: '',
      description: '',
      initial_stock: 15,
      location_id: 1
    });
    notify('success', 'Product Published', `${newProd.product_name} added to catalog with ${initStock} units.`);
  };

  // PATCH /products/{product_id} (Great for demonstrating Price Snapshot in Cart!)
  const handleAdminUpdatePrice = async (e) => {
    e.preventDefault();
    const pid = Number(editPriceForm.product_id);
    const newPrice = Number(editPriceForm.price);

    if (useLiveApi && apiStatus === 'connected') {
      try {
        const updated = await apiRequest('PATCH', `/products/${pid}`, { price: newPrice });
        await syncFromFastApi(activeCustomerId);
        notify(
          'success',
          'Catalog Price Updated (FastAPI)',
          `${updated.product_name} is now ₹${updated.price} (existing cart items keep their snapshotted unit_price!).`
        );
        return;
      } catch (err) {
        notify('error', 'Price Update Rejected', err.message);
        return;
      }
    }

    setProducts((prev) => prev.map((p) => (p.product_id === pid ? { ...p, price: newPrice } : p)));
    notify(
      'success',
      'Catalog Price Updated',
      `Product #${pid} price updated to ₹${newPrice}. Existing cart items keep their original unit_price snapshot!`
    );
  };

  // POST /categories & POST /locations
  const handleAdminAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryForm.category_name.trim()) return;
    if (useLiveApi && apiStatus === 'connected') {
      try {
        const created = await apiRequest('POST', '/categories', {
          category_name: newCategoryForm.category_name.trim(),
          description: newCategoryForm.description.trim() || null
        });
        await syncFromFastApi(activeCustomerId);
        setNewCategoryForm({ category_name: '', description: '' });
        notify('success', 'Category Created (FastAPI)', `Added "${created.category_name}" via POST /categories.`);
        return;
      } catch (err) {
        notify('error', 'Category Rejected', err.message);
        return;
      }
    }
    const nextCid = categories.reduce((m, c) => Math.max(m, c.category_id), 0) + 1;
    setCategories((prev) => [
      ...prev,
      {
        category_id: nextCid,
        category_name: newCategoryForm.category_name.trim(),
        description: newCategoryForm.description.trim(),
        accent: 'green'
      }
    ]);
    setNewCategoryForm({ category_name: '', description: '' });
    notify('success', 'Category Added', 'New department folder added to storefront.');
  };

  // Warehouse Utilization Telemetry for Radial Widget
  const warehouseTelemetry = useMemo(() => {
    const indoreUsed = productInventory
      .filter((r) => r.location_id === 1)
      .reduce((s, r) => s + r.stock_level, 0);
    const pithampurUsed = productInventory
      .filter((r) => r.location_id === 2)
      .reduce((s, r) => s + r.stock_level, 0);
    return {
      indoreUsed,
      indoreFree: 1000 - indoreUsed,
      indorePct: Math.round((indoreUsed / 1000) * 100),
      pithampurUsed,
      pithampurFree: 500 - pithampurUsed,
      pithampurPct: Math.round((pithampurUsed / 500) * 100),
      totalUnits: indoreUsed + pithampurUsed
    };
  }, [productInventory]);

  return (
    <div className="min-h-screen bg-[#1e2030] text-slate-100 font-sans selection:bg-[#7dcfff]/30 selection:text-[#7dcfff] pb-16">
      {/* Subtle Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-10 w-96 h-96 rounded-full bg-[#ff9e64]/[0.06] blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#7dcfff]/[0.06] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-[#bb9af7]/[0.05] blur-3xl" />
      </div>

      {/* Floating Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce">
          <div
            className={`rounded-2xl p-4 bg-[#25283d]/95 backdrop-blur-xl border shadow-2xl flex items-start gap-3 ${
              notification.type === 'error'
                ? 'border-[#f7768e] text-rose-100'
                : 'border-[#7dcfff] text-sky-100'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-[#f7768e] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#9ece6a] shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <div className="font-bold text-sm text-white">{notification.title}</div>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{notification.detail}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOP NAVIGATION BAR (NEUMORPHIC DARK SLATE WITH NEON SEARCH PILL)     */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#1e2030]/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Title matching italic bold header from reference image */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setActiveView('store')}
              className="w-11 h-11 rounded-2xl bg-[#24273a] shadow-[5px_5px_12px_#151722,-4px_-4px_10px_#31354f] border border-[#ff9e64]/50 flex items-center justify-center text-[#ff9e64] hover:scale-105 transition"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold italic tracking-wide text-white">
                Indore <span className="text-[#7dcfff]">Bazaar</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Let's shop and manage your orders seamlessly
              </p>
            </div>
          </div>

          {/* Neon-Rimmed Search Bar (Exact match to "Search your document" pill in reference image) */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative rounded-2xl bg-[#24273a] p-[1px] bg-gradient-to-r from-[#ff9e64]/70 via-[#bb9af7]/50 to-[#7dcfff]/70 shadow-[6px_6px_14px_#151722,-4px_-4px_10px_#31354f]">
              <div className="relative flex items-center bg-[#222538] rounded-2xl px-3.5 py-2">
                <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeView !== 'store') setActiveView('store');
                  }}
                  placeholder="Search your product or brand..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: View Switcher, Customer Profile, Cart Drawer Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Navigation Pills */}
            <div className="flex items-center bg-[#232638] p-1 rounded-2xl border border-white/5 shadow-[inset_3px_3px_6px_#161824,inset_-2px_-2px_5px_#30344e]">
              {[
                { id: 'store', label: 'Storefront' },
                { id: 'orders', label: `Orders (${customerOrders.length})` },
                { id: 'admin', label: 'Manager' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeView === tab.id
                      ? 'bg-[#2d314a] text-[#7dcfff] border border-[#7dcfff]/50 shadow-[0_0_12px_rgba(125,207,255,0.2)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Customer Switcher */}
            <div className="hidden sm:flex items-center gap-2 bg-[#24273a] border border-white/10 rounded-2xl px-3 py-2 shadow-[5px_5px_12px_#151722,-3px_-3px_8px_#31354f]">
              <User className="w-3.5 h-3.5 text-[#bb9af7]" />
              <select
                value={activeCustomerId}
                onChange={(e) => setActiveCustomerId(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id} className="bg-[#24273a] text-white">
                    #{c.customer_id} {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* API Status Indicator Button */}
            <button
              onClick={() => setShowApiModal(true)}
              className={`px-3 py-2 rounded-2xl bg-[#24273a] border shadow-[5px_5px_12px_#151722,-3px_-3px_8px_#31354f] flex items-center gap-2 text-xs font-semibold transition ${
                apiStatus === 'connected'
                  ? 'border-[#9ece6a]/60 text-[#9ece6a]'
                  : 'border-white/10 text-slate-300 hover:text-[#7dcfff]'
              }`}
              title="Configure FastAPI Backend Connection"
            >
              {apiStatus === 'connected' ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#9ece6a]" />
                  <span className="hidden xl:inline">FastAPI Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#ff9e64]" />
                  <span className="hidden xl:inline">Local DB Mode</span>
                </>
              )}
            </button>

            {/* Glowing Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#2b2f47] to-[#23263a] border border-[#ff9e64]/70 shadow-[0_0_18px_rgba(255,158,100,0.22)] text-xs font-semibold text-white hover:border-[#ff9e64] transition"
            >
              <ShoppingBag className="w-4 h-4 text-[#ff9e64]" />
              <span>Cart ({openCartItemCount})</span>
              <span className="text-[#ff9e64] font-mono hidden sm:inline">• ₹{openCartTotal}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT AREA                                                    */}
      {/* ==================================================================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: CUSTOMER STOREFRONT (Reference Image Layout)               */}
        {/* ------------------------------------------------------------------ */}
        {activeView === 'store' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* LEFT 4 COLUMNS: "Internal / External" Style Category Folders + Radial Gauge + Quick Filters */}
            <div className="lg:col-span-4 space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold italic tracking-wide text-white">Departments</h2>
                  <p className="text-xs text-slate-400">Select a category folder to filter catalog</p>
                </div>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs text-[#7dcfff] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 2x2 Notched Category Folders (Directly inspired by Internal/External folders in image_a3d322.jpg) */}
              <div className="grid grid-cols-2 gap-4">
                <NotchedFolderCard
                  accent="orange"
                  icon={Folder}
                  title="All Items"
                  subtitle={`${products.length} products`}
                  active={selectedCategory === 'All'}
                  onClick={() => setSelectedCategory('All')}
                />
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category_id === cat.category_id).length;
                  const iconMap = { Electronics: Smartphone, Books: BookOpen, Home: Home };
                  return (
                    <NotchedFolderCard
                      key={cat.category_id}
                      accent={cat.accent}
                      icon={iconMap[cat.category_name] || Folder}
                      title={cat.category_name}
                      subtitle={`${count} products`}
                      active={selectedCategory === cat.category_name}
                      onClick={() => setSelectedCategory(cat.category_name)}
                    />
                  );
                })}
              </div>

              {/* Concentric Radial Gauge (Exact visual match to Phone memory / External memory in reference image) */}
              <ConcentricRadialWidget
                outerPct={warehouseTelemetry.indorePct}
                innerPct={warehouseTelemetry.pithampurPct}
                innerTitle="Indore Central Hub"
                innerSubtitle={`Stock ${warehouseTelemetry.indoreUsed} units || Cap 1000`}
                outerTitle="Pithampur Hub"
                outerSubtitle={`Stock ${warehouseTelemetry.pithampurUsed} units || Cap 500`}
                centerLabel={`${warehouseTelemetry.totalUnits}`}
              />

              {/* Horizontal Pill Filter Rows (Matching Image / Document / Music stacked rows at bottom of left phone) */}
              <div className="space-y-3.5">
                <NeonPillRow
                  accent="orange"
                  icon={SlidersHorizontal}
                  title="Maximum Price Filter"
                  subtitle={`Showing items up to ₹${maxPrice}`}
                  rightContent={
                    <input
                      type="range"
                      min="300"
                      max="4000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-28 accent-[#ff9e64] cursor-pointer"
                    />
                  }
                />

                <NeonPillRow
                  accent="cyan"
                  icon={Package}
                  title="In-Stock Availability"
                  subtitle="Hide out-of-stock warehouse items"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  rightContent={
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        inStockOnly
                          ? 'bg-[#9ece6a]/20 border-[#9ece6a] text-[#9ece6a]'
                          : 'bg-[#1d2030] border-white/10 text-slate-400'
                      }`}
                    >
                      {inStockOnly ? 'Active' : 'All'}
                    </span>
                  }
                />

                <NeonPillRow
                  accent="purple"
                  icon={Truck}
                  title="Express Hub Delivery"
                  subtitle={`Delivering to ${currentCustomer.street}, ${currentCustomer.city}`}
                  onClick={() => setActiveView('orders')}
                  rightContent={
                    <span className="text-xs font-mono text-[#bb9af7]">{customerOrders.length} Orders</span>
                  }
                />
              </div>
            </div>

            {/* RIGHT 8 COLUMNS: Product Folder Grid (Matching the 2-column Neon Folder Grid on the right phone screen) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Top Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#24273a] px-5 py-4 rounded-3xl border border-white/10 shadow-[8px_8px_20px_#161825,-6px_-6px_16px_#30344f]">
                <div>
                  <h2 className="text-xl font-extrabold italic tracking-wide text-white">
                    {selectedCategory === 'All' ? 'Featured Catalog' : selectedCategory}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Showing {filteredProducts.length} items with live warehouse stock guarantees
                  </p>
                </div>

                {/* Mobile Search Input */}
                <div className="w-full sm:w-64 md:hidden">
                  <div className="flex items-center bg-[#1d2030] border border-[#ff9e64]/50 rounded-2xl px-3 py-2">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search catalog..."
                      className="bg-transparent text-xs text-white focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Neon Folder Grid of Products */}
              {filteredProducts.length === 0 ? (
                <NotchedFolderCard
                  accent="cyan"
                  title="No matching products found"
                  subtitle="Try increasing your price slider or clearing the search filter."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => {
                    const selectedQty = cardQuantities[product.product_id] || 1;
                    const theme = NEON_THEMES[product.accent] || NEON_THEMES.cyan;
                    const whDetails = productInventory
                      .filter((r) => r.product_id === product.product_id && r.stock_level > 0)
                      .map((r) => {
                        const loc = locations.find((l) => l.location_id === r.location_id);
                        return `${loc?.warehouse_name.split(' ')[0]}: ${r.stock_level}`;
                      })
                      .join(' • ');

                    return (
                      <NotchedFolderCard
                        key={product.product_id}
                        accent={product.accent}
                        icon={Package}
                        title={product.product_name}
                        subtitle={`${product.brand} • ${product.category_name}`}
                        rightBadge={`₹${product.price.toLocaleString('en-IN')}`}
                      >
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 min-h-[32px]">
                          {product.description}
                        </p>

                        {/* Warehouse Stock Pill */}
                        <div className="mt-3 px-3 py-1.5 rounded-xl bg-[#1c1f2e] border border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{whDetails || 'Out of stock'}</span>
                          <span
                            className={`font-semibold ${
                              product.stock_quantity > 0 ? 'text-[#9ece6a]' : 'text-[#f7768e]'
                            }`}
                          >
                            {product.stock_quantity} left
                          </span>
                        </div>

                        {/* Quantity + Add to Cart Controls */}
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex items-center bg-[#1c1f2e] rounded-xl p-1 border border-white/10">
                            <button
                              onClick={() =>
                                setCardQuantities((prev) => ({
                                  ...prev,
                                  [product.product_id]: Math.max(1, selectedQty - 1)
                                }))
                              }
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold px-2">{selectedQty}</span>
                            <button
                              onClick={() =>
                                setCardQuantities((prev) => ({
                                  ...prev,
                                  [product.product_id]: Math.min(product.stock_quantity || 1, selectedQty + 1)
                                }))
                              }
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            disabled={product.stock_quantity <= 0}
                            onClick={() => handleAddToCart(product.product_id, selectedQty)}
                            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                              product.stock_quantity > 0
                                ? theme.pillBtn
                                : 'border-slate-700 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </NotchedFolderCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: MY ORDERS, DELIVERY STEPPER, FEEDBACK & ITEM RETURNS       */}
        {/* ------------------------------------------------------------------ */}
        {activeView === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* LEFT 4 COLUMNS: Customer Profile Folder + Spend Radial Gauge */}
            <div className="lg:col-span-4 space-y-6">
              <NotchedFolderCard
                accent="cyan"
                icon={User}
                title={`${currentCustomer.first_name} ${currentCustomer.last_name}`}
                subtitle={currentCustomer.email}
                rightBadge={`Customer #${currentCustomer.customer_id}`}
              >
                <div className="mt-3 space-y-1.5 text-xs text-slate-300 bg-[#1c1f2e] p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Address:</span>
                    <span>{currentCustomer.street}, {currentCustomer.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pincode / State:</span>
                    <span>{currentCustomer.pincode} ({currentCustomer.state})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Phone:</span>
                    <span className="font-mono">{currentCustomer.phone}</span>
                  </div>
                </div>
              </NotchedFolderCard>

              {(() => {
                const deliveredCount = customerOrders.filter((o) => o.order_status === 'Delivered').length;
                const totalSpend = customerOrders.reduce((s, o) => s + o.total_amount * 1.18, 0);
                return (
                  <ConcentricRadialWidget
                    outerPct={customerOrders.length ? Math.round((deliveredCount / customerOrders.length) * 100) : 0}
                    innerPct={Math.min(100, Math.round((totalSpend / 15000) * 100))}
                    innerTitle="Total Spend (incl. 18% GST)"
                    innerSubtitle={`₹${totalSpend.toFixed(0)} spent across ${customerOrders.length} order(s)`}
                    outerTitle="Order Fulfillment Rate"
                    outerSubtitle={`${deliveredCount} Delivered || ${customerOrders.length - deliveredCount} In Progress`}
                    centerLabel={`${customerOrders.length}`}
                  />
                );
              })()}
            </div>

            {/* RIGHT 8 COLUMNS: Horizontal Pill Order Cards with Expandable Delivery & Return Controls */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between bg-[#24273a] px-5 py-4 rounded-3xl border border-white/10">
                <div>
                  <h2 className="text-xl font-extrabold italic text-white">My Orders & Returns</h2>
                  <p className="text-xs text-slate-400">
                    Click any order pill to inspect tax invoice, track live delivery, rate order, or return an item
                  </p>
                </div>
                {useLiveApi && apiStatus === 'connected' && (
                  <button
                    onClick={() => fetchCustomerOrders(activeCustomerId).catch((err) => notify('error', 'Could Not Refresh Orders', err.message))}
                    className="px-3 py-1.5 rounded-xl border border-[#7dcfff]/50 text-xs font-semibold text-[#7dcfff]"
                  >Refresh Tracking</button>
                )}
              </div>

              <div className="bg-[#24273a] px-5 py-4 rounded-3xl border border-[#bb9af7]/30 space-y-3">
                <h3 className="text-sm font-bold text-white">My Return Cart</h3>
                {customerReturns.length === 0 ? (
                  <p className="text-xs text-slate-400">You have not filed any returns.</p>
                ) : customerReturns.map((ret) => (
                  <div key={`${ret.cart_id}-${ret.serial_no}-${ret.return_cart_id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#1c1f2e] px-4 py-3 border border-white/10 text-xs">
                    <div>
                      <div className="font-semibold text-white">{ret.product_name || 'Item'} · Return #{ret.return_cart_id}</div>
                      <div className="text-slate-400">Order #{ret.order_id || '—'} · Cart #{ret.cart_id} · Serial #{ret.serial_no} · {ret.reason}</div>
                    </div>
                    <span className="text-[#bb9af7] font-semibold">
                      {ret.return_status}
                      {ret.delivery_person_id && ` · Pickup: ${deliveryPersons.find((person) => person.delivery_person_id === ret.delivery_person_id)?.name || `Courier #${ret.delivery_person_id}`}`}
                      {ret.refund_amount > 0 ? ` · ₹${ret.refund_amount} refunded` : ''}
                    </span>
                  </div>
                ))}
              </div>

              {customerOrders.length === 0 ? (
                <NotchedFolderCard
                  accent="orange"
                  title="No orders placed yet"
                  subtitle="Add items to your cart from the Storefront to place your first order."
                />
              ) : (
                customerOrders.map((ord, idx) => {
                  const inv = invoices.find((i) => i.order_id === ord.order_id);
                  const pay = inv ? payments.find((p) => p.invoice_id === inv.invoice_id) : null;
                  const driver = deliveryPersons.find((d) => d.delivery_person_id === ord.delivery_person_id);
                  const lines = orderCart.filter((l) => l.order_id === ord.order_id);
                  const orderFeedbacks = feedbacks.filter((f) => f.order_id === ord.order_id);
                  const isExpanded = expandedOrderId === ord.order_id;
                  const accents = ['cyan', 'orange', 'purple'];

                  return (
                    <NeonPillRow
                      key={ord.order_id}
                      accent={accents[idx % accents.length]}
                      icon={Package}
                      title={`Order #${ord.order_id} • ${lines.length} Item(s)`}
                      subtitle={`Placed on ${ord.order_date} • Status: ${ord.order_status} (${ord.delivery_status})`}
                      expanded={isExpanded}
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.order_id)}
                      rightContent={
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-mono font-bold text-white">
                            ₹{inv ? (inv.total_amount + inv.tax_amount).toFixed(2) : ord.total_amount.toFixed(2)}
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                              inv?.payment_status === 'Paid'
                                ? 'bg-[#9ece6a]/15 border-[#9ece6a]/50 text-[#9ece6a]'
                                : 'bg-[#ff9e64]/15 border-[#ff9e64]/50 text-[#ff9e64]'
                            }`}
                          >
                            {inv?.payment_status || 'Unpaid'}
                          </span>
                        </div>
                      }
                    >
                      <div className="space-y-5 pt-2">
                        {/* 1. Read-only 5-Step Delivery Progress Bar */}
                        <div className="bg-[#23263a] p-4 rounded-2xl border border-white/10">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="text-xs">
                              <span className="font-bold text-white">Delivery Tracking: </span>
                              <span className="text-[#7dcfff]">{ord.delivery_status}</span>
                              {driver && (
                                <span className="text-slate-400 ml-2">
                                  • Courier: {driver.name} ({driver.vehicle_no})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {inv?.payment_status !== 'Paid' ? (
                                <button
                                  onClick={() => setCheckoutModalInvoice(inv)}
                                  className="px-3 py-1 rounded-xl bg-[#ff9e64]/20 border border-[#ff9e64] text-xs font-semibold text-[#ff9e64]"
                                >
                                  Pay Invoice Now
                                </button>
                              ) : null}
                            </div>
                          </div>

                          <div className="grid grid-cols-5 gap-2">
                            {DELIVERY_STEPS.map((step, sIdx) => {
                              const currentRank = DELIVERY_STEPS.indexOf(ord.delivery_status);
                              const reached = sIdx <= currentRank;
                              return (
                                <div
                                  key={step}
                                  className={`p-2 rounded-xl border text-center text-[11px] font-medium transition ${
                                    reached
                                      ? 'bg-[#7dcfff]/15 border-[#7dcfff]/60 text-white'
                                      : 'bg-[#1b1e2e] border-white/5 text-slate-500'
                                  }`}
                                >
                                  {step}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Ordered Items & Individual Item Return Triggers */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-slate-300">
                            Order Line Items & Return Eligibility (10-Day Return Window):
                          </div>
                          {lines.map((line) => {
                            const prod = products.find((p) => p.product_id === line.product_id);
                            const itemReturns = customerReturns.filter(
                              (r) => r.cart_id === line.cart_id && r.serial_no === line.serial_no
                            );
                            const latestReturn = itemReturns.sort((a, b) => b.return_cart_id - a.return_cart_id)[0];

                            return (
                              <div
                                key={`${line.cart_id}-${line.serial_no}`}
                                className="flex flex-wrap items-center justify-between gap-3 bg-[#23263a] px-4 py-3 rounded-2xl border border-white/5"
                              >
                                <div>
                                  <div className="text-xs font-semibold text-white">
                                    {prod?.product_name} <span className="text-slate-400">× {line.quantity}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    Unit Price: ₹{line.unit_price} • Line Total: ₹{line.subtotal}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {latestReturn && (
                                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#bb9af7]/15 border border-[#bb9af7]/40 text-[#bb9af7]">
                                      Return #{latestReturn.return_cart_id}: {latestReturn.return_status}
                                      {latestReturn.refund_amount > 0 ? ` (₹${latestReturn.refund_amount})` : ''}
                                    </span>
                                  )}

                                  {ord.order_status === 'Delivered' &&
                                    (!latestReturn || latestReturn.return_status === 'Rejected') && (
                                      <button
                                        onClick={() =>
                                          setReturnModalItem({
                                            cart_id: line.cart_id,
                                            serial_no: line.serial_no,
                                            product_name: prod?.product_name,
                                            subtotal: line.subtotal
                                          })
                                        }
                                        className="px-3 py-1.5 rounded-xl border border-[#f7768e]/60 text-xs font-semibold text-[#f7768e] hover:bg-[#f7768e]/15 transition"
                                      >
                                        {latestReturn?.return_status === 'Rejected' ? 'Re-file Return' : 'Return Item'}
                                      </button>
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 3. Invoice Summary & Customer Feedback Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* GST Invoice Breakdown */}
                          {inv && (
                            <div className="bg-[#23263a] p-4 rounded-2xl border border-white/5 text-xs space-y-1.5">
                              <div className="font-bold text-white mb-2 flex items-center justify-between">
                                <span>GST Tax Invoice #{inv.invoice_id}</span>
                                <span className="text-[11px] font-mono text-[#7dcfff]">
                                  {pay ? `${pay.payment_mode} (${pay.payment_status})` : 'Unpaid'}
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Items Subtotal:</span>
                                <span className="font-mono text-slate-200">₹{inv.total_amount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>18% IGST/CGST:</span>
                                <span className="font-mono text-slate-200">+ ₹{inv.tax_amount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold text-white">
                                <span>Total Billed:</span>
                                <span className="font-mono text-[#9ece6a]">
                                  ₹{(inv.total_amount + inv.tax_amount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Order Rating & Feedback */}
                          <div className="bg-[#23263a] p-4 rounded-2xl border border-white/5 text-xs space-y-2.5">
                            <div className="font-bold text-white">Rate & Review Order</div>
                            {ord.order_status !== 'Delivered' ? (
                              <p className="text-slate-400">
                                Reviews unlock automatically once the order is marked Delivered.
                              </p>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setRatingInput(star)}
                                      className={`px-2 py-1 rounded-lg border text-xs font-bold ${
                                        ratingInput >= star
                                          ? 'bg-[#ff9e64]/20 border-[#ff9e64] text-[#ff9e64]'
                                          : 'bg-[#1b1e2e] border-white/5 text-slate-500'
                                      }`}
                                    >
                                      {star}★
                                    </button>
                                  ))}
                                  <textarea
                                    rows={3}
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder="Share delivery or packaging feedback..."
                                    className="w-full resize-y bg-[#1b1e2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleAddFeedback(ord.order_id)}
                                    disabled={!commentInput.trim()}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#9ece6a]/20 border border-[#9ece6a]/60 text-[#9ece6a] font-semibold hover:bg-[#9ece6a]/30 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    Submit Feedback
                                  </button>
                                </div>

                                {orderFeedbacks.length > 0 && (
                                  <div className="space-y-1 pt-1">
                                    {orderFeedbacks.map((fb) => (
                                      <div
                                        key={fb.feedback_id}
                                        className="flex items-center justify-between bg-[#1b1e2e] px-3 py-1.5 rounded-xl text-[11px]"
                                      >
                                        <span className="text-slate-300">"{fb.comments}"</span>
                                        <span className="text-[#ff9e64] font-bold">{fb.rating}★</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </NeonPillRow>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: STORE MANAGER / ADMIN PORTAL (Warehouses, Returns, Stock)  */}
        {/* ------------------------------------------------------------------ */}
        {activeView === 'admin' && (
          <div className="space-y-7">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-extrabold italic text-white">Order Delivery Management</h3>
                {useLiveApi && apiStatus === 'connected' && (
                  <button
                    onClick={() => fetchOrders().catch((err) => notify('error', 'Could Not Refresh Orders', err.message))}
                    className="px-3 py-1.5 rounded-xl border border-[#7dcfff]/50 text-xs font-semibold text-[#7dcfff]"
                  >Refresh Orders</button>
                )}
              </div>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400">No orders yet.</p>
              ) : orders.map((ord) => {
                const driver = deliveryPersons.find((person) => person.delivery_person_id === ord.delivery_person_id);
                const invoice = invoices.find((item) => item.order_id === ord.order_id);
                const paymentStatus = ord.payment_status || invoice?.payment_status;
                const selectedDriver = selectedDriverByOrder[ord.order_id] || deliveryPersons[0]?.delivery_person_id;
                return (
                  <div key={ord.order_id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#24273a] border border-white/10 px-4 py-3 text-xs">
                    <div>
                      <div className="font-semibold text-white">Order #{ord.order_id} · Customer #{ord.customer_id}</div>
                      <div className="text-slate-400">{ord.order_status} · {ord.delivery_status} · Payment: {paymentStatus || 'Unpaid'}</div>
                      {driver && <div className="text-[#7dcfff]">Courier: {driver.name} ({driver.vehicle_no})</div>}
                    </div>
                    {!ord.delivery_person_id && ord.delivery_status !== 'Delivered' && (
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Courier for order ${ord.order_id}`}
                          value={selectedDriver || ''}
                          onChange={(event) => setSelectedDriverByOrder((prev) => ({ ...prev, [ord.order_id]: Number(event.target.value) }))}
                          className="bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                        >
                          {deliveryPersons.map((person) => <option key={person.delivery_person_id} value={person.delivery_person_id}>{person.name} · {person.area_assigned}</option>)}
                        </select>
                        <button
                          disabled={!selectedDriver || paymentStatus !== 'Paid'}
                          onClick={() => handleAssignDriver(ord.order_id, selectedDriver)}
                          className="px-3 py-2 rounded-xl border border-[#7dcfff] text-[#7dcfff] disabled:opacity-40"
                        >Assign Courier</button>
                      </div>
                    )}
                    {ord.delivery_person_id && ord.delivery_status !== 'Delivered' && (
                      <button
                        onClick={() => handleAdvanceDeliveryStep(ord.order_id)}
                        className="px-3 py-2 rounded-xl border border-[#7dcfff] text-[#7dcfff]"
                      >Advance to {DELIVERY_STEPS[DELIVERY_STEPS.indexOf(ord.delivery_status) + 1]}</button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <ConcentricRadialWidget
                  outerPct={warehouseTelemetry.indorePct}
                  innerPct={warehouseTelemetry.pithampurPct}
                  innerTitle="Indore Central (Cap: 1000)"
                  innerSubtitle={`Used ${warehouseTelemetry.indoreUsed} || Free ${warehouseTelemetry.indoreFree}`}
                  outerTitle="Pithampur Hub (Cap: 500)"
                  outerSubtitle={`Used ${warehouseTelemetry.pithampurUsed} || Free ${warehouseTelemetry.pithampurFree}`}
                  centerLabel={`${warehouseTelemetry.totalUnits}`}
                />
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Set Warehouse Stock Level Card */}
                <NotchedFolderCard
                  accent="cyan"
                  icon={Warehouse}
                  title="Update Warehouse Stock"
                  subtitle="Synchronizes Product total across locations"
                >
                  <form onSubmit={handleAdminSetStock} className="mt-3 space-y-2.5 text-xs">
                    <select
                      value={adminStockProduct}
                      onChange={(e) => setAdminStockProduct(Number(e.target.value))}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      {products.map((p) => (
                        <option key={p.product_id} value={p.product_id}>
                          {p.product_name} (Total: {p.stock_quantity})
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={adminStockLocation}
                        onChange={(e) => setAdminStockLocation(Number(e.target.value))}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        {locations.map((l) => (
                          <option key={l.location_id} value={l.location_id}>
                            {l.warehouse_name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        value={adminStockLevel}
                        onChange={(e) => setAdminStockLevel(e.target.value)}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                        placeholder="Qty"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl border border-[#7dcfff]/60 text-[#7dcfff] hover:bg-[#7dcfff]/15 font-semibold transition"
                    >
                      Save Warehouse Stock
                    </button>
                  </form>
                </NotchedFolderCard>

                {/* Add New Product Card */}
                <NotchedFolderCard
                  accent="orange"
                  icon={Sparkles}
                  title="Launch New Product"
                  subtitle="Add item to catalog & allocate initial stock"
                >
                  <form onSubmit={handleAdminAddProduct} className="mt-3 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={newProductForm.product_name}
                        onChange={(e) => setNewProductForm({ ...newProductForm, product_name: e.target.value })}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Brand"
                        value={newProductForm.brand}
                        onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-1.5 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={newProductForm.price}
                        onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
                      />
                      <select
                        value={newProductForm.category_id}
                        onChange={(e) => setNewProductForm({ ...newProductForm, category_id: Number(e.target.value) })}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-2 py-1.5 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Stock"
                        value={newProductForm.initial_stock}
                        onChange={(e) => setNewProductForm({ ...newProductForm, initial_stock: e.target.value })}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl border border-[#ff9e64]/60 text-[#ff9e64] hover:bg-[#ff9e64]/15 font-semibold transition"
                    >
                      Publish to Storefront
                    </button>
                  </form>
                </NotchedFolderCard>

                {/* Update Catalog Price Card (PATCH /products/{product_id}) */}
                <NotchedFolderCard
                  accent="pink"
                  icon={SlidersHorizontal}
                  title="Edit Catalog Price"
                  subtitle="PATCH /products/{id} (Test Cart Price Snapshot)"
                >
                  <form onSubmit={handleAdminUpdatePrice} className="mt-3 space-y-2.5 text-xs">
                    <select
                      value={editPriceForm.product_id}
                      onChange={(e) => {
                        const pid = Number(e.target.value);
                        const p = products.find((x) => x.product_id === pid);
                        setEditPriceForm({ product_id: pid, price: p ? p.price : 499 });
                      }}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      {products.map((p) => (
                        <option key={p.product_id} value={p.product_id}>
                          {p.product_name} (Current: ₹{p.price})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editPriceForm.price}
                      onChange={(e) => setEditPriceForm({ ...editPriceForm, price: e.target.value })}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      placeholder="New Price ₹"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl border border-[#f7768e]/60 text-[#f7768e] hover:bg-[#f7768e]/15 font-semibold transition"
                    >
                      Update Product Price
                    </button>
                  </form>
                </NotchedFolderCard>

                {/* Create Department Category Card (POST /categories) */}
                <NotchedFolderCard
                  accent="purple"
                  icon={Folder}
                  title="New Department Folder"
                  subtitle="POST /categories (Unique category_name)"
                >
                  <form onSubmit={handleAdminAddCategory} className="mt-3 space-y-2.5 text-xs">
                    <input
                      type="text"
                      placeholder="Category Name (e.g., Gaming)"
                      value={newCategoryForm.category_name}
                      onChange={(e) => setNewCategoryForm({ ...newCategoryForm, category_name: e.target.value })}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Category Description"
                      value={newCategoryForm.description}
                      onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl border border-[#bb9af7]/60 text-[#bb9af7] hover:bg-[#bb9af7]/15 font-semibold transition"
                    >
                      Create Category Folder
                    </button>
                  </form>
                </NotchedFolderCard>
              </div>
            </div>

            {/* Returns & Refunds Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-extrabold italic text-white">Customer Return Requests & Refund Queue</h3>
                {useLiveApi && apiStatus === 'connected' && (
                  <button
                    onClick={async () => {
                      try {
                        await fetchReturnQueue();
                        notify('success', 'Return Queue Refreshed', 'Loaded pending requests from the database.');
                      } catch (err) {
                        notify('error', 'Could Not Refresh Returns', err.message);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#bb9af7]/50 text-xs font-semibold text-[#bb9af7] hover:bg-[#bb9af7]/10"
                  >
                    Refresh
                  </button>
                )}
              </div>
              {returns.length === 0 ? (
                <NeonPillRow
                  accent="purple"
                  icon={RotateCcw}
                  title="No active return requests"
                  subtitle="When customers file an item return from My Orders, you can Approve, Reject, or Refund it here."
                />
              ) : (
                returns.map((ret) => {
                  const line = orderCart.find((l) => l.cart_id === ret.cart_id && l.serial_no === ret.serial_no);
                  const prod = products.find((p) => p.product_id === line?.product_id);
                  return (
                    <NeonPillRow
                      key={`${ret.cart_id}-${ret.serial_no}-${ret.return_cart_id}`}
                      accent="purple"
                      icon={RotateCcw}
                      title={`${ret.product_name || prod?.product_name || 'Item'} • Return #${ret.return_cart_id}`}
                      subtitle={`Cart #${ret.cart_id} • Serial #${ret.serial_no} • Reason: "${ret.reason}"`}
                      rightContent={
                        <div className="flex items-center gap-2">
                          {ret.return_status === 'Requested' && (
                            <>
                              <button
                                onClick={() => handleReviewReturn(ret.cart_id, ret.serial_no, ret.return_cart_id, true)}
                                className="px-3 py-1.5 rounded-xl bg-[#9ece6a]/20 border border-[#9ece6a] text-xs font-semibold text-[#9ece6a]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewReturn(ret.cart_id, ret.serial_no, ret.return_cart_id, false)}
                                className="px-3 py-1.5 rounded-xl bg-[#f7768e]/20 border border-[#f7768e] text-xs font-semibold text-[#f7768e]"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {ret.return_status === 'Approved' && (
                            <>
                              {ret.delivery_person_id == null ? (
                                <>
                                  <select
                                    aria-label={`Pickup courier for return ${ret.return_cart_id}`}
                                    value={selectedDriverByReturn[`${ret.cart_id}-${ret.serial_no}-${ret.return_cart_id}`] || deliveryPersons[0]?.delivery_person_id || ''}
                                    onChange={(event) => setSelectedDriverByReturn((prev) => ({
                                      ...prev,
                                      [`${ret.cart_id}-${ret.serial_no}-${ret.return_cart_id}`]: Number(event.target.value)
                                    }))}
                                    className="bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-white"
                                  >
                                    {deliveryPersons.map((person) => <option key={person.delivery_person_id} value={person.delivery_person_id}>{person.name} · {person.area_assigned}</option>)}
                                  </select>
                                  <button
                                    disabled={deliveryPersons.length === 0}
                                    onClick={() => handleAssignReturnDriver(
                                      ret.cart_id, ret.serial_no, ret.return_cart_id,
                                      selectedDriverByReturn[`${ret.cart_id}-${ret.serial_no}-${ret.return_cart_id}`] || deliveryPersons[0].delivery_person_id
                                    )}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#7dcfff]/20 border border-[#7dcfff] text-xs font-semibold text-[#7dcfff] disabled:opacity-40"
                                  >Assign Pickup Courier</button>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs text-[#7dcfff]">
                                    Courier: {deliveryPersons.find((person) => person.delivery_person_id === ret.delivery_person_id)?.name || `#${ret.delivery_person_id}`}
                                  </span>
                                  <button
                                    onClick={() => handleCompleteRefund(ret.cart_id, ret.serial_no, ret.return_cart_id, ret.delivery_person_id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#7dcfff]/20 border border-[#7dcfff] text-xs font-semibold text-[#7dcfff]"
                                  >Issue Refund</button>
                                </>
                              )}
                            </>
                          )}
                          {ret.return_status === 'Refunded' && (
                            <span className="text-xs font-mono text-[#9ece6a]">
                              Refunded ₹{ret.refund_amount}
                            </span>
                          )}
                        </div>
                      }
                    />
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* SLIDE-OVER SHOPPING CART DRAWER (Transactions #2, #3, #4, #5)        */}
      {/* ==================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#222538] h-full border-l border-[#ff9e64]/40 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-extrabold italic text-white">My Shopping Cart</h3>
                  <p className="text-xs text-slate-400">
                    Customer: {currentCustomer.first_name} {currentCustomer.last_name}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#1b1e2e] flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="mt-5 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {openCartLines.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    Your shopping cart is empty. Browse the catalog to add items!
                  </div>
                ) : (
                  openCartLines.map((item) => (
                    <div
                      key={`${item.cart_id}-${item.serial_no}`}
                      className="p-3.5 rounded-2xl bg-[#2a2e45] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.product_name}</div>
                        <div className="text-[11px] font-mono text-[#7dcfff] mt-0.5">
                          ₹{item.unit_price} × {item.quantity} = ₹{item.subtotal.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#1c1f2e] rounded-xl p-1 border border-white/10">
                          <button
                            onClick={() => handleUpdateCartQuantity(item.cart_id, item.serial_no, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono px-2 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateCartQuantity(item.cart_id, item.serial_no, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleUpdateCartQuantity(item.cart_id, item.serial_no, 0)}
                          className="p-1.5 text-[#f7768e] hover:bg-[#f7768e]/15 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Footer Summary & Checkout Trigger */}
            {openCartLines.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-white">₹{openCartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated 18% GST:</span>
                    <span className="font-mono text-[#7dcfff]">+ ₹{(openCartTotal * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Payable Total:</span>
                    <span className="font-mono text-[#9ece6a]">₹{(openCartTotal * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutAndInvoice}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7dcfff] to-[#bb9af7] text-slate-950 font-extrabold text-xs tracking-wide shadow-[0_0_25px_rgba(125,207,255,0.4)] hover:opacity-95 transition"
                >
                  Checkout & Generate Tax Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PAYMENT GATEWAY MODAL (Transactions #6 & #7)                         */}
      {/* ==================================================================== */}
      {checkoutModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#24273a] border border-[#7dcfff]/60 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold italic text-white">
                  Invoice #{checkoutModalInvoice.invoice_id} Payment
                </h3>
                <p className="text-xs text-slate-400">Order #{checkoutModalInvoice.order_id} • 18% GST Included</p>
              </div>
              <button
                onClick={() => setCheckoutModalInvoice(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#1c1f2e] p-4 rounded-2xl border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Order Base Amount:</span>
                <span>₹{checkoutModalInvoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#7dcfff]">
                <span>18% GST Tax:</span>
                <span>+ ₹{checkoutModalInvoice.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-[#9ece6a]">
                <span>Total Amount Due:</span>
                <span>
                  ₹{(checkoutModalInvoice.total_amount + checkoutModalInvoice.tax_amount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold">Select Payment Mode:</label>
              <div className="grid grid-cols-4 gap-2">
                {['UPI', 'Card', 'Wallet', 'COD'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedPaymentMode(mode)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition ${
                      selectedPaymentMode === mode
                        ? 'bg-[#7dcfff]/20 border-[#7dcfff] text-white'
                        : 'bg-[#1c1f2e] border-white/10 text-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="rounded accent-[#f7768e]"
              />
              Simulate Gateway Failure (Test Failed → Retry flow)
            </label>

            <button
              onClick={handleProcessPayment}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff9e64] to-[#f7768e] text-slate-950 font-extrabold text-xs shadow-lg"
            >
              Pay ₹{(checkoutModalInvoice.total_amount + checkoutModalInvoice.tax_amount).toFixed(2)} via {selectedPaymentMode}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ITEM RETURN REQUEST MODAL (Transaction #11)                          */}
      {/* ==================================================================== */}
      {returnModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#24273a] border border-[#f7768e]/60 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold italic text-white">Request Item Return</h3>
              <button onClick={() => setReturnModalItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Returning: <strong>{returnModalItem.product_name}</strong> (Max Refund: ₹{returnModalItem.subtotal})
            </p>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Select Reason for Return:</label>
              <select
                value={selectedReturnReason}
                onChange={(e) => setSelectedReturnReason(e.target.value)}
                className="w-full bg-[#1c1f2e] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                {ALLOWED_RETURN_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleConfirmReturnRequest}
              className="w-full py-2.5 rounded-2xl bg-[#f7768e] text-slate-950 font-bold text-xs"
            >
              Submit Return Request
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FASTAPI CONNECTION MODAL (FOR CONNECTING TO PYTHON BACKEND)          */}
      {/* ==================================================================== */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#24273a] border border-[#bb9af7]/60 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">FastAPI Backend Connection (`main.py`)</h3>
              <button onClick={() => setShowApiModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connected to your friend&apos;s <code className="text-[#7dcfff]">main.py</code> endpoints. Last request: <code className="text-[#9ece6a]">{lastApiCall}</code>
            </p>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full bg-[#1c1f2e] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white"
            />
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
                className="rounded accent-[#7dcfff]"
              />
              Enable Live FastAPI Requests (Auto-falls back to Local DB if server is off)
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => syncFromFastApi(activeCustomerId)}
                className="px-4 py-2 rounded-xl bg-[#7dcfff]/20 border border-[#7dcfff] text-xs font-semibold text-[#7dcfff]"
              >
                Ping `/health` & Sync Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
