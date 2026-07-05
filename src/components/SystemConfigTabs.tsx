import React, { useState, useEffect } from 'react';
import { 
  PaymentSettings, 
  CommissionSettings, 
  DeliveryChargeSettings, 
  AreaZone, 
  Banner, 
  Coupon, 
  NotificationLog, 
  SystemSettings,
  AuditLog
} from '../types';
import { Language, LANGUAGES, TRANSLATIONS } from '../lib/translations';
import { 
  CreditCard, 
  Percent, 
  Truck, 
  MapPin, 
  Megaphone, 
  Settings, 
  Sliders, 
  QrCode, 
  Shield, 
  Plus, 
  X, 
  Check, 
  Power, 
  Send, 
  Lock, 
  DollarSign, 
  Clock, 
  UserCheck,
  Upload,
  Trash2,
  History,
  ClipboardCopy,
  Filter,
  Search,
  FileText,
  Languages,
  Globe
} from 'lucide-react';

// ==========================================
// 1. PAYMENT MANAGEMENT COMPONENT
// ==========================================
interface PaymentManagementTabProps {
  activeLanguage?: Language;
  settings: PaymentSettings;
  onUpdateSettings: (settings: PaymentSettings) => void;
}

export function PaymentManagementTab(props: PaymentManagementTabProps) {
  const { settings, onUpdateSettings } = props;
  const [upiIdInput, setUpiIdInput] = useState(settings.upiId);
  const [qrCodeUrlInput, setQrCodeUrlInput] = useState(settings.qrCodeUrl);
  const [qrColorTheme, setQrColorTheme] = useState<'slate' | 'indigo' | 'emerald' | 'orange'>('indigo');

  useEffect(() => {
    setUpiIdInput(settings.upiId);
    setQrCodeUrlInput(settings.qrCodeUrl);
  }, [settings]);

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      upiId: upiIdInput,
      qrCodeUrl: qrCodeUrlInput
    });
    alert('Merchant UPI ID & corporate QR Code configuration updated successfully.');
  };

  const toggleCOD = () => {
    onUpdateSettings({
      ...settings,
      codEnabled: !settings.codEnabled
    });
  };

  const toggleOnline = () => {
    onUpdateSettings({
      ...settings,
      onlineEnabled: !settings.onlineEnabled
    });
  };

  const changeGateway = (gateway: 'Razorpay' | 'Stripe' | 'Paytm' | 'Cashfree') => {
    onUpdateSettings({
      ...settings,
      activeGateway: gateway
    });
  };

  const getThemeColor = () => {
    switch (qrColorTheme) {
      case 'slate': return 'bg-slate-900 border-slate-700';
      case 'indigo': return 'bg-indigo-900 border-indigo-700';
      case 'emerald': return 'bg-emerald-900 border-emerald-700';
      case 'orange': return 'bg-orange-900 border-orange-700';
    }
  };

  return (
    <div className="space-y-6" id="payment-management-tab">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="text-indigo-600" size={20} />
          Payment Gateway & Merchant Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Configure company QR codes, active banking UPIs, and toggle COD or online checkout switches</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UPI and Gateways */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Merchant Settings</h3>
          
          <form onSubmit={handleSavePaymentConfig} className="space-y-4">
            {/* UPI ID Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Company UPI ID</label>
              <input
                type="text"
                required
                value={upiIdInput}
                onChange={(e) => setUpiIdInput(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                placeholder="e.g. bhopal.admin@okaxis"
              />
            </div>

            {/* QR Code URL Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant QR Code URL</label>
                <button
                  type="button"
                  onClick={() => {
                    const generated = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiIdInput}&pn=BhopalLogistics&am=0`;
                    setQrCodeUrlInput(generated);
                  }}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider transition-colors"
                >
                  Generate from UPI
                </button>
              </div>
              <input
                type="text"
                required
                value={qrCodeUrlInput}
                onChange={(e) => setQrCodeUrlInput(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                placeholder="https://example.com/qr-code.png"
              />
            </div>

            {/* Upload QR Image */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Or Upload QR Image File</label>
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all text-center">
                <Upload size={16} className="text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-600">Choose QR Code image file</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setQrCodeUrlInput(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={14} /> Save UPI & QR Configuration
            </button>
          </form>

          {/* Payment Switches */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant Methods</label>
            
            {/* COD Switch */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <span className="font-bold text-slate-700 text-xs block">Cash On Delivery (COD)</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Allow riders to accept cash on delivery handovers</span>
              </div>
              <button
                onClick={toggleCOD}
                className={`p-1.5 rounded-lg transition-all ${
                  settings.codEnabled 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-400 bg-slate-100'
                }`}
              >
                <Power size={18} />
              </button>
            </div>

            {/* Online Switch */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <span className="font-bold text-slate-700 text-xs block">Online Payments checkout</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Enable instant gateway billing (UPI, Netbanking, Cards)</span>
              </div>
              <button
                onClick={toggleOnline}
                className={`p-1.5 rounded-lg transition-all ${
                  settings.onlineEnabled 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-400 bg-slate-100'
                }`}
              >
                <Power size={18} />
              </button>
            </div>
          </div>

          {/* Gateway Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Payment Gateway</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Razorpay', 'Stripe', 'Paytm', 'Cashfree'] as const).map(gw => (
                <button
                  key={gw}
                  onClick={() => changeGateway(gw)}
                  className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                    settings.activeGateway === gw
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <span className="block">{gw}</span>
                  <span className="text-[9px] text-slate-400 font-medium mt-0.5 block">Gateway Ready</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic styled QR Code view */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Live Company QR Code Preview</h3>
            
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-slate-400 font-semibold">QR Accents:</span>
              {(['slate', 'indigo', 'emerald', 'orange'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => setQrColorTheme(theme)}
                  className={`w-4 h-4 rounded-full border ${
                    theme === 'slate' ? 'bg-slate-900 border-slate-700' :
                    theme === 'indigo' ? 'bg-indigo-600 border-indigo-400' :
                    theme === 'emerald' ? 'bg-emerald-600 border-emerald-400' : 'bg-orange-600 border-orange-400'
                  } ${qrColorTheme === theme ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                />
              ))}
            </div>

            {/* Simulated Vector QR Card */}
            <div className={`mt-5 p-5 rounded-2xl border text-white text-center max-w-xs mx-auto ${getThemeColor()} shadow-md`}>
              <span className="font-bold uppercase tracking-wider text-[10px] block">Bhopal Express Logistics</span>
              <span className="text-[9px] text-white/75 mt-0.5 block">Scan here to pay merchants instantly</span>
              
              <div className="bg-white p-3.5 rounded-xl mt-4 w-40 h-40 mx-auto flex items-center justify-center border border-white/20 shadow-inner">
                <img 
                  src={settings.qrCodeUrl} 
                  alt="Company UPI QR" 
                  className="w-full h-full" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 font-mono text-[10px] bg-black/25 py-1 px-2.5 rounded-md inline-block max-w-full truncate">
                {settings.upiId}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed text-center mt-4">
            This QR Code is dynamically linked to your corporate UPI node. Any food order with an Online status checks routing tables instantly.
          </p>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 2. COMMISSION MANAGEMENT COMPONENT
// ==========================================
interface CommissionManagementTabProps {
  activeLanguage?: Language;
  settings: CommissionSettings;
  onUpdateSettings: (settings: CommissionSettings) => void;
}

export function CommissionManagementTab(props: CommissionManagementTabProps) {
  const { settings, onUpdateSettings } = props;
  const [calculatorBasePrice, setCalculatorBasePrice] = useState(500);

  const updateCommissionPercentage = (val: number) => {
    onUpdateSettings({ ...settings, vendorCommissionPercentage: val });
  };

  const updatePlatformFee = (val: number) => {
    onUpdateSettings({ ...settings, platformFee: val });
  };

  const updateGstPercentage = (val: number) => {
    onUpdateSettings({ ...settings, gstPercentage: val });
  };

  const updateExtraCharges = (val: number) => {
    onUpdateSettings({ ...settings, extraCharges: val });
  };

  // Live order calculations
  const platformRateAmt = (calculatorBasePrice * settings.vendorCommissionPercentage) / 100;
  const gstAmt = (calculatorBasePrice * settings.gstPercentage) / 100;
  const customerPaysTotal = calculatorBasePrice + settings.platformFee + gstAmt + settings.extraCharges + 30; // ₹30 is flat delivery charge
  const vendorReceivesShare = calculatorBasePrice - platformRateAmt;
  const adminPlatformKeepsTotal = platformRateAmt + settings.platformFee;

  return (
    <div className="space-y-6" id="commission-tab">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Percent className="text-indigo-600" size={20} />
          Commission & Platform Fees Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Control default vendor commission shares, fixed platform service fees, corporate GST rules, and packaging charges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders and Inputs */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Corporate Settings</h3>

          {/* Slider 1: Vendor Commission */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">Default Vendor Commission</span>
              <span className="font-mono font-bold text-indigo-600 text-sm">{settings.vendorCommissionPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={settings.vendorCommissionPercentage}
              onChange={(e) => updateCommissionPercentage(parseInt(e.target.value) || 0)}
              className="w-full accent-indigo-600"
            />
            <p className="text-[10px] text-slate-400">Percentage sliced from vendor subtotal on completed delivery checks</p>
          </div>

          {/* Input 1: Platform Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Platform Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.platformFee}
                onChange={(e) => updatePlatformFee(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Corporate GST (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={settings.gstPercentage}
                onChange={(e) => updateGstPercentage(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Packaging Charge (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.extraCharges}
                onChange={(e) => updateExtraCharges(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Live Bill Breakdown Simulator */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Live Order Fee Breakdown Simulator</h3>
          
          <div className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">Enter Food Base Price (₹)</label>
              <input
                type="number"
                min="10"
                value={calculatorBasePrice}
                onChange={(e) => setCalculatorBasePrice(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Calculation Blocks */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <span className="text-[9px] text-blue-500 uppercase font-bold block">Customer Pays</span>
                <span className="font-mono font-bold text-blue-800 text-sm mt-1 block">₹{customerPaysTotal.toFixed(1)}</span>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <span className="text-[9px] text-orange-500 uppercase font-bold block">Vendor Share</span>
                <span className="font-mono font-bold text-orange-800 text-sm mt-1 block">₹{vendorReceivesShare.toFixed(1)}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <span className="text-[9px] text-emerald-500 uppercase font-bold block">Platform Net Keeps</span>
                <span className="font-mono font-bold text-emerald-800 text-sm mt-1 block">₹{adminPlatformKeepsTotal.toFixed(1)}</span>
              </div>
            </div>

            {/* Diagnostics sheet */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Food base price subtotal:</span>
                <span className="font-mono font-bold text-slate-700">₹{calculatorBasePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform commission slice ({settings.vendorCommissionPercentage}%):</span>
                <span className="font-mono font-bold text-slate-700">₹{platformRateAmt.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee:</span>
                <span className="font-mono font-bold text-slate-700">₹{settings.platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({settings.gstPercentage}%):</span>
                <span className="font-mono font-bold text-slate-700">₹{gstAmt.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Extra Packaging + Flat Delivery (₹30):</span>
                <span className="font-mono font-bold text-slate-700">₹{settings.extraCharges + 30}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 3. DELIVERY MANAGEMENT COMPONENT
// ==========================================
interface DeliveryManagementTabProps {
  activeLanguage?: Language;
  settings: DeliveryChargeSettings;
  onUpdateSettings: (settings: DeliveryChargeSettings) => void;
}

export function DeliveryManagementTab(props: DeliveryManagementTabProps) {
  const { settings, onUpdateSettings } = props;
  const [calculatorDistance, setCalculatorDistance] = useState(4.2);

  const calculateCharge = (km: number) => {
    if (km <= 3) return settings.charge0to3km;
    if (km <= 5) return settings.charge3to5km;
    const extraKm = Math.ceil(km - 5);
    return settings.charge3to5km + extraKm * settings.chargeAbove5kmPerKm;
  };

  return (
    <div className="space-y-6" id="delivery-tab">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Truck className="text-indigo-600" size={20} />
          Automatic Delivery Charges Engine
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Control distance-based pricing algorithms for automated food dispatching services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rules configurator */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Distance Pricing Rules</h3>

          <div className="space-y-3 text-xs">
            {/* Rule 1: 0-3 KM */}
            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">0 to 3 KM (Flat Rate ₹)</label>
              <input
                type="number"
                min="0"
                value={settings.charge0to3km}
                onChange={(e) => onUpdateSettings({ ...settings, charge0to3km: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none"
              />
            </div>

            {/* Rule 2: 3-5 KM */}
            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">3 to 5 KM (Flat Rate ₹)</label>
              <input
                type="number"
                min="0"
                value={settings.charge3to5km}
                onChange={(e) => onUpdateSettings({ ...settings, charge3to5km: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none"
              />
            </div>

            {/* Rule 3: Above 5 KM */}
            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Above 5 KM (Per additional KM ₹)</label>
              <input
                type="number"
                min="0"
                value={settings.chargeAbove5kmPerKm}
                onChange={(e) => onUpdateSettings({ ...settings, chargeAbove5kmPerKm: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Distance Calculator */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Bhopal Distance Tester</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">Enter simulated delivery distance (KM)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={calculatorDistance}
                  onChange={(e) => setCalculatorDistance(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Result Block */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-800 text-xs block">Calculated Delivery Charge</span>
                  <span className="text-[10px] text-emerald-600 mt-0.5 block">Automated dynamic fee</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 text-2xl">₹{calculateCharge(calculatorDistance)}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed text-center mt-4 border-t pt-3 border-slate-100">
            This delivery charge matrix is parsed during order checkouts to compute precise logistical logistics overhead.
          </p>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 4. AREA MANAGEMENT (BHOPAL) COMPONENT
// ==========================================
interface AreaManagementTabProps {
  activeLanguage?: Language;
  zones: AreaZone[];
  onUpdateZones: (zones: AreaZone[]) => void;
}

export function AreaManagementTab(props: AreaManagementTabProps) {
  const { zones, onUpdateZones } = props;
  const [addingZone, setAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRadius, setNewZoneRadius] = useState(5);
  const [subAreaInput, setSubAreaInput] = useState('');
  const [activeInputZoneId, setActiveInputZoneId] = useState<string | null>(null);

  const toggleZoneStatus = (zoneId: string) => {
    const updated = zones.map(z => 
      z.id === zoneId ? { ...z, status: z.status === 'Active' ? 'Disabled' as const : 'Active' as const } : z
    );
    onUpdateZones(updated);
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    const freshZone: AreaZone = {
      id: `ZONE-${String.fromCharCode(65 + zones.length)}`,
      name: newZoneName,
      coverageRadiusKm: newZoneRadius,
      status: 'Active',
      subAreas: []
    };
    onUpdateZones([...zones, freshZone]);
    setAddingZone(false);
    setNewZoneName('');
  };

  const handleAddSubArea = (zoneId: string) => {
    if (!subAreaInput.trim()) return;
    const updated = zones.map(z => 
      z.id === zoneId ? { ...z, subAreas: [...z.subAreas, subAreaInput] } : z
    );
    onUpdateZones(updated);
    setSubAreaInput('');
    setActiveInputZoneId(null);
  };

  const handleDeleteSubArea = (zoneId: string, subArea: string) => {
    const updated = zones.map(z => 
      z.id === zoneId ? { ...z, subAreas: z.subAreas.filter(s => s !== subArea) } : z
    );
    onUpdateZones(updated);
  };

  return (
    <div className="space-y-6" id="area-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-indigo-600" size={20} />
            Bhopal Area & Coverage Zones
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Define geographic coverage zones, set radiuses, and toggle delivery availability for localities</p>
        </div>
        <button
          onClick={() => setAddingZone(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus size={15} /> Create Zone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="zones-layout-grid">
        {zones.map(zone => {
          const isActive = zone.status === 'Active';
          return (
            <div key={zone.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-sm">{zone.name}</h3>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500 font-bold">{zone.id}</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">Coverage Radius: <strong>{zone.coverageRadiusKm} KM</strong></span>
                </div>

                <button
                  onClick={() => toggleZoneStatus(zone.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                    isActive 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {zone.status}
                </button>
              </div>

              {/* Sub Areas list */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Covered Neighborhoods</span>
                <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                  {zone.subAreas.length === 0 ? (
                    <span className="text-slate-400 text-xs italic">No neighborhoods added yet.</span>
                  ) : (
                    zone.subAreas.map((sub, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="inline-flex items-center gap-1 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded text-[11px] text-slate-600 font-medium"
                      >
                        {sub}
                        <button onClick={() => handleDeleteSubArea(zone.id, sub)} className="text-slate-400 hover:text-rose-600 font-bold">
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Add Sub Area Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                {activeInputZoneId === zone.id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      placeholder="e.g. Shahpura Sector C"
                      value={subAreaInput}
                      onChange={(e) => setSubAreaInput(e.target.value)}
                      className="flex-1 p-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <button onClick={() => handleAddSubArea(zone.id)} className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold">
                      Add
                    </button>
                    <button onClick={() => setActiveInputZoneId(null)} className="px-2 py-1 text-slate-400">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveInputZoneId(zone.id)}
                    className="text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Neighborhood
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Zone Modal */}
      {addingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Create Delivery Zone</h3>
              <button onClick={() => setAddingZone(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddZone} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  placeholder="Kolar Sector-B Area"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Coverage Radius (KM)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={newZoneRadius}
                  onChange={(e) => setNewZoneRadius(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddingZone(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 5. MARKETING & CAMPAIGNS COMPONENT
// ==========================================
interface MarketingTabProps {
  activeLanguage?: Language;
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  notifications: NotificationLog[];
  onAddNotification: (log: NotificationLog) => void;
}

export function MarketingTab(props: MarketingTabProps) {
  const { banners, onUpdateBanners, coupons, onUpdateCoupons, notifications, onAddNotification } = props;
  
  // States
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPct, setNewCouponPct] = useState(20);
  const [newCouponMax, setNewCouponMax] = useState(100);
  const [newCouponMinVal, setNewCouponMinVal] = useState(200);

  const [pushTitle, setPushTitle] = useState('');
  const [pushMsg, setPushMsg] = useState('');
  const [pushTarget, setPushTarget] = useState<'All' | 'Customers' | 'Vendors' | 'Riders'>('All');

  const toggleBanner = (bannerId: string) => {
    const updated = banners.map(b => b.id === bannerId ? { ...b, active: !b.active } : b);
    onUpdateBanners(updated);
  };

  const toggleCoupon = (couponId: string) => {
    const updated = coupons.map(c => c.id === couponId ? { ...c, active: !c.active } : c);
    onUpdateCoupons(updated);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const fresh: Coupon = {
      id: `CPN-${Math.floor(200 + Math.random() * 800)}`,
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: newCouponPct,
      maxDiscount: newCouponMax,
      minOrderValue: newCouponMinVal,
      active: true
    };
    onUpdateCoupons([...coupons, fresh]);
    setAddingCoupon(false);
    setNewCouponCode('');
  };

  const handleBroadcastPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMsg.trim()) return;

    const freshLog: NotificationLog = {
      id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
      title: pushTitle,
      message: pushMsg,
      target: pushTarget,
      timestamp: new Date().toISOString()
    };
    onAddNotification(freshLog);
    setPushTitle('');
    setPushMsg('');
    alert(`Push Broadcast Dispatched: Broadcasted successfully to ${pushTarget} channels.`);
  };

  return (
    <div className="space-y-6" id="marketing-tab">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Megaphone className="text-indigo-600 font-bold" size={20} />
          Marketing, Promos & Broadcasts Hub
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Control active promotional banners, manage coupon discounts, and broadcast live push messages to mobile apps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="marketing-core">
        {/* Banner Controls & Coupons list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Promo Banners */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Banners Management</h3>
            
            <div className="space-y-3">
              {banners.map(banner => (
                <div key={banner.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="h-12 w-20 rounded-lg object-cover border border-slate-150 shadow-3xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">{banner.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Target: {banner.target}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleBanner(banner.id)}
                    className={`px-2.5 py-1 rounded-full font-bold border text-[10px] transition-all ${
                      banner.active 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Coupon Codes */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Coupon Promos Manager</h3>
              <button
                onClick={() => setAddingCoupon(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus size={14} /> Add Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coupons.map(cpn => (
                <div key={cpn.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between gap-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-800 block text-sm bg-white border border-slate-150 py-1 px-2.5 rounded-lg inline-block">{cpn.code}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Discount: <strong>{cpn.discountPercentage}%</strong> (Up to ₹{cpn.maxDiscount})</span>
                    </div>
                    <button
                      onClick={() => toggleCoupon(cpn.id)}
                      className={`px-2 py-0.5 rounded-full font-bold border text-[9px] transition-all ${
                        cpn.active 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}
                    >
                      {cpn.active ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block border-t pt-2 border-slate-150">Minimum Order Value required: <strong>₹{cpn.minOrderValue}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Broadcast terminal */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Push Broadcaster</h3>
            
            <form onSubmit={handleBroadcastPush} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Target Audience</label>
                <select
                  value={pushTarget}
                  onChange={(e) => setPushTarget(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                >
                  <option value="All">All Entities</option>
                  <option value="Customers">Customers App only</option>
                  <option value="Vendors">Vendors Dashboard only</option>
                  <option value="Riders">Riders Companion only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhopal Food Carnival!"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Message Body</label>
                <textarea
                  required
                  placeholder="Get Flat 50% discount tonight on all street sweet ordering channels."
                  value={pushMsg}
                  onChange={(e) => setPushMsg(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm h-20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Send size={13} /> Broadcast Now
              </button>
            </form>
          </div>

          {/* Past Broadcast History */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">Broadcast Log</h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {notifications.map((not, nIdx) => (
                <div key={nIdx} className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-[11px] leading-relaxed">
                  <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                    <span>{not.title}</span>
                    <span className="px-1.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold">{not.target}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{not.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {addingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Create Promo Coupon</h3>
              <button onClick={() => setAddingCoupon(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCoupon} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="BHOPALMEGA30"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={newCouponPct}
                    onChange={(e) => setNewCouponPct(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Max Disc (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCouponMax}
                    onChange={(e) => setNewCouponMax(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={newCouponMinVal}
                    onChange={(e) => setNewCouponMinVal(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddingCoupon(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 6. SYSTEM SETTINGS COMPONENT
// ==========================================
interface SystemSettingsTabProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  auditLogs: AuditLog[];
  onClearLogs: () => void;
  addAuditLog: (action: string, category: AuditLog['category'], details: string) => void;
  activeLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export function SystemSettingsTab(props: SystemSettingsTabProps) {
  const { 
    settings, 
    onUpdateSettings, 
    auditLogs, 
    onClearLogs, 
    addAuditLog,
    activeLanguage = 'en',
    onSelectLanguage
  } = props;
  const [editingSettings, setEditingSettings] = useState({ ...settings });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Audit Trail filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setEditingSettings({ ...settings });
  }, [settings]);

  const logoPresets = [
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=80&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=80&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&auto=format&fit=crop&q=80'
  ];

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ ...settings, ...editingSettings });
    alert('Corporate system configuration updated.');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Error: New password and confirmation password do not match.');
      return;
    }
    alert('System Security Alert: Admin password changed successfully.');
    addAuditLog('Admin Security Password Changed', 'Security', 'Root security password locks updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCopyToClipboard = (log: AuditLog) => {
    const textToCopy = `[${log.id}] [${log.category}] ${log.action} - ${log.details} (${log.adminUser} at ${new Date(log.timestamp).toLocaleString()})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logs based on search and category
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminUser.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Commission', 'Status Toggle', 'Payment Switch', 'System Settings', 'Security', 'Coupons', 'Zones', 'Marketing'];

  const getCategoryBadgeClass = (cat: AuditLog['category']) => {
    switch (cat) {
      case 'Commission':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Status Toggle':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Payment Switch':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'System Settings':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Security':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Coupons':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
      case 'Zones':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Marketing':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6" id="settings-tab">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-indigo-600" size={20} />
          Platform System Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage administrative roles, visual logo assets, change root locks, and configure corporate contact registries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core details and visual asset selection */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">Company Details</h3>
          
          <form onSubmit={handleSaveDetails} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={editingSettings.companyName}
                onChange={(e) => setEditingSettings({ ...editingSettings, companyName: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Support Email ID</label>
                <input
                  type="email"
                  required
                  value={editingSettings.supportEmail}
                  onChange={(e) => setEditingSettings({ ...editingSettings, supportEmail: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Corporate Hotline</label>
                <input
                  type="text"
                  required
                  value={editingSettings.supportPhone}
                  onChange={(e) => setEditingSettings({ ...editingSettings, supportPhone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Corporate Headquarters Address</label>
              <textarea
                required
                value={editingSettings.bhopalOfficeAddress}
                onChange={(e) => setEditingSettings({ ...editingSettings, bhopalOfficeAddress: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm h-16 focus:outline-none"
              />
            </div>

            {/* Visual Logo Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-150">
              <label className="block font-bold text-slate-400 uppercase">Corporate Logo Accent</label>
              
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <img 
                    src={editingSettings.logoUrl} 
                    alt="Current Logo" 
                    className="h-16 w-16 rounded-xl object-cover border-2 border-indigo-100 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">Preview</span>
                </div>
                
                <div className="flex-1 space-y-3">
                  {/* Presets */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Select Preset Logo:</span>
                    <div className="flex gap-2">
                      {logoPresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setEditingSettings({ ...editingSettings, logoUrl: preset })}
                          className={`h-10 w-10 rounded-lg overflow-hidden border-2 transition-all ${
                            editingSettings.logoUrl === preset ? 'border-indigo-600 shadow-sm' : 'border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <img src={preset} alt="preset" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Or Enter Logo URL:</span>
                    <input
                      type="text"
                      placeholder="https://example.com/logo.png"
                      value={editingSettings.logoUrl}
                      onChange={(e) => setEditingSettings({ ...editingSettings, logoUrl: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    />
                  </div>

                  {/* Custom File Upload */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Or Upload Logo Image file:</span>
                    <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all text-center">
                      <Upload size={16} className="text-slate-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-600">Choose custom logo image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setEditingSettings({ ...editingSettings, logoUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              Save Configuration
            </button>
          </form>
        </div>

        {/* Security Password Lock */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">System Security Guard</h3>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">New Password Lock</label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
            >
              Update Security Password
            </button>
          </form>
        </div>

        {/* Language Options & Localization Column */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between" id="settings-lang-card">
          <div>
            <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100 flex items-center gap-1.5">
              <Globe size={16} className="text-indigo-600" />
              Language & Localization
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Choose your preferred language for the Bhopal Express Logistics and Admin portal. The entire system updates instantly.
            </p>

            <div className="space-y-2 mt-4">
              {LANGUAGES.map((lang) => {
                const isSelected = activeLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onSelectLanguage?.(lang.code)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <div className="text-left">
                        <span className="block font-bold">{lang.nativeName}</span>
                        <span className="block text-[9px] text-slate-400 font-medium font-sans uppercase tracking-wider">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="bg-indigo-600 text-white rounded-full p-0.5 text-[8px] font-bold">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono mt-3">
            Local Regional Focus: <span className="font-bold text-slate-500">HI, UR & EN</span>
          </div>
        </div>
      </div>

      {/* Role and Permissions Control List */}
      <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100 flex items-center gap-1.5">
          <Shield size={16} className="text-indigo-600" />
          Admin Roles & Permissions matrix
        </h3>

        {/* Mobile View: Cards */}
        <div className="block md:hidden space-y-3">
          {settings.roles.map((role, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{role.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">Role Node</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">{role.description}</p>
              <div className="pt-2 border-t border-slate-150">
                <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Permissions Matrix</span>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((perm, pIdx) => (
                    <span key={pIdx} className="bg-indigo-50 text-indigo-700 border border-indigo-150 py-0.5 px-2 rounded-md font-semibold text-[10px]">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Role Profile</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Permissions Matrix Allowed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {settings.roles.map((role, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-800">{role.name}</td>
                  <td className="px-4 py-3 text-slate-500">{role.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm, pIdx) => (
                        <span key={pIdx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 py-0.5 px-2 rounded-full font-semibold text-[10px]">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADMIN CRITICAL ACTIONS AUDIT TRAIL LOG */}
      <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <History size={16} className="text-indigo-600" />
              Administrative Critical Action Audit Trail
            </h3>
            <p className="text-xs text-slate-400">Verifiable trace logs of active toggles, commission rate adjustments, status flags, and security controls</p>
          </div>
          
          <button
            type="button"
            onClick={onClearLogs}
            disabled={auditLogs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg text-xs font-bold transition-all shrink-0 self-start sm:self-center"
          >
            <Trash2 size={13} />
            Wipe System Logs
          </button>
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by action, description, operator or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0 px-1">
              <Filter size={11} />
              Filter:
            </span>
            <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all shrink-0 font-bold ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table of logs */}
        {filteredLogs.length > 0 ? (
          <>
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto border border-slate-150 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3 font-mono">Trace ID</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Action Type</th>
                    <th className="px-4 py-3">Detailed Record Description</th>
                    <th className="px-4 py-3">Operator</th>
                    <th className="px-4 py-3 text-right">Timestamp (Bhopal UTC)</th>
                    <th className="px-4 py-3 text-center">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-400 text-[11px]">{log.id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 border text-[9px] uppercase font-bold rounded-md ${getCategoryBadgeClass(log.category)}`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">{log.action}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs xl:max-w-md break-words">{log.details}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{log.adminUser}</span>
                          {log.ipAddress && <span className="font-mono text-[9px] text-slate-400">{log.ipAddress}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(log)}
                          title="Copy trace to clipboard"
                          className="p-1 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-md transition-colors inline-flex items-center justify-center"
                        >
                          {copiedId === log.id ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <ClipboardCopy size={12} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List */}
            <div className="block md:hidden space-y-2.5">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-400 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {log.id}
                      </span>
                      <span className={`px-1.5 py-0.2 border text-[8px] uppercase font-bold rounded ${getCategoryBadgeClass(log.category)}`}>
                        {log.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(log)}
                      className="p-1 hover:bg-white text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-200 rounded transition-colors"
                    >
                      {copiedId === log.id ? (
                        <Check size={11} className="text-emerald-600" />
                      ) : (
                        <ClipboardCopy size={11} />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-[12px]">{log.action}</h4>
                    <p className="text-slate-500 leading-relaxed text-[11px]">{log.details}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="font-semibold text-slate-600">{log.adminUser} ({log.ipAddress || 'Internal'})</span>
                    <span>
                      {new Date(log.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Log Count Badge Footer */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">
              <FileText size={11} />
              Showing {filteredLogs.length} of {auditLogs.length} total logs registered
            </div>
          </>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-250">
            <History size={24} className="text-slate-300 mx-auto mb-2 animate-pulse" />
            <p className="text-xs font-bold text-slate-500">No matching security trace logs found</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Try altering your search keywords or choosing another category filter pill</p>
          </div>
        )}
      </div>
    </div>
  );
}
