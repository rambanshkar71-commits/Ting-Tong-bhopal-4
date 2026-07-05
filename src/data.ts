import { Customer, Vendor, Rider, Order, PaymentSettings, CommissionSettings, DeliveryChargeSettings, AreaZone, Banner, Coupon, NotificationLog, SystemSettings, AuditLog } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-101',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@gmail.com',
    phone: '+91 98270 12345',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    walletBalance: 450,
    status: 'Active',
    joinedDate: '2025-01-15',
    orderCount: 18,
    totalSpent: 4850
  },
  {
    id: 'CUST-102',
    name: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '+91 94250 67890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    walletBalance: 1200,
    status: 'Active',
    joinedDate: '2025-02-10',
    orderCount: 24,
    totalSpent: 7420
  },
  {
    id: 'CUST-103',
    name: 'Amit Patel',
    email: 'amit.patel@outlook.com',
    phone: '+91 75525 43210',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    walletBalance: 0,
    status: 'Active',
    joinedDate: '2025-03-01',
    orderCount: 5,
    totalSpent: 1250
  },
  {
    id: 'CUST-104',
    name: 'Anjali Verma',
    email: 'anjali.v@gmail.com',
    phone: '+91 91790 99887',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    walletBalance: 150,
    status: 'Blocked',
    joinedDate: '2025-02-28',
    orderCount: 9,
    totalSpent: 3100
  },
  {
    id: 'CUST-105',
    name: 'Vikram Singh',
    email: 'vikram.s@live.com',
    phone: '+91 93000 11223',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    walletBalance: 60,
    status: 'Active',
    joinedDate: '2025-04-12',
    orderCount: 2,
    totalSpent: 480
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VND-001',
    name: 'Sagar Gaire - MP Nagar',
    ownerName: 'Sagar Gaire',
    email: 'contact@sagargairebhopal.com',
    phone: '+91 75542 98765',
    cuisine: 'North Indian, Fast Food',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&auto=format&fit=crop&q=80',
    commissionRate: 15,
    status: 'Approved',
    walletBalance: 18450,
    rating: 4.6,
    address: 'Zone-II, Maharana Pratap Nagar, Bhopal',
    menu: [
      { id: 'M-101', name: 'Veg Cheese Sandwich', price: 120, isAvailable: true, category: 'Sandwiches' },
      { id: 'M-102', name: 'Paneer Butter Masala Combo', price: 210, isAvailable: true, category: 'Main Course' },
      { id: 'M-103', name: 'Veg Biryani', price: 180, isAvailable: true, category: 'Main Course' },
      { id: 'M-104', name: 'Cold Coffee with Ice Cream', price: 90, isAvailable: false, category: 'Beverages' }
    ]
  },
  {
    id: 'VND-002',
    name: 'Manohar Dairy & Restaurant',
    ownerName: 'Manohar Harwani',
    email: 'info@manohardairy.com',
    phone: '+91 75525 35555',
    cuisine: 'Sweets, Street Food, South Indian',
    avatar: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&auto=format&fit=crop&q=80',
    commissionRate: 12,
    status: 'Approved',
    walletBalance: 32900,
    rating: 4.8,
    address: 'Hamidia Road & MP Nagar Zone-I, Bhopal',
    menu: [
      { id: 'M-201', name: 'Special Chola Bhatura', price: 160, isAvailable: true, category: 'Breakfast' },
      { id: 'M-202', name: 'Raj Kachori', price: 95, isAvailable: true, category: 'Chaat' },
      { id: 'M-203', name: 'Rasmalai (2 Pcs)', price: 80, isAvailable: true, category: 'Sweets' },
      { id: 'M-204', name: 'Masala Dosa', price: 130, isAvailable: true, category: 'South Indian' }
    ]
  },
  {
    id: 'VND-003',
    name: 'Indian Coffee House - TT Nagar',
    ownerName: 'ICH Society Bhopal',
    email: 'ich.ttnagar@ichbhopal.co.in',
    phone: '+91 75525 51632',
    cuisine: 'South Indian, Chinese, Continental',
    avatar: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&auto=format&fit=crop&q=80',
    commissionRate: 10,
    status: 'Approved',
    walletBalance: 9800,
    rating: 4.3,
    address: 'New Market, TT Nagar, Bhopal',
    menu: [
      { id: 'M-301', name: 'Mutton Cutlet (2 Pcs)', price: 180, isAvailable: true, category: 'Snacks' },
      { id: 'M-302', name: 'Vegetable Cutlet', price: 110, isAvailable: true, category: 'Snacks' },
      { id: 'M-303', name: 'French Toast', price: 80, isAvailable: true, category: 'Breakfast' },
      { id: 'M-304', name: 'Special Filter Coffee', price: 50, isAvailable: true, category: 'Beverages' }
    ]
  },
  {
    id: 'VND-004',
    name: 'Sharma & Vishnu Fast Food',
    ownerName: 'Vishnu Sharma',
    email: 'sharmavishnu@gmail.com',
    phone: '+91 98932 74321',
    cuisine: 'Chinese, Fast Food',
    avatar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=150&auto=format&fit=crop&q=80',
    commissionRate: 14,
    status: 'Approved',
    walletBalance: 12200,
    rating: 4.4,
    address: 'Indrapuri C-Sector, BHEL, Bhopal',
    menu: [
      { id: 'M-401', name: 'Veg Manchurian Dry', price: 130, isAvailable: true, category: 'Chinese' },
      { id: 'M-402', name: 'Paneer Fried Rice', price: 140, isAvailable: true, category: 'Chinese' },
      { id: 'M-403', name: 'Cheese Butter Hakka Noodles', price: 160, isAvailable: true, category: 'Chinese' }
    ]
  },
  {
    id: 'VND-005',
    name: 'Bhopal Baking Company',
    ownerName: 'Rajesh Nair',
    email: 'bake@bhopalbakery.com',
    phone: '+91 97552 12121',
    cuisine: 'Bakery, Desserts, Cafe',
    avatar: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=80',
    commissionRate: 15,
    status: 'Pending',
    walletBalance: 0,
    rating: 4.2,
    address: 'Arera Colony, E-7, Bhopal',
    menu: [
      { id: 'M-501', name: 'Red Velvet Pastry', price: 110, isAvailable: true, category: 'Cakes' },
      { id: 'M-502', name: 'Chocolate Truffle Cake (Half KG)', price: 450, isAvailable: true, category: 'Cakes' }
    ]
  }
];

export const INITIAL_RIDERS: Rider[] = [
  {
    id: 'RDR-201',
    name: 'Rahul Yadav',
    phone: '+91 88789 54321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'Online',
    approvalStatus: 'Approved',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'MP-04-MJ-8832',
    documents: {
      license: 'LIC-9938201',
      aadhar: 'AADHAR-8832-1920-5542',
      verified: true
    },
    earnings: 2840,
    rating: 4.9,
    currentLocation: { x: 70, y: 53 }, // Near MP Nagar
    assignedShifts: ['Morning (07:00 AM - 03:00 PM)', 'Evening (03:00 PM - 11:00 PM)']
  },
  {
    id: 'RDR-202',
    name: 'Sandeep Mewada',
    phone: '+91 91118 76543',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    status: 'Online',
    approvalStatus: 'Approved',
    vehicleType: 'Scooter (Electric)',
    vehicleNumber: 'MP-04-ER-0199',
    documents: {
      license: 'LIC-3329188',
      aadhar: 'AADHAR-1243-9988-7711',
      verified: true
    },
    earnings: 1950,
    rating: 4.7,
    currentLocation: { x: 62, y: 65 }, // Near Bittan Market
    assignedShifts: ['Morning (07:00 AM - 03:00 PM)']
  },
  {
    id: 'RDR-203',
    name: 'Ankit Chouhan',
    phone: '+91 95899 12345',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    status: 'Offline',
    approvalStatus: 'Approved',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'MP-04-NK-4421',
    documents: {
      license: 'LIC-1122998',
      aadhar: 'AADHAR-5542-8811-9922',
      verified: true
    },
    earnings: 1120,
    rating: 4.5,
    currentLocation: { x: 42, y: 88 }, // Near Kolar Road
    assignedShifts: ['Evening (03:00 PM - 11:00 PM)']
  },
  {
    id: 'RDR-204',
    name: 'Sunil Bhojwani',
    phone: '+91 79998 88776',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    status: 'Offline',
    approvalStatus: 'Pending',
    vehicleType: 'Bicycle',
    vehicleNumber: 'N/A (Non-Motor)',
    documents: {
      license: 'N/A',
      aadhar: 'AADHAR-9982-4411-5522',
      verified: false
    },
    earnings: 0,
    rating: 0,
    currentLocation: { x: 80, y: 28 }, // Near Indrapuri
    assignedShifts: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5001',
    customerId: 'CUST-101',
    customerName: 'Ramesh Kumar',
    vendorId: 'VND-001',
    vendorName: 'Sagar Gaire - MP Nagar',
    riderId: 'RDR-201',
    riderName: 'Rahul Yadav',
    items: [
      { name: 'Veg Cheese Sandwich', price: 120, quantity: 2 },
      { name: 'Paneer Butter Masala Combo', price: 210, quantity: 1 }
    ],
    subtotal: 450,
    deliveryCharge: 30,
    platformFee: 10,
    gst: 22.5,
    discount: 50,
    total: 462.5,
    status: 'Picked',
    createdAt: '2026-07-02T05:15:00-07:00',
    deliveryAddress: 'E-5/12, Arera Colony, Bhopal',
    paymentMethod: 'Online',
    tracking: {
      riderX: 72,
      riderY: 60,
      restaurantX: 75, // MP Nagar
      restaurantY: 48,
      customerX: 70, // Arera Colony
      customerY: 75,
      path: [
        { x: 75, y: 48 },
        { x: 75, y: 55 },
        { x: 72, y: 60 },
        { x: 70, y: 68 },
        { x: 70, y: 75 }
      ]
    }
  },
  {
    id: 'ORD-5002',
    customerId: 'CUST-102',
    customerName: 'Priya Sharma',
    vendorId: 'VND-002',
    vendorName: 'Manohar Dairy & Restaurant',
    riderId: 'RDR-202',
    riderName: 'Sandeep Mewada',
    items: [
      { name: 'Special Chola Bhatura', price: 160, quantity: 1 },
      { name: 'Raj Kachori', price: 95, quantity: 2 },
      { name: 'Rasmalai (2 Pcs)', price: 80, quantity: 1 }
    ],
    subtotal: 430,
    deliveryCharge: 35,
    platformFee: 10,
    gst: 21.5,
    discount: 0,
    total: 496.5,
    status: 'Preparing',
    createdAt: '2026-07-02T05:25:00-07:00',
    deliveryAddress: 'Chunabhatti, Near Shahpura Lake, Bhopal',
    paymentMethod: 'COD',
    tracking: {
      riderX: 62,
      riderY: 65,
      restaurantX: 40, // Hamidia Road (Lower Lake area)
      restaurantY: 45,
      customerX: 55, // Shahpura Lake
      customerY: 78,
      path: [
        { x: 40, y: 45 },
        { x: 45, y: 55 },
        { x: 50, y: 65 },
        { x: 55, y: 78 }
      ]
    }
  },
  {
    id: 'ORD-5003',
    customerId: 'CUST-103',
    customerName: 'Amit Patel',
    vendorId: 'VND-003',
    vendorName: 'Indian Coffee House - TT Nagar',
    items: [
      { name: 'Mutton Cutlet (2 Pcs)', price: 180, quantity: 1 },
      { name: 'Special Filter Coffee', price: 50, quantity: 2 }
    ],
    subtotal: 280,
    deliveryCharge: 30,
    platformFee: 10,
    gst: 14,
    discount: 20,
    total: 314,
    status: 'New',
    createdAt: '2026-07-02T05:32:00-07:00',
    deliveryAddress: 'Kotra Sultanabad, Bhopal',
    paymentMethod: 'Online'
  },
  {
    id: 'ORD-5004',
    customerId: 'CUST-105',
    customerName: 'Vikram Singh',
    vendorId: 'VND-004',
    vendorName: 'Sharma & Vishnu Fast Food',
    items: [
      { name: 'Cheese Butter Hakka Noodles', price: 160, quantity: 1 },
      { name: 'Veg Manchurian Dry', price: 130, quantity: 1 }
    ],
    subtotal: 290,
    deliveryCharge: 45,
    platformFee: 10,
    gst: 14.5,
    discount: 0,
    total: 359.5,
    status: 'Delivered',
    createdAt: '2026-07-02T04:20:00-07:00',
    deliveryAddress: 'Kolar Heights, Kolar Road, Bhopal',
    paymentMethod: 'Online'
  },
  {
    id: 'ORD-5005',
    customerId: 'CUST-104',
    customerName: 'Anjali Verma',
    vendorId: 'VND-001',
    vendorName: 'Sagar Gaire - MP Nagar',
    items: [
      { name: 'Veg Cheese Sandwich', price: 120, quantity: 2 }
    ],
    subtotal: 240,
    deliveryCharge: 30,
    platformFee: 10,
    gst: 12,
    discount: 0,
    total: 292,
    status: 'Cancelled',
    createdAt: '2026-07-01T21:40:00-07:00',
    deliveryAddress: 'BHEL Colony, Piplani, Bhopal',
    paymentMethod: 'COD'
  }
];

export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: 'bhopal.admin@okaxis',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=bhopal.admin@okaxis&pn=MasterAdminPanel&am=0',
  codEnabled: true,
  onlineEnabled: true,
  activeGateway: 'Razorpay'
};

export const INITIAL_COMMISSION_SETTINGS: CommissionSettings = {
  vendorCommissionPercentage: 15,
  platformFee: 10,
  gstPercentage: 5,
  extraCharges: 15 // Packaging/handling charges
};

export const INITIAL_DELIVERY_CHARGE_SETTINGS: DeliveryChargeSettings = {
  charge0to3km: 30,
  charge3to5km: 45,
  chargeAbove5kmPerKm: 10 // Additional ₹10/KM
};

export const INITIAL_AREA_ZONES: AreaZone[] = [
  {
    id: 'ZONE-A',
    name: 'MP Nagar & Zone-II',
    coverageRadiusKm: 5,
    status: 'Active',
    subAreas: ['Zone-I', 'Zone-II', 'Press Complex', 'Arera Hills', 'Pragati Petrol Pump']
  },
  {
    id: 'ZONE-B',
    name: 'Arera Colony & Shahpura',
    coverageRadiusKm: 6,
    status: 'Active',
    subAreas: ['E-1 to E-7', 'Char Imli', 'Bittan Market', 'Shahpura Sector A, B, C', 'Chunabhatti']
  },
  {
    id: 'ZONE-C',
    name: 'Kolar Road Expansion',
    coverageRadiusKm: 8,
    status: 'Active',
    subAreas: ['Kolar Road', 'Lalita Nagar', 'Mandakini Colony', 'Sankhedi', 'Sarvadharma']
  },
  {
    id: 'ZONE-D',
    name: 'BHEL & Indrapuri',
    coverageRadiusKm: 5,
    status: 'Active',
    subAreas: ['Indrapuri A, B, C', 'Piplani', 'Awadhpuri', 'Khajuri Kalan', 'BHEL Township']
  },
  {
    id: 'ZONE-E',
    name: 'Old Bhopal & Lake Drive',
    coverageRadiusKm: 7,
    status: 'Disabled',
    subAreas: ['Hamidia Road', 'Peer Gate', 'Lalghati', 'Koh-e-Fiza', 'Bairagarh']
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'B-101',
    title: 'Monsoon Feast - Up to 50% Off on Street Foods',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    active: true,
    target: 'Customers'
  },
  {
    id: 'B-102',
    title: 'Vendor Super League - Boost sales with 0% extra commissions',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
    active: true,
    target: 'Vendors'
  },
  {
    id: 'B-103',
    title: 'Late Night Cravings Deal - Free delivery above ₹299',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    active: false,
    target: 'Customers'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'CPN-201',
    code: 'BHOPALFOOD50',
    discountPercentage: 50,
    maxDiscount: 100,
    minOrderValue: 200,
    active: true
  },
  {
    id: 'CPN-202',
    code: 'CHATORABHAY',
    discountPercentage: 20,
    maxDiscount: 150,
    minOrderValue: 250,
    active: true
  },
  {
    id: 'CPN-203',
    code: 'FREEDEL',
    discountPercentage: 100, // Covers delivery charge fully as simulated
    maxDiscount: 45,
    minOrderValue: 300,
    active: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'NOT-001',
    title: 'New Coupon Launched!',
    message: 'Coupon BHOPALFOOD50 is now live for all foodies in Bhopal. Order now!',
    target: 'Customers',
    timestamp: '2026-07-02T04:30:00-07:00'
  },
  {
    id: 'NOT-002',
    title: 'Rain Alert - Delivery Charge Hike',
    message: 'Heavy rains in Bhopal. Safe driving incentive activated for riders. Delivery charge increased by ₹10.',
    target: 'Riders',
    timestamp: '2026-07-02T02:15:00-07:00'
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  logoUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=80&auto=format&fit=crop&q=80',
  companyName: 'Bhopal Express Logistics',
  supportEmail: 'support@bhopalexpress.in',
  supportPhone: '+91 755 4901234',
  bhopalOfficeAddress: 'Plot 42, Sector C, Govindpura Industrial Area, Bhopal, MP - 462023',
  roles: [
    {
      name: 'Super Admin',
      description: 'Unrestricted master control of the entire platform.',
      permissions: ['All Permissions', 'Database Access', 'Manage Banners', 'Manage Commissions', 'Manage Settings']
    },
    {
      name: 'Support Representative',
      description: 'Manage customers, refunds, chat supports, and orders state.',
      permissions: ['View Customers', 'Process Refund', 'Manage Orders', 'View Live Tracking']
    },
    {
      name: 'Operations Manager',
      description: 'Manage vendors, menus, riders, and area delivery rules.',
      permissions: ['Manage Vendors', 'Approve Rider', 'Area Management', 'View Live Tracking']
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-301',
    action: 'Commission Rate Updated',
    category: 'Commission',
    details: 'Default Vendor Commission updated from 12% to 15%. Affects all future checkout subtotals.',
    adminUser: 'Super Admin',
    timestamp: '2026-07-02T10:15:00-07:00',
    ipAddress: '192.168.1.42'
  },
  {
    id: 'AUD-302',
    action: 'Payment Gateway Switched',
    category: 'Payment Switch',
    details: 'Active billing gateway changed from Paytm to Razorpay.',
    adminUser: 'Super Admin',
    timestamp: '2026-07-01T15:42:00-07:00',
    ipAddress: '192.168.1.42'
  },
  {
    id: 'AUD-303',
    action: 'Rider Suspended',
    category: 'Status Toggle',
    details: 'Rider RD-003 (Mohan Lal) suspended due to consecutive late handovers.',
    adminUser: 'Operations Manager',
    timestamp: '2026-07-01T11:04:00-07:00',
    ipAddress: '192.168.2.110'
  },
  {
    id: 'AUD-304',
    action: 'COD Payments Enabled',
    category: 'Payment Switch',
    details: 'Cash on Delivery (COD) checked active for all areas in Bhopal.',
    adminUser: 'Super Admin',
    timestamp: '2026-06-30T09:30:00-07:00',
    ipAddress: '192.168.1.42'
  },
  {
    id: 'AUD-305',
    action: 'Corporate GST Percentage Modified',
    category: 'Commission',
    details: 'GST Percentage adjusted from 18% to 5% for standard platform integration billing.',
    adminUser: 'Super Admin',
    timestamp: '2026-06-29T16:20:00-07:00',
    ipAddress: '192.168.1.55'
  }
];

