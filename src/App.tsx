import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_VENDORS, 
  INITIAL_RIDERS, 
  INITIAL_ORDERS, 
  INITIAL_PAYMENT_SETTINGS, 
  INITIAL_COMMISSION_SETTINGS, 
  INITIAL_DELIVERY_CHARGE_SETTINGS, 
  INITIAL_AREA_ZONES, 
  INITIAL_BANNERS, 
  INITIAL_COUPONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_AUDIT_LOGS
} from './data';
import { Customer, Vendor, Rider, Order, PaymentSettings, CommissionSettings, DeliveryChargeSettings, AreaZone, Banner, Coupon, NotificationLog, SystemSettings, AuditLog } from './types';
import { Language, LANGUAGES, TRANSLATIONS } from './lib/translations';

// Tab Components Imports
import DashboardTab from './components/DashboardTab';
import { CustomerManagementTab, VendorManagementTab, RiderManagementTab } from './components/CoreManagementTabs';
import { OrderManagementTab, LiveTrackingTab } from './components/OrderManagementTabs';
import { 
  PaymentManagementTab, 
  CommissionManagementTab, 
  DeliveryManagementTab, 
  AreaManagementTab, 
  MarketingTab, 
  SystemSettingsTab 
} from './components/SystemConfigTabs';
import SupportCenterTab from './components/SupportCenterTab';
import AuthPortal from './components/AuthPortal';
import RevenueReportsTab from './components/RevenueReportsTab';

// Icons Import
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Bike, 
  ShoppingBag, 
  Compass, 
  CreditCard, 
  Percent, 
  Truck, 
  MapPin, 
  Megaphone, 
  Settings, 
  Menu, 
  X, 
  Power, 
  ChevronRight, 
  Bell, 
  Activity,
  UserCheck,
  LifeBuoy,
  Send,
  Languages,
  Globe,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  // Global States representing our Live Admin DB
  const [customers, setCustomers] = useState<Customer[]>(() => 
    INITIAL_CUSTOMERS.map(c => ({
      ...c,
      password: c.password || 'cust@123',
      isSuspended: c.status === 'Blocked'
    }))
  );
  const [vendors, setVendors] = useState<Vendor[]>(() => 
    INITIAL_VENDORS.map(v => ({
      ...v,
      password: v.password || 'vend@123',
      isSuspended: v.isSuspended || false
    }))
  );
  const [riders, setRiders] = useState<Rider[]>(() => 
    INITIAL_RIDERS.map(r => ({
      ...r,
      password: r.password || 'rider@123',
      isSuspended: r.isSuspended || false
    }))
  );
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(INITIAL_PAYMENT_SETTINGS);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>(INITIAL_COMMISSION_SETTINGS);
  const [deliverySettings, setDeliverySettings] = useState<DeliveryChargeSettings>(INITIAL_DELIVERY_CHARGE_SETTINGS);
  const [zones, setZones] = useState<AreaZone[]>(INITIAL_AREA_ZONES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // App Layout States
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (path: string): string => {
    if (path.startsWith('/customers')) return 'customers';
    if (path.startsWith('/vendors')) return 'vendors';
    if (path.startsWith('/riders')) return 'riders';
    if (path.startsWith('/orders/all-orders')) return 'orders';
    if (path.startsWith('/orders/live-tracking')) return 'tracking';
    if (path.startsWith('/finance/commission')) return 'commission';
    if (path.startsWith('/reports/revenue')) return 'revenue';
    if (path.startsWith('/payment')) return 'payment';
    if (path.startsWith('/delivery')) return 'delivery';
    if (path.startsWith('/areas')) return 'areas';
    if (path.startsWith('/marketing')) return 'marketing';
    if (path.startsWith('/support')) return 'support';
    if (path.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(() => getTabFromPath(location.pathname));

  React.useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('admin_authenticated') === 'true');
  const [activeProfile, setActiveProfile] = useState<'Super Admin' | 'Support' | 'Operations'>(() => {
    const saved = localStorage.getItem('current_admin_profile');
    if (saved === 'Support' || saved === 'Operations' || saved === 'Super Admin') {
      return saved;
    }
    return 'Super Admin';
  });
  const [unreadAlerts, setUnreadAlerts] = useState<number>(3);
  const [activeLanguage, setActiveLanguage] = useState<Language>('en');

  const t = TRANSLATIONS[activeLanguage];

  const handleLoginSuccess = (profile: 'Super Admin' | 'Support' | 'Operations') => {
    setActiveProfile(profile);
    setIsAuthenticated(true);
  };

  const addAuditLog = (action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      action,
      category,
      details,
      adminUser: activeProfile,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.42'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Global Notification modal states
  const [globalNotifOpen, setGlobalNotifOpen] = useState(false);
  const [globalNotifTitle, setGlobalNotifTitle] = useState('');
  const [globalNotifMessage, setGlobalNotifMessage] = useState('');
  const [globalNotifTarget, setGlobalNotifTarget] = useState<'All' | 'Customers' | 'Vendors' | 'Riders'>('All');

  const handleSendGlobalNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalNotifTitle.trim() || !globalNotifMessage.trim()) return;

    const newLog: NotificationLog = {
      id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
      title: globalNotifTitle,
      message: globalNotifMessage,
      target: globalNotifTarget,
      timestamp: new Date().toISOString()
    };
    
    handleAddNotification(newLog);
    addAuditLog('Global Push Broadcasted', 'Marketing', `Broadcasted notification "${globalNotifTitle}" to target group: ${globalNotifTarget}.`);
    
    // Clear & Close
    setGlobalNotifTitle('');
    setGlobalNotifMessage('');
    setGlobalNotifTarget('All');
    setGlobalNotifOpen(false);
  };

  // Core modification functions to cascade updates across modules
  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    const old = customers.find(c => c.id === updatedCustomer.id);
    if (old) {
      if (old.status !== updatedCustomer.status || old.isSuspended !== updatedCustomer.isSuspended) {
        const isBlocked = updatedCustomer.status === 'Blocked' || updatedCustomer.isSuspended;
        addAuditLog(
          `Customer Status Toggled`,
          'Status Toggle',
          `Customer ${updatedCustomer.id} (${updatedCustomer.name}) status changed to ${isBlocked ? 'Blocked/Suspended' : 'Active'}.`
        );
      }
    }
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleAddCustomer = (freshCustomer: Customer) => {
    setCustomers([freshCustomer, ...customers]);
    addAuditLog('New Customer Created', 'Status Toggle', `Registered new customer ${freshCustomer.id} (${freshCustomer.name}).`);
  };

  const handleUpdateVendor = (updatedVendor: Vendor) => {
    const old = vendors.find(v => v.id === updatedVendor.id);
    if (old) {
      if (old.status !== updatedVendor.status || old.isSuspended !== updatedVendor.isSuspended) {
        addAuditLog(
          `Vendor Status Toggled`,
          'Status Toggle',
          `Vendor ${updatedVendor.id} (${updatedVendor.name}) changed status to ${updatedVendor.status === 'Approved' ? 'Approved' : 'Pending'}${updatedVendor.isSuspended ? ' & Suspended' : ' & Active'}.`
        );
      }
    }
    setVendors(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
  };

  const handleAddVendor = (freshVendor: Vendor) => {
    setVendors([freshVendor, ...vendors]);
    addAuditLog('New Vendor Registered', 'Status Toggle', `Onboarded vendor ${freshVendor.id} (${freshVendor.name}) in pending approval pool.`);
  };

  const handleUpdateRider = (updatedRider: Rider) => {
    const old = riders.find(r => r.id === updatedRider.id);
    if (old) {
      if (old.status !== updatedRider.status || old.isSuspended !== updatedRider.isSuspended || old.approvalStatus !== updatedRider.approvalStatus) {
        let details = `Rider ${updatedRider.id} (${updatedRider.name}) details altered: `;
        if (old.isSuspended !== updatedRider.isSuspended) {
          details += `Suspension flipped to ${updatedRider.isSuspended ? 'Suspended' : 'Active'}. `;
        }
        if (old.status !== updatedRider.status) {
          details += `Presence work status toggled to ${updatedRider.status}. `;
        }
        if (old.approvalStatus !== updatedRider.approvalStatus) {
          details += `Approval state changed to ${updatedRider.approvalStatus}. `;
        }
        addAuditLog(`Rider Status Modified`, 'Status Toggle', details);
      }
    }
    setRiders(riders.map(r => r.id === updatedRider.id ? updatedRider : r));
  };

  const handleAddRider = (freshRider: Rider) => {
    setRiders([freshRider, ...riders]);
    addAuditLog('New Rider Registered', 'Status Toggle', `Onboarded rider ${freshRider.id} (${freshRider.name}) with vehicle ${freshRider.vehicleNumber}.`);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    const old = orders.find(o => o.id === updatedOrder.id);
    if (old && old.status !== updatedOrder.status) {
      addAuditLog('Order Status Overridden', 'System Settings', `Order ${updatedOrder.id} status modified from ${old.status} to ${updatedOrder.status}.`);
    }
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleDeliverOrder = (order: Order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'Delivered' } : o));
    addAuditLog('Order Force Delivered', 'System Settings', `Admin force-completed delivery settlement for Order ${order.id}.`);
  };

  const handleAddNotification = (newLog: NotificationLog) => {
    setNotifications([newLog, ...notifications]);
    setUnreadAlerts(prev => prev + 1);
  };

  const handleUpdatePaymentSettings = (updated: PaymentSettings) => {
    if (paymentSettings.codEnabled !== updated.codEnabled) {
      addAuditLog(
        `COD Checkout Toggled`,
        'Payment Switch',
        `Cash on Delivery checkout was ${updated.codEnabled ? 'ENABLED' : 'DISABLED'} globally.`
      );
    }
    if (paymentSettings.onlineEnabled !== updated.onlineEnabled) {
      addAuditLog(
        `Online Checkout Toggled`,
        'Payment Switch',
        `Online Payments (gateways) checkout was ${updated.onlineEnabled ? 'ENABLED' : 'DISABLED'} globally.`
      );
    }
    if (paymentSettings.activeGateway !== updated.activeGateway) {
      addAuditLog(
        `Payment Gateway Switched`,
        'Payment Switch',
        `Active gateway switched from ${paymentSettings.activeGateway} to ${updated.activeGateway}.`
      );
    }
    if (paymentSettings.upiId !== updated.upiId) {
      addAuditLog(
        `Company UPI Updated`,
        'Payment Switch',
        `Corporate UPI target ID changed to ${updated.upiId}.`
      );
    }
    setPaymentSettings(updated);
  };

  const handleUpdateCommissionSettings = (updated: CommissionSettings) => {
    if (commissionSettings.vendorCommissionPercentage !== updated.vendorCommissionPercentage) {
      addAuditLog(
        `Vendor Commission Rate Changed`,
        'Commission',
        `Default vendor commission rate modified from ${commissionSettings.vendorCommissionPercentage}% to ${updated.vendorCommissionPercentage}%.`
      );
    }
    if (commissionSettings.platformFee !== updated.platformFee) {
      addAuditLog(
        `Platform Service Fee Modified`,
        'Commission',
        `Flat platform service fee modified from ₹${commissionSettings.platformFee} to ₹${updated.platformFee}.`
      );
    }
    if (commissionSettings.gstPercentage !== updated.gstPercentage) {
      addAuditLog(
        `Corporate GST Rate Modified`,
        'Commission',
        `GST rate changed from ${commissionSettings.gstPercentage}% to ${updated.gstPercentage}%.`
      );
    }
    if (commissionSettings.extraCharges !== updated.extraCharges) {
      addAuditLog(
        `Packaging Charges Modified`,
        'Commission',
        `Flat packing and merchant charges set to ₹${updated.extraCharges}.`
      );
    }
    setCommissionSettings(updated);
  };

  const handleUpdateDeliverySettings = (updated: DeliveryChargeSettings) => {
    let details = 'Distance delivery price rules adjusted: ';
    if (deliverySettings.charge0to3km !== updated.charge0to3km) {
      details += `0-3KM charge changed from ₹${deliverySettings.charge0to3km} to ₹${updated.charge0to3km}. `;
    }
    if (deliverySettings.charge3to5km !== updated.charge3to5km) {
      details += `3-5KM charge changed from ₹${deliverySettings.charge3to5km} to ₹${updated.charge3to5km}. `;
    }
    if (deliverySettings.chargeAbove5kmPerKm !== updated.chargeAbove5kmPerKm) {
      details += `>5KM rate changed from ₹${deliverySettings.chargeAbove5kmPerKm}/KM to ₹${updated.chargeAbove5kmPerKm}/KM. `;
    }
    addAuditLog(`Delivery Price Rules Updated`, 'Zones', details);
    setDeliverySettings(updated);
  };

  const handleUpdateZonesWithAudit = (updatedZones: AreaZone[]) => {
    addAuditLog(`Area Coverage Zones Updated`, 'Zones', `Bhopal coverage boundary matrix updated. Total zones: ${updatedZones.length}.`);
    setZones(updatedZones);
  };

  const handleUpdateCouponsWithAudit = (updatedCoupons: Coupon[]) => {
    if (coupons.length < updatedCoupons.length) {
      const added = updatedCoupons[updatedCoupons.length - 1];
      addAuditLog(
        `Promo Coupon Created`,
        'Coupons',
        `New coupon ${added.code} was created with ${added.discountPercentage}% discount (Max ₹${added.maxDiscount}, Min order ₹${added.minOrderValue}).`
      );
    } else {
      addAuditLog(`Coupons Modified`, 'Coupons', `Promo coupon table revised.`);
    }
    setCoupons(updatedCoupons);
  };

  const handleUpdateSystemSettingsWithAudit = (updated: SystemSettings) => {
    if (systemSettings.companyName !== updated.companyName) {
      addAuditLog(`Registered Name Updated`, 'System Settings', `Corporate legal name changed to "${updated.companyName}".`);
    }
    if (systemSettings.logoUrl !== updated.logoUrl) {
      addAuditLog(`Corporate Logo Updated`, 'System Settings', `Accent brand asset image changed.`);
    }
    if (systemSettings.supportEmail !== updated.supportEmail || systemSettings.supportPhone !== updated.supportPhone) {
      addAuditLog(`Contact Registries Modified`, 'System Settings', `Support email set to ${updated.supportEmail}, Phone set to ${updated.supportPhone}.`);
    }
    setSystemSettings(updated);
  };

  // Nav definitions
  const sidebarItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'customers', label: t.customers, icon: Users },
    { id: 'vendors', label: t.vendors, icon: Store },
    { id: 'riders', label: t.riders, icon: Bike },
    { id: 'orders', label: t.orders, icon: ShoppingBag },
    { id: 'tracking', label: t.tracking, icon: Compass },
    { id: 'payment', label: t.payment, icon: CreditCard },
    { id: 'commission', label: t.commission, icon: Percent },
    { id: 'delivery', label: t.delivery, icon: Truck },
    { id: 'areas', label: t.areas, icon: MapPin },
    { id: 'marketing', label: t.marketing, icon: Megaphone },
    { id: 'support', label: t.support, icon: LifeBuoy },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  const handleTabSelect = (tabId: string) => {
    setSidebarOpen(false); // Close mobile drawer
    switch (tabId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'customers':
        navigate('/customers');
        break;
      case 'vendors':
        navigate('/vendors');
        break;
      case 'riders':
        navigate('/riders');
        break;
      case 'orders':
        navigate('/orders/all-orders');
        break;
      case 'tracking':
        navigate('/orders/live-tracking');
        break;
      case 'payment':
        navigate('/payment');
        break;
      case 'commission':
        navigate('/finance/commission');
        break;
      case 'delivery':
        navigate('/delivery');
        break;
      case 'areas':
        navigate('/areas');
        break;
      case 'marketing':
        navigate('/marketing');
        break;
      case 'support':
        navigate('/support');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'revenue':
        navigate('/reports/revenue');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Render correct panel based on activeTab state
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab 
            activeLanguage={activeLanguage}
            customers={customers} 
            vendors={vendors} 
            riders={riders} 
            orders={orders} 
            onUpdateCustomer={handleUpdateCustomer}
            onUpdateVendor={handleUpdateVendor}
            onUpdateRider={handleUpdateRider}
          />
        );
      case 'customers':
        return <CustomerManagementTab activeLanguage={activeLanguage} customers={customers} orders={orders} onUpdateCustomer={handleUpdateCustomer} onAddCustomer={handleAddCustomer} />;
      case 'vendors':
        return <VendorManagementTab activeLanguage={activeLanguage} vendors={vendors} onUpdateVendor={handleUpdateVendor} onAddVendor={handleAddVendor} />;
      case 'riders':
        return <RiderManagementTab activeLanguage={activeLanguage} riders={riders} orders={orders} onUpdateRider={handleUpdateRider} onAddRider={handleAddRider} />;
      case 'orders':
        return (
          <OrderManagementTab 
            activeLanguage={activeLanguage}
            orders={orders} 
            riders={riders} 
            customers={customers} 
            vendors={vendors} 
            zones={zones}
            onUpdateOrder={handleUpdateOrder} 
            onUpdateRider={handleUpdateRider} 
            onUpdateCustomer={handleUpdateCustomer} 
            onUpdateVendor={handleUpdateVendor} 
          />
        );
      case 'tracking':
        return (
          <LiveTrackingTab 
            activeLanguage={activeLanguage}
            orders={orders} 
            onUpdateOrder={handleUpdateOrder} 
            riders={riders} 
            onUpdateRider={handleUpdateRider} 
            onDeliverOrder={handleDeliverOrder} 
          />
        );
      case 'payment':
        return <PaymentManagementTab activeLanguage={activeLanguage} settings={paymentSettings} onUpdateSettings={handleUpdatePaymentSettings} />;
      case 'commission':
        return <CommissionManagementTab activeLanguage={activeLanguage} settings={commissionSettings} onUpdateSettings={handleUpdateCommissionSettings} />;
      case 'delivery':
        return <DeliveryManagementTab activeLanguage={activeLanguage} settings={deliverySettings} onUpdateSettings={handleUpdateDeliverySettings} />;
      case 'areas':
        return <AreaManagementTab activeLanguage={activeLanguage} zones={zones} onUpdateZones={handleUpdateZonesWithAudit} />;
      case 'marketing':
        return (
          <MarketingTab 
            activeLanguage={activeLanguage}
            banners={banners} 
            onUpdateBanners={setBanners} 
            coupons={coupons} 
            onUpdateCoupons={handleUpdateCouponsWithAudit} 
            notifications={notifications} 
            onAddNotification={handleAddNotification} 
          />
        );
      case 'support':
        return (
          <SupportCenterTab 
            activeLanguage={activeLanguage}
            customers={customers} 
            vendors={vendors} 
            riders={riders} 
          />
        );
      case 'settings':
        return (
          <SystemSettingsTab 
            activeLanguage={activeLanguage}
            settings={systemSettings} 
            onUpdateSettings={handleUpdateSystemSettingsWithAudit} 
            auditLogs={auditLogs}
            onClearLogs={() => {
              setAuditLogs([]);
              addAuditLog('Audit Trails Cleared', 'Security', 'All records in system audit trails have been wiped.');
            }}
            addAuditLog={addAuditLog}
            onSelectLanguage={setActiveLanguage}
          />
        );
      case 'revenue':
        return (
          <RevenueReportsTab 
            activeLanguage={activeLanguage}
            orders={orders}
            vendors={vendors}
          />
        );
      default:
        return (
          <DashboardTab 
            activeLanguage={activeLanguage}
            customers={customers} 
            vendors={vendors} 
            riders={riders} 
            orders={orders} 
            onUpdateCustomer={handleUpdateCustomer}
            onUpdateVendor={handleUpdateVendor}
            onUpdateRider={handleUpdateRider}
          />
        );
    }
  };


  if (!isAuthenticated) {
    return (
      <AuthPortal 
        onLoginSuccess={handleLoginSuccess}
        addAuditLog={addAuditLog}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" id="main-admin-layout">

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="admin-sidebar"
      >
        {/* Sidebar Header Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <img 
                src={systemSettings.logoUrl} 
                alt="Logo" 
                className="h-8 w-8 rounded-lg object-cover border border-slate-700 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-bold text-white tracking-tight text-[13px] block">TING TONG BHOPAL</span>
                <span className="text-[9px] text-indigo-400 font-bold block uppercase tracking-wider">Foods Delivery</span>
              </div>
            </div>
            
            {/* Mobile close toggle */}
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]" id="sidebar-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white/80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold border border-slate-700 shrink-0">
                BE
              </div>
              <div className="min-w-0">
                <span className="font-bold text-white block truncate">{activeProfile} Mode</span>
                <span className="text-[10px] text-slate-500 block truncate">Bhopal Hub HQ</span>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('admin_authenticated');
                setIsAuthenticated(false);
                addAuditLog('Admin Logged Out', 'Security', `Administrator manually logged out of session.`);
              }}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-all shrink-0"
              title="Logout Session"
              id="sidebar-logout-btn"
            >
              <Power size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 2. MAIN CORE LAYOUT CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto" id="main-scrollable-container">
        
        {/* Layout Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 shadow-xs" id="main-header">
          <div className="flex items-center gap-3">
            {/* Mobile menu humburg toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl"
              id="hamburger-toggle"
            >
              <Menu size={18} />
            </button>

            {activeTab !== 'dashboard' && (
              <button
                onClick={() => handleTabSelect('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all border border-indigo-100 shadow-2xs group shrink-0 cursor-pointer"
                id="header-back-button"
              >
                <ArrowLeft size={14} className="stroke-[2.5px] group-hover:-translate-x-0.5 transition-transform text-indigo-600" />
                <span>{t.back}</span>
              </button>
            )}
            
            <div className="hidden sm:flex items-center gap-3 text-xs" id="header-diagnostics">
              <span className="text-slate-400 font-medium">{t.hubLabel}</span>
              <span className="text-slate-200">|</span>
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Activity size={12} className="text-emerald-500 animate-pulse" />
                {t.signalLabel} <strong>100%</strong>
              </span>
            </div>
          </div>

          {/* Settings & Profile Switches */}
          <div className="flex items-center gap-4">

            {/* Header Company Branding */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 border border-indigo-100/60 rounded-xl" id="header-company-name">
              <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 animate-pulse" />
              <span className="font-extrabold text-xs text-indigo-950 tracking-tight truncate max-w-[140px] sm:max-w-none">
                Ting Tong Bhopal
              </span>
            </div>

            {/* Quick Dispatch Notification Button */}
            <button
              onClick={() => setGlobalNotifOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all animate-pulse hover:animate-none shrink-0"
              id="global-alert-btn"
              title={t.broadcasterTooltip}
            >
              <Megaphone size={14} className="text-indigo-200" />
              <span className="hidden sm:inline">{t.broadcasterBtn}</span>
            </button>

            {/* Notifications Alert Center */}
            <button 
              onClick={() => {
                setUnreadAlerts(0);
                navigate('/marketing'); // Navigate to Marketing tab log to see notifications
              }}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-150 rounded-xl relative transition-all"
              id="alert-bell-button"
            >
              <Bell size={18} />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-600 text-[9px] text-white font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Tab Viewport */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto" id="viewport-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Broadcast Notification Modal Dialog (Anytime Alert Manager) */}
      {globalNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-100 shadow-2xl mx-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-rose-500"></div>
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Megaphone className="text-indigo-600" size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Central Alert Broadcaster</h3>
                  <p className="text-[10px] text-slate-400">Dispatch live push banner alerts anytime</p>
                </div>
              </div>
              <button 
                onClick={() => setGlobalNotifOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendGlobalNotif} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Audience Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['All', 'Customers', 'Vendors', 'Riders'] as const).map(target => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => setGlobalNotifTarget(target)}
                      className={`py-2 px-1 text-center rounded-xl font-bold border transition-all text-[10px] ${
                        globalNotifTarget === target
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {target === 'All' ? 'Everyone' : target}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhopal heavy rain waterlogging alert! 🌧️"
                  value={globalNotifTitle}
                  onChange={(e) => setGlobalNotifTitle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Detailed Notification Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Expected delays in Arera Colony & Kolar Road delivery logistics. Safe speed limit enforced."
                  value={globalNotifMessage}
                  onChange={(e) => setGlobalNotifMessage(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGlobalNotifOpen(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send size={13} /> Broadcast Live Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
