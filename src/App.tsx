import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { locales } from './locales';
import { Dashboard } from './components/Dashboard';
import { TRCIPage } from './components/TRCIPage';
import { PurchasesPage } from './components/PurchasesPage';
import { ProductionPage } from './components/ProductionPage';
import { CostPricePage } from './components/CostPricePage';
import { GlobalSynthesis } from './components/GlobalSynthesis';
import { ConfigPage } from './components/ConfigPage';
import { FinancialAssistant } from './components/FinancialAssistant';
import { LandingPage } from './components/LandingPage';
import { 
  Layers, 
  BookOpen, 
  ShoppingCart, 
  Factory, 
  Calculator, 
  PieChart, 
  Settings, 
  Globe, 
  User, 
  Menu, 
  X,
  ChevronsRight,
  LogOut,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';

function AppContent() {
  const { state, updateState } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  const t = locales[state.language];
  const isRtl = state.language === 'ar';

  // Apply visual text direction and font families strictly
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
    document.body.style.fontFamily = isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  }, [state.language, isRtl]);

  const tabsConfig = [
    { id: 'dashboard', label: t.dashboard, icon: PieChart },
    { id: 'trci', label: t.trci, icon: BookOpen },
    { id: 'purchases', label: t.purchases, icon: ShoppingCart },
    { id: 'production', label: t.production, icon: Factory },
    { id: 'costPrice', label: t.costPrice, icon: Calculator },
    { id: 'synthesis', label: t.synthesis, icon: Layers },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'trci': return <TRCIPage />;
      case 'purchases': return <PurchasesPage />;
      case 'production': return <ProductionPage />;
      case 'costPrice': return <CostPricePage />;
      case 'synthesis': return <GlobalSynthesis />;
      case 'settings': return <ConfigPage />;
      default: return <Dashboard />;
    }
  };

  const currentTabLabel = tabsConfig.find(tab => tab.id === activeTab)?.label || t.dashboard;

  if (viewMode === 'landing') {
    return <LandingPage onEnterERP={() => setViewMode('app')} />;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans antialiased overflow-x-hidden ${
      isRtl ? 'text-right' : 'text-left'
    }`}>
      {/* Header Top Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-900/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu button toggle */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 focus:outline-none text-slate-400 hover:text-white rounded-lg border border-slate-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* ERP Brand Launcher symbol */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/10 cursor-pointer" onClick={() => setViewMode('landing')}>
            <Layers className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400 tracking-wider cursor-pointer" onClick={() => setViewMode('landing')}>
              {t.appTitle.toUpperCase()}
            </h1>
            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
              <span>AnaCompta ERP</span>
              <span>/</span>
              <span className="text-indigo-400 font-medium">{currentTabLabel}</span>
            </div>
          </div>
        </div>

        {/* Configurations, language switches, and user elements */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#111827] border border-slate-800 text-indigo-400 hover:text-white rounded-xl transition-all"
            title={state.language === 'ar' ? 'الرجوع ومراجعة العروض' : 'Landing Gate'}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{state.language === 'ar' ? 'موقع لاندينج' : 'Site Web'}</span>
          </button>

          {/* Advanced Language switcher drop-button */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button 
              onClick={() => updateState({ language: 'ar' })}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                state.language === 'ar' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-505 border-indigo-500/20 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button 
              onClick={() => updateState({ language: 'fr' })}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                state.language === 'fr' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-505 border-indigo-500/20 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button 
              onClick={() => updateState({ language: 'en' })}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                state.language === 'en' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-505 border-indigo-500/20 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">fhouatis@gmail.com</span>
          </div>
        </div>
      </header>

      {/* Main ERP Area workspace */}
      <div className="flex flex-1 relative w-full">
        {/* Sidebar Fixed/Toggle drawer */}
        <aside className={`fixed lg:static top-[61px] bottom-0 z-30 w-64 bg-[#090d16] border-r border-[#151c2c]/80 flex flex-col justify-between shrink-0 transition-transform duration-300 transform ${
          sidebarOpen 
            ? 'translate-x-0' 
            : isRtl 
              ? 'translate-x-full lg:translate-x-0' 
              : '-translate-x-full lg:translate-x-0'
        } ${
          isRtl ? 'right-0 border-l border-r-0' : 'left-0 border-r border-l-0'
        }`}>
          {/* Dynamic Navigation Menu links */}
          <nav className="p-4 space-y-1">
            {tabsConfig.map(tab => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10 border border-indigo-500/20 font-bold' 
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
                  } ${
                    isRtl ? 'flex-row' : 'flex-row'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom decorative corporate status */}
          <div className="p-4 border-t border-slate-900/80 space-y-2">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 space-y-1 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block">Operational Node</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">active_node_3000</span>
            </div>
          </div>
        </aside>

        {/* Back drop modal on mobile layout */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[61px] bg-black/45 z-20 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Interactive content workspace area scrollable */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-full">
          {renderActiveScreen()}
        </main>
      </div>
      <FinancialAssistant />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
