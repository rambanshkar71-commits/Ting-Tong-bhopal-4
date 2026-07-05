import React, { useState, useEffect } from 'react';
import { Customer, Vendor, Rider } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Store, 
  Bike, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  LifeBuoy, 
  BookOpen, 
  Trash2, 
  CornerDownRight, 
  Zap, 
  RefreshCw 
} from 'lucide-react';

interface SupportCenterTabProps {
  activeLanguage?: Language;
  customers: Customer[];
  vendors: Vendor[];
  riders: Rider[];
}

// Support ticket interface
interface SupportTicket {
  id: string;
  senderName: string;
  senderRole: 'Customer' | 'Vendor' | 'Rider';
  senderAvatar?: string;
  senderId: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  resolutionNotes?: string;
}

// Live Chat Session interface
interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  name: string;
  role: 'Customer' | 'Vendor' | 'Rider';
  avatar?: string;
  senderId: string;
  lastMessage: string;
  status: 'active' | 'closed';
  messages: ChatMessage[];
  lastActive: string;
}

// FAQ / Help Articles interface
interface FAQArticle {
  id: string;
  question: string;
  answer: string;
  category: 'Customer' | 'Restaurant' | 'Rider';
  likes: number;
}

export default function SupportCenterTab(props: SupportCenterTabProps) {
  const { activeLanguage = 'en', customers, vendors, riders } = props;
  const t = TRANSLATIONS[activeLanguage];

  // Active view within Support Center
  const [activeSubTab, setActiveSubTab] = useState<'live-chats' | 'tickets' | 'faqs'>('live-chats');

  // Filter states
  const [roleFilter, setRoleFilter] = useState<'All' | 'Customer' | 'Vendor' | 'Rider'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Live Chat simulator state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'CHAT-101',
      name: 'Amit Sharma',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderId: 'CUST-001',
      lastMessage: 'The paneer tikka is completely cold and the gravy spilled in the bag. Can I get a refund?',
      status: 'active',
      lastActive: '2 mins ago',
      messages: [
        { id: 'm1', sender: 'user', text: 'Hello support, I just received my order from Manohar Dairy.', timestamp: '12:30 PM' },
        { id: 'm2', sender: 'admin', text: 'Hi Amit! Extremely sorry for any trouble. Is there an issue with the delivered package?', timestamp: '12:31 PM' },
        { id: 'm3', sender: 'user', text: 'The paneer tikka is completely cold and the gravy spilled in the bag. Can I get a refund?', timestamp: '12:32 PM' }
      ]
    },
    {
      id: 'CHAT-102',
      name: 'Tandoor Palace (Manish)',
      role: 'Vendor',
      avatar: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&auto=format&fit=crop&q=80',
      senderId: 'VEN-001',
      lastMessage: 'The tablet is not ringing for incoming orders. We missed 2 orders.',
      status: 'active',
      lastActive: '5 mins ago',
      messages: [
        { id: 'm4', sender: 'user', text: 'Our terminal is not showing the incoming orders. We can see them on mobile but the tablet does not chime.', timestamp: '12:20 PM' },
        { id: 'm5', sender: 'admin', text: 'Hello Manish, please make sure the Bhopal Express merchant application has notification volume enabled at 100%.', timestamp: '12:22 PM' },
        { id: 'm6', sender: 'user', text: 'The tablet is not ringing for incoming orders. We missed 2 orders. Please check if our sound API is updated.', timestamp: '12:25 PM' }
      ]
    },
    {
      id: 'CHAT-103',
      name: 'Rahul Verma',
      role: 'Rider',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      senderId: 'RIDE-001',
      lastMessage: 'I have arrived at Arera Colony home but customer is not answering the doorbell.',
      status: 'active',
      lastActive: '10 mins ago',
      messages: [
        { id: 'm7', sender: 'user', text: 'Hey dispatch admin, I have order #8291.', timestamp: '12:10 PM' },
        { id: 'm8', sender: 'admin', text: 'Yes Rahul. Please go ahead and deliver. Any problem?', timestamp: '12:11 PM' },
        { id: 'm9', sender: 'user', text: 'I have arrived at Arera Colony home but customer is not answering the doorbell or phone calls.', timestamp: '12:15 PM' }
      ]
    },
    {
      id: 'CHAT-104',
      name: 'Priya Patel',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      senderId: 'CUST-002',
      lastMessage: 'Wallet amount ₹300 was deducted but order was cancelled. Please check.',
      status: 'closed',
      lastActive: '2 hours ago',
      messages: [
        { id: 'm10', sender: 'user', text: 'Wallet amount ₹300 was deducted but order was cancelled. Please check.', timestamp: '10:05 AM' },
        { id: 'm11', sender: 'admin', text: 'Refund of ₹300 has been credited back to your Bhopal Express Wallet. You can check your wallet tab now.', timestamp: '10:10 AM' },
        { id: 'm12', sender: 'user', text: 'Thank you for the quick help, it is credited now!', timestamp: '10:12 AM' }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<string>('CHAT-101');
  const [typedMessage, setTypedMessage] = useState('');

  // 2. Tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-7031',
      senderName: 'Sagar Gome',
      senderRole: 'Customer',
      senderId: 'CUST-003',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      subject: 'Double Payment Charged',
      description: 'Paid via Paytm UPI but the app said payment failed, so I paid with COD cash again. Check my payment receipt.',
      priority: 'High',
      status: 'Open',
      createdAt: 'Today, 06:12 AM'
    },
    {
      id: 'TKT-7029',
      senderName: 'Sharma Biryani (Rohit)',
      senderRole: 'Vendor',
      senderId: 'VEN-002',
      senderAvatar: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=100&auto=format&fit=crop&q=80',
      subject: 'Requesting lower commission tier',
      description: 'We are receiving more than 100 orders daily. Can you reduce our standard commission from 15% to 10%?',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: 'Yesterday, 04:30 PM'
    },
    {
      id: 'TKT-7022',
      senderName: 'Sandeep Yadav',
      senderRole: 'Rider',
      senderId: 'RIDE-002',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      subject: 'Weekly Incentive missing',
      description: 'I finished 45 orders this week and should get ₹500 extra bonus. The wallet earnings tab is showing ₹0 bonus.',
      priority: 'High',
      status: 'Resolved',
      createdAt: 'June 30, 2026',
      resolutionNotes: 'Verified rider logs. Payout adjusted and ₹500 bonus transferred manually via wallet controls.'
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');

  // 3. FAQ system state
  const [faqs, setFaqs] = useState<FAQArticle[]>([
    {
      id: 'faq-reg-vendor',
      question: 'What is the official procedure for Vendor registration and activation?',
      answer: 'Vendors must register themselves online via the official Vendor Panel. Required: Bank Account details and Store Location. Optional: Store Photo. Activation: Can start taking orders ONLY after Admin approval is granted.',
      category: 'Restaurant',
      likes: 120
    },
    {
      id: 'faq-reg-rider',
      question: 'What are the strict requirements for Rider registration?',
      answer: 'Required: Bank Account details, Gender (Male/Female), and Date of Birth (DOB). Optional: Driving License (DL). Once submitted, the profile is queued for rapid verification.',
      category: 'Rider',
      likes: 85
    },
    {
      id: 'faq-rider-work-rule',
      question: 'What is the mandatory Rider Work Rule regarding shifts?',
      answer: 'Shift 1 is strictly mandatory for exactly 1 hour of duty. Beyond this single hour, riders have full flexibility and autonomy to extend their working hours further or work on additional slots as per their choice.',
      category: 'Rider',
      likes: 92
    },
    {
      id: 'faq-support-res',
      question: 'How do customers, vendors, and riders resolve transaction or payment issues?',
      answer: 'Customers, Vendors, and Riders can instantly resolve ANY issue (including transaction/payment failures) by directly calling or chatting with the Admin via the support live chat or direct hotline.',
      category: 'Customer',
      likes: 145
    },
    {
      id: 'faq-1',
      question: 'How do I add money to my Bhopal Express customer wallet?',
      answer: 'Go to your account menu, click "Wallet", select "Add Money", enter the amount, and pay using any UPI app, NetBanking, or Credit/Debit card. Credits are loaded instantly.',
      category: 'Customer',
      likes: 42
    },
    {
      id: 'faq-2',
      question: 'My order is late. How can I track the live rider location?',
      answer: 'Once a rider is assigned, click "Track Order" on your screen. You will see a real-time GPS map with the rider\'s location, delivery ETA, and direct mobile call button.',
      category: 'Customer',
      likes: 58
    },
    {
      id: 'faq-3',
      question: 'How is the restaurant commission calculated on orders?',
      answer: 'Our base system deducts commission based on the food subtotal item value. Delivery charge, GST, and platform fees are separate and collected directly by the platform.',
      category: 'Restaurant',
      likes: 24
    },
    {
      id: 'faq-4',
      question: 'What are the criteria for a rider to earn the Weekend Incentive?',
      answer: 'Riders must log a minimum of 8 active hours on Saturday & Sunday, accept 90%+ of orders dispatched, and complete at least 25 orders without any custom refunds or cancellations.',
      category: 'Rider',
      likes: 31
    }
  ]);

  // Form states for creating custom FAQs
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<'Customer' | 'Restaurant' | 'Rider'>('Customer');
  const [showFaqForm, setShowFaqForm] = useState(false);

  // Auto scroll chat list or update responses
  const activeChat = chatSessions.find(c => c.id === activeChatId);

  // Send message in simulator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSessions = chatSessions.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          lastMessage: typedMessage,
          lastActive: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setChatSessions(updatedSessions);
    setTypedMessage('');

    // Trigger dummy helpful reply after 1.5 seconds to simulate real-time feel
    setTimeout(() => {
      triggerUserReply(activeChat.id);
    }, 1500);
  };

  // Simulate a customer/vendor/rider reply to make the "live helps realtime" feel super active
  const triggerUserReply = (chatId: string) => {
    setChatSessions(prevSessions => {
      return prevSessions.map(c => {
        if (c.id === chatId) {
          const responses: Record<'Customer' | 'Vendor' | 'Rider', string[]> = {
            Customer: [
              'Perfect, thank you! I will wait for the delivery agent.',
              'Can you also credit the balance to my Bhopal wallet instead of credit card?',
              'Great. The app is working perfectly now, thanks for fixing it!',
              'Please hurry up, we are very hungry.'
            ],
            Vendor: [
              'Acknowledge. We will restart our merchant app tablet and check the volume again.',
              'Understood. Thanks for updating the payout configuration ledger.',
              'Excellent, please process our pending Sunday payout.'
            ],
            Rider: [
              'Okay sir, the customer answered now! Delivering food.',
              'Thanks admin. Moving to the next destination point.',
              'There was traffic near Board Office square, but I will reach Manohar Dairy in 2 mins.'
            ]
          };

          const possibleReplies = responses[c.role];
          const randomReply = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

          const newReply: ChatMessage = {
            id: `reply-${Date.now()}`,
            sender: 'user',
            text: randomReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          return {
            ...c,
            lastMessage: randomReply,
            lastActive: 'Just now',
            messages: [...c.messages, newReply]
          };
        }
        return c;
      });
    });
  };

  // Preset quick solutions to answer instantly
  const handleQuickSolution = (solutionText: string) => {
    if (!activeChat) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text: solutionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatSessions(chatSessions.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          lastMessage: solutionText,
          lastActive: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setTimeout(() => {
      triggerUserReply(activeChat.id);
    }, 1200);
  };

  // Handle ticket resolution update
  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'Resolved' as const,
          resolutionNotes: resolutionInput || 'Resolved by super-administrator via Help portal.'
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket(null);
    setResolutionInput('');
    alert(`Ticket ${selectedTicket.id} has been solved and closed.`);
  };

  // Handle Ticket status transition
  const updateTicketStatus = (tktId: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setTickets(tickets.map(t => t.id === tktId ? { ...t, status: newStatus } : t));
  };

  // Add FAQ
  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const newFaq: FAQArticle = {
      id: `faq-${Date.now()}`,
      question: faqQuestion,
      answer: faqAnswer,
      category: faqCategory,
      likes: 0
    };

    setFaqs([newFaq, ...faqs]);
    setFaqQuestion('');
    setFaqAnswer('');
    setShowFaqForm(false);
  };

  // Delete FAQ
  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  // Chat filter logic
  const filteredChats = chatSessions.filter(c => {
    const matchesRole = roleFilter === 'All' || c.role === roleFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Ticket filter logic
  const filteredTickets = tickets.filter(t => {
    const matchesRole = roleFilter === 'All' || t.senderRole === roleFilter;
    const matchesSearch = t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // FAQs categorized or searched
  const filteredFaqs = faqs.filter(f => {
    const matchesRole = roleFilter === 'All' || f.category === roleFilter;
    const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6" id="support-center-tab-wrapper">
      
      {/* Dynamic Interactive Stats Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Support Dispatch Terminal
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                Live Support Agent Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Bhopal Logistics Help & Solution Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Simulate and solve live questions, resolve active merchant disputes, help customer refund queries, and coordinate real-time rider dispatch solutions.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveSubTab('live-chats'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                activeSubTab === 'live-chats' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare size={14} /> Live Helps
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {chatSessions.filter(c => c.status === 'active').length}
              </span>
            </button>
            <button
              onClick={() => { setActiveSubTab('tickets'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                activeSubTab === 'tickets' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LifeBuoy size={14} /> Support Tickets
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {tickets.filter(t => t.status !== 'Resolved').length}
              </span>
            </button>
            <button
              onClick={() => { setActiveSubTab('faqs'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                activeSubTab === 'faqs' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle size={14} /> FAQ & Questions
            </button>
          </div>
        </div>
      </div>

      {/* Global Filter and Search Utility Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={`Search ${activeSubTab === 'live-chats' ? 'chats...' : activeSubTab === 'tickets' ? 'tickets...' : 'FAQs...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          />
        </div>

        {/* Categories / Roles Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter size={11} /> Filter By Target:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] shrink-0">
            {(['All', 'Customer', 'Vendor', 'Rider'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  roleFilter === role 
                    ? 'bg-white text-slate-800 shadow-3xs border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role === 'All' ? 'All Roles' : role === 'Vendor' ? 'Restaurants' : `${role}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* WORKSPACE VIEW 1: LIVE HELPS CHAT SIMULATOR */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'live-chats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="live-chats-workspace">
          
          {/* Chat Sessions List (cols 4) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden flex flex-col h-[520px]">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={15} className="text-indigo-600" />
                Active Conversations
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                {filteredChats.filter(c => c.status === 'active').length} Live
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredChats.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full">
                  <MessageSquare size={28} className="text-slate-300 mb-2" />
                  No chat sessions found.
                </div>
              ) : (
                filteredChats.map(session => {
                  const isActive = session.id === activeChatId;
                  const isClosed = session.status === 'closed';
                  return (
                    <button
                      key={session.id}
                      onClick={() => setActiveChatId(session.id)}
                      className={`w-full text-left p-4 hover:bg-slate-50/80 transition-all flex items-start gap-3 relative ${
                        isActive ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : ''
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={session.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          isClosed ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'
                        }`}></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800 truncate">{session.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0">{session.lastActive}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 my-1">
                          <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            session.role === 'Customer' 
                              ? 'bg-purple-50 text-purple-700 border border-purple-150' 
                              : session.role === 'Vendor' 
                              ? 'bg-orange-50 text-orange-700 border border-orange-150' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                          }`}>
                            {session.role === 'Customer' && <User size={9} />}
                            {session.role === 'Vendor' && <Store size={9} />}
                            {session.role === 'Rider' && <Bike size={9} />}
                            {session.role === 'Vendor' ? 'Restaurant' : session.role}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">ID: {session.senderId}</span>
                        </div>

                        <p className="text-[11px] text-slate-500 truncate font-medium mt-1">
                          {session.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window Simulator Panel (cols 8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-150 shadow-xs flex flex-col h-[520px]">
            
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-150 bg-slate-50 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{activeChat.name}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                          activeChat.role === 'Customer' 
                            ? 'bg-purple-100 text-purple-800' 
                            : activeChat.role === 'Vendor' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {activeChat.role === 'Vendor' ? 'Restaurant Partner' : activeChat.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">Active Channel: Bhopal-Logistics-IM-{activeChat.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      Direct Live Socket Connected
                    </span>
                  </div>
                </div>

                {/* Messages Body Scroll */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/50">
                  <div className="text-center py-2 shrink-0">
                    <span className="text-[9px] text-slate-400 font-bold bg-white border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                      Secure encrypted support session started
                    </span>
                  </div>

                  {activeChat.messages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl p-3 shadow-3xs ${
                          isAdmin 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}>
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="text-[9px] font-bold text-indigo-400">
                              {isAdmin ? 'System Dispatcher' : activeChat.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                          </div>
                          <p className="text-xs font-semibold leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Solution Templates Utility Bar */}
                <div className="bg-slate-50 border-t border-slate-150 px-4 py-2 flex items-center gap-2 shrink-0 overflow-x-auto">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                    <Zap size={11} className="text-amber-500" /> Quick replies:
                  </span>
                  
                  {activeChat.role === 'Customer' && (
                    <>
                      <button 
                        onClick={() => handleQuickSolution("I have initiated a full refund of ₹250 to your Bhopal wallet. Please refresh to check.")}
                        className="bg-white border hover:border-indigo-400 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors"
                      >
                        Refund to Wallet
                      </button>
                      <button 
                        onClick={() => handleQuickSolution("Apologies! I have dispatched a new delivery agent to Manohar Dairy to pick up your fresh order.")}
                        className="bg-white border hover:border-indigo-400 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors"
                      >
                        Remake & Dispatch Order
                      </button>
                    </>
                  )}

                  {activeChat.role === 'Vendor' && (
                    <>
                      <button 
                        onClick={() => handleQuickSolution("Please try logging out and logging back into your Bhopal Logistics vendor app. We cleared the cache.")}
                        className="bg-white border hover:border-indigo-400 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors"
                      >
                        Clear App Cache
                      </button>
                      <button 
                        onClick={() => handleQuickSolution("We verified the order delay. Commission waived off entirely for this specific order as a gesture of goodwill.")}
                        className="bg-white border hover:border-indigo-400 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors"
                      >
                        Waive Commission Charge
                      </button>
                    </>
                  )}

                  {activeChat.role === 'Rider' && (
                    <>
                      <button 
                        onClick={() => handleQuickSolution("Rahul, please wait for 3 minutes more. If they do not answer, please return the parcel to Manohar Dairy.")}
                        className="bg-white border hover:border-indigo-400 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors"
                      >
                        Order Return to Store
                      </button>
                      <button 
                        onClick={() => handleQuickSolution("I have manually marked this order as 'Delivered' on our central database. You can proceed.")}
                        className="bg-white border hover:border-indigo-400 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors"
                      >
                        Mark Manual Delivery
                      </button>
                    </>
                  )}
                </div>

                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-150 flex gap-2 shrink-0">
                  <input
                    type="text"
                    required
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={`Type response to help ${activeChat.name}...`}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-1 text-xs font-bold shadow-xs transition-colors"
                  >
                    Send <Send size={13} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <MessageSquare size={42} className="text-slate-300 mb-2" />
                Select an active conversation to begin helping in real-time.
              </div>
            )}

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* WORKSPACE VIEW 2: SUPPORT TICKETS LIST */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tickets-workspace">
          
          {/* Ticket Listing Column (cols 7) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <LifeBuoy size={15} className="text-indigo-600" />
                  Support Tickets Log
                </span>
                <span className="text-[10px] uppercase font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                  {filteredTickets.length} database receipts
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No tickets match current filters.
                  </div>
                ) : (
                  filteredTickets.map(ticket => {
                    const isOpen = ticket.status === 'Open';
                    const isInProgress = ticket.status === 'In Progress';
                    const isResolved = ticket.status === 'Resolved';
                    return (
                      <div 
                        key={ticket.id} 
                        className={`p-5 transition-all hover:bg-slate-50/50 ${
                          selectedTicket?.id === ticket.id ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={ticket.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                              alt={ticket.senderName}
                              className="h-10 w-10 rounded-full object-cover border border-slate-200 mt-0.5 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-slate-800">{ticket.senderName}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                                  ticket.senderRole === 'Customer' 
                                    ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                    : ticket.senderRole === 'Vendor' 
                                    ? 'bg-orange-50 text-orange-700 border border-orange-100' 
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                }`}>
                                  {ticket.senderRole === 'Vendor' ? 'Restaurant' : ticket.senderRole}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold mt-0.5">ID: {ticket.id} • Created {ticket.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Priority */}
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              ticket.priority === 'Critical' 
                                ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-300' 
                                : ticket.priority === 'High' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {ticket.priority} Priority
                            </span>

                            {/* Status */}
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isResolved 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : isInProgress 
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>

                        {/* Subject & Description */}
                        <div className="mt-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                          <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                            <CornerDownRight size={13} className="text-slate-400 shrink-0" />
                            {ticket.subject}
                          </h4>
                          <p className="text-slate-600 leading-relaxed font-semibold">{ticket.description}</p>
                          
                          {ticket.resolutionNotes && (
                            <div className="mt-3 pt-2.5 border-t border-slate-200 text-slate-500">
                              <span className="font-bold text-emerald-600 block mb-0.5">Admin Solution Update:</span>
                              <p className="italic font-medium">{ticket.resolutionNotes}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions footer */}
                        <div className="flex items-center justify-end gap-2 mt-3">
                          {!isResolved && (
                            <>
                              <button
                                onClick={() => updateTicketStatus(ticket.id, 'In Progress')}
                                className="px-2.5 py-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                              >
                                Mark "In Progress"
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setResolutionInput(ticket.resolutionNotes || '');
                                }}
                                className="px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                              >
                                Solve & Close Ticket
                              </button>
                            </>
                          )}
                          
                          {isResolved && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                              <CheckCircle size={12} /> Solved & Completed
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Ticket Response Resolution Form (cols 5) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs sticky top-4">
              {selectedTicket ? (
                <form onSubmit={handleResolveTicket} className="space-y-4">
                  <div className="border-b pb-3 border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider block">
                      Active Ticket Workspace
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-sm mt-1">
                      Resolving: {selectedTicket.subject}
                    </h3>
                    <p className="text-[11px] text-slate-400">Sender: {selectedTicket.senderName} ({selectedTicket.senderRole})</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Issue Description
                    </label>
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
                      "{selectedTicket.description}"
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Enter Resolution Solution Note
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={resolutionInput}
                      onChange={(e) => setResolutionInput(e.target.value)}
                      placeholder="e.g. Discussed with Manohar Dairy. Issue verified. Refund initiated to wallet balance, and delivery SLA commission penalized."
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                    >
                      Cancel Workspace
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> Commit Solution Update
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <LifeBuoy size={36} className="text-slate-300 mx-auto mb-2" />
                  <span className="text-xs font-bold block mb-1">No ticket selected for resolution.</span>
                  <p className="text-[11px] text-slate-400">Click "Solve & Close Ticket" on any ticket from the logs to load response controls.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* WORKSPACE VIEW 3: CORPORATE FAQ / QUESTIONS HUB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-6" id="faq-workspace">
          
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <BookOpen size={16} className="text-indigo-600" />
                Live FAQ Knowledge Base
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage help answers shown to users, restaurants, and riders on their mobile apps.
              </p>
            </div>

            <button
              onClick={() => setShowFaqForm(!showFaqForm)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
            >
              <Plus size={14} /> {showFaqForm ? 'Hide Creator' : 'Create New FAQ'}
            </button>
          </div>

          {/* New FAQ Article Form */}
          {showFaqForm && (
            <form onSubmit={handleAddFAQ} className="bg-white p-5 rounded-2xl border border-indigo-150 shadow-md space-y-4 animate-slide-in">
              <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest border-b pb-2 border-slate-100 flex items-center gap-1">
                <Plus size={13} /> Add New Customer, Restaurant or Rider Question & Answer
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Enter Question</label>
                  <input
                    type="text"
                    required
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="e.g. My coupon code is not working. How can I fix it?"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Audience</label>
                  <select
                    value={faqCategory}
                    onChange={(e) => setFaqCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold"
                  >
                    <option value="Customer">Customer Help</option>
                    <option value="Restaurant">Restaurant Partner</option>
                    <option value="Rider">Rider Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Detailed Answer Solution</label>
                <textarea
                  required
                  rows={3}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Provide step-by-step resolution details clearly..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowFaqForm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Publish Help Article
                </button>
              </div>
            </form>
          )}

          {/* Grid of FAQ cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFaqs.length === 0 ? (
              <div className="col-span-full bg-white p-10 text-center text-slate-400 text-xs">
                No Help questions found matching criteria.
              </div>
            ) : (
              filteredFaqs.map(faq => {
                return (
                  <div key={faq.id} className="bg-white p-5 rounded-2xl border border-slate-150 shadow-3xs hover:shadow-xs transition-all relative group">
                    <div className="flex justify-between items-start gap-3">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        faq.category === 'Customer'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : faq.category === 'Restaurant'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {faq.category === 'Restaurant' ? 'Restaurant Partner' : faq.category}
                      </span>

                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        title="Delete FAQ Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-xs mt-2.5 mb-1.5 flex items-start gap-1.5 leading-snug">
                      <HelpCircle size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      {faq.question}
                    </h4>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold pl-5">
                      {faq.answer}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Verified Solution Protocol</span>
                      <span className="font-medium text-slate-500 font-mono">ID: {faq.id}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
}
