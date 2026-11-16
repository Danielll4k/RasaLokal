import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Signal, User, Store, LogIn } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MobileHeader from './components/MobileHeader';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RestaurantDetail from './pages/RestaurantDetail';
import ScanNota from './pages/ScanNota';
import SubmitReview from './pages/SubmitReview';
import MyVouchers from './pages/MyVouchers';
import Profile from './pages/Profile';
import MerchantPortal from './pages/MerchantPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedResto, setSelectedResto] = useState(null);
  const [verifiedVoucherData, setVerifiedVoucherData] = useState(null);
  
  // Mobile Simulator mode for desktop testing
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);
  const [isRealMobile, setIsRealMobile] = useState(false);

  // Authentication State (Reviewer vs Kasir)
  const [currentUser, setCurrentUser] = useState({
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Alya Rahman',
    email: 'alya@gmail.com',
    role: 'customer',
    bio: 'Food explorer · Yogyakarta',
    badge: 'Reviewer Terverifikasi',
    avatar: 'AR'
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsRealMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleSelectResto = (resto) => {
    setSelectedResto(resto);
    setActiveTab('detail');
  };

  const handleStartReviewFromDetail = (resto) => {
    setActiveTab('scan');
  };

  const handleVoucherVerified = (data) => {
    setVerifiedVoucherData(data);
    setActiveTab('submit-review');
  };

  const handleReviewSuccess = () => {
    setVerifiedVoucherData(null);
    setActiveTab('voucher');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'cashier') {
      setActiveTab('merchant');
    } else {
      setActiveTab('home');
    }
  };

  const showBottomNav = ['home', 'explore', 'scan', 'voucher', 'profile'].includes(activeTab);
  const showMobileHeader = ['home', 'explore', 'scan', 'voucher', 'profile', 'merchant'].includes(activeTab);

  const renderContent = () => (
    <>
      {activeTab === 'home' && (
        <Home 
          onSelectResto={handleSelectResto} 
          onNavigate={setActiveTab} 
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {activeTab === 'explore' && (
        <Explore onSelectResto={handleSelectResto} onBack={() => setActiveTab('home')} />
      )}

      {activeTab === 'detail' && (
        <RestaurantDetail
          resto={selectedResto}
          onBack={() => setActiveTab('home')}
          onStartReview={handleStartReviewFromDetail}
        />
      )}

      {activeTab === 'scan' && (
        <ScanNota
          onVerified={handleVoucherVerified}
          onBack={() => setActiveTab('home')}
        />
      )}

      {activeTab === 'submit-review' && verifiedVoucherData && (
        <SubmitReview
          verifiedData={verifiedVoucherData}
          onSuccess={handleReviewSuccess}
          onCancel={() => setActiveTab('home')}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'voucher' && (
        <MyVouchers onBack={() => setActiveTab('home')} />
      )}

      {activeTab === 'profile' && (
        <Profile 
          onOpenMerchantPortal={() => setActiveTab('merchant')} 
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {activeTab === 'merchant' && (
        <MerchantPortal 
          onBack={() => setActiveTab('home')} 
          onNavigateToScan={(scannedCode) => {
            setActiveTab('scan');
          }}
          currentUser={currentUser}
        />
      )}
    </>
  );

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 font-sans selection:bg-brand-ice selection:text-brand-ocean">
      {/* Top Floating Control Bar (Visible on PC / tablet) */}
      <div className="fixed top-3 right-4 z-50 hidden sm:flex items-center space-x-2">
        {/* Quick Role / Login Switcher Button */}
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-white/95 backdrop-blur-md border border-slate-300/80 shadow-lg rounded-full py-1.5 px-3.5 flex items-center space-x-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all hover:scale-105"
        >
          <span className={`w-2 h-2 rounded-full ${currentUser.role === 'cashier' ? 'bg-sky-500' : 'bg-emerald-500'} animate-pulse`}></span>
          <span>{currentUser.role === 'cashier' ? '🏪 Kasir (Sore Dining)' : '👤 Reviewer (Alya)'}</span>
          <span className="text-[10px] text-brand-ocean underline font-medium">Ganti Akun</span>
        </button>

        {/* Device Switcher (Desktop vs Hape) */}
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-slate-300/80 shadow-lg rounded-full p-1 text-xs">
          <button
            onClick={() => setIsMobileSimulated(false)}
            className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 font-bold transition-all ${
              !isMobileSimulated
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setIsMobileSimulated(true)}
            className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 font-bold transition-all ${
              isMobileSimulated
                ? 'bg-brand-ocean text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tampilan Hape</span>
          </button>
        </div>
      </div>

      {/* CASE 1: SIMULATED MOBILE FRAME ON DESKTOP */}
      {isMobileSimulated && !isRealMobile ? (
        <div className="min-h-screen flex items-center justify-center p-4 md:py-8 bg-slate-900/95">
          {/* Smartphone Hardware Frame (Clean math: 50px outer - 10px padding = 40px inner) */}
          <div className="relative w-full max-w-[412px] h-[850px] bg-slate-950 rounded-[50px] p-2.5 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden">
            {/* Phone Screen Canvas (Overflow hidden without backdrop-blur bleed) */}
            <div className="relative w-full h-full bg-[#FBFCFD] rounded-[40px] overflow-hidden flex flex-col">
              {/* iOS / Android Status Bar (Solid white background, no black smudge) */}
              <div className="relative bg-white pt-3 px-6 pb-2.5 flex items-center justify-between text-xs font-semibold text-slate-800 shrink-0 z-40 border-b border-slate-100 select-none">
                <span className="font-bold text-slate-900 tracking-tight">09:41</span>
                
                {/* Dynamic Island Pill (Centered absolutely) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-6 bg-black rounded-full flex items-center justify-end pr-2 pointer-events-none z-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a1128] border border-slate-800" />
                </div>

                <div className="flex items-center space-x-1.5 text-slate-700">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <BatteryMedium className="w-4 h-4" />
                </div>
              </div>

              {/* Mobile Header (Hidden on detail & submit review) */}
              {showMobileHeader && (
                <MobileHeader 
                  onOpenMerchantPortal={() => setActiveTab('merchant')}
                  onOpenLogin={() => setIsLoginModalOpen(true)}
                  currentUser={currentUser}
                />
              )}

              {/* Scrollable Mobile App Area */}
              <div className="flex-1 overflow-y-auto pb-24 scrollbar-none">
                {renderContent()}
              </div>

              {/* Mobile Bottom Navigation inside phone frame */}
              {showBottomNav && (
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isSimulated={true} />
              )}

              {/* Home Indicator bar */}
              <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none z-50">
                <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CASE 2: RESPONSIVE VIEW (REAL MOBILE PHONE OR FULL DESKTOP) */
        <div className="flex bg-[#FBFCFD] min-h-screen text-slate-800">
          {/* Desktop Sidebar (hidden on phones) */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />

          {/* Main Area */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-20 md:pb-0">
            {/* Mobile Header (only visible on mobile screens, hidden on detail & review) */}
            {showMobileHeader && (
              <MobileHeader 
                onOpenMerchantPortal={() => setActiveTab('merchant')}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                currentUser={currentUser}
              />
            )}

            {/* View Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </main>

          {/* Mobile Bottom Navigation (only visible on mobile screens) */}
          {showBottomNav && (
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </div>
      )}

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentRole={currentUser.role}
      />
    </div>
  );
}
