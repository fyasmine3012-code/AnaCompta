import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { ShoppingCart, Plus, Trash2, Tag, Layers, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const PurchasesPage: React.FC = () => {
  const { 
    state, 
    addRawMaterial, 
    updateRawMaterial, 
    deleteRawMaterial, 
    calculatedValues 
  } = useApp();

  const t = locales[state.language];

  // Form states for fast top bar entry
  const [newMatName, setNewMatName] = useState('');
  const [newMatUnit, setNewMatUnit] = useState('kg');

  const onAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName) return;
    addRawMaterial({
      name: newMatName,
      unit: newMatUnit,
      initQ: 0,
      initV: 0,
      purchaseQ: 0,
      purchaseP: 0,
      directExpenseType: 'مصاريف شحن ونقل',
      directExpenseP: 0
    });
    setNewMatName('');
  };

  const approUnitCost = calculatedValues.trciTotals.unitCosts['appro'] || 0;

  return (
    <div className="space-y-6">
      {/* Top Title/Metric Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg">
            <ShoppingCart className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-400">
              {t.purchaseTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.purchaseDesc}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-left flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">{t.importApproCost}</span>
            <span className="text-xs font-black text-amber-400 font-mono">{approUnitCost.toFixed(2)} DA</span>
          </div>
          <Layers className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Insert raw material bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-1">
          <h3 className="text-xs font-black text-slate-300 flex items-center gap-2">
            <Plus className="text-amber-400 w-4 h-4" />
            <span>{t.addMaterialTitle}</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {state.language === 'ar' ? 'تضاف كعمود مستقل متبوعة ببطاقة جرد المخزون الخاص بها تلقائياً.' : 'Created alongside stock ledger tracking blocks.'}
          </p>
        </div>
        <form onSubmit={onAddMaterial} className="flex gap-2 md:col-span-3 w-full">
          <input 
            type="text" 
            value={newMatName} 
            onChange={e => setNewMatName(e.target.value)}
            placeholder={t.materialNamePlaceholder} 
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white flex-1 focus:outline-none focus:border-amber-500"
          />
          <select 
            value={newMatUnit}
            onChange={e => setNewMatUnit(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300"
          >
            <option value="kg">kg</option>
            <option value="m³">m³</option>
            <option value="tonne">T</option>
            <option value="unit">U</option>
          </select>
          <button 
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 rounded-xl transition-all"
          >
            {t.insertInSystem}
          </button>
        </form>
      </div>

      {/* Cost of Purchase Stacked Layout */}
      {state.rawMaterials.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-500 text-xs font-semibold border border-slate-800 space-y-2">
          <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
          <p>{t.noData}</p>
        </div>
      ) : (
        <div className="space-y-10">
          {state.rawMaterials.map((rm, idx) => {
            // Calculations for this specific material
            const basicAmt = rm.purchaseQ * rm.purchaseP;
            
            // Dynamic Direct Expense unit price based on selected mode
            const unitDirectP = rm.directExpenseMode === 'percentage'
              ? rm.purchaseP * ((rm.directExpensePct || 0) / 100)
              : (rm.directExpenseP || 0);
            
            const directAmt = rm.purchaseQ * unitDirectP;
            const indirectAmt = rm.purchaseQ * approUnitCost;
            const grandTotalAmt = basicAmt + directAmt + indirectAmt;
            const unitAmt = rm.purchaseQ > 0 ? (grandTotalAmt / rm.purchaseQ) : 0;

            const combQ = rm.initQ + rm.purchaseQ;
            const combV = rm.initV + grandTotalAmt;
            const cmupVal = calculatedValues.rawMaterialCumps[rm.id] || 0;

            return (
              <motion.div 
                key={rm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden p-6 space-y-6"
              >
                {/* Header with Title and Trash Action */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-black text-slate-200 uppercase tracking-wide">
                      {rm.name} ({rm.unit})
                    </h2>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(t.confirmDelete)) deleteRawMaterial(rm.id);
                    }}
                    className="text-rose-400 hover:text-rose-500 p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-950 transition-all flex items-center gap-1.5 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{state.language === 'ar' ? 'حذف المادة' : 'Delete Material'}</span>
                  </button>
                </div>

                {/* Left/Right Split: Cost Price vs Stocks */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Purchase Cost Table Column */}
                  <div className="xl:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {state.language === 'ar' ? 'جدول تكلفة الشراء المباشر وغير المباشر' : 'Direct & Indirect Purchase Cost Table'}
                    </h3>
                    <div className="border border-slate-800/60 rounded-xl overflow-hidden">
                      <table className="w-full text-center border-collapse text-xs select-none">
                        <thead>
                          <tr className="bg-slate-900 text-slate-300 font-bold">
                            <th className="p-3 text-right max-w-[200px]">{state.language === 'ar' ? 'العنصر التكلفوي' : 'Cost Element'}</th>
                            <th className="p-3 w-24">{t.quantity}</th>
                            <th className="p-3 w-32">{t.unitPrice}</th>
                            <th className="p-3 w-32">{t.amount}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 bg-slate-950/20 font-mono">
                          
                          {/* Row 1: Basic invoice price */}
                          <tr className="hover:bg-slate-900/10">
                            <td className="text-right p-3 font-semibold text-slate-300">{t.basicPurchasePrice}</td>
                            <td className="p-1">
                              <input 
                                type="number"
                                value={rm.purchaseQ}
                                onChange={e => {
                                  const q = parseFloat(e.target.value) || 0;
                                  const updatedDirectP = rm.directExpenseMode === 'percentage' ? rm.purchaseP * ((rm.directExpensePct || 0) / 100) : rm.directExpenseP;
                                  updateRawMaterial(rm.id, { purchaseQ: q, directExpenseP: updatedDirectP });
                                }}
                                className="w-full text-center bg-slate-950 border border-slate-800/80 rounded py-1 px-1.5 text-slate-100 font-bold focus:outline-none"
                              />
                            </td>
                            <td className="p-1">
                              <input 
                                type="number"
                                value={rm.purchaseP}
                                onChange={e => {
                                  const p = parseFloat(e.target.value) || 0;
                                  const updatedDirectP = rm.directExpenseMode === 'percentage' ? p * ((rm.directExpensePct || 0) / 100) : rm.directExpenseP;
                                  updateRawMaterial(rm.id, { purchaseP: p, directExpenseP: updatedDirectP });
                                }}
                                className="w-full text-center bg-slate-950 border border-slate-800/80 rounded py-1 px-1.5 text-slate-100 font-bold focus:outline-none"
                              />
                            </td>
                            <td className="p-1">
                              <input 
                                type="number"
                                value={Math.round(basicAmt)}
                                onChange={e => {
                                  const amt = parseFloat(e.target.value) || 0;
                                  const q = rm.purchaseQ || 1;
                                  const p = amt / q;
                                  const updatedDirectP = rm.directExpenseMode === 'percentage' ? p * ((rm.directExpensePct || 0) / 100) : rm.directExpenseP;
                                  updateRawMaterial(rm.id, { purchaseP: p, directExpenseP: updatedDirectP });
                                }}
                                className="w-full text-center bg-slate-950 border border-slate-800/80 rounded py-1 px-1.5 text-slate-100 font-bold focus:outline-none"
                              />
                            </td>
                          </tr>

                          {/* Row 2: Direct Freight / Logistics */}
                          <tr className="hover:bg-slate-900/10">
                            <td className="text-right p-3 font-semibold flex flex-col gap-1 inline-block">
                              <select 
                                value={rm.directExpenseType}
                                onChange={e => updateRawMaterial(rm.id, { directExpenseType: e.target.value })}
                                className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded p-1 focus:outline-none w-full"
                              >
                                <option value="مصاريف شحن ونقل">مصاريف شحن ونقل (Transportation)</option>
                                <option value="حقوق الجمركة">حقوق الجمركة (Customs Duties)</option>
                                <option value="تأمين السلع">تأمين السلع (Insurance)</option>
                                <option value="أخرى">أخرى (Others)</option>
                              </select>
                              
                              {/* Toggle Amount vs Percentage */}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-slate-500 font-bold">{state.language === 'ar' ? 'طريقة الحساب:' : 'Method:'}</span>
                                <div className="flex bg-slate-950 text-[9px] border border-slate-800 p-0.5 rounded">
                                  <button 
                                    onClick={() => updateRawMaterial(rm.id, { directExpenseMode: 'amount' })}
                                    className={`px-1.5 py-0.5 rounded font-bold ${rm.directExpenseMode !== 'percentage' ? 'bg-amber-600 text-white' : 'text-slate-500'}`}
                                  >
                                    {state.language === 'ar' ? 'مبلغ' : 'Amt'}
                                  </button>
                                  <button 
                                    onClick={() => updateRawMaterial(rm.id, { directExpenseMode: 'percentage' })}
                                    className={`px-1.5 py-0.5 rounded font-bold ${rm.directExpenseMode === 'percentage' ? 'bg-amber-600 text-white' : 'text-slate-500'}`}
                                  >
                                    %
                                  </button>
                                </div>
                              </div>
                            </td>
                            
                            {/* Quantity (same) */}
                            <td className="p-2 text-slate-500">-</td>
                            
                            {/* Editable Unit Price / Pct depending on mode */}
                            <td className="p-1.5">
                              {rm.directExpenseMode === 'percentage' ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-1">
                                    <input 
                                      type="number"
                                      value={rm.directExpensePct || 0}
                                      onChange={e => {
                                        const pct = parseFloat(e.target.value) || 0;
                                        updateRawMaterial(rm.id, { 
                                          directExpensePct: pct,
                                          directExpenseP: rm.purchaseP * (pct / 100)
                                        });
                                      }}
                                      className="w-12 text-center bg-transparent text-slate-100 font-bold focus:outline-none"
                                    />
                                    <span className="text-slate-500 font-bold">%</span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 font-bold">
                                    (= {unitDirectP.toFixed(2)} DA)
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-1">
                                  <input 
                                    type="number"
                                    value={rm.directExpenseP}
                                    onChange={e => {
                                      const pP = parseFloat(e.target.value) || 0;
                                      updateRawMaterial(rm.id, { 
                                        directExpenseP: pP,
                                        directExpensePct: rm.purchaseP > 0 ? (pP / rm.purchaseP) * 100 : 0
                                      });
                                    }}
                                    className="w-20 text-center bg-transparent text-slate-100 font-bold focus:outline-none"
                                  />
                                  <span className="text-slate-500 font-bold-xs">DA</span>
                                </div>
                              )}
                            </td>

                            {/* Cumulative Direct Logistics Line */}
                            <td className="p-1">
                              <input 
                                type="number"
                                value={Math.round(directAmt)}
                                onChange={e => {
                                  const amt = parseFloat(e.target.value) || 0;
                                  const q = rm.purchaseQ || 1;
                                  const unitExpenseP = amt / q;
                                  updateRawMaterial(rm.id, { 
                                    directExpenseP: unitExpenseP,
                                    directExpensePct: rm.purchaseP > 0 ? (unitExpenseP / rm.purchaseP) * 100 : 0 // Back-calculate percent or unit P
                                  });
                                }}
                                className="w-full text-center bg-slate-950 border border-slate-800/80 rounded py-1 px-1.5 text-slate-100 font-bold focus:outline-none"
                              />
                            </td>
                          </tr>

                          {/* Row 3: Indirect Appro load */}
                          <tr className="bg-amber-950/5 text-amber-500 hover:bg-slate-900/10">
                            <td className="text-right p-3 font-semibold flex items-center justify-start gap-1">
                              <Tag className="w-3.5 h-3.5 inline" />
                              <span>{t.indirectApproExpenses}</span>
                            </td>
                            <td className="p-2 border-r border-slate-805/10 font-bold text-slate-300">{rm.purchaseQ}</td>
                            <td className="p-2 border-r border-slate-805/10 font-bold text-center">{approUnitCost.toFixed(2)}</td>
                            <td className="p-3 font-black">
                              {Math.round(indirectAmt).toLocaleString()}
                            </td>
                          </tr>

                          {/* Row 4: Total Cost cumulative */}
                          <tr className="bg-amber-950/20 font-black text-amber-300 text-[13px] border-t-2 border-amber-900">
                            <td className="text-right p-3.5 italic">{t.totalPurchaseCost}</td>
                            <td className="p-3 text-slate-200">{rm.purchaseQ.toLocaleString()}</td>
                            <td className="p-3 text-amber-400">{unitAmt.toFixed(2)}</td>
                            <td className="p-3 font-black text-white">
                              {Math.round(grandTotalAmt).toLocaleString()}
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side: Stock movement cards for CMUP */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t.stockMovementCard}
                    </h3>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4.5 space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.initStockQ}</label>
                          <input 
                            type="number"
                            value={rm.initQ}
                            onChange={e => updateRawMaterial(rm.id, { initQ: parseFloat(e.target.value) || 0 })}
                            className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-teal-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">{t.initStockV}</label>
                          <input 
                            type="number"
                            value={rm.initV}
                            onChange={e => updateRawMaterial(rm.id, { initV: parseFloat(e.target.value) || 0 })}
                            className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-teal-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t.totalInputsAvailable}</span>
                          <span className="font-bold text-slate-300">{combQ.toLocaleString()} {rm.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-505 text-slate-500">{t.totalValueAvailable}</span>
                          <span className="font-bold text-slate-300">{Math.round(combV).toLocaleString()} DA</span>
                        </div>
                        
                        <div className="flex justify-between border-t border-slate-800/80 mt-3 pt-2.5 items-center">
                          <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-teal-400" />
                            <span>{t.cmupResult}:</span>
                          </span>
                          <span className="text-sm font-black text-white bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-500/20">
                            {cmupVal.toFixed(2)} <span className="text-[10px] text-emerald-500">DA</span>
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
