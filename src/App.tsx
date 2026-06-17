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
import { HistoricalAIAnalysis } from './components/HistoricalAIAnalysis';
import { ExportBar } from './components/ExportBar';
import { FyComptaLogo } from './components/FyComptaLogo';
import { SmartNotifications } from './components/SmartNotifications';
import { AIForecastingPage } from './components/AIForecastingPage';
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
  Home,
  Sun,
  Moon,
  AlertCircle,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

function AppContent() {
  const { state, updateState, confirmDialog, closeConfirm } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('anacompta_theme') as 'light' | 'dark') || 'dark';
  });

  const t = locales[state.language];
  const isRtl = state.language === 'ar';

  // Apply visual text direction and font families strictly
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
    document.body.style.fontFamily = isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  }, [state.language, isRtl]);

  useEffect(() => {
    localStorage.setItem('anacompta_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const tabsConfig = [
    { id: 'dashboard', label: t.dashboard, icon: PieChart },
    { id: 'trci', label: t.trci, icon: BookOpen },
    { id: 'purchases', label: t.purchases, icon: ShoppingCart },
    { id: 'production', label: t.production, icon: Factory },
    { id: 'costPrice', label: t.costPrice, icon: Calculator },
    { id: 'synthesis', label: t.synthesis, icon: Layers },
    { id: 'historical', label: state.language === 'en' ? 'Historical & AI' : (state.language === 'fr' ? 'Historique & IA' : 'البيانات التاريخية والذكاء الاصطناعي'), icon: BrainCircuit },
    { id: 'forecasting', label: state.language === 'en' ? 'Smart Forecasting & Scenario' : (state.language === 'fr' ? 'Prévisions & Scénarios' : 'التنبؤ الذكي والسيناريوهات'), icon: TrendingUp },
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
      case 'historical': return <HistoricalAIAnalysis />;
      case 'forecasting': return <AIForecastingPage />;
      case 'settings': return <ConfigPage />;
      default: return <Dashboard />;
    }
  };

  const currentTabLabel = tabsConfig.find(tab => tab.id === activeTab)?.label || t.dashboard;

  if (viewMode === 'landing') {
    return <LandingPage onEnterERP={() => setViewMode('app')} />;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden ${
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
          <div className="flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-95 transition-all" onClick={() => setViewMode('landing')}>
            <FyComptaLogo size={36} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider cursor-pointer" style={{ color: '#dce2f1' }} onClick={() => setViewMode('landing')}>
              {t.appTitle.toUpperCase()}
            </h1>
            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
              <span>FyCompta</span>
              <span>/</span>
              <span className="text-indigo-400 font-medium">{currentTabLabel}</span>
            </div>
          </div>
        </div>

        {/* Configurations, theme, language switches, and user elements */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white rounded-xl transition-all"
            title={state.language === 'ar' ? 'الرجوع ومراجعة العروض' : 'Landing Gate'}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{state.language === 'ar' ? 'موقع لاندينج' : 'Site Web'}</span>
          </button>

          {/* Smart Notification Bell & Panel */}
          <SmartNotifications onTabChange={setActiveTab} />

          {/* Sun/Moon Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title={state.language === 'ar' ? 'تبديل المظهر الليلي / النهاري' : 'Toggle Theme'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-amber-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Advanced Language switcher drop-button */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button 
              onClick={() => updateState({ language: 'ar' })}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                state.language === 'ar' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-505 border-indigo-500/20 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button 
              onClick={() => updateState({ language: 'fr' })}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                state.language === 'fr' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-505 border-indigo-500/20 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button 
              onClick={() => updateState({ language: 'en' })}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                state.language === 'en' 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-505 border-indigo-500/20 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">fhouatis@gmail.com</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl transition-all cursor-pointer"
            title={state.language === 'ar' ? 'تسجيل الخروج من المنصة' : 'Logout Session'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">{state.language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
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
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-full">
          <ExportBar />
          {renderActiveScreen()}
        </main>
      </div>
      <FinancialAssistant />

      {confirmDialog && confirmDialog.isOpen && (
        <div id="confirm-modal-overlay" className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div id="confirm-modal-box" className="bg-[#0b1329] border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 text-rose-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-100">
                {state.language === 'ar' ? 'رسالة تأكيد' : (state.language === 'fr' ? 'Confirmation' : 'Confirmation')}
              </h4>
              <p className="text-xs text-slate-300 font-medium whitespace-pre-line leading-relaxed">
                {confirmDialog.message}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                id="btn-confirm"
                onClick={() => {
                  confirmDialog.onConfirm();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow"
              >
                {state.language === 'ar' ? 'نعم' : (state.language === 'fr' ? 'Oui' : 'Yes')}
              </button>
              <button
                id="btn-cancel"
                onClick={closeConfirm}
                className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
              >
                {state.language === 'ar' ? 'إلغاء' : (state.language === 'fr' ? 'Annuler' : 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
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
