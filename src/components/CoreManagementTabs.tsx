import React, { useState } from 'react';
import { Customer, Vendor, Rider, Order, MenuItem } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { 
  Users, 
  Search, 
  Ban, 
  Check, 
  UserX, 
  UserCheck, 
  CreditCard, 
  Plus, 
  Edit2, 
  Clock, 
  CheckCircle, 
  Eye, 
  Percent, 
  Store, 
  DollarSign,
  Briefcase,
  AlertCircle,
  X,
  MapPin,
  XCircle,
  FileText,
  Trash2,
  Bike,
  Power,
  Phone,
  PhoneOff,
  ArrowLeft
} from 'lucide-react';

// ==========================================
// 1. CUSTOMER MANAGEMENT COMPONENT
// ==========================================
interface CustomerManagementTabProps {
  activeLanguage?: Language;
  customers: Customer[];
  orders: Order[];
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onAddCustomer?: (newCustomer: Customer) => void;
}

export function CustomerManagementTab(props: CustomerManagementTabProps) {
  const { activeLanguage = 'en', customers, orders, onUpdateCustomer, onAddCustomer } = props;
  const t = TRANSLATIONS[activeLanguage];
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    walletBalance: 0
  });

  const [walletTransaction, setWalletTransaction] = useState<{ amount: number; type: 'add' | 'deduct'; customerId: string | null }>({
    amount: 100,
    type: 'add',
    customerId: null
  });
  const [viewingHistoryCustomer, setViewingHistoryCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = (customer: Customer) => {
    const isCurrentlyBlocked = customer.status === 'Blocked' || customer.isSuspended;
    const nextStatus = isCurrentlyBlocked ? 'Active' : 'Blocked';
    const updated: Customer = {
      ...customer,
      status: nextStatus,
      isSuspended: !isCurrentlyBlocked
    };
    onUpdateCustomer(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer);
      setEditingCustomer(null);
    }
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerData.name.trim() || !newCustomerData.phone.trim()) return;

    const mockCustId = `CUST-${Math.floor(106 + Math.random() * 890)}`;
    const freshCust: Customer = {
      id: mockCustId,
      name: newCustomerData.name,
      email: newCustomerData.email || `${newCustomerData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: newCustomerData.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      walletBalance: Number(newCustomerData.walletBalance) || 0,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      orderCount: 0,
      totalSpent: 0,
      password: newCustomerData.password || 'cust@123',
      isSuspended: false
    };

    if (onAddCustomer) {
      onAddCustomer(freshCust);
    }
    setAddingCustomer(false);
    setNewCustomerData({ name: '', email: '', phone: '', password: '', walletBalance: 0 });
  };

  const handleWalletSubmit = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const delta = walletTransaction.type === 'add' ? walletTransaction.amount : -walletTransaction.amount;
      const updated: Customer = {
        ...customer,
        walletBalance: Math.max(0, customer.walletBalance + delta)
      };
      onUpdateCustomer(updated);
      setWalletTransaction({ amount: 100, type: 'add', customerId: null });
    }
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  return (
    <div className="space-y-6" id="customer-tab">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={20} />
            {t.customerRegistry}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.customerRegistryDesc}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
          <button
            onClick={() => setAddingCustomer(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <Plus size={14} /> {t.addNewCustomer}
          </button>
        </div>
      </div>

      {/* Main Customers Grid */}
      <div className="bg-white rounded-xl border border-slate-150 shadow-xs overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredCustomers.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">
              No customers found matching search criteria.
            </div>
          ) : (
            filteredCustomers.map(customer => {
              const isBlocked = customer.status === 'Blocked';
              return (
                <div key={customer.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block text-sm">{customer.name}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>ID: <strong className="text-indigo-600 font-bold">{customer.id}</strong></span>
                          <span>|</span>
                          <span>Pass: <strong className="text-indigo-600 font-bold">{customer.password || 'cust@123'}</strong></span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isBlocked ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    }`}>
                      {isBlocked ? 'Suspended' : 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Contact</span>
                      <span className="text-slate-700 block truncate font-medium">{customer.email}</span>
                      <span className="text-slate-500 font-mono block mt-0.5">{customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Activity & Wallet</span>
                      <span className="font-bold text-slate-700 block">{customer.orderCount} Orders</span>
                      <span className="font-mono font-bold text-indigo-600 block mt-0.5">₹{customer.walletBalance}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setWalletTransaction({ amount: 100, type: 'add', customerId: customer.id })}
                      className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <CreditCard size={13} /> Wallet
                    </button>
                    <button
                      onClick={() => setViewingHistoryCustomer(customer)}
                      className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <Eye size={13} /> History
                    </button>
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleBlock(customer)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-1 font-semibold transition-all ${
                        isBlocked 
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200' 
                          : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      {isBlocked ? <UserCheck size={13} /> : <UserX size={13} />} {isBlocked ? 'Reactivate' : 'Suspend'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Contact & Joined</th>
                <th className="px-6 py-4">Orders Stats</th>
                <th className="px-6 py-4">Wallet Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const isBlocked = customer.status === 'Blocked';
                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">{customer.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono block">
                              ID: <strong className="text-indigo-600">{customer.id}</strong> | Pass: <strong className="text-indigo-600">{customer.password || 'cust@123'}</strong>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block font-medium">{customer.email}</span>
                        <span className="text-xs text-slate-400 block mt-0.5">{customer.phone}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700 block">{customer.orderCount} Orders</span>
                        <span className="text-xs text-slate-400 block">Spent ₹{customer.totalSpent}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">
                        ₹{customer.walletBalance}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isBlocked ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                          {isBlocked ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Wallet Adjuster */}
                          <button
                            onClick={() => setWalletTransaction({ amount: 100, type: 'add', customerId: customer.id })}
                            title="Adjust Wallet"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <CreditCard size={16} />
                          </button>
 
                          {/* Order History */}
                          <button
                            onClick={() => setViewingHistoryCustomer(customer)}
                            title="Order History"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Eye size={16} />
                          </button>
 
                          {/* Profile Editor */}
                          <button
                            onClick={() => setEditingCustomer(customer)}
                            title="Edit Profile"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
 
                          {/* Toggle Lock */}
                          <button
                            onClick={() => handleToggleBlock(customer)}
                            title={isBlocked ? 'Reactivate Customer' : 'Suspend Customer'}
                            className={`p-1.5 rounded-lg transition-all ${
                              isBlocked 
                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                : 'text-rose-600 hover:bg-rose-50'
                            }`}
                          >
                            {isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Edit2 size={18} className="text-amber-500" />
                Edit Customer Profile
              </h3>
              <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Password</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.password || 'cust@123'}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {addingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <Plus size={18} className="text-indigo-600" />
                Register New Customer ID
              </h3>
              <button onClick={() => setAddingCustomer(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCustomerSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email ID</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98270 99999"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Setup Password</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. pass123"
                    value={newCustomerData.password}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, password: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Initial Wallet (₹)</label>
                  <input
                    type="number"
                    value={newCustomerData.walletBalance || ''}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, walletBalance: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingCustomer(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Modifier Widget */}
      {walletTransaction.customerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" />
                Adjust Wallet Balance
              </h3>
              <button onClick={() => setWalletTransaction({ amount: 100, type: 'add', customerId: null })} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-medium">Choose action:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWalletTransaction({ ...walletTransaction, type: 'add' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      walletTransaction.type === 'add'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Add Balance (Refund/Promo)
                  </button>
                  <button
                    onClick={() => setWalletTransaction({ ...walletTransaction, type: 'deduct' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      walletTransaction.type === 'deduct'
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Deduct Balance
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={walletTransaction.amount}
                  onChange={(e) => setWalletTransaction({ ...walletTransaction, amount: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setWalletTransaction({ amount: 100, type: 'add', customerId: null })}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleWalletSubmit(walletTransaction.customerId!)}
                  className={`px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all ${
                    walletTransaction.type === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Log Panel */}
      {viewingHistoryCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Order History & Logs</h3>
                <p className="text-xs text-slate-400">{viewingHistoryCustomer.name} (ID: {viewingHistoryCustomer.id})</p>
              </div>
              <button onClick={() => setViewingHistoryCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="mt-4 max-h-[350px] overflow-y-auto space-y-3 pr-1">
              {getCustomerOrders(viewingHistoryCustomer.id).length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-sm">No orders recorded for this customer yet.</p>
              ) : (
                getCustomerOrders(viewingHistoryCustomer.id).map(order => (
                  <div key={order.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono font-bold text-slate-700 text-sm">{order.id}</span>
                        <span className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 font-medium truncate mb-1">
                        {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                      </p>
                      <span className="text-slate-400 text-[10px]">Rest: {order.vendorName} • Delivery: {order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-1 border-t md:border-none pt-2 md:pt-0 border-slate-100">
                      <span className="font-mono font-bold text-slate-800 text-sm">₹{order.total}</span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                        order.status === 'Delivered' ? 'text-emerald-700 bg-emerald-50' :
                        order.status === 'Cancelled' ? 'text-rose-700 bg-rose-50' : 'text-blue-700 bg-blue-50'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
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
// 2. VENDOR MANAGEMENT COMPONENT
// ==========================================
interface VendorManagementTabProps {
  activeLanguage?: Language;
  vendors: Vendor[];
  onUpdateVendor: (updatedVendor: Vendor) => void;
  onAddVendor: (newVendor: Vendor) => void;
}

export function VendorManagementTab(props: VendorManagementTabProps) {
  const { activeLanguage = 'en', vendors, onUpdateVendor, onAddVendor } = props;
  const t = TRANSLATIONS[activeLanguage];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  
  // Modals / Editors state
  const [addingVendor, setAddingVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    cuisine: '',
    address: '',
    commissionRate: 15,
    password: '',
    shopPhoto: '',
    fssaiNumber: '',
    bankAccountNo: '',
    bankIfsc: '',
    bankName: 'State Bank of India'
  });

  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(100);
  const [newItemCategory, setNewItemCategory] = useState('Main Course');

  // Local state for editing vendor KYC inline
  const [editingKycVendorId, setEditingKycVendorId] = useState<string | null>(null);
  const [kycForm, setKycForm] = useState({
    shopPhoto: '',
    fssaiNumber: '',
    bankAccountNo: '',
    bankIfsc: '',
    bankName: ''
  });

  // Simulated calling state
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string; avatar: string; role: string } | null>(null);
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  React.useEffect(() => {
    let timer: any = null;
    if (activeCall) {
      if (callStatus === 'connecting') {
        timer = setTimeout(() => {
          setCallStatus('ringing');
        }, 1500);
      } else if (callStatus === 'ringing') {
        timer = setTimeout(() => {
          setCallStatus('connected');
          setCallDuration(0);
        }, 2000);
      } else if (callStatus === 'connected') {
        timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
      }
    };
  }, [activeCall, callStatus]);

  const handleInitiateCall = (name: string, phone: string, avatar: string, role: string) => {
    setActiveCall({ name, phone, avatar, role });
    setCallStatus('connecting');
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeaker(false);
  };

  const handleHangUp = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setActiveCall(null);
    }, 1000);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'approved') return v.status === 'Approved' && matchesSearch;
    return v.status === 'Pending' && matchesSearch;
  });

  const handleApprove = (vendor: Vendor) => {
    onUpdateVendor({
      ...vendor,
      status: 'Approved'
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockVendorId = `VND-${Math.floor(100 + Math.random() * 900)}`;
    const freshVendor: Vendor = {
      id: mockVendorId,
      name: newVendorData.name,
      ownerName: newVendorData.ownerName,
      email: newVendorData.email,
      phone: newVendorData.phone,
      cuisine: newVendorData.cuisine,
      address: newVendorData.address,
      avatar: newVendorData.shopPhoto || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150&auto=format&fit=crop&q=80',
      commissionRate: newVendorData.commissionRate,
      status: 'Approved', // Auto-approved on add by default
      walletBalance: 0,
      rating: 5.0,
      password: newVendorData.password || 'vend@123',
      isSuspended: false,
      shopPhoto: newVendorData.shopPhoto || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
      fssaiNumber: newVendorData.fssaiNumber || '10423000' + Math.floor(100000 + Math.random() * 900000),
      bankAccountNo: newVendorData.bankAccountNo || '309988' + Math.floor(10000 + Math.random() * 90000),
      bankIfsc: newVendorData.bankIfsc || 'SBIN0003290',
      bankName: newVendorData.bankName || 'State Bank of India',
      menu: [
        { id: `M-${Math.floor(1000 + Math.random() * 9000)}`, name: 'Special Handi Paneer', price: 250, isAvailable: true, category: 'Main Course' }
      ]
    };
    onAddVendor(freshVendor);
    setAddingVendor(false);
    setNewVendorData({
      name: '',
      ownerName: '',
      email: '',
      phone: '',
      cuisine: '',
      address: '',
      commissionRate: 15,
      password: '',
      shopPhoto: '',
      fssaiNumber: '',
      bankAccountNo: '',
      bankIfsc: '',
      bankName: 'State Bank of India'
    });
  };

  const handleToggleItemAvailability = (vendor: Vendor, itemId: string) => {
    const updatedMenu = vendor.menu.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateVendor({ ...vendor, menu: updatedMenu });
  };

  const handleEditItemPrice = (vendor: Vendor, itemId: string, newPrice: number) => {
    const updatedMenu = vendor.menu.map(item => 
      item.id === itemId ? { ...item, price: newPrice } : item
    );
    onUpdateVendor({ ...vendor, menu: updatedMenu });
  };

  const handleAddMenuItem = (vendor: Vendor) => {
    if (!newItemName.trim()) return;
    const freshItem: MenuItem = {
      id: `M-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newItemName,
      price: newItemPrice,
      category: newItemCategory,
      isAvailable: true
    };
    onUpdateVendor({
      ...vendor,
      menu: [...vendor.menu, freshItem]
    });
    setNewItemName('');
    setNewItemPrice(100);
  };

  const handleDeleteMenuItem = (vendor: Vendor, itemId: string) => {
    onUpdateVendor({
      ...vendor,
      menu: vendor.menu.filter(i => i.id !== itemId)
    });
  };

  const startEditingKyc = (vendor: Vendor) => {
    setEditingKycVendorId(vendor.id);
    setKycForm({
      shopPhoto: vendor.shopPhoto || '',
      fssaiNumber: vendor.fssaiNumber || '',
      bankAccountNo: vendor.bankAccountNo || '',
      bankIfsc: vendor.bankIfsc || '',
      bankName: vendor.bankName || 'State Bank of India'
    });
  };

  const saveKycChanges = (vendor: Vendor) => {
    onUpdateVendor({
      ...vendor,
      shopPhoto: kycForm.shopPhoto,
      avatar: kycForm.shopPhoto || vendor.avatar,
      fssaiNumber: kycForm.fssaiNumber,
      bankAccountNo: kycForm.bankAccountNo,
      bankIfsc: kycForm.bankIfsc,
      bankName: kycForm.bankName
    });
    setEditingKycVendorId(null);
  };

  const handleSettleWallet = (vendor: Vendor) => {
    if (vendor.walletBalance <= 0) return;
    onUpdateVendor({
      ...vendor,
      walletBalance: 0
    });
    alert(`Wallet Settle Processed: ₹${vendor.walletBalance} dispatched to ${vendor.name}'s registered bank account.`);
  };

  return (
    <div className="space-y-6" id="vendor-tab">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Store className="text-orange-600" size={20} />
            {t.vendorRegistry}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.vendorRegistryDesc}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-60">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50/50"
            />
          </div>
          <button
            onClick={() => setAddingVendor(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
          >
            <Plus size={16} /> {t.addNewVendor}
          </button>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-slate-100" id="vendor-status-tabs">
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'approved'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Approved Partners ({vendors.filter(v => v.status === 'Approved').length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pending Applications ({vendors.filter(v => v.status === 'Pending').length})
        </button>
      </div>

      {/* Vendors list */}
      <div className="space-y-4">
        {filteredVendors.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-slate-100 text-center text-slate-400">
            No restaurant records found.
          </div>
        ) : (
          filteredVendors.map(vendor => {
            const isExpanded = expandedVendorId === vendor.id;
            return (
              <div 
                key={vendor.id} 
                className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* Main Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4">
                    <img 
                      src={vendor.avatar} 
                      alt={vendor.name} 
                      referrerPolicy="no-referrer"
                      className="h-14 w-14 rounded-xl object-cover border border-slate-100 shadow-2xs" 
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-base">{vendor.name}</h3>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-mono text-slate-500 font-bold">
                          {vendor.id}
                        </span>
                        {vendor.isSuspended && (
                          <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider animate-pulse">
                            Suspended 🔥
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-orange-600 font-semibold mt-0.5">{vendor.cuisine}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                        <span><strong>Owner:</strong> {vendor.ownerName}</span>
                        <span>•</span>
                        <span><strong>Credentials:</strong> ID: <strong className="text-orange-600 font-mono">{vendor.id}</strong> | Pass: <strong className="text-orange-600 font-mono">{vendor.password || 'vend@123'}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-100 px-2 py-0.5 rounded-lg">
                          <strong>Phone:</strong> {vendor.phone}
                          <button
                            onClick={() => handleInitiateCall(vendor.name, vendor.phone, vendor.avatar, 'Vendor')}
                            className="p-0.5 hover:bg-orange-100 text-orange-600 rounded transition-all flex items-center justify-center cursor-pointer ml-1"
                            title="Call Immediately"
                          >
                            <Phone size={11} className="fill-orange-600" />
                          </button>
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[200px]"><strong>Loc:</strong> {vendor.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Settings */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-6 lg:gap-8 border-t lg:border-none pt-4 lg:pt-0 border-slate-50 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Commission Rate</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={vendor.commissionRate}
                          onChange={(e) => onUpdateVendor({ ...vendor, commissionRate: parseInt(e.target.value) || 0 })}
                          className="w-12 p-1 border border-slate-200 rounded text-center font-bold text-slate-800"
                        />
                        <span className="font-bold text-slate-500">%</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Wallet Balance</span>
                      <span className="font-mono font-bold text-slate-800 mt-1 block text-sm">
                        ₹{vendor.walletBalance}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Menu Items</span>
                      <span className="font-bold text-slate-700 mt-1 block">
                        {vendor.menu.length} Products
                      </span>
                    </div>

                    {/* Actions based on approval state */}
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-2 lg:ml-4 flex-wrap">
                      {vendor.status === 'Pending' ? (
                        <button
                          onClick={() => handleApprove(vendor)}
                          className="w-full lg:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Check size={14} /> Approve Store
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleInitiateCall(vendor.name, vendor.phone, vendor.avatar, 'Vendor')}
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Phone size={13} className="fill-emerald-700 text-emerald-700" /> Call Immediately
                          </button>

                          <button
                            onClick={() => handleSettleWallet(vendor)}
                            disabled={vendor.walletBalance <= 0}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-200"
                          >
                            <DollarSign size={13} /> Settle Account
                          </button>
                          
                          <button
                            onClick={() => {
                              const updatedVendor: Vendor = {
                                ...vendor,
                                isSuspended: !vendor.isSuspended
                              };
                              onUpdateVendor(updatedVendor);
                            }}
                            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1 transition-all ${
                              vendor.isSuspended
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            <UserX size={13} />
                            {vendor.isSuspended ? 'Reactivate Store' : 'Suspend Store'}
                          </button>

                          <button
                            onClick={() => setExpandedVendorId(isExpanded ? null : vendor.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                              isExpanded 
                                ? 'bg-orange-50 border-orange-200 text-orange-600' 
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            {isExpanded ? 'Hide Menu' : 'Menu & Control'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Menu Control Panel */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-150 p-5 space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                      
                      {/* Left: Corporate KYC & Financials (5 Columns) */}
                      <div className="xl:col-span-5 bg-white p-5 rounded-xl border border-slate-200/80 shadow-3xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <span className="text-orange-500">🏢</span> Corporate KYC & Bank Info
                          </h4>
                          {editingKycVendorId !== vendor.id ? (
                            <button
                              onClick={() => startEditingKyc(vendor)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                            >
                              Edit Info
                            </button>
                          ) : (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => saveKycChanges(vendor)}
                                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingKycVendorId(null)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-medium transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        {editingKycVendorId === vendor.id ? (
                          // Edit Form
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Shop Photo URL</label>
                              <input
                                type="text"
                                value={kycForm.shopPhoto}
                                onChange={(e) => setKycForm({ ...kycForm, shopPhoto: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">FSSAI Certificate Number</label>
                              <input
                                type="text"
                                value={kycForm.fssaiNumber}
                                onChange={(e) => setKycForm({ ...kycForm, fssaiNumber: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Name</label>
                                <input
                                  type="text"
                                  value={kycForm.bankName}
                                  onChange={(e) => setKycForm({ ...kycForm, bankName: e.target.value })}
                                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">IFSC Code</label>
                                <input
                                  type="text"
                                  value={kycForm.bankIfsc}
                                  onChange={(e) => setKycForm({ ...kycForm, bankIfsc: e.target.value })}
                                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bank Account Number</label>
                              <input
                                type="text"
                                value={kycForm.bankAccountNo}
                                onChange={(e) => setKycForm({ ...kycForm, bankAccountNo: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          // Read Mode
                          <div className="space-y-4 text-xs">
                            <div className="flex gap-4 items-start">
                              <img
                                src={vendor.shopPhoto || vendor.avatar}
                                alt="Shop view"
                                referrerPolicy="no-referrer"
                                className="h-16 w-24 object-cover rounded-lg border border-slate-100 shadow-3xs shrink-0"
                              />
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Shop Front Photo</span>
                                <p className="text-slate-600 mt-1 leading-snug">Official retail storefront photo used in mobile customer applications.</p>
                              </div>
                            </div>

                            <div className="p-3 bg-orange-50/50 border border-orange-100/70 rounded-lg">
                              <span className="text-[10px] font-bold text-orange-700 uppercase block">FSSAI Certificate No.</span>
                              <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{vendor.fssaiNumber || 'Pending / Under Verification'}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">✓ Valid Food Safety and Standards Authority of India Registration</span>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block border-b border-slate-200/60 pb-1">Payout Bank Credentials</span>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-slate-400">Bank Name</span>
                                  <p className="font-semibold text-slate-700 mt-0.5">{vendor.bankName || 'State Bank of India'}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">IFSC Code</span>
                                  <p className="font-mono font-bold text-slate-700 mt-0.5">{vendor.bankIfsc || 'SBIN0003290'}</p>
                                </div>
                              </div>
                              <div className="pt-1.5 border-t border-slate-200/40">
                                <span className="text-slate-400 text-[10px]">Bank Account Number</span>
                                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">xxxx xxxx {vendor.bankAccountNo ? vendor.bankAccountNo.slice(-4) : '2901'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Products Menu Management (7 Columns) */}
                      <div className="xl:col-span-7 bg-white p-5 rounded-xl border border-slate-200/80 shadow-3xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <span className="text-orange-500">🍔</span> Product Menu Management
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Name..."
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              className="p-1 border border-slate-200 bg-white rounded-lg text-xs w-28"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(parseInt(e.target.value) || 0)}
                              className="w-12 p-1 border border-slate-200 bg-white rounded-lg text-xs font-mono text-center"
                            />
                            <select
                              value={newItemCategory}
                              onChange={(e) => setNewItemCategory(e.target.value)}
                              className="p-1 border border-slate-200 bg-white rounded-lg text-[11px] font-medium text-slate-600"
                            >
                              <option value="Main Course">Main Course</option>
                              <option value="Breakfast">Breakfast</option>
                              <option value="Chinese">Chinese</option>
                              <option value="Beverages">Beverages</option>
                              <option value="Sweets">Sweets</option>
                            </select>
                            <button
                              onClick={() => handleAddMenuItem(vendor)}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-0.5 shrink-0"
                            >
                              <Plus size={11} /> Add
                            </button>
                          </div>
                        </div>

                        {/* Products List Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                          {vendor.menu.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center col-span-2 py-4">No menu items configured for this store.</p>
                          ) : (
                            vendor.menu.map(item => (
                              <div 
                                key={item.id} 
                                className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-150 flex items-center justify-between shadow-3xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  <div>
                                    <span className="font-semibold text-slate-800 text-xs block truncate max-w-[110px]">{item.name}</span>
                                    <span className="text-[9px] text-slate-400 block">{item.category}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="flex items-center gap-0.5">
                                    <span className="text-slate-400 text-[10px] font-bold">₹</span>
                                    <input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) => handleEditItemPrice(vendor, item.id, parseInt(e.target.value) || 0)}
                                      className="w-11 p-0.5 border border-slate-200 rounded text-center text-xs font-mono font-bold bg-white"
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleToggleItemAvailability(vendor, item.id)}
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                                      item.isAvailable 
                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                  >
                                    {item.isAvailable ? 'In-Stock' : 'OOS'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenuItem(vendor, item.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Vendor Drawer Modal */}
      {addingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-xl mx-4 flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden">
            {/* Header with back button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <button 
                type="button"
                onClick={() => setAddingVendor(false)} 
                className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-3xs transition-all cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <Plus size={16} className="text-orange-600" />
                Add New Vendor Store
              </h3>
              <button 
                type="button"
                onClick={() => setAddingVendor(false)} 
                className="text-slate-400 hover:text-slate-600 bg-slate-150/50 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Fields container */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sagar Gaire - Arera"
                      value={newVendorData.name}
                      onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rajesh Gaire"
                      value={newVendorData.ownerName}
                      onChange={(e) => setNewVendorData({ ...newVendorData, ownerName: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="partner@sagargaire.com"
                      value={newVendorData.email}
                      onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98270 99887"
                      value={newVendorData.phone}
                      onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Cuisines Offered</label>
                    <input
                      type="text"
                      required
                      placeholder="South Indian, Desserts"
                      value={newVendorData.cuisine}
                      onChange={(e) => setNewVendorData({ ...newVendorData, cuisine: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Commission Rate (%)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={newVendorData.commissionRate}
                      onChange={(e) => setNewVendorData({ ...newVendorData, commissionRate: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Setup Password</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. vend@123"
                      value={newVendorData.password}
                      onChange={(e) => setNewVendorData({ ...newVendorData, password: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Store Complete Address</label>
                  <textarea
                    required
                    placeholder="Plot 10, Sector E, Arera Colony, Bhopal"
                    value={newVendorData.address}
                    onChange={(e) => setNewVendorData({ ...newVendorData, address: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm h-14 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* KYC and Financials Section */}
                <div className="border-t border-slate-150 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    🏢 Store KYC & Payout Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Shop Photo URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://images.unsplash.com/..."
                        value={newVendorData.shopPhoto}
                        onChange={(e) => setNewVendorData({ ...newVendorData, shopPhoto: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">FSSAI Certificate No.</label>
                      <input
                        type="text"
                        placeholder="e.g. 10423000991823"
                        value={newVendorData.fssaiNumber}
                        onChange={(e) => setNewVendorData({ ...newVendorData, fssaiNumber: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Bank Name</label>
                      <input
                        type="text"
                        placeholder="State Bank of India"
                        value={newVendorData.bankName}
                        onChange={(e) => setNewVendorData({ ...newVendorData, bankName: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Bank IFSC Code</label>
                      <input
                        type="text"
                        placeholder="SBIN0003290"
                        value={newVendorData.bankIfsc}
                        onChange={(e) => setNewVendorData({ ...newVendorData, bankIfsc: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Bank Account No.</label>
                      <input
                        type="text"
                        placeholder="30998811234"
                        value={newVendorData.bankAccountNo}
                        onChange={(e) => setNewVendorData({ ...newVendorData, bankAccountNo: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with back & action buttons */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setAddingVendor(false)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingVendor(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all shadow-3xs cursor-pointer"
                  >
                    Register Store
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Call Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-slate-950 text-white w-full max-w-sm p-6 rounded-3xl border border-slate-800 shadow-2xl mx-4 relative overflow-hidden animate-fadeIn">
            {/* Pulsing ring background design */}
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent opacity-50" />
            
            {/* Header */}
            <div className="flex flex-col items-center text-center mt-4 mb-8">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-3">
                Outgoing {activeCall.role} Call
              </span>
              
              {/* Profile Image with animated ring */}
              <div className="relative mt-2">
                <div className={`absolute -inset-4 rounded-full bg-emerald-500/20 blur-sm ${(callStatus === 'connecting' || callStatus === 'ringing') ? 'animate-ping' : ''}`} />
                <div className="relative">
                  <img 
                    src={activeCall.avatar} 
                    alt={activeCall.name} 
                    referrerPolicy="no-referrer"
                    className="h-28 w-28 rounded-full object-cover border-4 border-slate-800 shadow-xl" 
                  />
                  {callStatus === 'connected' && (
                    <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-950 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Name & Phone */}
              <h3 className="text-xl font-extrabold text-white mt-6 tracking-tight">{activeCall.name}</h3>
              <p className="text-sm text-slate-400 font-mono mt-1">{activeCall.phone}</p>
              
              {/* Call Status and Duration */}
              <div className="mt-8">
                {callStatus === 'connecting' && (
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider animate-pulse">Connecting to Network...</p>
                )}
                {callStatus === 'ringing' && (
                  <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider animate-pulse">Ringing phone...</p>
                )}
                {callStatus === 'connected' && (
                  <div className="space-y-1">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Call Connected</p>
                    <p className="text-2xl font-bold font-mono tracking-widest text-slate-200 mt-1">{formatDuration(callDuration)}</p>
                  </div>
                )}
                {callStatus === 'ended' && (
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">Call Ended</p>
                )}
              </div>
            </div>

            {/* In-call simulated controls */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                  isMuted 
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span className="text-sm">🎙️</span>
                <span className="text-[10px] font-bold uppercase">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                  isSpeaker 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span className="text-sm">🔊</span>
                <span className="text-[10px] font-bold uppercase">{isSpeaker ? 'Speaker Active' : 'Speaker'}</span>
              </button>
            </div>

            {/* Hangup Button */}
            <div className="flex justify-center pb-4">
              <button
                type="button"
                onClick={handleHangUp}
                className="w-16 h-16 bg-rose-600 hover:bg-rose-700 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 3. RIDER MANAGEMENT COMPONENT
// ==========================================
interface RiderManagementTabProps {
  activeLanguage?: Language;
  riders: Rider[];
  orders: Order[];
  onUpdateRider: (updatedRider: Rider) => void;
  onAddRider: (newRider: Rider) => void;
}

export function RiderManagementTab(props: RiderManagementTabProps) {
  const { activeLanguage = 'en', riders, orders, onUpdateRider, onAddRider } = props;
  const t = TRANSLATIONS[activeLanguage];
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDocsRider, setViewingDocsRider] = useState<Rider | null>(null);
  const [activeIdCardRider, setActiveIdCardRider] = useState<Rider | null>(null);
  const [addingRider, setAddingRider] = useState(false);
  const [newRiderData, setNewRiderData] = useState({
    name: '',
    phone: '',
    vehicleType: 'Motorcycle',
    vehicleNumber: '',
    license: '',
    aadhar: '',
    password: '',
    avatar: '',
    bankAccountNo: '',
    bankIfsc: '',
    bankName: 'State Bank of India'
  });

  const [schedulingRider, setSchedulingRider] = useState<Rider | null>(null);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [customShift, setCustomShift] = useState({ name: 'Custom Shift', start: '09:00 AM', end: '05:00 PM' });
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Simulated calling state for riders
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string; avatar: string; role: string } | null>(null);
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  React.useEffect(() => {
    let timer: any = null;
    if (activeCall) {
      if (callStatus === 'connecting') {
        timer = setTimeout(() => {
          setCallStatus('ringing');
        }, 1500);
      } else if (callStatus === 'ringing') {
        timer = setTimeout(() => {
          setCallStatus('connected');
          setCallDuration(0);
        }, 2000);
      } else if (callStatus === 'connected') {
        timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
      }
    };
  }, [activeCall, callStatus]);

  const handleInitiateCall = (name: string, phone: string, avatar: string, role: string) => {
    setActiveCall({ name, phone, avatar, role });
    setCallStatus('connecting');
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeaker(false);
  };

  const handleHangUp = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setActiveCall(null);
    }, 1000);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Zomato-like 24/7 1-Hour Gig Slots and pricing
  const gigSlots = [
    '12:00 AM - 01:00 AM',
    '01:00 AM - 02:00 AM',
    '02:00 AM - 03:00 AM',
    '03:00 AM - 04:00 AM',
    '04:00 AM - 05:00 AM',
    '05:00 AM - 06:00 AM',
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
    '10:00 PM - 11:00 PM',
    '11:00 PM - 12:00 AM'
  ];

  const [hourlyRates, setHourlyRates] = useState<Record<string, number>>({
    '12:00 AM - 01:00 AM': 85,
    '01:00 AM - 02:00 AM': 90,
    '02:00 AM - 03:00 AM': 90,
    '03:00 AM - 04:00 AM': 85,
    '04:00 AM - 05:00 AM': 80,
    '05:00 AM - 06:00 AM': 75,
    '06:00 AM - 07:00 AM': 70,
    '07:00 AM - 08:00 AM': 65,
    '08:00 AM - 09:00 AM': 60,
    '09:00 AM - 10:00 AM': 65,
    '10:00 AM - 11:00 AM': 70,
    '11:00 AM - 12:00 PM': 75,
    '12:00 PM - 01:00 PM': 80,
    '01:00 PM - 02:00 PM': 85,
    '02:00 PM - 03:00 PM': 80,
    '03:00 PM - 04:00 PM': 75,
    '04:00 PM - 05:00 PM': 70,
    '05:00 PM - 06:00 PM': 75,
    '06:00 PM - 07:00 PM': 80,
    '07:00 PM - 08:00 PM': 85,
    '08:00 PM - 09:00 PM': 90,
    '09:00 PM - 10:00 PM': 85,
    '10:00 PM - 11:00 PM': 80,
    '11:00 PM - 12:00 AM': 85,
  });

  const [rainSurgeEnabled, setRainSurgeEnabled] = useState(true);
  const [rainSurgeAmount, setRainSurgeAmount] = useState(25);
  const [editingSlot, setEditingSlot] = useState('12:00 PM - 01:00 PM');
  const [slotRate, setSlotRate] = useState(80);
  
  // Dynamic payout modes: Hourly Slot Rates or Per-Parcel (Base Pay + Per-KM Rate)
  const [payoutMode, setPayoutMode] = useState<'Hourly' | 'Per-Parcel'>('Hourly');
  const [perParcelBase, setPerParcelBase] = useState(30);
  const [perParcelPerKm, setPerParcelPerKm] = useState(8);

  const presetShifts = gigSlots;

  const handleOpenScheduling = (rider: Rider) => {
    setSchedulingRider(rider);
    setSelectedShifts(rider.assignedShifts || []);
  };

  const handleToggleShiftSelection = (shift: string) => {
    if (selectedShifts.includes(shift)) {
      setSelectedShifts(selectedShifts.filter(s => s !== shift));
    } else {
      setSelectedShifts([...selectedShifts, shift]);
    }
  };

  const handleAddCustomShift = () => {
    if (!customShift.name.trim()) return;
    const formatted = `${customShift.name} (${customShift.start} - ${customShift.end})`;
    if (!selectedShifts.includes(formatted)) {
      setSelectedShifts([...selectedShifts, formatted]);
    }
    setCustomShift({ name: 'Custom Shift', start: '09:00 AM', end: '05:00 PM' });
  };

  const handleSaveSchedule = () => {
    if (schedulingRider) {
      onUpdateRider({
        ...schedulingRider,
        assignedShifts: selectedShifts
      });
      setSchedulingRider(null);
    }
  };

  const filteredRiders = riders.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone.includes(searchTerm) ||
    r.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOnlineStatus = (rider: Rider) => {
    onUpdateRider({
      ...rider,
      status: rider.status === 'Online' ? 'Offline' : 'Online'
    });
  };

  const handleApproveDocs = (rider: Rider) => {
    const updated: Rider = {
      ...rider,
      approvalStatus: 'Approved',
      documents: {
        ...rider.documents,
        verified: true
      }
    };
    onUpdateRider(updated);
    if (viewingDocsRider?.id === rider.id) {
      setViewingDocsRider(updated);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockRiderId = `RDR-${Math.floor(200 + Math.random() * 800)}`;
    const freshEmployeeId = `TTB-RDR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshRider: Rider = {
      id: mockRiderId,
      name: newRiderData.name,
      phone: newRiderData.phone,
      avatar: newRiderData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'Offline',
      approvalStatus: 'Pending',
      vehicleType: newRiderData.vehicleType,
      vehicleNumber: newRiderData.vehicleNumber || 'N/A',
      employeeId: freshEmployeeId,
      bankAccountNo: newRiderData.bankAccountNo || '102930' + Math.floor(100000 + Math.random() * 900000),
      bankIfsc: newRiderData.bankIfsc || 'SBIN0000382',
      bankName: newRiderData.bankName || 'State Bank of India',
      documents: {
        license: newRiderData.license || 'LIC-PENDING',
        aadhar: newRiderData.aadhar || 'AADHAR-PENDING',
        verified: false
      },
      earnings: 0,
      rating: 5.0,
      currentLocation: { x: 50, y: 50 },
      password: newRiderData.password || 'rider@123',
      isSuspended: false
    };
    onAddRider(freshRider);
    setAddingRider(false);
    setNewRiderData({
      name: '',
      phone: '',
      vehicleType: 'Motorcycle',
      vehicleNumber: '',
      license: '',
      aadhar: '',
      password: '',
      avatar: '',
      bankAccountNo: '',
      bankIfsc: '',
      bankName: 'State Bank of India'
    });
  };

  return (
    <div className="space-y-6" id="rider-tab">
      {/* Header with Search and Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bike className="text-emerald-600" size={20} />
            {t.riderRegistry}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.riderRegistryDesc}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-60">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
          <button
            onClick={() => setAddingRider(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
          >
            <Plus size={16} /> {t.addNewRider}
          </button>
        </div>
      </div>

      {/* 24/7 GIG OPERATIONS & SURGE CONFIGURATION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        {/* Left Column: Rain Surge Control & Availability Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌧️</span>
            <div>
              <h3 className="font-extrabold text-xs tracking-wide text-indigo-400 uppercase">Rain Surge Controller</h3>
              <p className="text-[10px] text-slate-400">Apply or remove real-time rain surge incentives instantly</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Surge Status</span>
              <button
                type="button"
                onClick={() => setRainSurgeEnabled(!rainSurgeEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rainSurgeEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40 shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
              >
                <Power size={12} /> {rainSurgeEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">Surge Incentive:</span>
                <span className="font-extrabold text-emerald-400 text-xs">₹{rainSurgeAmount} per order</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={rainSurgeAmount}
                disabled={!rainSurgeEnabled}
                onChange={(e) => setRainSurgeAmount(parseInt(e.target.value) || 25)}
                className="w-full accent-emerald-500 opacity-90 disabled:opacity-30 cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">Maximum surge capacity set at ₹30 per rain-affected handover.</span>
            </div>

            <div className={`p-2.5 rounded-lg text-center text-xs font-bold transition-all ${
              rainSurgeEnabled ? 'bg-indigo-900/30 text-indigo-300 border border-indigo-800/50' : 'bg-slate-900 text-slate-500'
            }`}>
              {rainSurgeEnabled ? `🌧️ ACTIVE: ₹${rainSurgeAmount} added to every rain order` : '☀️ Surges inactive. Standard pay structure applies.'}
            </div>
          </div>

          <div className="p-4 bg-slate-950/30 rounded-xl border border-slate-800/50 text-[11px] leading-relaxed text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">⏰ 24/7 Availability Policy</span>
            The platform operates 24/7. Riders are gig-workers with complete freedom to select, book, and extend shifts at will. Shift 1 is mandatory for exactly 1 hour.
          </div>
        </div>

        {/* Middle Column: Dynamic Hourly Rates Configurator & Payout Mode switcher */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h3 className="font-extrabold text-xs tracking-wide text-indigo-400 uppercase">Payout System Manager</h3>
              <p className="text-[10px] text-slate-400">Switch mode & configure rider billing dynamic rates</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3.5">
            {/* Payout Mode Switcher */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1.5 uppercase">Payout Mode</label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayoutMode('Hourly')}
                  className={`py-1.5 rounded-lg text-center text-xs font-bold transition-all ${
                    payoutMode === 'Hourly'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hourly Slots
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMode('Per-Parcel')}
                  className={`py-1.5 rounded-lg text-center text-xs font-bold transition-all ${
                    payoutMode === 'Per-Parcel'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Per-Parcel
                </button>
              </div>
            </div>

            {payoutMode === 'Hourly' ? (
              <div className="space-y-3.5 transition-all animate-fadeIn">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Select Gig Hour Slot</label>
                  <select
                    value={editingSlot}
                    onChange={(e) => {
                      setEditingSlot(e.target.value);
                      setSlotRate(hourlyRates[e.target.value] || 75);
                    }}
                    className="w-full p-2 bg-slate-900 border border-slate-850 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {gigSlots.map(slot => (
                      <option key={slot} value={slot}>{slot} (Current: ₹{hourlyRates[slot]}/hr)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Hourly Rate (₹40 - ₹150):</span>
                    <span className="font-extrabold text-indigo-400 text-sm">₹{slotRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={slotRate}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 40;
                      setSlotRate(val);
                      setHourlyRates(prev => ({ ...prev, [editingSlot]: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-semibold font-mono">
                    <span>MIN: ₹40</span>
                    <span>MAX: ₹150</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSlotRate(40);
                      setHourlyRates(prev => ({ ...prev, [editingSlot]: 40 }));
                    }}
                    className="py-1.5 bg-slate-900 hover:bg-slate-850 rounded-lg text-center font-bold text-slate-300 border border-slate-800"
                  >
                    Set Min (₹40)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSlotRate(150);
                      setHourlyRates(prev => ({ ...prev, [editingSlot]: 150 }));
                    }}
                    className="py-1.5 bg-indigo-950 hover:bg-indigo-900 rounded-lg text-center font-bold text-indigo-300 border border-indigo-900"
                  >
                    Set Max (₹150)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 transition-all animate-fadeIn text-xs">
                <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Per-Parcel Pay Engine</span>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Base Pay Per Order</label>
                      <span className="font-extrabold text-emerald-400">₹{perParcelBase}</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={perParcelBase}
                      onChange={(e) => setPerParcelBase(parseInt(e.target.value) || 30)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold font-mono">
                      <span>₹15</span>
                      <span>₹60</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Per-KM Distance Rate</label>
                      <span className="font-extrabold text-emerald-400">₹{perParcelPerKm}/KM</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      value={perParcelPerKm}
                      onChange={(e) => setPerParcelPerKm(parseInt(e.target.value) || 8)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold font-mono">
                      <span>₹3/KM</span>
                      <span>₹20/KM</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-indigo-950/40 rounded-lg border border-indigo-900/40 text-[10px] text-indigo-200/90 leading-relaxed">
                  💡 <strong>Payout Formula:</strong> Total Pay = Base Pay (₹{perParcelBase}) + Distance (KM) * Rate (₹{perParcelPerKm}/KM) {rainSurgeEnabled && `+ Surge (₹${rainSurgeAmount})`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 24-Hour Active Rate Matrix Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="font-extrabold text-xs tracking-wide text-indigo-400 uppercase">24-Hour Rate Matrix</h3>
              <p className="text-[10px] text-slate-400">Real-time hourly billing snapshot (Click to edit)</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 h-[190px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent text-[11px] space-y-1.5">
            {gigSlots.map(slot => {
              const isEditing = editingSlot === slot;
              const rate = hourlyRates[slot] || 75;
              return (
                <div
                  key={slot}
                  onClick={() => {
                    setEditingSlot(slot);
                    setSlotRate(rate);
                  }}
                  className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all ${
                    isEditing ? 'bg-indigo-600 text-white font-extrabold shadow-sm' : 'hover:bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{slot}</span>
                  <div className="flex items-center gap-1.5">
                    {rate >= 85 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High Peak Reward" />
                    )}
                    <span className="font-mono font-bold">₹{rate}/hr</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shift Scheduler Controller */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <Clock className="text-emerald-600 mt-0.5 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Shift Scheduling & Active Status Sync</h4>
            <p className="text-xs text-slate-500 mt-0.5">Assign active (Online) or inactive (Offline) status to riders instantly based on scheduled shift slots.</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 self-stretch md:self-auto shrink-0 flex-wrap w-full md:w-auto">
          <select
            id="shift-selector"
            className="flex-1 md:flex-none p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            defaultValue="Shift 1 (Mandatory - Exactly 1 Hour)"
          >
            <option value="Shift 1 (Mandatory - Exactly 1 Hour)">Shift 1 (Mandatory - Exactly 1 Hour)</option>
            {gigSlots.map(slot => (
              <option key={slot} value={slot}>{slot} (₹{hourlyRates[slot]}/hr)</option>
            ))}
            <option value="Morning (07:00 AM - 03:00 PM)">Morning (07:00 AM - 03:00 PM)</option>
            <option value="Evening (03:00 PM - 11:00 PM)">Evening (03:00 PM - 11:00 PM)</option>
            <option value="Night (11:00 PM - 07:00 AM)">Night (11:00 PM - 07:00 AM)</option>
            <option value="Mid-Day Peak (11:00 AM - 05:00 PM)">Mid-Day Peak (11:00 AM - 05:00 PM)</option>
            <option value="Late Night (08:00 PM - 02:00 AM)">Late Night (08:00 PM - 02:00 AM)</option>
          </select>
          <button
            onClick={() => {
              const selectedValue = (document.getElementById('shift-selector') as HTMLSelectElement)?.value;
              if (selectedValue) {
                let onlineCount = 0;
                let offlineCount = 0;
                riders.forEach(r => {
                  if (r.approvalStatus === 'Approved' && !r.isSuspended) {
                    const hasShift = r.assignedShifts?.includes(selectedValue);
                    const nextStatus = hasShift ? 'Online' : 'Offline';
                    if (r.status !== nextStatus) {
                      onUpdateRider({ ...r, status: nextStatus });
                    }
                    if (nextStatus === 'Online') onlineCount++;
                    else offlineCount++;
                  }
                });
                setSyncStatus(`Status synced! For slot "${selectedValue}", ${onlineCount} riders are now Online and ${offlineCount} are Offline.`);
                setTimeout(() => setSyncStatus(null), 6000);
              }
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Check size={14} /> Sync Status
          </button>
        </div>
      </div>

      {/* Rider Work Rule Directive Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
        <span className="text-base text-amber-600 mt-0.5">⚠️</span>
        <div className="text-xs">
          <span className="font-extrabold text-amber-900 tracking-wider uppercase block">Rider Work Rule Directive</span>
          <p className="text-amber-800 mt-1 leading-relaxed">
            <strong>Shift 1</strong> is mandatory for exactly <strong>1 hour</strong>. However, riders retain the complete flexibility to extend their working hours further as per their choice.
          </p>
        </div>
      </div>

      {syncStatus && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <span className="font-medium">{syncStatus}</span>
          <button onClick={() => setSyncStatus(null)} className="text-slate-400 hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Grid of Riders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRiders.map(rider => {
          const isOnline = rider.status === 'Online';
          const isApproved = rider.approvalStatus === 'Approved';
          return (
            <div key={rider.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={rider.avatar} alt={rider.name} referrerPolicy="no-referrer" className="h-12 w-12 rounded-full object-cover border border-slate-150" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm">{rider.name}</h3>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500 font-bold">{rider.id}</span>
                      {rider.employeeId && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                          {rider.employeeId}
                        </span>
                      )}
                      {rider.isSuspended && (
                        <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                          Suspended 🔥
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-400 font-medium mt-1 gap-0.5">
                      <span className="flex items-center gap-1 bg-indigo-50 text-indigo-800 border border-indigo-100 px-1.5 py-0.5 rounded-md max-w-max mt-0.5 mb-1">
                        <strong>Phone:</strong> {rider.phone}
                        <button
                          onClick={() => handleInitiateCall(rider.name, rider.phone, rider.avatar, 'Rider')}
                          className="p-0.5 hover:bg-indigo-150 text-indigo-600 rounded transition-all flex items-center justify-center cursor-pointer ml-1"
                          title="Call Immediately"
                        >
                          <Phone size={10} className="fill-indigo-600" />
                        </button>
                      </span>
                      <span><strong>Credentials:</strong> ID: <strong className="text-indigo-600 font-mono">{rider.id}</strong> | Pass: <strong className="text-indigo-600 font-mono">{rider.password || 'rider@123'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Online / Offline switch */}
                  <button
                    onClick={() => handleToggleOnlineStatus(rider)}
                    disabled={!isApproved}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                      !isApproved ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100' :
                      isOnline 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isOnline ? 'Online / Duty' : 'Offline / Rest'}
                  </button>
                </div>
              </div>

              {/* Rider attributes */}
              <div className="grid grid-cols-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Vehicle Reg</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">{rider.vehicleNumber}</span>
                  <span className="text-[10px] text-slate-400 block">{rider.vehicleType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Duty Earnings</span>
                  <span className="font-mono font-bold text-slate-800 mt-0.5 block text-sm">₹{rider.earnings}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">KYC Status</span>
                  <span className={`inline-flex items-center gap-1 mt-0.5 font-semibold ${isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isApproved ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {rider.approvalStatus}
                  </span>
                </div>
              </div>

              {/* Rider Payout Bank Credentials */}
              <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-150 text-[10px] space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Company Payout Bank Details</span>
                <div className="grid grid-cols-2 gap-x-2 text-slate-600 font-medium">
                  <div>
                    <span className="text-slate-400">Bank:</span> {rider.bankName || 'State Bank of India'}
                  </div>
                  <div>
                    <span className="text-slate-400">IFSC:</span> <span className="font-mono font-bold">{rider.bankIfsc || 'SBIN0000382'}</span>
                  </div>
                  <div className="col-span-2 pt-0.5 border-t border-slate-200/50 mt-0.5">
                    <span className="text-slate-400">Account No:</span> <span className="font-mono font-bold text-slate-800">xxxx xxxx {rider.bankAccountNo ? rider.bankAccountNo.slice(-4) : '2901'}</span>
                  </div>
                </div>
              </div>

              {/* Scheduled Shifts Display */}
              <div className="bg-indigo-50/40 p-3 rounded-lg border border-indigo-100/50 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Clock size={12} className="text-indigo-600" />
                    Scheduled Shifts
                  </span>
                  <button
                    onClick={() => handleOpenScheduling(rider)}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold hover:underline"
                  >
                    Set Shift
                  </button>
                </div>
                {rider.assignedShifts && rider.assignedShifts.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {rider.assignedShifts.map((sh, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-[10px] font-medium border border-indigo-100 text-indigo-700 flex items-center gap-1 shadow-3xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                        {sh}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No scheduled shifts assigned.</span>
                )}
              </div>

              {/* Interactive bottom buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setViewingDocsRider(rider)}
                  className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold flex items-center justify-center gap-0.5 shrink-0"
                >
                  <FileText size={11} /> Review Docs
                </button>
                <button
                  onClick={() => handleInitiateCall(rider.name, rider.phone, rider.avatar, 'Rider')}
                  className="flex-1 py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shrink-0"
                >
                  <Phone size={11} className="fill-emerald-700 text-emerald-700" /> Call Immediately
                </button>
                <button
                  onClick={() => setActiveIdCardRider(rider)}
                  className="flex-1 py-1.5 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-0.5 shrink-0"
                >
                  🆔 Company ID
                </button>
                <button
                  onClick={() => {
                    onUpdateRider({
                      ...rider,
                      isSuspended: !rider.isSuspended
                    });
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-0.5 border transition-all shrink-0 ${
                    rider.isSuspended
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                  }`}
                >
                  <UserX size={11} />
                  {rider.isSuspended ? 'Reactivate' : 'Suspend'}
                </button>
                {!isApproved && (
                  <button
                    onClick={() => handleApproveDocs(rider)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-0.5 shrink-0"
                  >
                    <Check size={11} /> Approve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* KYC Documents Inspector */}
      {viewingDocsRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">KYC Document Locker</h3>
                <p className="text-xs text-slate-400">{viewingDocsRider.name} Details</p>
              </div>
              <button onClick={() => setViewingDocsRider(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-bold block mb-1">RIDER DRIVING LICENSE (DL)</span>
                <span className="font-mono font-bold text-slate-700 text-sm">{viewingDocsRider.documents.license}</span>
                <div className="mt-2 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg text-[11px] text-indigo-700 flex items-center gap-2">
                  <FileText size={14} /> DL verified with Bhopal RTO Database.
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-bold block mb-1">AADHAR CARD NUMBER</span>
                <span className="font-mono font-bold text-slate-700 text-sm">{viewingDocsRider.documents.aadhar}</span>
                <div className="mt-2 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg text-[11px] text-indigo-700 flex items-center gap-2">
                  <FileText size={14} /> Biometric CIDR matching verified.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setViewingDocsRider(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Close
                </button>
                {!viewingDocsRider.documents.verified && (
                  <button
                    onClick={() => handleApproveDocs(viewingDocsRider)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"
                  >
                    Confirm & Approve KYC
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rider Official ID Card Badge Modal */}
      {activeIdCardRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 text-white w-full max-w-sm p-6 rounded-3xl border border-slate-800 shadow-2xl mx-4 relative overflow-hidden animate-fadeIn">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl -mr-8 -mt-8" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl -ml-8 -mb-8" />

            <div className="flex justify-between items-center pb-4 border-b border-slate-800 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Official Identity Badge</span>
              <button 
                onClick={() => setActiveIdCardRider(null)} 
                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Virtual Badge Body */}
            <div className="my-6 flex flex-col items-center text-center relative z-10">
              {/* Card Container with custom border */}
              <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-orange-500/30 rounded-2xl p-5 w-full shadow-lg relative overflow-hidden">
                {/* ID Badge Ribbon/Header */}
                <div className="bg-orange-600 text-white py-1 px-3 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block mb-4 shadow-3xs">
                  Ting Tong Bhopal
                </div>
                
                {/* Rider Photo Frame */}
                <div className="relative inline-block mb-3">
                  <img 
                    src={activeIdCardRider.avatar} 
                    alt={activeIdCardRider.name} 
                    referrerPolicy="no-referrer"
                    className="h-28 w-28 rounded-2xl object-cover border-4 border-slate-800 shadow-md mx-auto" 
                  />
                  <span className="absolute bottom-1 right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-slate-950 animate-pulse" title="Duty Active Status" />
                </div>

                {/* Rider Name and Designation */}
                <h4 className="text-base font-extrabold text-white tracking-tight">{activeIdCardRider.name}</h4>
                <p className="text-[10px] font-extrabold text-orange-400 tracking-widest uppercase mt-1">Rider Delivery Executive</p>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-3 mt-5 text-[10px] bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-left font-mono">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase font-bold">Company ID</span>
                    <span className="text-white font-extrabold">{activeIdCardRider.employeeId || `TTB-RDR-2026-${activeIdCardRider.id}`}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase font-bold">Rider ID</span>
                    <span className="text-white font-extrabold">{activeIdCardRider.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase font-bold">Vehicle Reg No.</span>
                    <span className="text-white font-bold truncate block">{activeIdCardRider.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase font-bold">Registered Mobile</span>
                    <span className="text-white font-bold">{activeIdCardRider.phone}</span>
                  </div>
                </div>

                {/* Barcode Simulator / Signature block */}
                <div className="mt-5 pt-3 border-t border-slate-850 flex flex-col items-center">
                  <div className="w-full bg-white h-7 flex items-center justify-between px-2 py-1 rounded opacity-90">
                    {/* Fake Barcode Lines */}
                    <div className="flex gap-0.5 h-full w-full justify-center">
                      {[2,4,1,3,2,1,4,2,3,1,2,4,1,3,2,1,2,3,4,1,2,3].map((val, i) => (
                        <div key={i} className="bg-black" style={{ width: `${val}px` }} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase tracking-widest">FOODS DELIVERY LOGISTICS NETWORK</span>
                </div>
              </div>
            </div>

            {/* Print and Actions */}
            <div className="flex justify-between items-center gap-3 relative z-10 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">Auto-generated upon verification.</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveIdCardRider(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white transition-all shadow-md"
                >
                  Print Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Rider Drawer Modal */}
      {addingRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-xl mx-4 flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden">
            {/* Header with back button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <button 
                type="button"
                onClick={() => setAddingRider(false)} 
                className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-3xs transition-all cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <Plus size={16} className="text-emerald-600" />
                Add New Rider Partner
              </h3>
              <button 
                type="button"
                onClick={() => setAddingRider(false)} 
                className="text-slate-400 hover:text-slate-600 bg-slate-150/50 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Fields container */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Rider Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Singh Yadav"
                    value={newRiderData.name}
                    onChange={(e) => setNewRiderData({ ...newRiderData, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 99999 88888"
                    value={newRiderData.phone}
                    onChange={(e) => setNewRiderData({ ...newRiderData, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Vehicle Type</label>
                    <select
                      value={newRiderData.vehicleType}
                      onChange={(e) => setNewRiderData({ ...newRiderData, vehicleType: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Scooter (Electric)">Scooter (Electric)</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Vehicle Number</label>
                    <input
                      type="text"
                      required
                      placeholder="MP-04-AB-1234"
                      value={newRiderData.vehicleNumber}
                      onChange={(e) => setNewRiderData({ ...newRiderData, vehicleNumber: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Driving License No.</label>
                    <input
                      type="text"
                      required
                      placeholder="DL-882910"
                      value={newRiderData.license}
                      onChange={(e) => setNewRiderData({ ...newRiderData, license: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Aadhar Card No.</label>
                    <input
                      type="text"
                      required
                      placeholder="AADHAR-1234-5678-9012"
                      value={newRiderData.aadhar}
                      onChange={(e) => setNewRiderData({ ...newRiderData, aadhar: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Setup Password</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rider@123"
                    value={newRiderData.password}
                    onChange={(e) => setNewRiderData({ ...newRiderData, password: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Rider Photo & Bank Details */}
                <div className="border-t border-slate-150 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    🚲 Rider Photo & Payout Credentials
                  </h4>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Rider Photo URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={newRiderData.avatar}
                      onChange={(e) => setNewRiderData({ ...newRiderData, avatar: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Bank Name</label>
                      <input
                        type="text"
                        placeholder="SBI"
                        value={newRiderData.bankName}
                        onChange={(e) => setNewRiderData({ ...newRiderData, bankName: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Bank IFSC Code</label>
                      <input
                        type="text"
                        placeholder="SBIN0000382"
                        value={newRiderData.bankIfsc}
                        onChange={(e) => setNewRiderData({ ...newRiderData, bankIfsc: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 uppercase mb-1">Bank Account No.</label>
                      <input
                        type="text"
                        placeholder="1029302910"
                        value={newRiderData.bankAccountNo}
                        onChange={(e) => setNewRiderData({ ...newRiderData, bankAccountNo: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with back & action buttons */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setAddingRider(false)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingRider(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-3xs cursor-pointer"
                  >
                    Register Rider (Pending DL KYC)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shift Scheduler Modal */}
      {schedulingRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-100 shadow-xl mx-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Assign Shifts & Scheduling</h3>
                <p className="text-xs text-slate-400">Configure duty slots for {schedulingRider.name}</p>
              </div>
              <button onClick={() => setSchedulingRider(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Shift 1 Rule Notice */}
            <div className="mt-3 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-800">
              <strong>Rule:</strong> Shift 1 is mandatory for exactly 1 hour. Additional hours are completely flexible.
            </div>

            <div className="space-y-4 mt-4 text-xs text-slate-600">
              {/* 24/7 GIG BOOKING LIST */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">Select 1-Hour Gig Slots</label>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedShifts.length > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700 animate-pulse'
                  }`}>
                    {selectedShifts.length} Slots Selected ({selectedShifts.length} hrs)
                  </span>
                </div>

                {/* Booking Rule Alert Banner */}
                {selectedShifts.length === 0 && (
                  <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-xl font-medium">
                    ⚠️ <strong>Booking Rule:</strong> To start working, a rider must select and book at least 1 shift (1 hour). Saving is disabled until at least 1 slot is booked.
                  </div>
                )}

                <div className="p-1 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="max-h-56 overflow-y-auto p-1.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300">
                    {/* Special Mandatory Shift Option */}
                    <button
                      type="button"
                      onClick={() => handleToggleShiftSelection('Shift 1 (Mandatory - Exactly 1 Hour)')}
                      className={`w-full p-2 rounded-lg border text-left text-xs font-bold flex items-center justify-between transition-all ${
                        selectedShifts.includes('Shift 1 (Mandatory - Exactly 1 Hour)')
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>⭐ Shift 1 (Mandatory - Exactly 1 Hour)</span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedShifts.includes('Shift 1 (Mandatory - Exactly 1 Hour)') ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'
                      }`}>
                        {selectedShifts.includes('Shift 1 (Mandatory - Exactly 1 Hour)') && <Check size={10} strokeWidth={3} />}
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-slate-200 my-1 pb-1" />

                    {/* 24 Hourly Slots */}
                    <div className="grid grid-cols-1 gap-1.5">
                      {gigSlots.map((slot) => {
                        const isSelected = selectedShifts.includes(slot);
                        const rate = hourlyRates[slot] || 75;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleToggleShiftSelection(slot)}
                            className={`p-2 rounded-lg border text-left text-[11px] font-semibold flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span>{slot}</span>
                              <span className="text-[9px] text-slate-400 font-normal">Payout Rate: <strong className="text-emerald-600 font-bold">₹{rate}/hr</strong></span>
                            </div>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check size={10} strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-2 italic leading-normal">
                  💡 <strong>Extension Freedom:</strong> Riders have absolute freedom to select as many consecutive or non-consecutive 1-hour slots as they want to extend their working hours.
                </p>
              </div>

              {/* Add Custom Slot */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="block font-bold text-slate-500 uppercase text-[10px]">Create Custom Shift Slot</span>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-0.5">SHIFT NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Peak Dinner Rush"
                      value={customShift.name}
                      onChange={(e) => setCustomShift({ ...customShift, name: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold mb-0.5">START TIME</label>
                      <input
                        type="text"
                        placeholder="e.g. 06:00 PM"
                        value={customShift.start}
                        onChange={(e) => setCustomShift({ ...customShift, start: e.target.value })}
                        className="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold mb-0.5">END TIME</label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 PM"
                        value={customShift.end}
                        onChange={(e) => setCustomShift({ ...customShift, end: e.target.value })}
                        className="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomShift}
                    className="w-full py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[10px] transition-all"
                  >
                    + Add Custom Slot
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSchedulingRider(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  disabled={selectedShifts.length === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Shift Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Rider Call Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-slate-950 text-white w-full max-w-sm p-6 rounded-3xl border border-slate-800 shadow-2xl mx-4 relative overflow-hidden animate-fadeIn">
            {/* Pulsing ring background design */}
            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent opacity-50" />
            
            {/* Header */}
            <div className="flex flex-col items-center text-center mt-4 mb-8">
              <span className="text-[10px] bg-indigo-50/10 text-indigo-400 border border-indigo-550/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-3">
                Outgoing {activeCall.role} Call
              </span>
              
              {/* Profile Image with animated ring */}
              <div className="relative mt-2">
                <div className={`absolute -inset-4 rounded-full bg-indigo-500/20 blur-sm ${(callStatus === 'connecting' || callStatus === 'ringing') ? 'animate-ping' : ''}`} />
                <div className="relative">
                  <img 
                    src={activeCall.avatar} 
                    alt={activeCall.name} 
                    referrerPolicy="no-referrer"
                    className="h-28 w-28 rounded-full object-cover border-4 border-slate-800 shadow-xl" 
                  />
                  {callStatus === 'connected' && (
                    <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-950 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Name & Phone */}
              <h3 className="text-xl font-extrabold text-white mt-6 tracking-tight">{activeCall.name}</h3>
              <p className="text-sm text-slate-400 font-mono mt-1">{activeCall.phone}</p>
              
              {/* Call Status and Duration */}
              <div className="mt-8">
                {callStatus === 'connecting' && (
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider animate-pulse">Connecting to Network...</p>
                )}
                {callStatus === 'ringing' && (
                  <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider animate-pulse">Ringing phone...</p>
                )}
                {callStatus === 'connected' && (
                  <div className="space-y-1">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Call Connected</p>
                    <p className="text-2xl font-bold font-mono tracking-widest text-slate-200 mt-1">{formatDuration(callDuration)}</p>
                  </div>
                )}
                {callStatus === 'ended' && (
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">Call Ended</p>
                )}
              </div>
            </div>

            {/* In-call simulated controls */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-slate-400">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                  isMuted 
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                    : 'bg-slate-900 border-slate-800 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span className="text-sm">🎙️</span>
                <span className="text-[10px] font-bold uppercase">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                  isSpeaker 
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                    : 'bg-slate-900 border-slate-800 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span className="text-sm">🔊</span>
                <span className="text-[10px] font-bold uppercase">{isSpeaker ? 'Speaker Active' : 'Speaker'}</span>
              </button>
            </div>

            {/* Hangup Button */}
            <div className="flex justify-center pb-4">
              <button
                type="button"
                onClick={handleHangUp}
                className="w-16 h-16 bg-rose-600 hover:bg-rose-700 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
