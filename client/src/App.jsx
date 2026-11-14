import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
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

  return (
    <div className="flex bg-brand-bg min-h-screen text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {activeTab === 'home' && (
          <Home onSelectResto={handleSelectResto} onNavigate={setActiveTab} />
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
          />
        )}

        {activeTab === 'voucher' && (
          <MyVouchers onBack={() => setActiveTab('home')} />
        )}

        {activeTab === 'profile' && (
          <Profile onOpenMerchantPortal={() => setActiveTab('merchant')} />
        )}

        {activeTab === 'merchant' && (
          <MerchantPortal onBack={() => setActiveTab('home')} />
        )}
      </main>
    </div>
  );
}
