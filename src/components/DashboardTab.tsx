import React, { useState } from 'react';
import { Customer, Vendor, Rider, Order } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { 
  TrendingUp, 
  ShoppingBag, 
  IndianRupee, 
  Percent, 
  Store, 
  Bike, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Wallet,
  Send,
  ArrowUpDown,
  CheckCircle,
  FileText,
  AlertCircle,
  TrendingDown,
  Building,
  RefreshCw,
  Search,
  Check,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface DashboardTabProps {
  activeLanguage?: Language;
  customers: Customer[];
  vendors: Vendor[];
  riders: Rider[];
  orders: Order[];
  onUpdateCustomer?: (updatedCustomer: Customer) => void;
  onUpdateVendor?: (updatedVendor: Vendor) => void;
  onUpdateRider?: (updatedRider: Rider) => void;
}

interface AdminTransaction {
  id: string;
  type: 'Wallet Deposit' | 'Wallet Deduction' | 'Vendor Payout' | 'Rider Settlement';
  targetName: string;
  targetRole: 'Customer' | 'Vendor' | 'Rider';
  amount: number;
  timestamp: string;
  status: 'Completed' | 'Pending';
  remarks: string;
}

export default function DashboardTab(props: DashboardTabProps) {
  const { activeLanguage = 'en', customers, vendors, riders, orders, onUpdateCustomer, onUpdateVendor, onUpdateRider } = props;
  const t = TRANSLATIONS[activeLanguage];
  const [selectedChartRange, setSelectedChartRange] = useState<'7days' | '30days'>('7days');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  
  // Tab within the Financial Hub
  const [finTab, setFinTab] = useState<'wallet' | 'vendor' | 'rider'>('wallet');
  
  // Form States for Wallet Tab
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [walletAmount, setWalletAmount] = useState<number>(500);
  const [walletAction, setWalletAction] = useState<'add' | 'deduct'>('add');
  const [walletRemarks, setWalletRemarks] = useState<string>('Customer Loyalty Bonus');

  // Form States for Vendor Settlement Tab
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors[0]?.id || '');
  const [vendorPayoutAmount, setVendorPayoutAmount] = useState<number>(2000);
  const [vendorRemarks, setVendorRemarks] = useState<string>('Weekly Gross Profit Payout');

  // Form States for Rider Settlement Tab
  const [selectedRiderId, setSelectedRiderId] = useState<string>(riders[0]?.id || '');
  const [riderPayoutAmount, setRiderPayoutAmount] = useState<number>(1500);
  const [riderRemarks, setRiderRemarks] = useState<string>('Incentive + Distance Settlement');

  // Session admin transaction log
  const [adminTransactions, setAdminTransactions] = useState<AdminTransaction[]>([
    {
      id: 'TXN-9021',
      type: 'Vendor Payout',
      targetName: 'Tandoor Palace',
      targetRole: 'Vendor',
      amount: 4500,
      timestamp: 'Today, 05:40 AM',
      status: 'Completed',
      remarks: 'Settlement for Mon-Wed orders'
    },
    {
      id: 'TXN-9018',
      type: 'Wallet Deposit',
      targetName: 'Amit Sharma',
      targetRole: 'Customer',
      amount: 250,
      timestamp: 'Today, 04:12 AM',
      status: 'Completed',
      remarks: 'Refund processed to wallet'
    },
    {
      id: 'TXN-9012',
      type: 'Rider Settlement',
      targetName: 'Rahul Verma',
      targetRole: 'Rider',
      amount: 1800,
      timestamp: 'Yesterday, 09:30 PM',
      status: 'Completed',
      remarks: 'Fuel & distance payout'
    }
  ]);

  // Alert Banner message
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const triggerAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Live calculation metrics
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const liveOrdersCount = orders.filter(o => !['Delivered', 'Cancelled', 'Refunded'].includes(o.status)).length;
  
  // Total Revenue (all completed orders total payment)
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  
  // Commission collected by admin = Sum of (Subtotal * Vendor Commission % / 100) + Platform Fees + GST + Delivery charges
  const totalCommission = deliveredOrders.reduce((sum, o) => {
    const vendor = vendors.find(v => v.id === o.vendorId);
    const rate = vendor ? vendor.commissionRate : 15;
    const vendorComm = (o.subtotal * rate) / 100;
    return sum + vendorComm + o.platformFee;
  }, 0);

  const activeVendors = vendors.filter(v => v.status === 'Approved').length;
  const activeRiders = riders.filter(r => r.status === 'Online').length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;

  // Wallet balances totals for diagnostics
  const totalCustomerWalletFunds = customers.reduce((sum, c) => sum + c.walletBalance, 0);
  const totalVendorWalletBalance = vendors.reduce((sum, v) => sum + v.walletBalance, 0);
  const totalRidersEarnings = riders.reduce((sum, r) => sum + r.earnings, 0);

  // Daily Trend values
  const dailyStats7Days = [
    { day: 'Mon', orders: 42, revenue: 14500, commission: 2350 },
    { day: 'Tue', orders: 48, revenue: 16200, commission: 2580 },
    { day: 'Wed', orders: 55, revenue: 19800, commission: 3120 },
    { day: 'Thu', orders: 50, revenue: 17400, commission: 2810 },
    { day: 'Fri', orders: 68, revenue: 24500, commission: 3950 },
    { day: 'Sat', orders: 85, revenue: 32000, commission: 5100 },
    { day: 'Sun', orders: 90, revenue: 34500, commission: 5420 }
  ];

  const dailyStats30Days = [
    { day: 'Week 1', orders: 280, revenue: 98000, commission: 15400 },
    { day: 'Week 2', orders: 320, revenue: 112000, commission: 17800 },
    { day: 'Week 3', orders: 390, revenue: 141000, commission: 22200 },
    { day: 'Week 4', orders: 450, revenue: 165000, commission: 25900 }
  ];

  const activeChartData = selectedChartRange === '7days' ? dailyStats7Days : dailyStats30Days;
  const maxOrdersValue = Math.max(...activeChartData.map(d => d.orders)) * 1.15;

  // Handle wallet adjustment
  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateCustomer) {
      triggerAlert('Wallet functions are disabled in this environment state.', 'info');
      return;
    }
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    const changeAmount = Number(walletAmount);
    if (isNaN(changeAmount) || changeAmount <= 0) {
      triggerAlert('Please enter a valid transfer amount.', 'info');
      return;
    }

    let newBalance = customer.walletBalance;
    if (walletAction === 'add') {
      newBalance += changeAmount;
    } else {
      if (newBalance < changeAmount) {
        triggerAlert(`Insufficient balance. Customer current balance is ₹${newBalance}`, 'info');
        return;
      }
      newBalance -= changeAmount;
    }

    // Process update
    onUpdateCustomer({
      ...customer,
      walletBalance: newBalance
    });

    // Create ledger entry
    const nextTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: AdminTransaction = {
      id: nextTxnId,
      type: walletAction === 'add' ? 'Wallet Deposit' : 'Wallet Deduction',
      targetName: customer.name,
      targetRole: 'Customer',
      amount: changeAmount,
      timestamp: 'Just now',
      status: 'Completed',
      remarks: walletRemarks || (walletAction === 'add' ? 'Funds added by Super Admin' : 'Funds deducted by Support')
    };

    setAdminTransactions([newTxn, ...adminTransactions]);
    triggerAlert(`Successfully ${walletAction === 'add' ? 'credited' : 'debited'} ₹${changeAmount} ${walletAction === 'add' ? 'to' : 'from'} ${customer.name}'s wallet! New balance: ₹${newBalance}`);
  };

  // Handle vendor payout
  const handleVendorPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateVendor) {
      triggerAlert('Vendor payouts are disabled in this environment state.', 'info');
      return;
    }
    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (!vendor) return;

    const payout = Number(vendorPayoutAmount);
    if (isNaN(payout) || payout <= 0) {
      triggerAlert('Please enter a valid payout amount.', 'info');
      return;
    }

    if (vendor.walletBalance < payout) {
      triggerAlert(`Outstanding merchant account balance (₹${vendor.walletBalance}) is lower than requested payout amount.`, 'info');
      return;
    }

    const newBalance = vendor.walletBalance - payout;

    onUpdateVendor({
      ...vendor,
      walletBalance: newBalance
    });

    const nextTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: AdminTransaction = {
      id: nextTxnId,
      type: 'Vendor Payout',
      targetName: vendor.name,
      targetRole: 'Vendor',
      amount: payout,
      timestamp: 'Just now',
      status: 'Completed',
      remarks: vendorRemarks || 'Merchant settlement processed successfully'
    };

    setAdminTransactions([newTxn, ...adminTransactions]);
    triggerAlert(`Successfully transferred ₹${payout} payout to ${vendor.name}! Updated outstanding balance: ₹${newBalance}`);
  };

  // Handle rider payout
  const handleRiderPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateRider) {
      triggerAlert('Rider settlements are disabled in this environment state.', 'info');
      return;
    }
    const rider = riders.find(r => r.id === selectedRiderId);
    if (!rider) return;

    const payout = Number(riderPayoutAmount);
    if (isNaN(payout) || payout <= 0) {
      triggerAlert('Please enter a valid settlement amount.', 'info');
      return;
    }

    if (rider.earnings < payout) {
      triggerAlert(`Rider accumulated earnings (₹${rider.earnings}) are less than settlement request.`, 'info');
      return;
    }

    const newEarnings = rider.earnings - payout;

    onUpdateRider({
      ...rider,
      earnings: newEarnings
    });

    const nextTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: AdminTransaction = {
      id: nextTxnId,
      type: 'Rider Settlement',
      targetName: rider.name,
      targetRole: 'Rider',
      amount: payout,
      timestamp: 'Just now',
      status: 'Completed',
      remarks: riderRemarks || 'Rider milestone earnings settlement'
    };

    setAdminTransactions([newTxn, ...adminTransactions]);
    triggerAlert(`Successfully processed ₹${payout} earnings transfer to ${rider.name}! Outstanding accrued: ₹${newEarnings}`);
  };

  const selectedCustomerObj = customers.find(c => c.id === selectedCustomerId);
  const selectedVendorObj = vendors.find(v => v.id === selectedVendorId);
  const selectedRiderObj = riders.find(r => r.id === selectedRiderId);

  return (
    <div className="space-y-6" id="dashboard-tab-container">
      
      {/* Alert Banner */}
      {alertMessage && (
        <div 
          className={`p-4 rounded-xl shadow-md border flex items-center justify-between transition-all duration-300 animate-slide-in ${
            alertMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}
          id="financial-alert-toast"
        >
          <div className="flex items-center gap-2.5">
            {alertMessage.type === 'success' ? (
              <CheckCircle className="text-emerald-600 shrink-0" size={18} />
            ) : (
              <AlertCircle className="text-indigo-600 shrink-0" size={18} />
            )}
            <span className="text-xs font-semibold">{alertMessage.text}</span>
          </div>
          <button 
            onClick={() => setAlertMessage(null)}
            className="text-xs font-bold hover:opacity-80 transition-opacity ml-4 bg-white/40 px-2 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Beautiful Grid Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl" id="dashboard-header-premium">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {activeLanguage === 'hi' ? 'सिस्टम कमांड सेंटर' : 'System Command Center'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                {activeLanguage === 'hi' ? 'टर्मिनल सक्रिय' : 'Terminal Active'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeLanguage === 'hi' ? 'भोपाल एक्सप्रेस लॉजिस्टिक्स हब' : 'Bhopal Express Logistics Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {activeLanguage === 'hi' 
                ? 'भोपाल के प्रमुख डिलीवरी बेड़े नेटवर्क के लिए वास्तविक समय की निगरानी, मर्चेंट कमीशन भुगतान, राइडर निपटान और त्वरित डिजिटल वॉलेट नियंत्रण।' 
                : "Real-time monitoring, merchant commission payouts, rider settlements, and instant digital wallet controls for Bhopal's premier delivery fleet network."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <div className="text-center px-4 py-2 border-r border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">{activeLanguage === 'hi' ? 'कुल राजस्व' : 'Total Revenue'}</span>
              <span className="text-lg font-extrabold text-white">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-center px-4 py-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">{activeLanguage === 'hi' ? 'कुल ऑर्डर' : 'Total Orders'}</span>
              <span className="text-lg font-extrabold text-indigo-400">{totalOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Refined attractive visuals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="kpi-grid">
        
        {/* KPI 1: Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group" id="kpi-revenue">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{activeLanguage === 'hi' ? 'कुल राजस्व' : 'Gross Revenue'}</span>
              <span className="text-2xl font-extrabold text-slate-800 block group-hover:text-indigo-600 transition-colors">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-all">
              <IndianRupee size={22} className="stroke-[2.5px]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-500 border-t pt-2 border-slate-100">
            <span className="font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight size={13} /> +14.2%
            </span>
            <span>{activeLanguage === 'hi' ? 'दैनिक लेनदेन गति' : 'daily transaction velocity'}</span>
          </div>
        </div>

        {/* KPI 2: Net Commissions & Platform Fees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group" id="kpi-commission">
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{activeLanguage === 'hi' ? 'कुल कमीशन' : 'Net Commission'}</span>
              <span className="text-2xl font-extrabold text-slate-800 block">
                ₹{totalCommission.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-all">
              <Percent size={22} className="stroke-[2.5px]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-500 border-t pt-2 border-slate-100">
            <span className="font-bold text-indigo-600">₹{Math.floor(totalCommission * 0.18)} GST</span>
            <span>{activeLanguage === 'hi' ? 'प्लेटफॉर्म शुल्क में शामिल' : 'included in platform charges'}</span>
          </div>
        </div>

        {/* KPI 3: Orders pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group" id="kpi-total-orders">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{activeLanguage === 'hi' ? 'कुल लॉजिस्टिक्स' : 'Total Logistics'}</span>
              <span className="text-2xl font-extrabold text-slate-800 block">
                {totalOrders} {activeLanguage === 'hi' ? 'ऑर्डर' : 'Orders'}
              </span>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-all">
              <ShoppingBag size={22} className="stroke-[2.5px]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-[11px] border-t pt-2 border-slate-100">
            <span className="text-emerald-600 font-bold">{deliveredOrders.length} {activeLanguage === 'hi' ? 'पूरा हुआ' : 'Completed'}</span>
            <span className="h-3 w-[1px] bg-slate-200"></span>
            <span className="text-rose-600 font-bold">{orders.filter(o => o.status === 'Cancelled').length} {activeLanguage === 'hi' ? 'रद्द हुआ' : 'Cancelled'}</span>
          </div>
        </div>

        {/* KPI 4: Live active pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group" id="kpi-live-orders">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{activeLanguage === 'hi' ? 'सक्रिय पाइपलाइन' : 'Active Pipeline'}</span>
              <span className="text-2xl font-extrabold text-slate-800 block">
                {liveOrdersCount} {activeLanguage === 'hi' ? 'सक्रिय' : 'Active'}
              </span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-all">
              <Clock size={22} className="stroke-[2.5px] animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-500 border-t pt-2 border-slate-100">
            <span className="flex items-center text-amber-600 font-bold">
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mr-1 inline-block animate-pulse"></span>
              {activeLanguage === 'hi' ? 'लाइव डिलीवरी रूट' : 'Live Delivery Route'}
            </span>
            <span>{activeLanguage === 'hi' ? 'पारगमन में है' : 'currently in transit'}</span>
          </div>
        </div>

      </div>

      {/* Network Actors Statistics Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="network-actors-metrics">
        
        {/* Approved active vendors */}
        <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
              <Store size={22} className="stroke-[2px]" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{activeLanguage === 'hi' ? 'विक्रेता ऑनलाइन' : 'Vendors Online'}</span>
              <span className="text-sm font-extrabold text-slate-800 block">{activeVendors} {activeLanguage === 'hi' ? 'स्वीकृत' : 'Approved'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold block">{activeLanguage === 'hi' ? 'कुल बहीखाता' : 'Total Ledger'}</span>
            <span className="text-xs font-bold text-slate-700">₹{totalVendorWalletBalance.toLocaleString('en-IN')} {activeLanguage === 'hi' ? 'बैलेंस' : 'Balance'}</span>
          </div>
        </div>

        {/* Riders Online */}
        <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <Bike size={22} className="stroke-[2px]" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{activeLanguage === 'hi' ? 'राइडर्स ऑनलाइन' : 'Riders Online'}</span>
              <span className="text-sm font-extrabold text-slate-800 block">{activeRiders} {activeLanguage === 'hi' ? 'ड्यूटी पर' : 'On Duty'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold block">{activeLanguage === 'hi' ? 'अर्जित शुल्क' : 'Accrued Fees'}</span>
            <span className="text-xs font-bold text-slate-700">₹{totalRidersEarnings.toLocaleString('en-IN')} {activeLanguage === 'hi' ? 'बकाया' : 'Outstanding'}</span>
          </div>
        </div>

        {/* Customer Database */}
        <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
              <Users size={22} className="stroke-[2px]" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{activeLanguage === 'hi' ? 'ग्राहक' : 'Customers'}</span>
              <span className="text-sm font-extrabold text-slate-800 block">{activeCustomers} {activeLanguage === 'hi' ? 'सक्रिय' : 'Active'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold block">{activeLanguage === 'hi' ? 'प्रीपेड संपत्ति' : 'Prepaid Assets'}</span>
            <span className="text-xs font-bold text-slate-700">₹{totalCustomerWalletFunds.toLocaleString('en-IN')} {activeLanguage === 'hi' ? 'वॉलेट' : 'Wallets'}</span>
          </div>
        </div>

      </div>

      {/* 
        ADMIN FINANCIAL & WALLET CONTROLS HUB
        Specifically requested by the user: "Create payment and transfer and wallet controls for admin"
      */}
      <div className="bg-white rounded-3xl border border-slate-150 shadow-md overflow-hidden" id="admin-financial-hub">
        
        {/* Section Header */}
        <div className="bg-slate-900 px-6 py-5 border-b border-slate-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <Wallet className="text-indigo-400 animate-pulse" size={20} />
              Admin Financial Settlement & Wallet Control Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deposit user cash, deduct loyalty fees, settle outstanding vendor commissions, and transfer earnings to riders instantly.
            </p>
          </div>

          {/* Sub-tab selection buttons */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFinTab('wallet')}
              className={`px-4 py-2 rounded-lg font-bold tracking-wide transition-all ${
                finTab === 'wallet' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Wallets
            </button>
            <button
              onClick={() => setFinTab('vendor')}
              className={`px-4 py-2 rounded-lg font-bold tracking-wide transition-all ${
                finTab === 'vendor' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Merchant Settlements
            </button>
            <button
              onClick={() => setFinTab('rider')}
              className={`px-4 py-2 rounded-lg font-bold tracking-wide transition-all ${
                finTab === 'rider' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rider Payouts
            </button>
          </div>
        </div>

        {/* Live interactive panel workspace */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form column (cols 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tab 1: Customer Wallet Adjustment */}
              {finTab === 'wallet' && (
                <form onSubmit={handleWalletSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <CreditCard size={16} className="text-indigo-600" />
                      Adjust Customer Prepaid Wallet Balance
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                      Live Database updates
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Customer</label>
                      <select
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                      >
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} (Bal: ₹{c.walletBalance})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Select */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Transaction Operation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setWalletAction('add')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            walletAction === 'add'
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-extrabold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Credit (+ Deposit)
                        </button>
                        <button
                          type="button"
                          onClick={() => setWalletAction('deduct')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            walletAction === 'deduct'
                              ? 'bg-rose-50 border-rose-400 text-rose-800 font-extrabold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Debit (- Deduct)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount (INR)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          max="10000"
                          value={walletAmount}
                          onChange={(e) => setWalletAmount(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Presets</label>
                      <div className="flex gap-1.5">
                        {[100, 250, 500, 1000].map(p => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => setWalletAmount(p)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-slate-200 transition-all flex-1"
                          >
                            ₹{p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Transaction Reference / Memo</label>
                    <input
                      type="text"
                      value={walletRemarks}
                      onChange={(e) => setWalletRemarks(e.target.value)}
                      placeholder="e.g. Compensation refund for delayed dispatch order"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <Send size={14} className="text-indigo-400" />
                    Process Wallet {walletAction === 'add' ? 'Credit' : 'Deduction'} Transfer
                  </button>
                </form>
              )}

              {/* Tab 2: Vendor Settlements */}
              {finTab === 'vendor' && (
                <form onSubmit={handleVendorPayoutSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Building size={16} className="text-indigo-600" />
                      Disburse Outstanding Vendor Gross Account Earnings
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                      Bank Settlement Gateways
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vendor list selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Vendor Restaurant</label>
                      <select
                        value={selectedVendorId}
                        onChange={(e) => setSelectedVendorId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                      >
                        {vendors.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} (Accrued: ₹{v.walletBalance})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payout Amount (INR)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          max={selectedVendorObj ? selectedVendorObj.walletBalance : 10000}
                          value={vendorPayoutAmount}
                          onChange={(e) => setVendorPayoutAmount(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Settlement Remarks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payout Memo & Bank Reference</label>
                    <input
                      type="text"
                      value={vendorRemarks}
                      onChange={(e) => setVendorRemarks(e.target.value)}
                      placeholder="e.g. Weekly net order earnings clearance to ICICI Current A/C"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Warning Info */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      Executing this will deduct ₹{vendorPayoutAmount} from the vendor's virtual app balance and dispatch a real-time corporate bank API trigger to their linked accounts.
                    </div>
                  </div>

                  {/* Payout actions */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedVendorObj) {
                          setVendorPayoutAmount(selectedVendorObj.walletBalance);
                        }
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all"
                    >
                      Settle Full Balance (₹{selectedVendorObj?.walletBalance || 0})
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Dispatch Vendor Settlement
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 3: Rider Earnings Settlements */}
              {finTab === 'rider' && (
                <form onSubmit={handleRiderPayoutSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Bike size={16} className="text-indigo-600" />
                      Approve & Settle Rider Commission + Distance Earnings
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                      UPI IMPS Transfer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Rider selection dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Delivery Rider</label>
                      <select
                        value={selectedRiderId}
                        onChange={(e) => setSelectedRiderId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                      >
                        {riders.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} (Accrued earnings: ₹{r.earnings})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Settlement Transfer (INR)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          max={selectedRiderObj ? selectedRiderObj.earnings : 10000}
                          value={riderPayoutAmount}
                          onChange={(e) => setRiderPayoutAmount(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rider Memo remarks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rider Memo & Incentive Notes</label>
                    <input
                      type="text"
                      value={riderRemarks}
                      onChange={(e) => setRiderRemarks(e.target.value)}
                      placeholder="e.g. Regular distance fuel payout + Weekend streak milestone bonus"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Warning notes */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      Executing this will immediately reset the selected Rider accrued pocket balance and log an electronic UPI payout receipt in their dashboard.
                    </div>
                  </div>

                  {/* Rider buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRiderObj) {
                          setRiderPayoutAmount(selectedRiderObj.earnings);
                        }
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all"
                    >
                      Clear All Accrued (₹{selectedRiderObj?.earnings || 0})
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> Authorize UPI Transfer
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Target Profile Diagnostic card (cols 5) */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
              
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block border-b pb-2">
                  Target Account Summary
                </span>

                {finTab === 'wallet' && selectedCustomerObj && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedCustomerObj.avatar} 
                        alt="Customer" 
                        className="h-12 w-12 rounded-full object-cover border border-indigo-200 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-800 block text-sm">{selectedCustomerObj.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{selectedCustomerObj.email}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-slate-400 block">Current Balance</span>
                        <span className="text-sm font-extrabold text-indigo-600 block mt-0.5">₹{selectedCustomerObj.walletBalance}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Orders count</span>
                        <span className="text-sm font-extrabold text-slate-700 block mt-0.5">{selectedCustomerObj.orderCount} orders</span>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 leading-relaxed">
                      <strong>Pending Operation Estimate</strong>: <br/>
                      {walletAction === 'add' ? 'Depositing' : 'Withdrawing'} ₹{walletAmount} will adjust balance from ₹{selectedCustomerObj.walletBalance} to{' '}
                      <strong>₹{walletAction === 'add' ? selectedCustomerObj.walletBalance + walletAmount : Math.max(0, selectedCustomerObj.walletBalance - walletAmount)}</strong>.
                    </div>
                  </div>
                )}

                {finTab === 'vendor' && selectedVendorObj && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedVendorObj.avatar} 
                        alt="Vendor" 
                        className="h-12 w-12 rounded-full object-cover border border-orange-200 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-800 block text-sm">{selectedVendorObj.name}</span>
                        <span className="text-[10px] text-slate-400 block">Cuisine: {selectedVendorObj.cuisine}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-slate-400 block">Accrued virtual capital</span>
                        <span className="text-sm font-extrabold text-emerald-600 block mt-0.5">₹{selectedVendorObj.walletBalance}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Commission tier</span>
                        <span className="text-sm font-extrabold text-slate-700 block mt-0.5">{selectedVendorObj.commissionRate}% rate</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed">
                      <strong>Commission Settle Estimate</strong>: <br/>
                      Disbursing payout of ₹{vendorPayoutAmount} will leave an outstanding virtual wallet reserve of{' '}
                      <strong>₹{Math.max(0, selectedVendorObj.walletBalance - vendorPayoutAmount)}</strong> in local app files.
                    </div>
                  </div>
                )}

                {finTab === 'rider' && selectedRiderObj && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedRiderObj.avatar} 
                        alt="Rider" 
                        className="h-12 w-12 rounded-full object-cover border border-teal-200 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-800 block text-sm">{selectedRiderObj.name}</span>
                        <span className="text-[10px] text-slate-400 block">Vehicle: {selectedRiderObj.vehicleType} • {selectedRiderObj.vehicleNumber}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-slate-400 block">Oustanding Accrued</span>
                        <span className="text-sm font-extrabold text-indigo-600 block mt-0.5">₹{selectedRiderObj.earnings}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Approval rating</span>
                        <span className="text-sm font-extrabold text-slate-700 block mt-0.5">★ {selectedRiderObj.rating} / 5.0</span>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 leading-relaxed">
                      <strong>UPI IMPS Gateway Estimate</strong>: <br/>
                      Clearing ₹{riderPayoutAmount} will reduce rider accrued balance to{' '}
                      <strong>₹{Math.max(0, selectedRiderObj.earnings - riderPayoutAmount)}</strong>.
                    </div>
                  </div>
                )}

              </div>

              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                Bhopal Express Logistics Payment Gateway Integration • secure, audited logs
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* SVG Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="charts-and-logs">
        
        {/* SVG Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-base">
                  <TrendingUp size={18} className="text-indigo-600" />
                  Logistics Performance Metrics (Gross Sales vs Vol)
                </h4>
                <p className="text-xs text-slate-400 font-medium">Bhopal region gross revenue tracking indices</p>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs" id="range-toggle">
                <button
                  onClick={() => setSelectedChartRange('7days')}
                  className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all ${
                    selectedChartRange === '7days' 
                      ? 'bg-white text-slate-800 shadow-xs border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setSelectedChartRange('30days')}
                  className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all ${
                    selectedChartRange === '30days' 
                      ? 'bg-white text-slate-800 shadow-xs border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart Renderer */}
            <div className="relative pt-2">
              <svg viewBox="0 0 600 240" className="w-full h-auto overflow-visible">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="570" y2="20" stroke="#f8fafc" strokeWidth="1" />
                <line x1="40" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="140" x2="570" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="200" x2="570" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Y Axis Labels (Revenue) */}
                <text x="35" y="25" textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                  {selectedChartRange === '7days' ? '₹35k' : '₹180k'}
                </text>
                <text x="35" y="85" textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                  {selectedChartRange === '7days' ? '₹20k' : '₹120k'}
                </text>
                <text x="35" y="145" textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                  {selectedChartRange === '7days' ? '₹10k' : '₹60k'}
                </text>
                <text x="35" y="203" textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                  ₹0
                </text>

                {/* Bar Renderers */}
                {activeChartData.map((d, index) => {
                  const totalBars = activeChartData.length;
                  const containerWidth = 530;
                  const barSpacing = containerWidth / totalBars;
                  const x = 40 + index * barSpacing + (barSpacing - 22) / 2;
                  
                  // Scale calculations
                  const maxVal = selectedChartRange === '7days' ? 35000 : 180000;
                  const barHeight = (d.revenue / maxVal) * 180;
                  const y = 200 - barHeight;

                  return (
                    <g key={index} className="cursor-pointer">
                      {/* Background hover guide */}
                      <rect 
                        x={40 + index * barSpacing} 
                        y="15" 
                        width={barSpacing} 
                        height="190" 
                        fill="transparent" 
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      />

                      {/* Revenue Bar */}
                      <rect
                        x={x}
                        y={y}
                        width="18"
                        height={Math.max(barHeight, 4)}
                        rx="4"
                        fill={hoveredBarIndex === index ? '#4f46e5' : '#818cf8'}
                        className="transition-all duration-200"
                      />

                      {/* X Axis Label */}
                      <text
                        x={40 + index * barSpacing + barSpacing / 2}
                        y="218"
                        textAnchor="middle"
                        className={`text-[10px] font-bold tracking-wider transition-all uppercase ${
                          hoveredBarIndex === index ? 'fill-slate-850' : 'fill-slate-400'
                        }`}
                      >
                        {d.day}
                      </text>
                    </g>
                  );
                })}

                {/* Line Path for Orders Count */}
                <path
                  d={activeChartData.reduce((pathStr, d, index) => {
                    const totalBars = activeChartData.length;
                    const containerWidth = 530;
                    const barSpacing = containerWidth / totalBars;
                    const x = 40 + index * barSpacing + barSpacing / 2;
                    const y = 200 - (d.orders / (selectedChartRange === '7days' ? 100 : 500)) * 180;
                    return pathStr + `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dots on the Line */}
                {activeChartData.map((d, index) => {
                  const totalBars = activeChartData.length;
                  const containerWidth = 530;
                  const barSpacing = containerWidth / totalBars;
                  const x = 40 + index * barSpacing + barSpacing / 2;
                  const y = 200 - (d.orders / (selectedChartRange === '7days' ? 100 : 500)) * 180;

                  return (
                    <circle
                      key={`dot-${index}`}
                      cx={x}
                      cy={y}
                      r={hoveredBarIndex === index ? "6" : "4.5"}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                  );
                })}
              </svg>

              {/* Float Tooltip */}
              {hoveredBarIndex !== null && (
                <div 
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs py-2 px-3.5 rounded-xl shadow-lg flex items-center gap-4 z-10 transition-opacity border border-slate-800 animate-fade-in"
                >
                  <div>
                    <span className="text-slate-500 block text-[8px] uppercase font-bold tracking-wider">Metric Period</span>
                    <span className="font-extrabold text-white">{activeChartData[hoveredBarIndex].day}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-800"></div>
                  <div>
                    <span className="text-indigo-400 block text-[8px] uppercase font-bold tracking-wider">Gross Sales</span>
                    <span className="font-extrabold text-indigo-300">₹{activeChartData[hoveredBarIndex].revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-800"></div>
                  <div>
                    <span className="text-emerald-400 block text-[8px] uppercase font-bold tracking-wider">Orders</span>
                    <span className="font-extrabold text-emerald-300">{activeChartData[hoveredBarIndex].orders}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-3 w-5 bg-indigo-400 rounded inline-block"></span>
              <span className="text-slate-600 font-bold">Platform Gross Sales Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-emerald-500 rounded-sm inline-block relative after:content-[''] after:absolute after:h-2 after:w-2 after:bg-emerald-500 after:rounded-full after:left-1.5 after:-top-[4px]"></span>
              <span className="text-slate-600 font-bold">Orders Dispatch Count</span>
            </div>
          </div>
        </div>

        {/* Live Admin Audit & Ledger Log */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-base mb-4 border-b pb-3 border-slate-100">
              <Layers size={18} className="text-indigo-600" />
              Real-time Administrative Audit Ledger
            </h4>
            
            <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1" id="ledger-transactions-list">
              {adminTransactions.map((txn) => {
                let badgeColor = 'text-indigo-700 bg-indigo-50 border-indigo-100';
                if (txn.type === 'Vendor Payout') badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
                if (txn.type === 'Rider Settlement') badgeColor = 'text-amber-700 bg-amber-50 border-amber-100';
                if (txn.type === 'Wallet Deduction') badgeColor = 'text-rose-700 bg-rose-50 border-rose-100';

                return (
                  <div key={txn.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex flex-col justify-between text-xs gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-400 text-[10px]">{txn.id}</span>
                      <span className={`px-2 py-0.5 rounded-md font-extrabold text-[9px] border ${badgeColor}`}>
                        {txn.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 font-bold">{txn.targetName}</span>
                      <span className="font-mono font-extrabold text-slate-900">₹{txn.amount}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">"{txn.remarks}"</p>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 border-t pt-1 border-dashed border-slate-200">
                      <span>Target: {txn.targetRole}</span>
                      <span>{txn.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Bhopal Logistics System Ledger</span>
            <span className="font-mono font-bold text-emerald-600 animate-pulse flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span> Secure Audit Live
            </span>
          </div>
        </div>

      </div>

      {/* Sleek dispatch terminal events ticker */}
      <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
        <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm mb-3">
          <Clock size={16} className="text-indigo-600" />
          Terminal Logistics Event Log (Recent Dispatch Pipeline)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {orders.slice(0, 4).map((order) => {
            let statusBadge = 'text-blue-700 bg-blue-50 border-blue-100';
            if (order.status === 'Delivered') statusBadge = 'text-emerald-700 bg-emerald-50 border-emerald-100';
            if (order.status === 'Cancelled') statusBadge = 'text-rose-700 bg-rose-50 border-rose-100';
            if (order.status === 'Preparing') statusBadge = 'text-amber-700 bg-amber-50 border-amber-100';

            return (
              <div key={order.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800 text-[11px]">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusBadge}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Customer <strong>{order.customerName}</strong> ordered from restaurant <strong>{order.vendorName}</strong>.
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-1 border-slate-150 font-medium">
                  <span>Method: {order.paymentMethod}</span>
                  <span className="font-bold text-indigo-600">₹{order.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
