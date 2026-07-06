import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, KeyRound, UserPlus, Lock, CheckCircle2, User, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess: (profileName: 'Super Admin' | 'Support' | 'Operations') => void;
  addAuditLog: (action: string, category: any, details: string) => void;
}

interface AdminAccount {
  username: string;
  passwordHash: string;
  pin: string;
  fullName: string;
  role: 'Super Admin' | 'Support' | 'Operations';
}

export default function AuthPortal({ onLoginSuccess, addAuditLog }: AuthPortalProps) {
  // Store admin credentials locally in state (initially loaded from localStorage or default credentials)
  const [admins, setAdmins] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('bhopal_admin_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    const defaultAccount: AdminAccount = {
      username: 'admin@8827',
      passwordHash: 'India#8827',
      pin: '8827',
      fullName: 'Chief Logistics Administrator',
      role: 'Super Admin'
    };
    return [defaultAccount];
  });

  const saveAdmins = (updatedList: AdminAccount[]) => {
    setAdmins(updatedList);
    localStorage.setItem('bhopal_admin_accounts', JSON.stringify(updatedList));
  };

  // UI States
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'pin'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Input States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Signup Input States
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupRole, setSignupRole] = useState<'Super Admin' | 'Support' | 'Operations'>('Super Admin');

  // Handle Login Authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (loginMethod === 'password') {
        const found = admins.find(
          (a) => a.username.toLowerCase() === loginUsername.trim().toLowerCase() && a.passwordHash === loginPassword
        );
        if (found) {
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('current_admin_profile', found.role);
          localStorage.setItem('current_admin_name', found.fullName);
          addAuditLog('Admin Logged In', 'Security', `Administrator ${found.fullName} (${found.role}) logged in successfully using credentials.`);
          onLoginSuccess(found.role);
        } else {
          setErrorMsg('Invalid username or password. Please verify your credentials.');
          addAuditLog('Failed Login Attempt', 'Security', `Failed login attempt for username: ${loginUsername}`);
          setIsLoading(false);
        }
      } else {
        // PIN login
        const found = admins.find((a) => a.pin === loginPin.trim());
        if (found) {
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('current_admin_profile', found.role);
          localStorage.setItem('current_admin_name', found.fullName);
          addAuditLog('Admin Logged In (PIN)', 'Security', `Administrator ${found.fullName} (${found.role}) logged in successfully using PIN.`);
          onLoginSuccess(found.role);
        } else {
          setErrorMsg('Invalid Quick Access PIN. Please try again.');
          addAuditLog('Failed PIN Attempt', 'Security', `Failed login attempt using security PIN.`);
          setIsLoading(false);
        }
      }
    }, 900); // realistic spinner feeling
  };

  // Handle Signup / Registration
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signupName.trim() || !signupUsername.trim() || !signupPassword.trim() || !signupPin.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (signupPin.trim().length < 4) {
      setErrorMsg('Quick Access PIN must be at least 4 digits.');
      return;
    }

    const exists = admins.some((a) => a.username.toLowerCase() === signupUsername.trim().toLowerCase());
    if (exists) {
      setErrorMsg('An administrator with this username already exists.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newAdmin: AdminAccount = {
        fullName: signupName.trim(),
        username: signupUsername.trim(),
        passwordHash: signupPassword,
        pin: signupPin.trim(),
        role: signupRole
      };

      const updatedAdmins = [...admins, newAdmin];
      saveAdmins(updatedAdmins);
      
      setSuccessMsg('Admin registration completed! You can now log in.');
      addAuditLog('New Admin Registered', 'Security', `New administrator profile created: ${signupName} as ${signupRole}.`);
      
      // Reset signup fields & switch tab
      setSignupName('');
      setSignupUsername('');
      setSignupPassword('');
      setSignupPin('');
      setIsLoading(false);
      
      // Auto switch back to login tab after brief delay
      setTimeout(() => {
        setAuthTab('login');
        setLoginUsername(newAdmin.username);
        setSuccessMsg('');
      }, 1500);

    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans" id="auth-portal-screen">
      {/* Visual decorative radial glowing orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-rose-600/10 blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 relative z-10 overflow-hidden">
        {/* Glow border strip */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>

        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-slate-800/80">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-3 shadow-inner">
            <Shield size={28} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">TING TONG BHOPAL</h1>
          <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-1.5 font-extrabold">Enterprise Logistics Control Panel</p>
        </div>

        {/* Tab Switcher (Login / Register Admin) */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 my-5">
          <button
            onClick={() => {
              setAuthTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'login'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <KeyRound size={14} />
            Administrator Sign In
          </button>
          <button
            onClick={() => {
              setAuthTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'signup'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus size={14} />
            Register Admin
          </button>
        </div>

        {/* Active Tab Viewport */}
        <AnimatePresence mode="wait">
          {authTab === 'login' ? (
            <motion.div
              key="login-form-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* Login Method Sub-Toggle */}
              <div className="flex justify-center gap-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setErrorMsg('');
                  }}
                  className={`pb-1 border-b-2 transition-all ${
                    loginMethod === 'password'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent hover:text-slate-300'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('pin');
                    setErrorMsg('');
                  }}
                  className={`pb-1 border-b-2 transition-all ${
                    loginMethod === 'pin'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent hover:text-slate-300'
                  }`}
                >
                  Quick PIN Access
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-semibold leading-relaxed text-center">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={15} />
                    {successMsg}
                  </div>
                )}

                {loginMethod === 'password' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Username / Admin Email</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          placeholder="e.g. admin@8827"
                          className="w-full p-3 pl-10 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                        />
                        <User className="absolute left-3 top-3.5 text-slate-600" size={14} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Security Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full p-3 pl-10 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                        />
                        <Lock className="absolute left-3 top-3.5 text-slate-600" size={14} />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Enter 4-Digit Security PIN</label>
                    <div className="relative max-w-[200px] mx-auto">
                      <input
                        type="password"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full p-3 text-center bg-slate-950 border border-slate-800 rounded-xl text-white font-extrabold text-lg tracking-[8px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <p className="text-center text-[10px] text-slate-500 mt-2">Enter your 4-digit secure administrative passcode.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying Command...
                    </>
                  ) : (
                    'Authenticate & Launch'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="signup-form-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-semibold text-center">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-center">
                    ✨ {successMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Operator Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Username Key</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ramesh@8827"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="India#8827"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">4-Digit PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="e.g. 8827"
                      value={signupPin}
                      onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-700 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assigned Security Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Super Admin', 'Support', 'Operations'] as const).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSignupRole(role)}
                        className={`py-2 px-1 text-center rounded-xl font-bold border transition-all text-[10px] ${
                          signupRole === role
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {role.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Registering Admin Profile...
                    </>
                  ) : (
                    'Create Operator Account'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command footer */}
        <div className="text-center pt-4 border-t border-slate-800/80 mt-5 text-[10px] text-slate-500">
          Secure end-to-end sandbox administration. IP: <span className="font-mono text-indigo-400">192.168.1.42</span>
        </div>
      </div>
    </div>
  );
}
