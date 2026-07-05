import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Rider, Customer, Vendor, AreaZone } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  Bike, 
  RotateCcw, 
  Play, 
  Pause,
  Compass,
  Zap,
  Info,
  Navigation,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// ==========================================
// Address lookup map for Bhopal nodes to get highly detailed coordinates and names
// ==========================================
export const VENDOR_ADDRESS_MAP: Record<string, string> = {
  'VND-001': 'Zone-II, Maharana Pratap Nagar, Bhopal, Madhya Pradesh, India',
  'VND-002': 'Hamidia Road, near Bhopal Junction railway station, Bhopal, Madhya Pradesh, India',
  'VND-003': 'Indian Coffee House, TT Nagar, Bhopal, Madhya Pradesh, India',
  'VND-004': 'Sharma & Vishnu Fast Food, Indrapuri Sector C, Bhopal, Madhya Pradesh, India',
};

export const CUSTOMER_ADDRESS_MAP: Record<string, string> = {
  'CUST-101': 'Arera Colony E-7, Bhopal, Madhya Pradesh, India',
  'CUST-102': 'Chunabhatti, Near Shahpura Lake, Bhopal, Madhya Pradesh, India',
  'CUST-103': 'Kotra Sultanabad, Bhopal, Madhya Pradesh, India',
  'CUST-104': 'BHEL Colony, Piplani, Bhopal, Madhya Pradesh, India',
  'CUST-105': 'Kolar Heights, Kolar Road, Bhopal, Madhya Pradesh, India',
};

// ==========================================
// 1. ORDER PIPELINE MANAGEMENT COMPONENT
// ==========================================
interface OrderManagementTabProps {
  activeLanguage?: Language;
  orders: Order[];
  riders: Rider[];
  customers: Customer[];
  vendors: Vendor[];
  zones: AreaZone[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onUpdateRider: (updatedRider: Rider) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onUpdateVendor: (updatedVendor: Vendor) => void;
}

export function OrderManagementTab(props: OrderManagementTabProps) {
  const { activeLanguage = 'en', orders, riders, customers, vendors, zones = [], onUpdateOrder, onUpdateRider, onUpdateCustomer, onUpdateVendor } = props;
  const t = TRANSLATIONS[activeLanguage];
  const [activePipelineTab, setActivePipelineTab] = useState<OrderStatus>('New');
  const [assigningRiderOrderId, setAssigningRiderOrderId] = useState<string | null>(null);
  const [manualMatchOrderId, setManualMatchOrderId] = useState<string | null>(null);

  // Auto-Assignment Engine persistent toggling
  const [isAutoAssignActive, setIsAutoAssignActive] = useState<boolean>(() => {
    return localStorage.getItem('auto_assign_riders') === 'true';
  });

  const [assignmentLogs, setAssignmentLogs] = useState<string[]>(() => {
    return [
      `[${new Date().toLocaleTimeString()}] 📡 Multi-Zone Dispatcher Engine initialized. Standing by...`,
      `[${new Date().toLocaleTimeString()}] 🗺️ Bhopal Metropolitan Grid system ready.`
    ];
  });

  useEffect(() => {
    localStorage.setItem('auto_assign_riders', isAutoAssignActive ? 'true' : 'false');
  }, [isAutoAssignActive]);

  // Bhopal Metropolitan Grid - coordinate helpers
  const getVendorCoords = (vendorId: string) => {
    switch (vendorId) {
      case 'VND-001': return { x: 75, y: 48 }; // MP Nagar
      case 'VND-002': return { x: 40, y: 45 }; // Hamidia Road
      case 'VND-003': return { x: 45, y: 51 }; // TT Nagar
      case 'VND-004': return { x: 85, y: 25 }; // Indrapuri
      default: return { x: 50, y: 50 };
    }
  };

  const getCustomerCoords = (customerId: string) => {
    switch (customerId) {
      case 'CUST-101': return { x: 70, y: 75 }; // Arera Colony E-7
      case 'CUST-102': return { x: 55, y: 78 }; // Chunabhatti
      case 'CUST-103': return { x: 45, y: 90 }; // Kotra Sultanabad
      case 'CUST-104': return { x: 82, y: 25 }; // BHEL Colony
      case 'CUST-105': return { x: 45, y: 88 }; // Kolar Road
      default: return { x: 50, y: 50 };
    }
  };

  const getClosestZoneId = (x: number, y: number) => {
    const zoneCenters: Record<string, { x: number; y: number }> = {
      'ZONE-A': { x: 75, y: 48 },  // MP Nagar
      'ZONE-B': { x: 65, y: 70 },  // Arera Colony
      'ZONE-C': { x: 45, y: 88 },  // Kolar Road
      'ZONE-D': { x: 82, y: 25 },  // BHEL & Indrapuri
      'ZONE-E': { x: 40, y: 45 },  // Old Bhopal
    };

    let minDistance = Infinity;
    let closestId = 'ZONE-A';

    for (const zoneId of Object.keys(zoneCenters)) {
      const center = zoneCenters[zoneId];
      const dist = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closestId = zoneId;
      }
    }
    return closestId;
  };

  const computeRiderMatches = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return [];

    const vendorCoords = getVendorCoords(order.vendorId);
    const orderZoneId = getClosestZoneId(vendorCoords.x, vendorCoords.y);

    return riders
      .filter(r => r.status === 'Online' && r.approvalStatus === 'Approved' && !r.isSuspended)
      .map(rider => {
        const rCoords = rider.currentLocation || { x: 50, y: 50 };
        const riderZoneId = getClosestZoneId(rCoords.x, rCoords.y);
        const rZone = zones.find(z => z.id === riderZoneId);
        const isRiderZoneActive = rZone ? rZone.status === 'Active' : true;

        const distance = Math.sqrt(Math.pow(rCoords.x - vendorCoords.x, 2) + Math.pow(rCoords.y - vendorCoords.y, 2));
        
        let score = 100;
        let reasons: string[] = [];

        if (riderZoneId === orderZoneId) {
          score += 15;
          reasons.push('Same Zone Match (+15)');
        } else {
          score -= 20;
          reasons.push('Cross-Zone Dispatch (-20)');
        }

        const distPenalty = Math.round(distance * 2);
        score -= distPenalty;
        reasons.push(`Distance Penalty (-${distPenalty})`);

        const activeOrdersCount = orders.filter(o => o.riderId === rider.id && ['Preparing', 'Ready', 'Picked'].includes(o.status)).length;
        if (activeOrdersCount > 0) {
          const loadPenalty = activeOrdersCount * 25;
          score -= loadPenalty;
          reasons.push(`Active Load Penalty: ${activeOrdersCount} orders (-${loadPenalty})`);
        } else {
          score += 10;
          reasons.push('Rider Idle / High Availability (+10)');
        }

        if (!isRiderZoneActive) {
          score = -999;
          reasons.push('CRITICAL: Rider zone is disabled!');
        }

        return {
          rider,
          score,
          distance,
          riderZoneName: rZone?.name || 'Bhopal Grid',
          riderZoneId,
          isEligible: score > -500,
          reasons
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const autoAssignSingleOrder = (orderId: string, silent = false) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const matches = computeRiderMatches(orderId);
    const eligibleMatches = matches.filter(m => m.isEligible);

    if (eligibleMatches.length === 0) {
      if (!silent) {
        alert(`Could not find any eligible online riders in active zones for order ${orderId}. Please make sure at least one approved rider is Online.`);
      }
      return false;
    }

    const bestMatch = eligibleMatches[0];
    const bestRider = bestMatch.rider;

    handleAssignRiderSubmit(orderId, bestRider.id);

    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] 🧠 Order ${orderId} matched with ${bestRider.name} (Zone: ${bestMatch.riderZoneName}, Distance: ${bestMatch.distance.toFixed(1)} units, Score: ${bestMatch.score})`;
    setAssignmentLogs(prev => [logMsg, ...prev]);

    return true;
  };

  const handleBulkAutoAssign = () => {
    const acceptedUnassigned = orders.filter(o => o.status === 'Accepted' && !o.riderId);
    if (acceptedUnassigned.length === 0) {
      alert('There are no accepted, unassigned orders to match at this moment.');
      return;
    }

    let count = 0;
    acceptedUnassigned.forEach(order => {
      const success = autoAssignSingleOrder(order.id, true);
      if (success) count++;
    });

    alert(`Processed dispatcher matching queue: Automatically assigned ${count} out of ${acceptedUnassigned.length} orders to optimal nearby riders.`);
  };

  // Run dynamic automatic assignment when orders update and auto assignment is toggled ON
  useEffect(() => {
    if (!isAutoAssignActive) return;

    const acceptedUnassigned = orders.filter(o => o.status === 'Accepted' && !o.riderId);
    if (acceptedUnassigned.length === 0) return;

    const targetOrder = acceptedUnassigned[0];
    autoAssignSingleOrder(targetOrder.id, true);
  }, [orders, isAutoAssignActive]);

  const pipelineTabs: OrderStatus[] = ['New', 'Accepted', 'Preparing', 'Ready', 'Picked', 'Delivered', 'Cancelled', 'Refunded'];

  const filteredOrders = orders.filter(o => o.status === activePipelineTab);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Preparing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Ready': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Picked': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const handleAcceptOrder = (order: Order) => {
    onUpdateOrder({
      ...order,
      status: 'Accepted'
    });
  };

  const handleCancelOrder = (order: Order) => {
    onUpdateOrder({
      ...order,
      status: 'Cancelled'
    });
  };

  const handleDispatchOrder = (order: Order) => {
    onUpdateOrder({
      ...order,
      status: 'Picked'
    });
  };

  // Handles moving order to Delivered, adding commission earnings to admin stats,
  // credit earnings to rider's wallet, and settling vendor commission payout wallet balance.
  const handleDeliverOrder = (order: Order) => {
    const updatedOrder: Order = { ...order, status: 'Delivered' };
    onUpdateOrder(updatedOrder);

    // Credit Rider Earnings
    if (order.riderId) {
      const rider = riders.find(r => r.id === order.riderId);
      if (rider) {
        onUpdateRider({
          ...rider,
          earnings: rider.earnings + 40 // Flat delivery incentive ₹40
        });
      }
    }

    // Credit Vendor Wallet (Subtotal - Commission)
    const vendor = vendors.find(v => v.id === order.vendorId);
    if (vendor) {
      const commissionPercentage = vendor.commissionRate;
      const commissionAmount = (order.subtotal * commissionPercentage) / 100;
      const vendorShare = order.subtotal - commissionAmount;

      onUpdateVendor({
        ...vendor,
        walletBalance: vendor.walletBalance + vendorShare
      });
    }
  };

  const handleRefundOrder = (order: Order) => {
    // Return money to customer wallet
    const customer = customers.find(c => c.id === order.customerId);
    if (customer) {
      onUpdateCustomer({
        ...customer,
        walletBalance: customer.walletBalance + order.total
      });
    }

    // Deduct vendor wallet if already delivered
    if (order.status === 'Delivered') {
      const vendor = vendors.find(v => v.id === order.vendorId);
      if (vendor) {
        const commissionPercentage = vendor.commissionRate;
        const commissionAmount = (order.subtotal * commissionPercentage) / 100;
        const vendorShare = order.subtotal - commissionAmount;

        onUpdateVendor({
          ...vendor,
          walletBalance: Math.max(0, vendor.walletBalance - vendorShare)
        });
      }
    }

    onUpdateOrder({
      ...order,
      status: 'Refunded'
    });

    alert(`Refund processed successfully: ₹${order.total} has been returned to ${order.customerName}'s in-app wallet balance.`);
  };

  const handleAssignRiderSubmit = (orderId: string, riderId: string) => {
    const order = orders.find(o => o.id === orderId);
    const rider = riders.find(r => r.id === riderId);
    
    if (order && rider) {
      onUpdateOrder({
        ...order,
        status: 'Preparing',
        riderId: rider.id,
        riderName: rider.name,
        tracking: {
          riderX: rider.currentLocation?.x || 50,
          riderY: rider.currentLocation?.y || 50,
          restaurantX: order.vendorId === 'VND-001' ? 75 : order.vendorId === 'VND-002' ? 40 : order.vendorId === 'VND-003' ? 45 : 85,
          restaurantY: order.vendorId === 'VND-001' ? 48 : order.vendorId === 'VND-002' ? 45 : order.vendorId === 'VND-003' ? 51 : 25,
          customerX: order.customerId === 'CUST-101' ? 70 : order.customerId === 'CUST-102' ? 55 : 45,
          customerY: order.customerId === 'CUST-101' ? 75 : order.customerId === 'CUST-102' ? 78 : 90,
          path: []
        }
      });
      setAssigningRiderOrderId(null);
    }
  };

  const handleMarkReady = (order: Order) => {
    onUpdateOrder({
      ...order,
      status: 'Ready'
    });
  };

  const getOnlineRiders = () => {
    return riders.filter(r => r.status === 'Online' && r.approvalStatus === 'Approved');
  };

  return (
    <div className="space-y-6" id="order-pipeline-tab">
      {/* Tab bar header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-indigo-600" size={20} />
            Master Orders Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Approve, dispatch, track, and process refunds for live delivery nodes</p>
        </div>
      </div>

      {/* 🧠 SMART DISPATCH & MULTI-ZONE RIDER MATCHER PANEL */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Zap className="animate-pulse" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                🧠 Smart Dispatch & Multi-Zone Matcher Engine
                <span className={`h-2.5 w-2.5 rounded-full ${isAutoAssignActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Automates nearby rider routing across active Bhopal zones with cross-load balancing.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto self-stretch lg:self-auto justify-end">
            <button
              onClick={handleBulkAutoAssign}
              className="flex-1 lg:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-900/30"
            >
              🚀 Bulk Auto-Assign Now
            </button>
            <button
              onClick={() => setIsAutoAssignActive(!isAutoAssignActive)}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                isAutoAssignActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isAutoAssignActive ? '🟢 Engine Active' : '⚪ Engine Standing By'}
            </button>
          </div>
        </div>

        {/* Dispatcher Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Col 1: Zone Status & Rider Presence */}
          <div className="bg-slate-950/40 border border-slate-800/85 rounded-xl p-3.5 space-y-2.5">
            <h4 className="font-extrabold text-[10px] tracking-wider text-slate-400 uppercase">Active Zone Presence Matrix</h4>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin">
              {zones.map(zone => {
                const zoneRiders = riders.filter(r => {
                  if (r.status !== 'Online' || r.approvalStatus !== 'Approved') return false;
                  const coords = r.currentLocation || { x: 50, y: 50 };
                  return getClosestZoneId(coords.x, coords.y) === zone.id;
                });
                const isActive = zone.status === 'Active';
                return (
                  <div key={zone.id} className="flex items-center justify-between p-1 bg-slate-900/40 rounded border border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      <span className="font-bold text-[11px] truncate max-w-[120px]" title={zone.name}>{zone.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1 py-0.2 rounded">{zone.id}</span>
                      <span className="font-mono text-[11px] font-bold text-indigo-300">{zoneRiders.length} 🏍️</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 2: Dispatcher Live Activity Logs Terminal */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 flex flex-col justify-between md:col-span-2">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
              <span className="font-mono font-bold text-[10px] tracking-wider text-indigo-400 uppercase">Live Routing & Telemetry Stream</span>
              <button 
                onClick={() => setAssignmentLogs([`[${new Date().toLocaleTimeString()}] 🧹 Logs cleared.`])}
                className="text-[9px] hover:text-white text-slate-500 underline font-mono"
              >
                Clear Stream
              </button>
            </div>
            <div className="mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[10px] text-slate-300 space-y-1.5 h-[110px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {assignmentLogs.map((log, idx) => (
                <div key={idx} className="leading-normal break-all">
                  <span className="text-slate-500">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Horizon Horizontal Scroll Pipeline Stages */}
      <div className="overflow-x-auto pb-2 border-b border-slate-100">
        <div className="flex gap-2 min-w-max" id="pipeline-scroll-tabs">
          {pipelineTabs.map(tab => {
            const count = orders.filter(o => o.status === tab).length;
            const isActive = activePipelineTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActivePipelineTab(tab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Stage Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="orders-cards-grid">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-100">
            No orders currently in <strong>{activePipelineTab}</strong> status.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-slate-150 shadow-xs overflow-hidden flex flex-col justify-between">
              {/* Card Header */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-800 block text-sm">{order.id}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5 text-xs flex-1">
                {/* Items and Store */}
                <div>
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Store Card</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{order.vendorName}</span>
                  <div className="mt-2 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-600">
                        <span>{item.name} <strong className="text-slate-400">x{item.quantity}</strong></span>
                        <span className="font-mono font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Customer and Delivery address */}
                <div>
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Delivery Path</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{order.customerName}</span>
                  <p className="text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </p>
                  <div className="mt-2.5">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(VENDOR_ADDRESS_MAP[order.vendorId] || (order.vendorName + ', Bhopal, India'))}&destination=${encodeURIComponent(CUSTOMER_ADDRESS_MAP[order.customerId] || order.deliveryAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-indigo-50/70 hover:bg-indigo-100/90 text-indigo-700 border border-indigo-100 hover:border-indigo-200 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer"
                    >
                      <Navigation size={10} className="transform rotate-45 text-indigo-600" /> Route on Google Maps Online 🚀
                    </a>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Rider Info */}
                <div>
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Rider Agent</span>
                  {order.riderName ? (
                    <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-bold">
                      <Bike size={13} className="text-slate-500" />
                      <span>{order.riderName}</span>
                    </div>
                  ) : (
                    <span className="text-rose-600 block mt-1 font-bold">No rider assigned</span>
                  )}
                </div>

                <hr className="border-slate-100" />

                {/* Bill Breakdown */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-[11px] font-medium text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-700">₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-mono font-bold text-slate-700">₹{order.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST + Admin Fee:</span>
                    <span className="font-mono font-bold text-slate-700">₹{(order.gst + order.platformFee).toFixed(1)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Promo Savings:</span>
                      <span className="font-mono font-bold">-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-800 font-bold text-xs pt-1 border-t border-dashed border-slate-200">
                    <span>Paid via {order.paymentMethod}:</span>
                    <span className="font-mono text-slate-900">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                {order.status === 'New' && (
                  <>
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="flex-1 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAcceptOrder(order)}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                    >
                      Accept Order
                    </button>
                  </>
                )}

                {order.status === 'Accepted' && (
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => setAssigningRiderOrderId(order.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Bike size={14} /> Assign Rider Manually
                    </button>
                    <button
                      onClick={() => setManualMatchOrderId(order.id)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Zap size={14} className="animate-pulse text-yellow-300" /> ✨ Auto-Assign Best Rider
                    </button>
                  </div>
                )}

                {order.status === 'Preparing' && (
                  <button
                    onClick={() => handleMarkReady(order)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
                  >
                    Mark as Food Ready
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button
                    onClick={() => handleDispatchOrder(order)}
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold"
                  >
                    Dispatch / Handover to Rider
                  </button>
                )}

                {order.status === 'Picked' && (
                  <button
                    onClick={() => handleDeliverOrder(order)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Confirm Delivery
                  </button>
                )}

                {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                  <button
                    onClick={() => handleRefundOrder(order)}
                    className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-bold"
                  >
                    Process Refund to Customer Wallet
                  </button>
                )}

                {order.status === 'Refunded' && (
                  <div className="w-full text-center py-2 text-[11px] text-slate-400 font-semibold bg-slate-100 rounded-lg">
                    Full Amount Refunded
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Rider Drawer Overlay */}
      {assigningRiderOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Assign Rider Partner</h3>
              <button onClick={() => setAssigningRiderOrderId(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="mt-4 space-y-2 max-h-[250px] overflow-y-auto">
              {getOnlineRiders().length === 0 ? (
                <p className="text-center text-slate-400 py-6 text-xs">No online rider agents available. Move a rider online in Rider tab.</p>
              ) : (
                getOnlineRiders().map(rider => (
                  <button
                    key={rider.id}
                    onClick={() => handleAssignRiderSubmit(assigningRiderOrderId, rider.id)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 hover:border-indigo-300 rounded-xl text-left text-xs flex items-center justify-between transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{rider.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{rider.vehicleNumber} ({rider.vehicleType})</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">On Duty</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🧠 SMART AUTO-ASSIGN COMPARISON MODAL */}
      {manualMatchOrderId && (() => {
        const order = orders.find(o => o.id === manualMatchOrderId);
        if (!order) return null;
        
        const matches = computeRiderMatches(manualMatchOrderId);
        const optimalMatch = matches.find(m => m.isEligible);
        const vendorCoords = getVendorCoords(order.vendorId);
        const orderZoneId = getClosestZoneId(vendorCoords.x, vendorCoords.y);
        const orderZone = zones.find(z => z.id === orderZoneId);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="text-indigo-400 animate-pulse" size={18} />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Smart Match Dispatcher</h3>
                    <p className="text-[10px] text-slate-400">Order Ref: <span className="font-mono text-indigo-300 font-bold">{order.id}</span></p>
                  </div>
                </div>
                <button onClick={() => setManualMatchOrderId(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Order Info Summary */}
              <div className="p-4 bg-slate-950/40 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wide">Restaurant Node</span>
                  <span className="font-bold text-white block mt-0.5">{order.vendorName}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Zone: {orderZone?.name || 'Bhopal Central'} ({orderZoneId})</span>
                </div>
                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wide">Customer Node</span>
                  <span className="font-bold text-white block mt-0.5">Drop: {order.customerId}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{CUSTOMER_ADDRESS_MAP[order.customerId] || 'Delivery Node Coordinates'}</span>
                </div>
              </div>

              {/* Comparison List */}
              <div className="p-5 overflow-y-auto max-h-[350px] space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                <h4 className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">Rider Score Matching Matrix</h4>
                
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 font-medium text-xs">
                    No online approved riders found in the active workspace. Go to Riders Tab to set a rider online!
                  </div>
                ) : (
                  matches.map(match => {
                    const isOptimal = optimalMatch && optimalMatch.rider.id === match.rider.id;
                    const ratingColor = match.score >= 80 ? 'text-emerald-400' : match.score >= 50 ? 'text-indigo-400' : 'text-slate-500';
                    const progressColor = match.score >= 80 ? 'bg-emerald-500' : match.score >= 50 ? 'bg-indigo-500' : 'bg-slate-600';
                    return (
                      <div 
                        key={match.rider.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isOptimal 
                            ? 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-950/20' 
                            : 'bg-slate-950/20 border-slate-800/70 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">{match.rider.name}</span>
                            <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono font-bold">{match.rider.id}</span>
                            {isOptimal && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-extrabold rounded-full flex items-center gap-1 animate-pulse">
                                🌟 HIGHEST SUGGESTED MATCH
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                            <span>Vehicle: <strong className="text-slate-300">{match.rider.vehicleType} ({match.rider.vehicleNumber})</strong></span>
                            <span>Region: <strong className="text-indigo-300">{match.riderZoneName}</strong></span>
                            <span>Distance: <strong className="text-white">{match.distance.toFixed(1)} coords units</strong></span>
                          </div>

                          {/* Matching logic break down reasons */}
                          <div className="pt-1.5 flex flex-wrap gap-1.5">
                            {match.reasons.map((reason, idx) => (
                              <span key={idx} className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${reason.includes('+') ? 'bg-emerald-950/50 text-emerald-400' : reason.includes('disabled') || reason.includes('CRITICAL') ? 'bg-rose-950/50 text-rose-400 font-extrabold border border-rose-500/30' : 'bg-slate-850 text-slate-400'}`}>
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Dispatch Button & Score Badge */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className={`block font-mono font-extrabold text-lg ${ratingColor}`}>{match.score < -500 ? 'INELIGIBLE' : `${match.score} pts`}</span>
                            {match.score >= -500 && (
                              <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div className={`h-full ${progressColor}`} style={{ width: `${Math.max(0, Math.min(100, match.score))}%` }} />
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              handleAssignRiderSubmit(order.id, match.rider.id);
                              
                              const timestamp = new Date().toLocaleTimeString();
                              const logMsg = `[${timestamp}] 🤝 Manually dispatched order ${order.id} to ${match.rider.name} based on recommendation (Match Score: ${match.score})`;
                              setAssignmentLogs(prev => [logMsg, ...prev]);
                              setManualMatchOrderId(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all active:scale-95 ${
                              isOptimal 
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                          >
                            Assign This Rider
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Decision model prioritizes same zone active riders & proximity balance.</span>
                <button
                  onClick={() => setManualMatchOrderId(null)}
                  className="px-4 py-2 hover:bg-slate-800 text-slate-300 font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


// ==========================================
// 2. LIVE tracking MAP & SIMULATION COMPONENT
// ==========================================
interface LiveTrackingTabProps {
  activeLanguage?: Language;
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  riders: Rider[];
  onUpdateRider: (updatedRider: Rider) => void;
  onDeliverOrder: (order: Order) => void;
}

export function LiveTrackingTab(props: LiveTrackingTabProps) {
  const { activeLanguage = 'en', orders, onUpdateOrder, riders, onUpdateRider, onDeliverOrder } = props;
  const t = TRANSLATIONS[activeLanguage];
  
  // View mode switcher: 'google_navigation' (Free Google Maps directions) or 'vector_telemetry' (the original SVG Bhopal view)
  const [mapMode, setMapMode] = useState<'google_navigation' | 'vector_telemetry'>('google_navigation');
  
  // Custom navigation parameters
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customOrigin, setCustomOrigin] = useState<string>('Maharana Pratap Nagar, Bhopal, Madhya Pradesh');
  const [customDestination, setCustomDestination] = useState<string>('Chunabhatti, Near Shahpura Lake, Bhopal, Madhya Pradesh');
  const [customSearchOrigin, setCustomSearchOrigin] = useState<string>('Maharana Pratap Nagar, Bhopal, Madhya Pradesh');
  const [customSearchDestination, setCustomSearchDestination] = useState<string>('Chunabhatti, Near Shahpura Lake, Bhopal, Madhya Pradesh');

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // Speed multiplier

  // Automatic go to route google map online state
  const [autoOpenMapsOnline, setAutoOpenMapsOnline] = useState<boolean>(() => {
    return localStorage.getItem('auto_open_maps_online') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('auto_open_maps_online', autoOpenMapsOnline ? 'true' : 'false');
  }, [autoOpenMapsOnline]);

  const activeTrackingOrders = orders.filter(o => ['Preparing', 'Ready', 'Picked'].includes(o.status));

  // Set default selected order on load
  useEffect(() => {
    if (activeTrackingOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(activeTrackingOrders[0].id);
    }
  }, [activeTrackingOrders, selectedOrderId]);

  // Run simulation interval (only for vector_telemetry)
  useEffect(() => {
    if (!isSimulating || !selectedOrderId || mapMode !== 'vector_telemetry') return;

    const interval = setInterval(() => {
      const order = orders.find(o => o.id === selectedOrderId);
      if (!order || !order.tracking) return;

      const { riderX, riderY, restaurantX, restaurantY, customerX, customerY } = order.tracking;
      
      let targetX = restaurantX;
      let targetY = restaurantY;
      let phase: 'to_restaurant' | 'to_customer' = 'to_restaurant';

      // If order is picked, rider moves towards customer. Otherwise moves towards restaurant.
      if (order.status === 'Picked') {
        targetX = customerX;
        targetY = customerY;
        phase = 'to_customer';
      }

      // Step movement
      const dx = targetX - riderX;
      const dy = targetY - riderY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 2) {
        // Arrived at target!
        if (phase === 'to_restaurant') {
          // Food is ready or picked up now
          onUpdateOrder({
            ...order,
            status: 'Picked',
            tracking: {
              ...order.tracking,
              riderX: restaurantX,
              riderY: restaurantY
            }
          });
          alert(`Rider Alert: Rider arrived at restaurant ${order.vendorName} and picked up order ${order.id}. Moving to customer.`);
        } else {
          // Arrived at customer
          setIsSimulating(false);
          alert(`Delivery Arrived: Rider arrived at customer ${order.customerName}'s location. Click Complete Delivery in Order Pipeline to settle payment.`);
        }
      } else {
        // Move towards target
        const stepSize = 1.5 * simulationSpeed;
        const ratio = Math.min(1, stepSize / distance);
        const nextX = riderX + dx * ratio;
        const nextY = riderY + dy * ratio;

        onUpdateOrder({
          ...order,
          tracking: {
            ...order.tracking,
            riderX: parseFloat(nextX.toFixed(2)),
            riderY: parseFloat(nextY.toFixed(2))
          }
        });

        // Also update rider's global coordinates
        if (order.riderId) {
          const rider = riders.find(r => r.id === order.riderId);
          if (rider) {
            onUpdateRider({
              ...rider,
              currentLocation: { x: nextX, y: nextY }
            });
          }
        }
      }

    }, 3000);

    return () => clearInterval(interval);

  }, [isSimulating, selectedOrderId, orders, simulationSpeed, mapMode]);

  const trackedOrder = orders.find(o => o.id === selectedOrderId);

  // Landmarks of Bhopal
  const landmarks = [
    { name: 'Upper Lake (Bada Talaab)', x: 18, y: 50, radius: 26, color: '#93c5fd', labelOffset: -10 },
    { name: 'Lower Lake', x: 38, y: 46, radius: 10, color: '#bfdbfe', labelOffset: 0 },
    { name: 'MP Nagar Zone-II', x: 75, y: 48, icon: '🏢' },
    { name: 'Arera Colony E-7', x: 70, y: 75, icon: '🏡' },
    { name: 'Bittan Market', x: 62, y: 65, icon: '🛍️' },
    { name: 'Kolar Heights', x: 45, y: 88, icon: '🏢' },
    { name: 'Indrapuri B-Sector', x: 82, y: 25, icon: '🎓' }
  ];

  // Calculate distance and time from standard grid coordinates
  const getOrderDistanceAndTime = (order: Order) => {
    if (!order.tracking) {
      return {
        distance: '4.8 km',
        time: '12 mins',
        startAddr: order.vendorName + ', Bhopal, India',
        endAddr: order.deliveryAddress,
        restaurantX: 75,
        restaurantY: 48,
        customerX: 55,
        customerY: 78
      };
    }
    const { restaurantX, restaurantY, customerX, customerY } = order.tracking;
    const dx = customerX - restaurantX;
    const dy = customerY - restaurantY;
    const distanceUnits = Math.sqrt(dx * dx + dy * dy);
    const distanceKm = parseFloat((distanceUnits * 0.15).toFixed(1));
    const timeMins = Math.round(distanceKm * 2.5) + 3; // ~2.5 mins per km + buffer
    
    const startAddr = VENDOR_ADDRESS_MAP[order.vendorId] || (order.vendorName + ', Bhopal, India');
    const endAddr = CUSTOMER_ADDRESS_MAP[order.customerId] || order.deliveryAddress;
    
    return {
      distance: `${distanceKm} km`,
      time: `${timeMins} mins`,
      startAddr,
      endAddr,
      restaurantX,
      restaurantY,
      customerX,
      customerY
    };
  };

  // Stable estimation hash for custom address inputs
  const getCustomDistanceAndTime = (origin: string, dest: string) => {
    const combined = origin + dest;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const distanceKm = parseFloat((3.5 + (Math.abs(hash) % 95) / 10).toFixed(1));
    const timeMins = Math.round(distanceKm * 2.2) + 2;
    return {
      distance: `${distanceKm} km`,
      time: `${timeMins} mins`
    };
  };

  // Generate responsive step-by-step directions lists
  const generateNavigationSteps = (originName: string, destName: string, distanceStr: string) => {
    return [
      { instruction: `Depart from restaurant hub at "${originName.split(',')[0]}"`, distance: '0.2 km' },
      { instruction: 'Merge onto main traffic lane toward closest bypass junction', distance: '1.1 km' },
      { instruction: `Navigate along Central Link road, keeping track of optimal GPS route`, distance: `${(parseFloat(distanceStr) * 0.6).toFixed(1)} km` },
      { instruction: `Turn into the access lane for "${destName.split(',')[0]}" drop zone`, distance: '0.8 km' },
      { instruction: `Arrive securely at customer drop point: "${destName.split(',')[0]}"`, distance: '0.1 km' },
    ];
  };

  // Derive active trajectory addresses and specs
  let originAddress = '';
  let destinationAddress = '';
  let calculatedDistance = '';
  let calculatedTime = '';
  let titleHeader = '';
  let stepsList: Array<{ instruction: string; distance: string }> = [];

  if (isCustomMode) {
    originAddress = customOrigin;
    destinationAddress = customDestination;
    const stats = getCustomDistanceAndTime(customOrigin, customDestination);
    calculatedDistance = stats.distance;
    calculatedTime = stats.time;
    titleHeader = 'Custom Trajectory';
    stepsList = generateNavigationSteps(customOrigin, customDestination, calculatedDistance);
  } else {
    if (trackedOrder) {
      const stats = getOrderDistanceAndTime(trackedOrder);
      originAddress = stats.startAddr;
      destinationAddress = stats.endAddr;
      calculatedDistance = stats.distance;
      calculatedTime = stats.time;
      titleHeader = `Order ${trackedOrder.id} Tracker`;
      stepsList = generateNavigationSteps(trackedOrder.vendorName, trackedOrder.deliveryAddress, calculatedDistance);
    } else {
      originAddress = 'Maharana Pratap Nagar, Bhopal, Madhya Pradesh';
      destinationAddress = 'Chunabhatti, Bhopal, Madhya Pradesh';
      calculatedDistance = '5.4 km';
      calculatedTime = '12 mins';
      titleHeader = 'Default Bhopal Corridor';
      stepsList = generateNavigationSteps('Standard Restaurant Node', 'Standard Customer Address', '5.4 km');
    }
  }

  // Automatic online redirection effect
  useEffect(() => {
    if (!autoOpenMapsOnline) return;
    if (mapMode !== 'google_navigation') return;
    if (!originAddress || !destinationAddress) return;

    const timer = setTimeout(() => {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(destinationAddress)}`;
      const win = window.open(googleMapsUrl, '_blank');
      if (win) {
        win.focus();
      }
    }, 450); // Small delay to guarantee resolved coordinates
    return () => clearTimeout(timer);
  }, [selectedOrderId, customOrigin, customDestination, autoOpenMapsOnline, mapMode]);

  const handleApplyCustomRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchOrigin.trim() || !customSearchDestination.trim()) return;
    setCustomOrigin(customSearchOrigin);
    setCustomDestination(customSearchDestination);
  };

  return (
    <div className="space-y-6" id="live-tracking-panel">
      
      {/* 1. Header and View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Compass className="text-indigo-600 animate-spin-slow" size={20} />
            Bhopal Navigation & Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time Google Maps route directions and custom trajectory planners</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setMapMode('google_navigation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === 'google_navigation'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🗺️ Google Maps Navigation
          </button>
          <button
            onClick={() => setMapMode('vector_telemetry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === 'vector_telemetry'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🛰️ Live Vector Telemetry
          </button>
        </div>
      </div>

      {/* 2. Google Maps Navigation Dashboard View */}
      {mapMode === 'google_navigation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="google-maps-navigation-container">
          
          {/* Navigation Controls Sidepanel */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Target Select / Sandbox Toggle */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs text-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Navigation Context</h3>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCustomMode}
                    onChange={(e) => setIsCustomMode(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <span className="font-bold text-[10px] text-slate-500">Custom Address Sandbox</span>
                </label>
              </div>

              {/* Mode 1: Track Active Order */}
              {!isCustomMode ? (
                <div>
                  <label className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1.5">Select Active Delivery Node</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-xs"
                  >
                    {activeTrackingOrders.length === 0 ? (
                      <option value="">No Active Deliveries to Route</option>
                    ) : (
                      activeTrackingOrders.map(o => (
                        <option key={o.id} value={o.id}>{o.id} • {o.vendorName} ({o.status})</option>
                      ))
                    )}
                  </select>
                </div>
              ) : (
                /* Mode 2: Custom Sandbox Route Planner */
                <form onSubmit={handleApplyCustomRoute} className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Restaurant / Origin Location</label>
                    <input
                      type="text"
                      value={customSearchOrigin}
                      onChange={(e) => setCustomSearchOrigin(e.target.value)}
                      placeholder="Enter restaurant name or landmark..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold bg-slate-50 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Customer / Drop Location</label>
                    <input
                      type="text"
                      value={customSearchDestination}
                      onChange={(e) => setCustomSearchDestination(e.target.value)}
                      placeholder="Enter delivery address..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold bg-slate-50 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Load Free Map Route
                  </button>
                </form>
              )}

              {/* Automatic Online Google Maps Integration */}
              <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Automatic Live Redirect</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={autoOpenMapsOnline}
                      onChange={(e) => setAutoOpenMapsOnline(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                  When enabled, selecting an order or custom route instantly launches Google Maps Online Directions in a new browser tab.
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(destinationAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <Navigation size={12} className="transform rotate-45 text-emerald-200" /> Go to Google Maps Online 🚀
                </a>
              </div>
            </div>

            {/* Dynamic Distance and Time Indicators */}
            <div className="grid grid-cols-2 gap-4">
              {/* Distance Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                  <Navigation size={18} className="transform rotate-45" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Estimated Distance</span>
                  <span className="text-base font-extrabold text-slate-800 block mt-0.5">{calculatedDistance}</span>
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Estimated Time</span>
                  <span className="text-base font-extrabold text-slate-800 block mt-0.5">{calculatedTime}</span>
                </div>
              </div>
            </div>

            {/* Route Addresses Information Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs text-xs space-y-3.5">
              <h4 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1">
                <Zap size={14} className="text-indigo-600" /> Live Delivery Pipeline
              </h4>

              <div className="space-y-3">
                {/* Restaurant details */}
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">R</div>
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] block">RESTAURANT ROUTE</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{!isCustomMode && trackedOrder ? trackedOrder.vendorName : 'Custom Restaurant'}</span>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{originAddress}</p>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-slate-200 ml-2.5 h-4 my-1"></div>

                {/* Customer details */}
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">C</div>
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] block">CUSTOMER ROUTE</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{!isCustomMode && trackedOrder ? trackedOrder.customerName : 'Custom Customer'}</span>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{destinationAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step by Step Navigation Path Instructions */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs text-xs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider pb-1.5 border-b border-slate-50">
                🚀 Step-by-Step Trajectory
              </h4>
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                {stepsList.map((step, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="font-mono text-[10px] font-bold text-slate-400 mt-0.5">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="text-slate-600 leading-relaxed text-[11px]">{step.instruction}</p>
                      <span className="text-[10px] font-mono text-indigo-500 font-semibold mt-0.5 block">Distance: {step.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Real Google Maps Iframe Frame */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm flex flex-col min-h-[520px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between px-5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {titleHeader}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Google Maps Sandbox Mode</span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(destinationAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-extrabold shadow-3xs transition-all cursor-pointer"
                >
                  <Navigation size={11} className="transform rotate-45" /> Go to Maps Online
                </a>
              </div>
            </div>
            
            <div className="flex-1 relative bg-slate-100">
              <iframe
                title="Google Map Navigation"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '520px' }}
                src={`https://maps.google.com/maps?saddr=${encodeURIComponent(originAddress)}&daddr=${encodeURIComponent(destinationAddress)}&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full border-0 absolute inset-0"
              ></iframe>
            </div>
          </div>

        </div>
      )}

      {/* 3. Original Telemetry Vector Map View */}
      {mapMode === 'vector_telemetry' && (
        <>
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Compass className="text-indigo-600 animate-spin-slow" size={16} />
                Live Bhopal Delivery Tracker
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry and rider path tracking across Bhopal metropolitan area</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Order Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Track Order:</span>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="p-2 border border-slate-200 rounded-xl font-bold text-slate-700 bg-slate-50"
                >
                  {activeTrackingOrders.length === 0 ? (
                    <option value="">No Active Deliveries</option>
                  ) : (
                    activeTrackingOrders.map(o => (
                      <option key={o.id} value={o.id}>{o.id} • {o.vendorName} ({o.status})</option>
                    ))
                  )}
                </select>
              </div>

              {/* Speed Controls */}
              {selectedOrderId && (
                <div className="flex items-center gap-2 border-l pl-3 border-slate-100 text-xs">
                  <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={`p-2 rounded-xl font-bold flex items-center gap-1 transition-all ${
                      isSimulating 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isSimulating ? <Pause size={14} /> : <Play size={14} />}
                    {isSimulating ? 'Pause Map' : 'Start Simulation'}
                  </button>

                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => setSimulationSpeed(1)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${simulationSpeed === 1 ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
                    >
                      1x
                    </button>
                    <button 
                      onClick={() => setSimulationSpeed(2)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${simulationSpeed === 2 ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
                    >
                      2x Turbo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-fadeIn" id="map-arena">
            {/* SVG Live Map */}
            <div className="xl:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative shadow-md">
              {/* Dashboard Head Up Display (HUD) */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 text-white z-10 text-[11px] font-mono space-y-1 select-none">
                <span className="text-emerald-400 font-bold block flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  SYS TELEMETRY ONLINE
                </span>
                <span>GRID: Bhopal Central</span>
                {trackedOrder && trackedOrder.tracking && (
                  <>
                    <span>RIDER X: {trackedOrder.tracking.riderX}</span>
                    <span>Y: {trackedOrder.tracking.riderY}</span>
                    <span className="text-indigo-400 block font-bold">STATUS: {trackedOrder.status}</span>
                  </>
                )}
              </div>

              {/* Bhopal SVG Map */}
              <svg viewBox="0 0 100 100" className="w-full h-full aspect-square overflow-visible select-none bg-[#0b1329]">
                {/* Grid Coordinates Overlay lines */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.1" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Lakes */}
                {landmarks.slice(0, 2).map((lake, idx) => (
                  <g key={idx}>
                    <circle cx={lake.x} cy={lake.y} r={lake.radius} fill="#1e3a8a" opacity="0.45" />
                    <circle cx={lake.x} cy={lake.y} r={lake.radius - 2} fill="#1d4ed8" opacity="0.3" />
                    <text x={lake.x} y={lake.y + (lake.labelOffset || 0)} textAnchor="middle" className="fill-slate-400 font-bold text-[3px] opacity-80 pointer-events-none">
                      {lake.name}
                    </text>
                  </g>
                ))}

                {/* Land Roads Lines */}
                <path d="M 10 50 Q 40 45 75 48" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
                <path d="M 75 48 L 70 75" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
                <path d="M 70 75 L 45 88" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
                <path d="M 75 48 L 82 25" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.4" />

                {/* Landmarks Pins */}
                {landmarks.slice(2).map((mark, idx) => (
                  <g key={idx}>
                    <circle cx={mark.x} cy={mark.y} r="1.5" fill="#475569" />
                    <text x={mark.x} y={mark.y - 3} textAnchor="middle" className="text-[2.2px] fill-slate-300 font-medium">
                      {mark.icon} {mark.name}
                    </text>
                  </g>
                ))}

                {/* Active tracked route paths (dashed line) */}
                {trackedOrder && trackedOrder.tracking && (
                  <g>
                    {/* Route: Restaurant to Customer */}
                    <line 
                      x1={trackedOrder.tracking.restaurantX} 
                      y1={trackedOrder.tracking.restaurantY} 
                      x2={trackedOrder.tracking.customerX} 
                      y2={trackedOrder.tracking.customerY} 
                      stroke="#4f46e5" 
                      strokeWidth="0.5" 
                      strokeDasharray="1.5,1.5" 
                      opacity="0.65"
                    />

                    {/* Restaurant Marker PIN */}
                    <g transform={`translate(${trackedOrder.tracking.restaurantX}, ${trackedOrder.tracking.restaurantY})`}>
                      <circle r="2.8" fill="#f97316" className="animate-pulse" />
                      <circle r="1.5" fill="#ea580c" />
                      <text y="-4" textAnchor="middle" className="fill-orange-400 font-bold text-[2.5px]">🏬 STORE</text>
                    </g>

                    {/* Customer Marker PIN */}
                    <g transform={`translate(${trackedOrder.tracking.customerX}, ${trackedOrder.tracking.customerY})`}>
                      <circle r="2.8" fill="#3b82f6" className="animate-pulse" />
                      <circle r="1.5" fill="#2563eb" />
                      <text y="-4" textAnchor="middle" className="fill-blue-400 font-bold text-[2.5px]">👤 CUSTOMER</text>
                    </g>

                    {/* Moving Rider Agent Marker */}
                    <g transform={`translate(${trackedOrder.tracking.riderX}, ${trackedOrder.tracking.riderY})`}>
                      <circle r="3.2" fill="#10b981" className="animate-ping" opacity="0.5" />
                      <circle r="2.2" fill="#059669" />
                      <circle r="1.2" fill="#ffffff" />
                      <text y="-4.5" textAnchor="middle" className="fill-emerald-400 font-bold text-[2.8px]">🏍️ RIDER</text>
                    </g>
                  </g>
                )}
              </svg>
            </div>

            {/* Dynamic Spec Panel */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs text-xs space-y-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                  <Zap size={16} className="text-orange-500" />
                  Live Order Spec
                </h4>

                {trackedOrder ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 font-medium block">Order Node</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">{trackedOrder.id}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Restaurant Node</span>
                      <span className="font-bold text-slate-700">{trackedOrder.vendorName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Customer Drop Address</span>
                      <span className="text-slate-600 block">{trackedOrder.deliveryAddress}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Rider Assigned</span>
                      <span className="text-slate-700 font-bold flex items-center gap-1 mt-0.5">
                        <Bike size={13} className="text-slate-500" />
                        {trackedOrder.riderName}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Delivery Status</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] mt-1 ${
                        trackedOrder.status === 'Picked' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {trackedOrder.status === 'Picked' ? 'Rider In Transit To Drop' : 'Rider Navigating to Restaurant'}
                      </span>
                    </div>

                    {/* Telemetry diagnostics */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-400">ETA Estimate:</span>
                        <span className="text-slate-700 font-bold">~12 Mins</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-400">Sim speed factor:</span>
                        <span className="text-slate-700 font-bold">{simulationSpeed}x</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-400">Signals:</span>
                        <span className="text-emerald-600 font-bold">SATELLITE SYNC</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-10">
                    <Info size={24} className="mx-auto text-slate-300 mb-2" />
                    <p>No active deliveries currently in transition map.</p>
                    <p className="text-[10px] mt-1">Accept and dispatch orders in the pipeline to begin live tracking.</p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-150 text-xs">
                <h5 className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle size={14} />
                  Simulation Instruction
                </h5>
                <p className="text-amber-700 leading-relaxed text-[11px]">
                  Our system runs active vector tracking in real-time. Pausing the map stops coordinates from shifting. Switch the simulation speed to 2x for fast testing.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
