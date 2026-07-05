export type Language = 'en' | 'hi';

export interface TranslationSet {
  // Sidebar
  dashboard: string;
  customers: string;
  vendors: string;
  riders: string;
  orders: string;
  tracking: string;
  payment: string;
  commission: string;
  delivery: string;
  areas: string;
  marketing: string;
  support: string;
  settings: string;
  
  // Header
  hubLabel: string;
  roleLabel: string;
  signalLabel: string;
  broadcasterBtn: string;
  broadcasterTooltip: string;
  logoutLabel: string;
  
  // Common Buttons, Input Fields & Badges
  saveChanges: string;
  cancel: string;
  add: string;
  edit: string;
  delete: string;
  statusActive: string;
  statusBlocked: string;
  statusPending: string;
  statusApproved: string;
  all: string;
  searchPlaceholder: string;
  actions: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  submit: string;
  back: string;
  walletBalance: string;

  // Dashboard Highlights & Headings
  totalRevenue: string;
  activeCustomers: string;
  activeVendors: string;
  activeRiders: string;
  liveOrders: string;
  operationalSuccess: string;
  financialHub: string;
  financialHubDesc: string;
  operationalPulse: string;
  operationalPulseDesc: string;
  walletDeposit: string;
  vendorSettlement: string;
  riderSettlement: string;
  amount: string;
  remarks: string;
  recentTransactions: string;
  recentTransactionsDesc: string;
  
  // Customer & Vendor & Rider Management Tab
  customerRegistry: string;
  customerRegistryDesc: string;
  addNewCustomer: string;
  vendorRegistry: string;
  vendorRegistryDesc: string;
  addNewVendor: string;
  riderRegistry: string;
  riderRegistryDesc: string;
  addNewRider: string;
  
  // Order Management Tab
  liveOrdersBoard: string;
  liveOrdersBoardDesc: string;
  orderId: string;
  customer: string;
  vendor: string;
  rider: string;
  items: string;
  totalPrice: string;
  orderStatus: string;
  updateStatus: string;

  // Payments / Commission / Delivery Tabs
  paymentGateways: string;
  paymentGatewaysDesc: string;
  commissionRates: string;
  commissionRatesDesc: string;
  deliveryCharges: string;
  deliveryChargesDesc: string;

  // Areas & Zones Tab
  geographicalZones: string;
  geographicalZonesDesc: string;
  zoneName: string;
  baseCharge: string;
  coverageRadius: string;

  // Marketing Tab
  bannerCampaigns: string;
  bannerCampaignsDesc: string;
  couponsOffers: string;
  couponsOffersDesc: string;

  // Support Tab
  supportTickets: string;
  supportTicketsDesc: string;
  
  // Settings Tab
  companySettings: string;
  companySettingsDesc: string;
  securityControls: string;
  securityControlsDesc: string;
  auditTrail: string;
  auditTrailDesc: string;
  languageAndLocalization: string;
  languageAndLocalizationDesc: string;
}

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    dashboard: 'Dashboard',
    customers: 'Customer Management',
    vendors: 'Vendor Management',
    riders: 'Rider Management',
    orders: 'Order Management',
    tracking: 'Live Tracking',
    payment: 'Payment Management',
    commission: 'Commission Management',
    delivery: 'Delivery Management',
    areas: 'Area Management',
    marketing: 'Marketing Hub',
    support: 'Help & Support Center',
    settings: 'System Settings',
    
    hubLabel: 'Bhopal Hub Center',
    roleLabel: 'Role:',
    signalLabel: 'Network Signal:',
    broadcasterBtn: 'Broadcaster 🔥',
    broadcasterTooltip: 'Broadcast Live Push Alert Anytime',
    logoutLabel: 'Exit',
    
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    add: 'Add New',
    edit: 'Edit Details',
    delete: 'Delete',
    statusActive: 'Active',
    statusBlocked: 'Blocked',
    statusPending: 'Pending Approval',
    statusApproved: 'Approved',
    all: 'All Pools',
    searchPlaceholder: 'Search here...',
    actions: 'Actions',
    name: 'Name',
    phone: 'Phone Number',
    email: 'Email Address',
    status: 'Status',
    submit: 'Submit',
    back: 'Back',
    walletBalance: 'Wallet Balance',
    
    totalRevenue: 'Total Platform Revenue',
    activeCustomers: 'Total Active Customers',
    activeVendors: 'Onboarded Merchants',
    activeRiders: 'On-Duty Delivery Riders',
    liveOrders: 'Active Live Orders',
    operationalSuccess: 'Delivery Success Rate',
    financialHub: 'Platform Financial Hub',
    financialHubDesc: 'Direct ledger adjustments, merchant payouts, and rider incentives dispatch panel',
    operationalPulse: 'Operational Pulse & Live Stats',
    operationalPulseDesc: 'Real-time logistics analytics and success rates',
    walletDeposit: 'Wallet Deposit / Deduction',
    vendorSettlement: 'Vendor Settlement Payout',
    riderSettlement: 'Rider Incentive Settlement',
    amount: 'Amount (INR)',
    remarks: 'Remarks / Transaction Notes',
    recentTransactions: 'Recent Financial Logs',
    recentTransactionsDesc: 'Audit trail of the most recent manual system cash adjustments',

    customerRegistry: 'Customer Accounts Registry',
    customerRegistryDesc: 'Onboard new clients, update personal wallets, toggle user access rules, and block violators',
    addNewCustomer: 'Add New Customer',
    vendorRegistry: 'Onboarded Vendor Partners',
    vendorRegistryDesc: 'Configure merchant parameters, operational hours, commission schedules, and service toggles',
    addNewVendor: 'Add New Vendor Partner',
    riderRegistry: 'Delivery Rider Fleet',
    riderRegistryDesc: 'Manage logistics operators, document validation, dynamic live presence, and cash holdings',
    addNewRider: 'Onboard New Rider',

    liveOrdersBoard: 'Live Order Control Center',
    liveOrdersBoardDesc: 'Manage and dispatch orders, assign riders, update fulfillment steps, and view transaction values',
    orderId: 'Order ID',
    customer: 'Customer',
    vendor: 'Vendor',
    rider: 'Rider',
    items: 'Ordered Items',
    totalPrice: 'Total Price',
    orderStatus: 'Fulfillment Status',
    updateStatus: 'Update Status',

    paymentGateways: 'Payment Gateways & API Switches',
    paymentGatewaysDesc: 'Toggle live payment integrations, API credentials, checkout channels, and platform sandboxes',
    commissionRates: 'Global Commission & Share Matrix',
    commissionRatesDesc: 'Adjust vendor fee percentages, fixed platform cuts, and tax structures across logistics operations',
    deliveryCharges: 'Dynamic Delivery Fee Formulas',
    deliveryChargesDesc: 'Configure base delivery rates, peak hours multipliers, rain surges, and distance weight pricing',

    geographicalZones: 'Geographical Service Areas',
    geographicalZonesDesc: 'Define active delivery radiuses, local municipal zones, geofenced zones, and dispatch nodes',
    zoneName: 'Zone Area Name',
    baseCharge: 'Base Delivery Surcharge',
    coverageRadius: 'Coverage Radius (km)',

    bannerCampaigns: 'Active Promotion Banner Campaigns',
    bannerCampaignsDesc: 'Manage hero sliders, marketing campaigns, and seasonal graphic announcements',
    couponsOffers: 'Discount Coupons & Promotional Offers',
    couponsOffersDesc: 'Create active coupon codes, minimum order requirements, fixed discounts, and user caps',

    supportTickets: 'Help & Customer Care Tickets',
    supportTicketsDesc: 'Review user complaints, live rider reports, merchant queries, and resolve pending disputes',

    companySettings: 'Company Registry & Identity',
    companySettingsDesc: 'Manage administrative roles, visual logo assets, change root locks, and configure corporate contact registries',
    securityControls: 'Security & Root Access',
    securityControlsDesc: 'Modify root administrator credentials and update access logs policy',
    auditTrail: 'Administrative Action Audit Trail',
    auditTrailDesc: 'Verifiable trace logs of active toggles, commission rate adjustments, status flags, and security controls',
    languageAndLocalization: 'Language & Localization Options',
    languageAndLocalizationDesc: 'Choose your preferred language for the Bhopal Express Logistics and Admin portal.'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    customers: 'ग्राहक प्रबंधन',
    vendors: 'विक्रेता प्रबंधन',
    riders: 'राइडर प्रबंधन',
    orders: 'ऑर्डर प्रबंधन',
    tracking: 'लाइव ट्रैकिंग',
    payment: 'भुगतान प्रबंधन',
    commission: 'कमीशन प्रबंधन',
    delivery: 'वितरण शुल्क प्रबंधन',
    areas: 'क्षेत्र प्रबंधन',
    marketing: 'विपणन हब',
    support: 'सहायता केंद्र',
    settings: 'सिस्टम सेटिंग्स',
    
    hubLabel: 'भोपाल हब केंद्र',
    roleLabel: 'भूमिका:',
    signalLabel: 'नेटवर्क सिग्नल:',
    broadcasterBtn: 'प्रसारक 🔥',
    broadcasterTooltip: 'कभी भी लाइव पुश अलर्ट प्रसारित करें',
    logoutLabel: 'निकास',
    
    saveChanges: 'परिवर्तनों को सहेजें',
    cancel: 'रद्द करें',
    add: 'नया जोड़ें',
    edit: 'विवरण संपादित करें',
    delete: 'हटाएं',
    statusActive: 'सक्रिय',
    statusBlocked: 'अवरुद्ध',
    statusPending: 'मंजूरी लंबित',
    statusApproved: 'स्वीकृत',
    all: 'सभी पूल',
    searchPlaceholder: 'यहाँ खोजें...',
    actions: 'कार्रवाई',
    name: 'नाम',
    phone: 'फ़ोन नंबर',
    email: 'ईमेल पता',
    status: 'स्थिति',
    submit: 'जमा करें',
    back: 'पीछे जाएँ',
    walletBalance: 'वॉलेट बैलेंस',
    
    totalRevenue: 'कुल प्लेटफ़ॉर्म राजस्व',
    activeCustomers: 'कुल सक्रिय ग्राहक',
    activeVendors: 'ऑनबोर्डेड मर्चेंट',
    activeRiders: 'ड्यूटी पर राइडर्स',
    liveOrders: 'सक्रिय लाइव ऑर्डर',
    operationalSuccess: 'वितरण सफलता दर',
    financialHub: 'प्लेटफॉर्म वित्तीय हब',
    financialHubDesc: 'प्रत्यक्ष बहीखाता समायोजन, मर्चेंट भुगतान, और राइडर प्रोत्साहन प्रेषण पैनल',
    operationalPulse: 'ऑपरेशनल पल्स और लाइव आंकड़े',
    operationalPulseDesc: 'वास्तविक समय रसद विश्लेषण और सफलता दर',
    walletDeposit: 'वॉलेट जमा / कटौती',
    vendorSettlement: 'विक्रेता निपटान भुगतान',
    riderSettlement: 'राइडर प्रोत्साहन निपटान',
    amount: 'राशि (INR)',
    remarks: 'टिप्पणी / लेनदेन विवरण',
    recentTransactions: 'हाल के वित्तीय लॉग',
    recentTransactionsDesc: 'सबसे हाल के मैन्युअल सिस्टम नकद समायोजन का ऑडिट ट्रेल',

    customerRegistry: 'ग्राहक खाता रजिस्ट्री',
    customerRegistryDesc: 'नए ग्राहकों को जोड़ें, व्यक्तिगत वॉलेट अपडेट करें, उपयोगकर्ता पहुंच नियमों को टॉगल करें, और उल्लंघनकर्ताओं को ब्लॉक करें',
    addNewCustomer: 'नया ग्राहक जोड़ें',
    vendorRegistry: 'पंजीकृत विक्रेता भागीदार',
    vendorRegistryDesc: 'मर्चेंट पैरामीटर, परिचालन घंटे, कमीशन कार्यक्रम, और सेवा टॉगल कॉन्फ़िगर करें',
    addNewVendor: 'नया विक्रेता भागीदार जोड़ें',
    riderRegistry: 'वितरण राइडर बेड़ा',
    riderRegistryDesc: 'लॉजिस्टिक्स ऑपरेटरों, दस्तावेज़ सत्यापन, गतिशील लाइव उपस्थिति, और नकद होल्डिंग्स का प्रबंधन करें',
    addNewRider: 'नया राइडर ऑनबोर्ड करें',

    liveOrdersBoard: 'लाइव ऑर्डर नियंत्रण केंद्र',
    liveOrdersBoardDesc: 'ऑर्डर प्रबंधित और प्रेषित करें, राइडर्स असाइन करें, पूर्ति चरणों को अपडेट करें, और लेनदेन मूल्यों को देखें',
    orderId: 'ऑर्डर आईडी',
    customer: 'ग्राहक',
    vendor: 'विक्रेता',
    rider: 'राइडर',
    items: 'ऑर्डर की गई वस्तुएं',
    totalPrice: 'कुल कीमत',
    orderStatus: 'पूर्ति की स्थिति',
    updateStatus: 'स्थिति अपडेट करें',

    paymentGateways: 'भुगतान गेटवे और एपीआई स्विच',
    paymentGatewaysDesc: 'लाइव भुगतान एकीकरण, एपीआई क्रेडेंशियल, चेकआउट चैनल और प्लेटफॉर्म सैंडबॉक्स टॉगल करें',
    commissionRates: 'वैश्विक कमीशन और साझा मैट्रिक्स',
    commissionRatesDesc: 'रसद संचालन में विक्रेता शुल्क प्रतिशत, निश्चित मंच कटौती, और कर संरचनाओं को समायोजित करें',
    deliveryCharges: 'गतिशील वितरण शुल्क सूत्र',
    deliveryChargesDesc: 'आधार वितरण दरें, पीक आवर्स मल्टीप्लायर, बारिश अधिभार, और दूरी आधारित मूल्य निर्धारण कॉन्फ़िगर करें',

    geographicalZones: 'भौगोलिक सेवा क्षेत्र',
    geographicalZonesDesc: 'सक्रिय वितरण त्रिज्या, स्थानीय नगरपालिका क्षेत्र, जियोफेंस वाले क्षेत्र और प्रेषण नोड्स को परिभाषित करें',
    zoneName: 'जोन क्षेत्र का नाम',
    baseCharge: 'आधार वितरण अधिभार',
    coverageRadius: 'कवरेज त्रिज्या (किमी)',

    bannerCampaigns: 'सक्रिय प्रचार बैनर अभियान',
    bannerCampaignsDesc: 'हीरो स्लाइडर्स, मार्केटिंग अभियान, और मौसमी ग्राफिक घोषणाओं का प्रबंधन करें',
    couponsOffers: 'डिस्कौंट कूपन और प्रचार प्रस्ताव',
    couponsOffersDesc: 'सक्रिय कूपन कोड, न्यूनतम आदेश आवश्यकताएं, निश्चित छूट और उपयोगकर्ता सीमाएं बनाएं',

    supportTickets: 'सहायता और ग्राहक सेवा टिकट',
    supportTicketsDesc: 'उपयोगकर्ता की शिकायतों, लाइव राइडर रिपोर्ट, मर्चेंट प्रश्नों की समीक्षा करें और लंबित विवादों को हल करें',

    companySettings: 'कंपनी रजिस्ट्री और पहचान',
    companySettingsDesc: 'प्रशासनिक भूमिकाओं, विज़ुअल लोगो परिसंपत्तियों का प्रबंधन करें, रूट सुरक्षा लॉक बदलें, और कॉर्पोरेट संपर्क रजिस्ट्रियों को कॉन्फ़िगर करें',
    securityControls: 'सुरक्षा और रूट एक्सेस',
    securityControlsDesc: 'रूट एडमिनिस्ट्रेटर क्रेडेंशियल बदलें और एक्सेस लॉग पॉलिसी को अपडेट करें',
    auditTrail: 'प्रशासनिक कार्रवाई ऑडिट ट्रेल',
    auditTrailDesc: 'सक्रिय टॉगल, कमीशन दर समायोजन, स्थिति झंडे, और सुरक्षा नियंत्रणों के सत्यापन योग्य ट्रेस लॉग',
    languageAndLocalization: 'भाषा और स्थानीयकरण विकल्प',
    languageAndLocalizationDesc: 'भोपाल एक्सप्रेस लॉजिस्टिक्स और एडमिन पोर्टल के लिए अपनी पसंदीदा भाषा चुनें। पूरा सिस्टम तुरंत अपडेट हो जाएगा।'
  }
};

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' }
] as const;
