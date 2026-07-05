export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  walletBalance: number;
  status: 'Active' | 'Blocked';
  joinedDate: string;
  orderCount: number;
  totalSpent: number;
  password?: string;
  isSuspended?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  cuisine: string;
  avatar: string;
  commissionRate: number;
  status: 'Pending' | 'Approved';
  walletBalance: number;
  rating: number;
  address: string;
  menu: MenuItem[];
  password?: string;
  isSuspended?: boolean;
  shopPhoto?: string;
  fssaiNumber?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankName?: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'Online' | 'Offline';
  approvalStatus: 'Pending' | 'Approved';
  vehicleType: string;
  vehicleNumber: string;
  documents: {
    license: string; // Document URL or simulated status
    aadhar: string;
    verified: boolean;
  };
  earnings: number;
  rating: number;
  currentLocation?: { x: number; y: number };
  password?: string;
  isSuspended?: boolean;
  assignedShifts?: string[];
  bankAccountNo?: string;
  bankIfsc?: string;
  bankName?: string;
  employeeId?: string;
}

export type OrderStatus = 'New' | 'Accepted' | 'Preparing' | 'Ready' | 'Picked' | 'Delivered' | 'Cancelled' | 'Refunded';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  riderId?: string;
  riderName?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  platformFee: number;
  gst: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: 'COD' | 'Online';
  tracking?: {
    riderX: number;
    riderY: number;
    restaurantX: number;
    restaurantY: number;
    customerX: number;
    customerY: number;
    path: Array<{ x: number; y: number }>;
  };
}

export interface PaymentSettings {
  upiId: string;
  qrCodeUrl: string;
  codEnabled: boolean;
  onlineEnabled: boolean;
  activeGateway: 'Razorpay' | 'Stripe' | 'Paytm' | 'Cashfree';
}

export interface CommissionSettings {
  vendorCommissionPercentage: number;
  platformFee: number;
  gstPercentage: number;
  extraCharges: number;
}

export interface DeliveryChargeSettings {
  charge0to3km: number;
  charge3to5km: number;
  chargeAbove5kmPerKm: number;
}

export interface AreaZone {
  id: string;
  name: string;
  coverageRadiusKm: number;
  status: 'Active' | 'Disabled';
  subAreas: string[];
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  active: boolean;
  target: 'All' | 'Vendors' | 'Customers';
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderValue: number;
  active: boolean;
}

export interface NotificationLog {
  id: string;
  title: string;
  message: string;
  target: 'All' | 'Customers' | 'Vendors' | 'Riders';
  timestamp: string;
}

export interface SystemSettings {
  logoUrl: string;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  bhopalOfficeAddress: string;
  roles: Array<{
    name: string;
    description: string;
    permissions: string[];
  }>;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'Commission' | 'Status Toggle' | 'Payment Switch' | 'System Settings' | 'Security' | 'Coupons' | 'Zones' | 'Marketing';
  details: string;
  adminUser: string;
  timestamp: string;
  ipAddress?: string;
}

