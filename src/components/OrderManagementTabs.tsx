import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Rider, Customer, Vendor } from '../types';
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
// 1. ORDER PIPELINE MANAGEMENT COMPONENT
// ==========================================
interface OrderManagementTabProps {
  activeLanguage?: Language;
  orders: Order[];
  riders: Rider[];
  customers: Customer[];
  vendors: Vendor[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onUpdateRider: (updatedRider: Rider) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onUpdateVendor: (updatedVendor: Vendor) => void;
}

export function OrderManagementTab(props: OrderManagementTabProps) {
  const { activeLanguage = 'en', orders, riders, customers, vendors, onUpdateOrder, onUpdateRider, onUpdateCustomer, onUpdateVendor } = props;
  const t = TRANSLATIONS[activeLanguage];
  const [activePipelineTab, setActivePipelineTab] = useState<OrderStatus>('New');
  const [assigningRiderOrderId, setAssigningRiderOrderId] = useState<string | null>(null);

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
                  <button
                    onClick={() => setAssigningRiderOrderId(order.id)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Bike size={14} /> Assign Rider & Cook
                  </button>
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

  const activeTrackingOrders = orders.filter(o => ['Preparing', 'Ready', 'Picked'].includes(o.status));

  // Address lookup map for Bhopal nodes to get highly detailed coordinates and names
  const VENDOR_ADDRESS_MAP: Record<string, string> = {
    'VND-001': 'Zone-II, Maharana Pratap Nagar, Bhopal, Madhya Pradesh, India',
    'VND-002': 'Hamidia Road, near Bhopal Junction railway station, Bhopal, Madhya Pradesh, India',
    'VND-003': 'Indian Coffee House, TT Nagar, Bhopal, Madhya Pradesh, India',
    'VND-004': 'Sharma & Vishnu Fast Food, Indrapuri Sector C, Bhopal, Madhya Pradesh, India',
  };

  const CUSTOMER_ADDRESS_MAP: Record<string, string> = {
    'CUST-101': 'Arera Colony E-7, Bhopal, Madhya Pradesh, India',
    'CUST-102': 'Chunabhatti, Near Shahpura Lake, Bhopal, Madhya Pradesh, India',
    'CUST-103': 'Kotra Sultanabad, Bhopal, Madhya Pradesh, India',
    'CUST-104': 'BHEL Colony, Piplani, Bhopal, Madhya Pradesh, India',
    'CUST-105': 'Kolar Heights, Kolar Road, Bhopal, Madhya Pradesh, India',
  };

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
              <span className="text-[10px] text-slate-400 font-semibold">Google Maps Sandbox (Free Mode)</span>
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
