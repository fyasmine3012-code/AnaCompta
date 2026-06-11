import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { Factory, Plus, Trash2, CheckSquare, Square, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductionPage: React.FC = () => {
  const { 
    state, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    calculatedValues 
  } = useApp();

  const t = locales[state.language];

  // Form states for creating products
  const [newProdName, setNewProdName] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('unité');

  const onAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    
    // Create product with default empty lists
    const consumedMaterials: Record<string, number> = {};
    if (state.rawMaterials[0]) {
      consumedMaterials[state.rawMaterials[0].id] = 1; // Default consume 1 unit
    }

    const activeWorkshops: Record<string, boolean> = {};
    const workshopQ: Record<string, number> = {};
    
    state.workshops.forEach(w => {
      if (w.type === 'main' && w.id !== 'appro' && w.id !== 'comm') {
        activeWorkshops[w.id] = true;
        workshopQ[w.id] = 100; // default UO count
      }
    });

    addProduct({
      name: newProdName,
      unit: newProdUnit,
      initQ: 0,
      initV: 0,
      consumedMaterials,
      modQ: 100,
      modP: 150,
      activeWorkshops,
      workshopQ,
      productionVolume: 500,
      quantitySold: 400,
      sellingPrice: 1000
    });

    setNewProdName('');
  };

  const costW1 = calculatedValues.trciTotals.unitCosts['atel1'] || 0;
  const costW2 = calculatedValues.trciTotals.unitCosts['atel2'] || 0;

  return (
    <div className="space-y-6">
      {/* Title / Metric overview row */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col lg:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Factory className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400">
              {t.prodTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.prodDesc}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-left">
            <span className="text-[9px] text-amber-500 block font-bold">{t.importedCmupMat}</span>
            <span className="font-bold text-slate-200">
              {state.rawMaterials[0] 
                ? `${state.rawMaterials[0].name.split('/')[0]}: ${(calculatedValues.rawMaterialCumps[state.rawMaterials[0].id] || 0).toFixed(2)} DA` 
                : '-'}
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-left">
            <span className="text-[9px] text-emerald-400 block font-bold">{t.workshop1Cost}</span>
            <span className="font-bold text-emerald-400">{costW1.toFixed(2)} DA</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-left">
            <span className="text-[9px] text-emerald-400 block font-bold">{t.workshop2Cost}</span>
            <span className="font-bold text-emerald-400">{costW2.toFixed(2)} DA</span>
          </div>
        </div>
      </div>

      {/* Insert product study bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 block mb-1">{t.newProductTitle}</label>
          <input 
            type="text" 
            value={newProdName}
            onChange={e => setNewProdName(e.target.value)}
            placeholder={t.newProductNamePlaceholder} 
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white w-full focus:outline-none focus:border-indigo-505 focus:border-indigo-500"
          />
        </div>
        <div className="w-full md:w-48">
          <label className="text-xs font-bold text-slate-400 block mb-1">{t.primaryUnit}</label>
          <select 
            value={newProdUnit}
            onChange={e => setNewProdUnit(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 w-full focus:outline-none"
          >
            <option value="unité">unité</option>
            <option value="kg">kg</option>
            <option value="ton">ton</option>
            <option value="batch">batch</option>
          </select>
        </div>
        <div className="pt-5 w-full md:w-auto">
          <button 
            onClick={onAddProduct}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all w-full flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>{t.buildProdTable}</span>
          </button>
        </div>
      </div>

      {/* Products calculation blocks */}
      {state.products.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-500 text-xs font-semibold border border-slate-800 space-y-2 shadow-xl">
          <Factory className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-400 animate-pulse" />
          <p>{t.noData}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {state.products.map(p => {
            const costs = calculatedValues.productCosts[p.id] || { 
              rawMaterialCost: 0, 
              modCost: 0, 
              workshopCost: 0, 
              totalProductionCost: 0, 
              unitProductionCost: 0 
            };

            const fgCmup = calculatedValues.finishedGoodsCumps[p.id] || 0;
            const combQ = p.initQ + p.productionVolume;
            const combV = p.initV + costs.totalProductionCost;

            return (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden"
              >
                {/* Header detail */}
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <h2 className="text-base font-black text-indigo-400 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span>{state.language === 'ar' ? 'حساب تكلفة إنتاج' : 'Production Cost calculation'}: {p.name} ({p.unit})</span>
                  </h2>
                  <button 
                    onClick={() => {
                      if (confirm(t.confirmDelete)) deleteProduct(p.id);
                    }}
                    className="text-rose-400 hover:text-rose-500 hover:scale-105 transition-all bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.delete}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Grid 1-2: Costs Allocation table */}
                  <div className="lg:col-span-2 overflow-x-auto">
                    <table className="w-full text-center border-collapse text-xs select-none font-mono">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                          <th className="text-right p-3.5 min-w-[220px]">{t.productionElements}</th>
                          <th className="w-24">{t.quantity}</th>
                          <th className="w-28">{t.unitPrice}</th>
                          <th className="w-32">{t.amount}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Raw materials row block */}
                        <tr className="bg-slate-950/20">
                          <td colSpan={4} className="text-right p-2.5 font-bold text-amber-500/95 bg-slate-900/10 border-b border-slate-800/40">
                            {t.consumedMaterialsLabel}
                          </td>
                        </tr>

                        {state.rawMaterials.map(rm => {
                          const isActive = p.activeMaterials ? p.activeMaterials[rm.id] !== false : true;
                          const consumedRatio = p.consumedMaterials[rm.id] || 0;
                          const calculatedConsumedQty = consumedRatio * p.productionVolume;
                          const matCmup = calculatedValues.rawMaterialCumps[rm.id] || 0;
                          const costAmount = isActive ? (calculatedConsumedQty * matCmup) : 0;

                          return (
                            <tr key={rm.id} className={`transition-all ${isActive ? 'hover:bg-slate-900/10' : 'opacity-45 bg-slate-950/40 grayscale'}`}>
                              <td className="text-right p-3 pl-4">
                                <div className="flex items-center gap-2 select-none">
                                  <button
                                    type="button" 
                                    onClick={() => {
                                      const activeMap = { ...(p.activeMaterials || {}) };
                                      activeMap[rm.id] = !isActive;
                                      updateProduct(p.id, { activeMaterials: activeMap });
                                    }}
                                    className="text-amber-500 hover:scale-105 transition-all focus:outline-none"
                                  >
                                    {isActive ? (
                                      <CheckSquare className="w-4 h-4 text-amber-500" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-600" />
                                    )}
                                  </button>
                                  <span className={`font-semibold ${isActive ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                                    {rm.name} <span className="text-[10px] text-slate-500">({rm.unit} {state.language === 'ar' ? 'لكل وحدة منتج' : 'per unit'})</span>
                                  </span>
                                </div>
                              </td>
                              <td className="p-1">
                                {isActive ? (
                                  <div className="flex items-center justify-center gap-1">
                                    {/* User inputs the allocation ratio per finished good item */}
                                    <input 
                                      type="number"
                                      value={consumedRatio}
                                      onChange={e => {
                                        const updatedRatio = { ...p.consumedMaterials };
                                        updatedRatio[rm.id] = parseFloat(e.target.value) || 0;
                                        updateProduct(p.id, { consumedMaterials: updatedRatio });
                                      }}
                                      className="w-16 text-center bg-slate-950 border border-slate-800 rounded p-1 text-slate-100 font-bold focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-500">→ {Math.round(calculatedConsumedQty).toLocaleString()}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="p-2 font-bold text-slate-300 text-center">
                                {isActive ? matCmup.toFixed(2) : ""}
                              </td>
                              <td className="p-2 font-black text-slate-100 text-center">
                                {isActive ? Math.round(costAmount).toLocaleString() : ""}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Direct labor MOD */}
                        <tr className="bg-slate-950/20 border-t border-slate-800/60 font-bold">
                          <td className="text-right p-3 text-indigo-400 pl-4">{t.directLaborLabel}</td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.modQ}
                              onChange={e => updateProduct(p.id, { modQ: parseFloat(e.target.value) || 0 })}
                              className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1 text-slate-100 font-bold focus:outline-none"
                            />
                          </td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.modP}
                              onChange={e => updateProduct(p.id, { modP: parseFloat(e.target.value) || 0 })}
                              className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1 text-slate-100 font-bold focus:outline-none"
                            />
                          </td>
                          <td className="p-2 text-indigo-300 font-black text-center">
                            {Math.round(p.modQ * p.modP).toLocaleString()}
                          </td>
                        </tr>

                        {/* Primary workshops row blocks */}
                        <tr className="bg-slate-950/20">
                          <td colSpan={4} className="text-right p-2.5 font-bold text-emerald-400/90 bg-slate-900/10 border-t border-b border-slate-800/40">
                            {state.language === 'ar' ? 'الأعباء غير المباشرة للورشات (مستوردة من TRCI)' : 'Indirect Workshop Cost Allocation (TRCI Synergized)'}
                          </td>
                        </tr>

                        {state.workshops.filter(w => w.type === 'main' && w.id !== 'appro' && w.id !== 'comm').map(w => {
                          const isActive = p.activeWorkshops[w.id] !== false; // Active by default
                          const uoCost = calculatedValues.trciTotals.unitCosts[w.id] || 0;
                          const spentQ = p.workshopQ[w.id] || 0;
                          const finalWAmount = isActive ? (spentQ * uoCost) : 0;

                          return (
                            <tr 
                              key={w.id} 
                              className={`transition-all ${
                                isActive ? 'hover:bg-slate-900/15' : 'opacity-40 bg-slate-950/50 grayscale'
                              }`}
                            >
                              <td className="text-right p-3 flex items-center gap-2 select-none">
                                <button
                                  type="button" 
                                  onClick={() => {
                                    const activeMap = { ...p.activeWorkshops };
                                    activeMap[w.id] = !isActive;
                                    updateProduct(p.id, { activeWorkshops: activeMap });
                                  }}
                                  className="text-indigo-400 hover:scale-105 transition-all"
                                >
                                  {isActive ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-600" />
                                  )}
                                </button>
                                <span className={`font-semibold ${isActive ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                                  {w.name}
                                </span>
                              </td>
                              <td className="p-1">
                                <input 
                                  type="number"
                                  value={spentQ}
                                  disabled={!isActive}
                                  onChange={e => {
                                    const qSpentMap = { ...p.workshopQ };
                                    qSpentMap[w.id] = parseFloat(e.target.value) || 0;
                                    updateProduct(p.id, { workshopQ: qSpentMap });
                                  }}
                                  className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1 text-slate-100 font-bold focus:outline-none disabled:opacity-30"
                                />
                              </td>
                              <td className="p-2 font-bold text-emerald-400 text-center">
                                {isActive ? uoCost.toFixed(2) : '-'}
                              </td>
                              <td className="p-2 font-black text-slate-200 text-center">
                                {isActive ? Math.round(finalWAmount).toLocaleString() : '0'}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Produced outputs Volume input section */}
                        <tr className="bg-indigo-950/25 border-t-2 border-indigo-900">
                          <td className="text-right p-3.5 font-bold text-indigo-300">{t.productionVolumeLabel}</td>
                          <td colSpan={3} className="p-1.5 pl-4 pr-4">
                            <input 
                              type="number"
                              value={p.productionVolume}
                              onChange={e => updateProduct(p.id, { productionVolume: parseFloat(e.target.value) || 0 })}
                              placeholder={t.enterProdVolume}
                              className="w-full text-center bg-slate-950 border border-indigo-500/30 rounded-xl p-2 font-black text-sm text-indigo-400 focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                        </tr>

                        {/* Final row block */}
                        <tr className="bg-indigo-900/40 text-[13px] font-black text-indigo-200">
                          <td className="text-right p-3">{t.totalProductionCost}</td>
                          <td className="p-3 text-slate-200 font-mono">{p.productionVolume.toLocaleString()}</td>
                          <td className="p-3 text-amber-400 font-black">{costs.unitProductionCost.toFixed(2)}</td>
                          <td className="p-3 text-white font-black">{Math.round(costs.totalProductionCost).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Stock movement ledger for this finished product */}
                  <div className="space-y-4">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-4">
                      <div className="border-b border-slate-800 pb-2 flex justify-between items-center text-xs font-bold text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span>{t.finishedGoodsStockCard}</span>
                        </span>
                        <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {p.unit}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">{t.initStockQ}</label>
                          <input 
                            type="number"
                            value={p.initQ}
                            onChange={e => updateProduct(p.id, { initQ: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                            className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-teal-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">{t.initStockV}</label>
                          <input 
                            type="number"
                            value={p.initV}
                            onChange={e => updateProduct(p.id, { initV: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                            className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-teal-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>{t.totalAvailableForSaleQ}</span>
                          <span className="font-bold text-white">{combQ.toLocaleString()} {p.unit}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>{t.totalAvailableForSaleV}</span>
                          <span className="font-bold text-white">{Math.round(combV).toLocaleString()} DA</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-800 pt-2.5 mt-2.5 font-black">
                          <span className="text-emerald-400 flex items-center gap-1 text-xs">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-emerald-500" />
                            <span>{t.finishedGoodsCmup}:</span>
                          </span>
                          <span className="bg-emerald-950/60 text-white px-2.5 py-1 rounded border border-emerald-500/20 text-xs">
                            {fgCmup.toFixed(2)} <span className="text-[10px] text-emerald-500">DA</span>
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
