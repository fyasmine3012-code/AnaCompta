import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { Settings, RefreshCw, Trash2, Plus, Info, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const ConfigPage: React.FC = () => {
  const { 
    state, 
    addRawMaterial, 
    deleteRawMaterial, 
    addProduct, 
    deleteProduct, 
    addWorkshop, 
    deleteWorkshop, 
    resetToDefault,
    showConfirm
  } = useApp();

  const t = locales[state.language];

  // Raw Material Form
  const [rmName, setRmName] = useState('');
  const [rmUnit, setRmUnit] = useState('kg');
  const [rmInitQ, setRmInitQ] = useState(0);
  const [rmInitV, setRmInitV] = useState(0);

  // Product Form
  const [prodName, setProdName] = useState('');
  const [prodUnit, setProdUnit] = useState('unité');
  const [prodInitQ, setProdInitQ] = useState(0);
  const [prodInitV, setProdInitV] = useState(0);

  // Workshop Form
  const [wsName, setWsName] = useState('');
  const [wsType, setWsType] = useState<'aux' | 'main'>('main');

  const handleCreateRM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmName) return;
    addRawMaterial({
      name: rmName,
      unit: rmUnit,
      initQ: rmInitQ,
      initV: rmInitV,
      purchaseQ: 1000,
      purchaseP: 50,
      directExpenseType: 'مصاريف شحن ونقل',
      directExpenseP: 2
    });
    setRmName('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    // Default material consume and default workshops
    const consumedMaterials: Record<string, number> = {};
    if (state.rawMaterials[0]) {
      consumedMaterials[state.rawMaterials[0].id] = 1;
    }

    const activeWorkshops: Record<string, boolean> = {};
    const workshopQ: Record<string, number> = {};
    state.workshops.forEach(w => {
      if (w.type === 'main' && w.id !== 'appro' && w.id !== 'comm') {
        activeWorkshops[w.id] = true;
        workshopQ[w.id] = 50;
      }
    });

    addProduct({
      name: prodName,
      unit: prodUnit,
      initQ: prodInitQ,
      initV: prodInitV,
      consumedMaterials,
      modQ: 50,
      modP: 100,
      activeWorkshops,
      workshopQ,
      productionVolume: 200,
      quantitySold: 150,
      sellingPrice: 500
    });
    setProdName('');
  };

  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName) return;
    addWorkshop({
      name: wsName,
      type: wsType,
      natureUO: wsType === 'aux' ? '-' : 'ساعة عمل',
      nombreUO: 120
    });
    setWsName('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-800 flex items-center justify-center shadow-lg">
            <Settings className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {t.settingsTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.settingsDesc}
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            if (confirm(state.language === 'ar' ? 'هل تريد إعادة ضبط جميع البيانات إلى القيم الافتراضية التجريبية؟' : 'Reset all data back to original balanced simulation?')) {
              resetToDefault();
            }
          }}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ml-auto md:ml-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{state.language === 'ar' ? 'إعادة ضبط تجريبي' : 'Reload Demo Data'}</span>
        </button>
      </div>

      {/* Bento Grid Configurations block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Raw Materials management */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-2">
            {t.manageRawMaterials}
          </h3>

          <form onSubmit={handleCreateRM} className="space-y-3 p-3 bg-slate-950/20 rounded-xl border border-slate-900">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.materialName}</label>
              <input 
                type="text" 
                value={rmName}
                onChange={e => setRmName(e.target.value)}
                placeholder="e.g. Bois de hêtre" 
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.unit}</label>
                <input 
                  type="text" 
                  value={rmUnit}
                  onChange={e => setRmUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 text-center"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">{state.language === 'ar' ? 'مخزون أول المدة Q' : 'Initial Stock'}</label>
                <input 
                  type="number" 
                  value={rmInitQ}
                  onChange={e => setRmInitQ(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 text-center"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 font-bold py-2 rounded-lg text-[10px] uppercase text-white flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>{t.add}</span>
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {state.rawMaterials.map(rm => (
              <div key={rm.id} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/50 text-xs font-mono">
                <div>
                  <span className="text-slate-200 font-semibold">{rm.name}</span>
                  <div className="text-[10px] text-slate-500">{rm.initQ} {rm.unit} @ {rm.initV} DA</div>
                </div>
                <button 
                  onClick={() => { showConfirm(state.language === 'ar' ? "هل أنت متأكد من حذف هذا العنصر؟" : t.confirmDelete, () => deleteRawMaterial(rm.id)); }}
                  className="text-rose-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Finished Goods management */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            {t.manageProducts}
          </h3>

          <form onSubmit={handleCreateProduct} className="space-y-3 p-3 bg-slate-950/20 rounded-xl border border-slate-900">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.productName}</label>
              <input 
                type="text" 
                value={prodName}
                onChange={e => setProdName(e.target.value)}
                placeholder="e.g. Table en chêne" 
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.unit}</label>
                <input 
                  type="text" 
                  value={prodUnit}
                  onChange={e => setProdUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 text-center"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">{state.language === 'ar' ? 'مخزون أول المدة Q' : 'Initial Stock'}</label>
                <input 
                  type="number" 
                  value={prodInitQ}
                  onChange={e => setProdInitQ(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 text-center"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 font-bold py-2 rounded-lg text-[10px] uppercase text-white flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>{t.add}</span>
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {state.products.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/50 text-xs font-mono">
                <div>
                  <span className="text-slate-200 font-semibold">{p.name}</span>
                  <div className="text-[10px] text-slate-500">{p.initQ} {p.unit} @ {p.initV} DA</div>
                </div>
                <button 
                  onClick={() => { showConfirm(state.language === 'ar' ? "هل أنت متأكد من حذف هذا العنصر؟" : t.confirmDelete, () => deleteProduct(p.id)); }}
                  className="text-rose-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Workshops management */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            {t.manageWorkshops}
          </h3>

          <form onSubmit={handleCreateWorkshop} className="space-y-3 p-3 bg-slate-950/20 rounded-xl border border-slate-900">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.workshopName}</label>
              <input 
                type="text" 
                value={wsName}
                onChange={e => setWsName(e.target.value)}
                placeholder="e.g. Atelier Peinture" 
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.secType}</label>
              <select 
                value={wsType}
                onChange={e => setWsType(e.target.value as 'aux' | 'main')}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-2 focus:outline-none"
              >
                <option value="main">{t.mainSec}</option>
                <option value="aux">{t.auxSec}</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-2 rounded-lg text-[10px] uppercase text-white flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>{t.add}</span>
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {state.workshops.map(w => (
              <div key={w.id} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/50 text-xs font-mono">
                <div>
                  <span className="text-slate-200 font-semibold">{w.name}</span>
                  <div className="text-[10px] text-slate-500 uppercase">{w.type === 'aux' ? t.auxSec : t.mainSec}</div>
                </div>
                {/* Prevent deleting core centers */}
                {w.id !== 'adm' && w.id !== 'maint' && w.id !== 'appro' && w.id !== 'comm' ? (
                  <button 
                    onClick={() => { showConfirm(state.language === 'ar' ? "هل أنت متأكد من حذف هذا العنصر؟" : t.confirmDelete, () => deleteWorkshop(w.id)); }}
                    className="text-rose-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded">core</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
