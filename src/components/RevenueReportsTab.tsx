import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, Vendor } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { 
  TrendingUp, 
  IndianRupee, 
  Percent, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight, 
  Download, 
  Filter, 
  Clock,
  ArrowUpDown,
  DollarSign,
  ShieldAlert,
  Sliders,
  Sparkles,
  PieChart,
  BarChart4,
  ArrowLeft
} from 'lucide-react';

interface RevenueReportsTabProps {
  activeLanguage?: Language;
  orders: Order[];
  vendors: Vendor[];
}

export default function RevenueReportsTab({ activeLanguage = 'en', orders, vendors }: RevenueReportsTabProps) {
  const t = TRANSLATIONS[activeLanguage];
  const [filterVendor, setFilterVendor] = useState<string>('all');
  const [filterDays, setFilterDays] = useState<number>(30);
  const [sortField, setSortField] = useState<'date' | 'revenue' | 'commission'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter completed / delivered orders
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  // Calculate stats based on filters
  const processedReportData = deliveredOrders.map(o => {
    const vendor = vendors.find(v => v.id === o.vendorId);
    const commRate = vendor ? vendor.commissionRate : 15;
    const commission = (o.subtotal * commRate) / 100;
    const gst = commission * 0.18; // 18% GST simulated
    const netEarnings = commission + o.platformFee;

    return {
      orderId: o.id,
      customerName: o.customerName,
      vendorName: vendor ? vendor.name : 'Unknown Merchant',
      vendorId: o.vendorId,
      subtotal: o.subtotal,
      total: o.total,
      commissionRate: commRate,
      commissionAmount: commission,
      platformFee: o.platformFee,
      gstAmount: gst,
      netRevenue: netEarnings,
      date: o.createdAt || 'Today'
    };
  });

  const filteredData = processedReportData.filter(item => {
    if (filterVendor !== 'all' && item.vendorId !== filterVendor) return false;
    return true;
  });

  // Sort logic
  const sortedData = [...filteredData].sort((a, b) => {
    let valA: any = a.date;
    let valB: any = b.date;

    if (sortField === 'revenue') {
      valA = a.total;
      valB = b.total;
    } else if (sortField === 'commission') {
      valA = a.netRevenue;
      valB = b.netRevenue;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Totals
  const totalGrossRevenue = filteredData.reduce((sum, item) => sum + item.total, 0);
  const totalPlatformCommissions = filteredData.reduce((sum, item) => sum + item.commissionAmount, 0);
  const totalPlatformFeesCollected = filteredData.reduce((sum, item) => sum + item.platformFee, 0);
  const totalGstSettled = filteredData.reduce((sum, item) => sum + item.gstAmount, 0);
  const totalNetCorporateEarnings = totalPlatformCommissions + totalPlatformFeesCollected;

  const handleSort = (field: 'date' | 'revenue' | 'commission') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6" id="revenue-reports-viewport">
      
      {/* Back button row */}
      <div className="flex items-center">
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all shadow-3xs group"
        >
          <ArrowLeft size={14} className="stroke-[2.5px] group-hover:-translate-x-0.5 transition-transform text-indigo-600" />
          <span>{t.back} to {activeLanguage === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Financial Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Corporate Revenue Report
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Detailed tracking of gross transaction volumes, merchant commission settlements, platform service charges, and integrated GST registries.
            </p>
          </div>

          <button 
            onClick={() => alert('Report spreadsheet downloaded successfully in simulated format.')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 self-start sm:self-center transition-all shadow-md"
          >
            <Download size={14} />
            Export Ledger
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Gross Volume</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                ₹{totalGrossRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
              <IndianRupee size={20} className="stroke-[2.5px]" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1 font-medium">
            <ArrowUpRight size={12} className="text-emerald-500" />
            100% processed through checkout portal
          </p>
        </div>

        {/* KPI 2: Corporate Net Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Net Revenue</span>
              <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">
                ₹{totalNetCorporateEarnings.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
              <Percent size={20} className="stroke-[2.5px]" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium">
            Comprising merchant cuts + platform flat fees
          </p>
        </div>

        {/* KPI 3: Platform Service Fees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Service Fees</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                ₹{totalPlatformFeesCollected.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
              <Sliders size={20} className="stroke-[2px]" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium">
            Flat charge collections per customer checkout
          </p>
        </div>

        {/* KPI 4: GST Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total GST</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                ₹{totalGstSettled.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
              <Sparkles size={20} className="stroke-[2px]" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium">
            18% state-regulated tax on platform margins
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={14} className="text-indigo-600" />
              Filter Analytics
            </h3>

            {/* Merchant Filter */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-400 uppercase">Merchant Partner</label>
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                <option value="all">All Vendor Merchants</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Range selection */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-400 uppercase">Time Range Limit</label>
              <div className="grid grid-cols-2 gap-2">
                {[7, 30].map(days => (
                  <button
                    key={days}
                    onClick={() => setFilterDays(days)}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      filterDays === days 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Last {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-[11px] text-slate-500 leading-normal">
              <p className="font-bold text-slate-700">Aesthetic Analytics Note:</p>
              <p>Filters dynamically adjust gross margins, platform commissions, service charge counts, and regional taxation variables in real-time across the active delivery lifecycle.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Settlement Ledger */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Revenue Settlement Ledger</h3>
                <p className="text-[10px] text-slate-400">Chronological transaction logs with split billing breakdown</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSort('date')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                    sortField === 'date' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Clock size={10} /> Date
                </button>
                <button
                  onClick={() => handleSort('revenue')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                    sortField === 'revenue' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <IndianRupee size={10} /> Amount
                </button>
                <button
                  onClick={() => handleSort('commission')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                    sortField === 'commission' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Percent size={10} /> Platform Margin
                </button>
              </div>
            </div>

            {sortedData.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No revenue records found matching selected filters.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedData.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                          {item.orderId}
                        </span>
                        <span className="font-semibold text-slate-700">{item.vendorName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>Customer: <strong>{item.customerName}</strong></span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-800 block">
                        ₹{item.total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        +₹{item.netRevenue.toFixed(1)} Platform Profit
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
