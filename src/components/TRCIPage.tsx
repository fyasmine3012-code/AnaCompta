import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { Workshop } from '../types';
import { Plus, Trash2, Check, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const TRCIPage: React.FC = () => {
  const { 
    state, 
    updateState, 
    addWorkshop, 
    updateWorkshop,
    deleteWorkshop, 
    updateTrciRow, 
    addCustomTrciRow, 
    calculatedValues 
  } = useApp();

  const t = locales[state.language];

  // Tab state within TRCI: 'chart' which shows rows management, or 'trci' which shows the distribution matrix
  const [activeSubTab, setActiveSubTab] = useState<'chart' | 'matrix'>('matrix');

  // Forms states
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccName, setNewAccName] = useState('');

  const [newWsName, setNewWsName] = useState('');
  const [newWsType, setNewWsType] = useState<'aux' | 'main'>('main');

  const onAddCustomAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccCode || !newAccName) return;
    addCustomTrciRow(newAccCode, newAccName);
    setNewAccCode('');
    setNewAccName('');
  };

  const onAddWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName) return;
    addWorkshop({
      name: newWsName,
      type: newWsType,
      natureUO: newWsType === 'aux' ? '-' : 'وحدة عمل',
      nombreUO: 100
    });
    setNewWsName('');
  };

  // Helper to compute the total percentage of a row
  const getRowSumPct = (row: any) => {
    return state.workshops.reduce((acc, ws) => acc + (row.pcts[ws.id] || 0), 0);
  };

  const isRtl = state.language === 'ar';

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400">
            {t.trciTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {t.trciDesc}
          </p>
        </div>

        {/* Custom Tab Toggles in TRCI */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1.5 ml-auto mr-0 rtl:mr-auto rtl:ml-0">
          <button 
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'matrix' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.trci}</span>
          </button>
          <button 
            onClick={() => setActiveSubTab('chart')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'chart' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{state.language === 'ar' ? 'دليل الحسابات' : 'Chart of Accounts'}</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'chart' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Add custom account row */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 mb-3">{state.language === 'ar' ? 'إضافة حساب فرعي أو عبء مخصص' : 'Add Custom SCF Row / Expense'}</h3>
            <form onSubmit={onAddCustomAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{state.language === 'ar' ? 'رقم الحساب' : 'Account Code'}</label>
                <input 
                  type="text" 
                  value={newAccCode} 
                  onChange={e => setNewAccCode(e.target.value)} 
                  placeholder="e.g. 614" 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{state.language === 'ar' ? 'اسم الحساب المحاسبي' : 'Account Description'}</label>
                <input 
                  type="text" 
                  value={newAccName} 
                  onChange={e => setNewAccName(e.target.value)} 
                  placeholder="e.g. Transport" 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t.add}</span>
              </button>
            </form>
          </div>

          {/* Chart of accounts list with direct/indirect toggle */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <table className="w-full text-center border-collapse text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                <tr>
                  <th className="p-3 text-right">{t.scfAccountName}</th>
                  <th className="p-3">{t.loadType}</th>
                  <th className="p-3">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/30">
                {state.trciRows.map((row) => (
                  <tr key={row.accountCode} className="hover:bg-slate-900/40">
                    <td className="p-3 text-right font-semibold text-slate-200">{row.accountCode} - {row.accountName}</td>
                    <td className="p-3">
                      <select 
                        value={row.type}
                        onChange={e => updateTrciRow(row.accountCode, { type: e.target.value as 'direct' | 'indirect' })}
                        className="bg-slate-900 border border-slate-800 text-xs rounded-lg p-1.5 text-slate-300 focus:outline-none"
                      >
                        <option value="indirect">{t.indirect}</option>
                        <option value="direct">{t.direct}</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={row.isActive} 
                          onChange={e => updateTrciRow(row.accountCode, { isActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Add Workshop dynamic bar */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-300 flex items-center gap-2">
                  <Plus className="text-emerald-400 w-4 h-4" />
                  <span>{state.language === 'ar' ? 'إدراج قسم أو ورشة عمل هيكلية' : 'Insert Department / Workshop'}</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  {state.language === 'ar' ? 'تضاف كقسم فرعي داعم قبل القسم التجاري الختامي' : 'Added to allocation centers prior to Sales center'}
                </p>
              </div>

              <form onSubmit={onAddWorkshop} className="flex flex-wrap gap-2 flex-1 max-w-2xl justify-end">
                <input 
                  type="text" 
                  value={newWsName} 
                  onChange={e => setNewWsName(e.target.value)} 
                  placeholder={t.secNamePlaceholder} 
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white max-w-lg flex-1 focus:outline-none focus:border-indigo-500"
                />
                <select 
                  value={newWsType} 
                  onChange={e => setNewWsType(e.target.value as 'aux' | 'main')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="main">{t.mainSec}</option>
                  <option value="aux">{t.auxSec}</option>
                </select>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 rounded-xl transition-all"
                >
                  {t.add}
                </button>
              </form>
            </div>
          </div>

          {/* TRCI Distribution Matrix */}
          <div className="glass-panel rounded-2xl overflow-x-auto border border-slate-800 shadow-2xl relative">
            <table className="w-full text-center border-collapse text-xs select-none">
              <thead>
                <tr className="bg-slate-900 text-slate-200">
                  <th rowSpan={2} className="p-4 text-right min-w-[240px] border-b border-slate-800">{t.scfAccountName}</th>
                  <th rowSpan={2} className="p-4 w-28 border-b border-slate-800">{t.loadType}</th>
                  <th rowSpan={2} className="p-4 w-28 border-b border-slate-800">{state.language === 'ar' ? 'المجموع (DA)' : 'Total (DA)'}</th>
                  
                  {state.workshops.map(ws => (
                    <th 
                      key={ws.id} 
                      colSpan={2} 
                      className={`p-3 relative border-b border-slate-800 border-r border-slate-800 ${
                        ws.type === 'aux' 
                          ? 'bg-indigo-950/20 text-indigo-300' 
                          : ws.id === 'comm' 
                            ? 'bg-amber-950/20 text-amber-400 font-bold' 
                            : 'bg-emerald-950/20 text-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between px-1">
                        <span>{ws.name}</span>
                        {/* Protect core defaults from deletion */}
                        {ws.id !== 'adm' && ws.id !== 'maint' && ws.id !== 'appro' && ws.id !== 'comm' && (
                          <button 
                            onClick={() => deleteWorkshop(ws.id)} 
                            className="text-rose-400 hover:text-rose-500 hover:scale-105 transition-all p-0.5 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th rowSpan={2} className="p-4 w-24 border-b border-slate-800 border-r border-slate-800">{t.controlColumn}</th>
                </tr>
                <tr className="bg-slate-900/60 text-[10px] text-slate-400">
                  {state.workshops.map(ws => (
                    <React.Fragment key={ws.id}>
                      <th className="p-2 border-r border-slate-800">%</th>
                      <th className="p-2 border-r border-slate-800">DA</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {/* Active categories rows */}
                {state.trciRows.filter(row => row.isActive).map(row => {
                  const row_sum = getRowSumPct(row);
                  const isBalanced = Math.abs(row_sum - 100) < 0.01;

                  return (
                    <tr key={row.accountCode} className="hover:bg-slate-900/20">
                      {/* Name */}
                      <td className="text-right p-3 font-semibold text-slate-300 border-r border-slate-800/40">
                        {row.accountCode} : {row.accountName}
                      </td>

                      {/* Type toggle */}
                      <td className="p-2.5">
                        <select 
                          value={row.type}
                          onChange={e => updateTrciRow(row.accountCode, { type: e.target.value as 'direct' | 'indirect' })}
                          className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 p-1 rounded-md focus:outline-none w-full"
                        >
                          <option value="indirect">{t.indirect}</option>
                          <option value="direct">{t.direct}</option>
                        </select>
                      </td>

                      {/* Total Amount input */}
                      <td className="p-2 border-r border-slate-800/40 min-w-[100px]">
                        <input 
                          type="number" 
                          value={row.totalAmount}
                          onChange={e => updateTrciRow(row.accountCode, { totalAmount: parseFloat(e.target.value) || 0 })}
                          className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1 text-slate-100 font-bold focus:outline-none"
                        />
                      </td>

                      {/* Matrix cells for each workshop */}
                      {state.workshops.map(ws => {
                        const pctValue = row.pcts[ws.id] || 0;
                        const allocatedDA = row.totalAmount * (pctValue / 100);

                        return (
                          <React.Fragment key={ws.id}>
                            {/* % input */}
                            <td className="p-1 border-r border-slate-800/40 min-w-[60px]">
                              <input 
                                type="number" 
                                min="0" 
                                max="100"
                                value={pctValue}
                                onChange={e => {
                                  const updatedPcts = { ...row.pcts };
                                  const inputted = parseFloat(e.target.value) || 0;
                                  updatedPcts[ws.id] = inputted;

                                  // Smart Balance logic: auto-fills remaining fields if total percent is close
                                  const othersSum = state.workshops
                                    .filter(other => other.id !== ws.id)
                                    .reduce((sum, other) => sum + (updatedPcts[other.id] || 0), 0);
                                  
                                  const remainder = 100 - (othersSum + inputted);
                                  // If only one cell is remaining and it's zero or empty, let's auto-fill it to complete 100%
                                  if (remainder > 0 && inputtingIsRemaining(ws.id, updatedPcts, state.workshops)) {
                                    const lastWs = state.workshops.find(other => other.id !== ws.id && (updatedPcts[other.id] === 0 || !updatedPcts[other.id]));
                                    if (lastWs) {
                                      updatedPcts[lastWs.id] = remainder;
                                    }
                                  }

                                  updateTrciRow(row.accountCode, { pcts: updatedPcts });
                                }}
                                className="w-full text-center bg-slate-950 border border-slate-800 rounded p-0.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                              />
                            </td>
                            {/* DA view */}
                            <td className="p-1 border-r border-slate-800/40 min-w-[75px]">
                              <input 
                                type="number"
                                value={Math.round(allocatedDA)}
                                onChange={e => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const total = row.totalAmount || 1;
                                  const updatedPcts = { ...row.pcts };
                                  updatedPcts[ws.id] = (val / total) * 100;
                                  updateTrciRow(row.accountCode, { pcts: updatedPcts });
                                }}
                                className="w-full text-center bg-slate-950 border border-slate-800/60 rounded p-0.5 text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}

                      {/* Control Column */}
                      <td className="p-2 border-r border-slate-800">
                        <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-[10px] w-full ${
                          isBalanced ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {row_sum}%
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Initial distribution totals sum row */}
                <tr className="bg-slate-900/40 border-t-2 border-slate-700 font-bold text-xs">
                  <td colSpan={2} className="text-right p-3 text-indigo-400">{t.initialDistributionSum}</td>
                  <td className="p-3 text-white font-black font-mono">
                    {Math.round(
                      state.trciRows
                        .filter(r => r.isActive && r.type === 'indirect')
                        .reduce((acc, r) => acc + r.totalAmount, 0)
                    ).toLocaleString()}
                  </td>
                  
                  {state.workshops.map(ws => {
                    const sum = calculatedValues.trciTotals.initialSums[ws.id] || 0;
                    return (
                      <React.Fragment key={ws.id}>
                        <td className="p-2 bg-slate-950/25 border-r border-slate-800">-</td>
                        <td className="p-2 font-black text-white font-mono border-r border-slate-800">
                          {Math.round(sum).toLocaleString()}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border-r border-slate-800">-</td>
                </tr>

                {/* Secondary distribution totals sum row (balances auxiliary sections ADM, MIN) */}
                <tr className="bg-emerald-950/10 border-t border-slate-800 font-black text-xs text-emerald-400">
                  <td colSpan={2} className="text-right p-3">{t.secondaryDistributionSum}</td>
                  <td className="p-3 text-white font-black font-mono">
                    {Math.round(
                      state.trciRows
                        .filter(r => r.isActive && r.type === 'indirect')
                        .reduce((acc, r) => acc + r.totalAmount, 0)
                    ).toLocaleString()}
                  </td>
                  
                  {state.workshops.map(ws => {
                    const secSum = calculatedValues.trciTotals.secondarySums[ws.id] || 0;
                    return (
                      <React.Fragment key={ws.id}>
                        <td className="p-2 bg-slate-950/25 border-r border-slate-800">-</td>
                        <td className="p-2 font-black text-white font-mono border-r border-slate-800">
                          {Math.round(secSum).toLocaleString()}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border-r border-slate-800">-</td>
                </tr>

                {/* Nature of Work Unit */}
                <tr className="text-slate-400 text-xs font-semibold">
                  <td colSpan={2} className="text-right p-3">{t.natureUO}</td>
                  <td className="p-2 bg-slate-950/20">-</td>
                  {state.workshops.map(ws => (
                    <React.Fragment key={ws.id}>
                      {ws.type === 'aux' ? (
                        <td colSpan={2} className="p-2 bg-slate-950/40 border-r border-slate-800 text-slate-600">-</td>
                      ) : (
                        <td colSpan={2} className="p-2 border-r border-slate-800 relative">
                          <select 
                            value={ws.natureUO}
                            onChange={e => updateWorkshop(ws.id, { natureUO: e.target.value })}
                            className="w-full text-center bg-slate-950 border border-slate-800 text-emerald-400 font-bold rounded p-1 text-xs focus:outline-none"
                          >
                            <option value="ساعة عمل مباشرة">ساعة عمل مباشرة / H.M.O.D</option>
                            <option value="ساعة تشغيل الآلة">ساعة تشغيل الآلة / Heure Machine</option>
                            <option value="كمية مشتراة">كمية مشتراة / Q. Achetée</option>
                            <option value="كمية مستهلكة">كمية مستهلكة / Q. Consommée</option>
                            <option value="كمية مباعة">كمية مباعة / Q. Vendue</option>
                            <option value="رقم الأعمال">رقم الأعمال / Chiffre d'Affaires</option>
                            <option value="وحدة منتجة">وحدة منتجة / Unité Produite</option>
                            <option value="وحدة عمل">وحدة عمل / Unité d'œuvre</option>
                            <option value="-">-</option>
                          </select>
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                  <td className="border-r border-slate-800">-</td>
                </tr>

                {/* Number of Work Units */}
                <tr className="text-slate-300 text-xs font-bold">
                  <td colSpan={2} className="text-right p-2">{t.nombreUO}</td>
                  <td className="p-2 bg-slate-950/20">-</td>
                  {state.workshops.map(ws => {
                    // Let's offer automatic feedback on system quantities
                    let dynamicCount = ws.nombreUO;
                    let isDynamic = false;
                    
                    if (ws.id === 'appro') {
                      dynamicCount = state.rawMaterials.reduce((acc, rm) => acc + rm.purchaseQ, 0);
                      isDynamic = true;
                    } else if (ws.id === 'comm') {
                      dynamicCount = state.products.reduce((acc, p) => acc + p.quantitySold, 0);
                      isDynamic = true;
                    } else {
                      const totalWsUsage = state.products.reduce((acc, p) => {
                        if (p.activeWorkshops[ws.id]) {
                          return acc + (p.workshopQ[ws.id] || 0);
                        }
                        return acc;
                      }, 0);
                      if (totalWsUsage > 0) {
                        dynamicCount = totalWsUsage;
                        isDynamic = true;
                      }
                    }

                    return (
                      <React.Fragment key={ws.id}>
                        {ws.type === 'aux' ? (
                          <td colSpan={2} className="p-2 bg-slate-950/40 border-r border-slate-800 text-slate-600">-</td>
                        ) : (
                          <td colSpan={2} className="p-1 border-r border-slate-800">
                            <div className="relative group">
                              <input 
                                type="number"
                                value={ws.overrideNombreUO !== undefined ? ws.overrideNombreUO : (isDynamic ? dynamicCount : ws.nombreUO)}
                                onChange={e => {
                                  const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                  updateWorkshop(ws.id, { overrideNombreUO: val });
                                }}
                                className={`w-full text-center border rounded p-1 font-black bg-slate-950 text-white focus:border-indigo-500`}
                              />
                              {(isDynamic || ws.overrideNombreUO !== undefined) && (
                                <div className="text-[9px] text-slate-500 mt-0.5 flex flex-col items-center justify-center gap-0.5">
                                  {ws.overrideNombreUO !== undefined ? (
                                    <button 
                                      type="button"
                                      onClick={() => updateWorkshop(ws.id, { overrideNombreUO: undefined })}
                                      className="text-amber-400 hover:text-amber-300 font-bold underline text-[8px] cursor-pointer"
                                      title="Click to restore system formula"
                                    >
                                      {state.language === 'ar' ? 'يدوي (اضغط للتلقائي)' : 'Manual (click for auto)'}
                                    </button>
                                  ) : (
                                    <span className="text-teal-400 font-bold text-[8px]">
                                      {state.language === 'ar' ? 'تلقائي / آلي' : 'System Synced'}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <td className="border-r border-slate-800">-</td>
                </tr>

                {/* Cost per Work Unit */}
                <tr className="bg-indigo-950/20 font-black text-indigo-300 text-xs">
                  <td colSpan={2} className="text-right p-3">{t.coutUO}</td>
                  <td className="p-3 bg-slate-950/20 font-bold">-</td>
                  {state.workshops.map(ws => {
                    const uCost = calculatedValues.trciTotals.unitCosts[ws.id] || 0;
                    return (
                      <React.Fragment key={ws.id}>
                        {ws.type === 'aux' ? (
                          <td colSpan={2} className="p-2 bg-slate-950/40 border-r border-slate-800 text-slate-600">-</td>
                        ) : (
                          <td colSpan={2} className="p-3 border-r border-slate-800 text-center font-black text-indigo-400 font-mono text-[11px]">
                            {uCost.toFixed(2)} <span className="text-[10px] text-indigo-500">DA</span>
                          </td>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <td className="border-r border-slate-800">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to check if we are down to final blank percent cell to ease computation
function inputtingIsRemaining(activeId: string, updatedPcts: Record<string, number>, workshops: Workshop[]) {
  const unsetWorkshops = workshops.filter(ws => ws.id !== activeId && (!updatedPcts[ws.id] || updatedPcts[ws.id] === 0));
  return unsetWorkshops.length === 1;
}
