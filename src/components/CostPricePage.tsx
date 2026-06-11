import React from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { Scaling, TrendingUp, TrendingDown, Layers, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

export const CostPricePage: React.FC = () => {
  const { 
    state, 
    updateProduct, 
    calculatedValues 
  } = useApp();

  const t = locales[state.language];

  const commUnitCost = calculatedValues.trciTotals.unitCosts['comm'] || 0;

  return (
    <div className="space-y-6">
      {/* Title block with static metric */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center shadow-lg">
            <Calculator className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-400">
              {t.costPriceTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.costPriceDesc}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-left flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 block font-bold">{state.language === 'ar' ? 'أعباء التوزيع غير المباشرة (التجاري) المستوردة:' : 'Imported Commercial UO Cost:'}</span>
            <span className="text-xs font-black text-teal-400">{commUnitCost.toFixed(2)} DA</span>
          </div>
          <Layers className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {state.products.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-500 text-xs font-semibold border border-slate-800 space-y-2">
          <Calculator className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
          <p>{t.noData}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {state.products.map(p => {
            const results = calculatedValues.netResults[p.id] || { 
              costOfSales: 0, 
              distributionCost: 0, 
              totalCostPrice: 0, 
              revenue: 0, 
              analyticMarge: 0 
            };

            const prodCmupOnSale = calculatedValues.finishedGoodsCumps[p.id] || 0;
            const isProductLoss = results.analyticMarge < 0;

            const hasOverrides = 
              p.overrideCostOfSales !== undefined || 
              p.overrideDistributionCost !== undefined || 
              p.overrideTotalCostPrice !== undefined || 
              p.overrideRevenue !== undefined || 
              p.overrideAnalyticMarge !== undefined;

            return (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-6"
              >
                {/* Header Product description and manual toggle warning */}
                <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                      <Scaling className="w-4 h-4 text-indigo-400" />
                      <span>{t.costPriceElements} {p.name}</span>
                    </h3>
                    <div className="flex gap-2 mt-1.5 items-center">
                      <span className="text-[10px] text-slate-500 font-bold">{state.language === 'ar' ? 'التكلفة المعيارية المستهدفة:' : 'Target Standard Cost (Variance):'}</span>
                      <input 
                        type="number"
                        placeholder="e.g. 500"
                        value={p.standardUnitCost || ""}
                        onChange={e => updateProduct(p.id, { standardUnitCost: parseFloat(e.target.value) || undefined })}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-center font-bold text-amber-400 font-mono w-20 text-[11px] focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 font-bold">{state.language === 'ar' ? 'دج/وحدة' : 'DA/unit'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Override Reset alert banner */}
                    {hasOverrides && (
                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold text-amber-400">
                        <span>⚠️ {state.language === 'ar' ? 'تعديل يدوي نشط' : 'Manual Overrides Active'}</span>
                        <button 
                          onClick={() => updateProduct(p.id, {
                            overrideCostOfSales: undefined,
                            overrideDistributionCost: undefined,
                            overrideTotalCostPrice: undefined,
                            overrideRevenue: undefined,
                            overrideAnalyticMarge: undefined
                          })}
                          className="bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 px-2 py-0.5 rounded transition-all text-[9.5px]"
                        >
                          {state.language === 'ar' ? 'إعادة الحساب الآلي' : 'Reset to Formula'}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400 font-bold">{t.soldQuantity}:</label>
                      <input 
                        type="number"
                        value={p.quantitySold}
                        onChange={e => updateProduct(p.id, { quantitySold: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-800 text-white font-bold rounded-lg px-3 py-1.5 w-24 text-center text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Left Side: Cost Price calculation table */}
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider">{state.language === 'ar' ? 'جدول سعر التكلفة الإجمالي (Coût de Revient)' : 'Total Cost Price Structure'}</h4>
                    <table className="w-full text-center border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                          <th className="text-right p-3">{state.language === 'ar' ? 'عناصر سعر التكلفة' : 'Cost Price Components'}</th>
                          <th className="w-20">Q</th>
                          <th className="w-24">P.U</th>
                          <th className="w-32">{state.language === 'ar' ? 'المبلغ (قابل للتعديل)' : 'Amount (Editable)'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Cost of production of sold items */}
                        <tr className="hover:bg-slate-900/10 border-b border-slate-800/30">
                          <td className="text-right p-3 text-slate-300">{t.prodCostSoldGoods}</td>
                          <td className="p-2 text-slate-400">{p.quantitySold.toLocaleString()}</td>
                          <td className="p-2 text-indigo-400 font-bold">{prodCmupOnSale.toFixed(2)}</td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.overrideCostOfSales !== undefined ? p.overrideCostOfSales : Math.round(results.costOfSales)}
                              onChange={e => updateProduct(p.id, { overrideCostOfSales: parseFloat(e.target.value) || 0 })}
                              className={`w-full text-center bg-slate-950 border rounded p-1 text-slate-100 font-bold focus:outline-none ${p.overrideCostOfSales !== undefined ? 'border-amber-500/80 text-amber-400' : 'border-slate-800'}`}
                            />
                          </td>
                        </tr>

                        {/* Indirect commercial loads */}
                        <tr className="hover:bg-slate-900/10 border-b border-slate-800/30">
                          <td className="text-right p-3 text-slate-300">{t.distributionCommercialExpenses}</td>
                          <td className="p-2 text-slate-400">{p.quantitySold.toLocaleString()}</td>
                          <td className="p-2 text-emerald-400 font-bold">{commUnitCost.toFixed(2)}</td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.overrideDistributionCost !== undefined ? p.overrideDistributionCost : Math.round(results.distributionCost)}
                              onChange={e => updateProduct(p.id, { overrideDistributionCost: parseFloat(e.target.value) || 0 })}
                              className={`w-full text-center bg-slate-950 border rounded p-1 text-slate-100 font-bold focus:outline-none ${p.overrideDistributionCost !== undefined ? 'border-amber-500/80 text-amber-400' : 'border-slate-800'}`}
                            />
                          </td>
                        </tr>

                        {/* Total Cost Price cumulative */}
                        <tr className="bg-indigo-950/20 font-black text-indigo-300 border-t border-slate-700">
                          <td className="text-right p-3">{t.totalCostPriceLabel}</td>
                          <td className="p-2 text-slate-200">{p.quantitySold.toLocaleString()}</td>
                          <td className="p-2 text-amber-400">{(results.totalCostPrice / (p.quantitySold || 1)).toFixed(2)}</td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.overrideTotalCostPrice !== undefined ? p.overrideTotalCostPrice : Math.round(results.totalCostPrice)}
                              onChange={e => updateProduct(p.id, { overrideTotalCostPrice: parseFloat(e.target.value) || 0 })}
                              className={`w-full text-center bg-indigo-900/20 border rounded p-1 text-slate-100 font-black focus:outline-none ${p.overrideTotalCostPrice !== undefined ? 'border-amber-500/80 text-amber-400' : 'border-slate-800/60'}`}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right Side: Analytical profit & margin table */}
                  <div>
                    <h4 className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider">{state.language === 'ar' ? 'حساب النتيجة التحليلية للمنتج (Résultat Analytique)' : 'Analytical Income & Margins'}</h4>
                    <table className="w-full text-center border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                          <th className="text-right p-3">{state.language === 'ar' ? 'المبيعات والربحية' : 'Revenues & Profitability'}</th>
                          <th className="w-20">Q</th>
                          <th className="w-24">P.U</th>
                          <th className="w-32">{state.language === 'ar' ? 'المبلغ (قابل للتعديل)' : 'Amount (Editable)'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Sold price revenue */}
                        <tr className="hover:bg-slate-900/10 border-b border-slate-800/30">
                          <td className="text-right p-3 text-slate-300">{t.sellingRevenueLabel}</td>
                          <td className="p-2 text-slate-400">{p.quantitySold.toLocaleString()}</td>
                          <td className="p-1">
                            {/* Selling Price is dynamically editable directly in the row */}
                            <input 
                              type="number"
                              value={p.sellingPrice}
                              onChange={e => updateProduct(p.id, { sellingPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1 text-slate-100 font-bold focus:outline-none"
                            />
                          </td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.overrideRevenue !== undefined ? p.overrideRevenue : Math.round(results.revenue)}
                              onChange={e => updateProduct(p.id, { overrideRevenue: parseFloat(e.target.value) || 0 })}
                              className={`w-full text-center bg-slate-950 border rounded p-1 text-slate-100 font-bold focus:outline-none ${p.overrideRevenue !== undefined ? 'border-amber-500/80 text-amber-400' : 'border-slate-800'}`}
                            />
                          </td>
                        </tr>

                        {/* Subtracted Cost price */}
                        <tr className="hover:bg-slate-900/15 border-b border-slate-800/30 italic text-slate-400">
                          <td className="text-right p-3 pl-4">{t.lessCostPrice}</td>
                          <td className="p-2">{p.quantitySold.toLocaleString()}</td>
                          <td className="p-2">{(results.totalCostPrice / (p.quantitySold || 1)).toFixed(2)}</td>
                          <td className="p-2 text-slate-300 font-bold">{Math.round(results.totalCostPrice).toLocaleString()}</td>
                        </tr>

                        {/* Net analytical outcome row representation */}
                        <tr className={`font-black ${
                          isProductLoss ? 'bg-rose-950/15 text-rose-400' : 'bg-emerald-950/15 text-emerald-400'
                        } border-t border-slate-700`}>
                          <td className="text-right p-3 flex items-center gap-1.5">
                            {isProductLoss ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                            <span>{t.netProductResult}</span>
                          </td>
                          <td className="p-2 text-slate-200">{p.quantitySold.toLocaleString()}</td>
                          <td className="p-2">{(results.analyticMarge / (p.quantitySold || 1)).toFixed(2)}</td>
                          <td className="p-1">
                            <input 
                              type="number"
                              value={p.overrideAnalyticMarge !== undefined ? p.overrideAnalyticMarge : Math.round(results.analyticMarge)}
                              onChange={e => updateProduct(p.id, { overrideAnalyticMarge: parseFloat(e.target.value) || 0 })}
                              className={`w-full text-center font-black rounded p-1 focus:outline-none bg-slate-950 ${isProductLoss ? 'text-rose-400' : 'text-emerald-400'} ${p.overrideAnalyticMarge !== undefined ? 'border border-amber-500' : 'border border-slate-800'}`}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
