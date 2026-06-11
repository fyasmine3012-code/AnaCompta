import React from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { TrendingUp, TrendingDown, Award, PieChart, Info, Settings, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const GlobalSynthesis: React.FC = () => {
  const { 
    state, 
    updateState, 
    calculatedValues 
  } = useApp();

  const t = locales[state.language];

  const sum = calculatedValues.corporateSummary;
  const isLoss = sum.netCorporateProfit < 0;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center shadow-lg">
            <PieChart className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-400">
              {t.synthesisTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.synthesisDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main Aggregated Table */}
      <div className="glass-panel rounded-2xl p-6 border-2 border-indigo-500/20 shadow-2xl space-y-4">
        <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
          <h2 className="text-sm font-black text-indigo-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>{state.language === 'ar' ? 'الجدول الختامي لتحديد النتيجة الصافية الإجمالية للمؤسسة' : 'Final Corporate Analytic Net Income'}</span>
          </h2>
          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            SCF (Système Comptable Financier)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs select-none">
            <thead>
              <tr className="bg-indigo-950/40 text-slate-200 border-b border-slate-800/80">
                <th className="p-3 text-right font-bold min-w-[200px]">{state.language === 'ar' ? 'العناصر الهيكلية الأساسية' : 'Corporate Accounts / Margin Summary'}</th>
                {state.products.map(p => (
                  <th key={p.id} className="p-3 w-36 font-semibold border-r border-slate-800">{p.name}</th>
                ))}
                <th className="p-3 w-44 bg-slate-900/60 font-black border-r border-slate-800">{state.language === 'ar' ? 'المجموع الإجمالي (Total)' : 'Cumulative totals'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {/* Gross Sales Turnover */}
              <tr className="hover:bg-slate-900/10">
                <td className="text-right p-3 font-semibold text-slate-300">{t.corporateSalesSummary}</td>
                {state.products.map(p => {
                  const res = calculatedValues.netResults[p.id]?.revenue || 0;
                  return (
                    <td key={p.id} className="p-2 border-r border-slate-800/40 text-slate-300">{Math.round(res).toLocaleString()}</td>
                  );
                })}
                <td className="p-2 font-black text-white bg-slate-900/40 border-r border-slate-800">
                  {Math.round(sum.totalSales).toLocaleString()}
                </td>
              </tr>

              {/* Cumulative Cost Price */}
              <tr className="hover:bg-slate-900/10">
                <td className="text-right p-3 font-semibold text-slate-300">{t.corporateCostPriceSummary}</td>
                {state.products.map(p => {
                  const cp = calculatedValues.netResults[p.id]?.totalCostPrice || 0;
                  return (
                    <td key={p.id} className="p-2 border-r border-slate-800/40 text-slate-400">{Math.round(cp).toLocaleString()}</td>
                  );
                })}
                <td className="p-2 font-black text-slate-300 bg-slate-900/40 border-r border-slate-800">
                  {Math.round(sum.totalCostPrice).toLocaleString()}
                </td>
              </tr>

              {/* Net Product Margin Result */}
              <tr className="bg-slate-900/30 font-bold text-amber-400">
                <td className="text-right p-3.5 text-amber-500">{t.corporateNetAnalyticSummary}</td>
                {state.products.map(p => {
                  const r = calculatedValues.netResults[p.id]?.analyticMarge || 0;
                  return (
                    <td key={p.id} className={`p-2 border-r border-slate-800/40 font-bold ${r < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {Math.round(r).toLocaleString()}
                    </td>
                  );
                })}
                <td className="p-2 font-black text-amber-400 bg-slate-900/60 text-sm border-r border-slate-800">
                  {Math.round(sum.netProductResult).toLocaleString()}
                </td>
              </tr>

              {/* Supplementary Costs */}
              <tr className="border-t-2 border-slate-800/80">
                <td className="text-right p-3 text-emerald-400 font-semibold italic">{t.suppChargesLabel}</td>
                <td colSpan={state.products.length} className="bg-slate-950/10 text-slate-500 text-[10px] hover:text-slate-400 transition-all font-sans text-right italic p-3">
                  {state.language === 'ar' 
                    ? '* تخص تغطية تسيير فوائد رأس المال وعناصر تقديرية كأعباء إضافية للمؤسسة ككل.' 
                    : '* Corporate-wide supplementary factors regarding capital or administrative evaluation.'}
                </td>
                <td className="p-1 bg-slate-900 border-r border-slate-800">
                  <input 
                    type="number"
                    value={state.globalSupp}
                    onChange={e => updateState({ globalSupp: parseFloat(e.target.value) || 0 })}
                    className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </td>
              </tr>

              {/* Non-incorporable costs */}
              <tr>
                <td className="text-right p-3 text-rose-405 text-rose-400 font-semibold italic">{t.nonIncChargesLabel}</td>
                <td colSpan={state.products.length} className="bg-slate-950/10 text-slate-500 text-[10px] hover:text-slate-400 transition-all font-sans text-right italic p-3">
                  {state.language === 'ar'
                    ? '* تشمل الغرامات وعقوبات الضرائب والاهتلاكات الاستثنائية التي تقصى من تكلفة المنفعة.'
                    : '* Exceptional write-offs, taxes, or penalties excluded from operational costs.'}
                </td>
                <td className="p-1 bg-slate-900 border-r border-slate-800">
                  <input 
                    type="number"
                    value={state.globalNonInc}
                    onChange={e => updateState({ globalNonInc: parseFloat(e.target.value) || 0 })}
                    className="w-full text-center bg-slate-950 border border-slate-800 rounded p-1.5 text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                  />
                </td>
              </tr>

              {/* Highly styled Certifier Outcome Row */}
              <tr className={`border-t-4 border-slate-700 font-black transition-all ${
                isLoss ? 'bg-rose-950/20 text-rose-400' : 'bg-emerald-950/20 text-emerald-400'
              }`}>
                <td className="text-right p-4 text-xs font-black flex items-center gap-2 text-white">
                  {isLoss ? <TrendingDown className="w-5 h-5 text-rose-400" /> : <TrendingUp className="w-5 h-5 text-emerald-400" />}
                  <span>{isLoss ? t.perteMessage : t.beneficeMessage}</span>
                </td>
                <td colSpan={state.products.length} className="bg-slate-950/35"></td>
                <td className="bg-slate-950/80 p-3 text-base font-black text-center font-mono border-r border-slate-800">
                  {Math.round(sum.netCorporateProfit).toLocaleString()} <span className="text-xs">DA</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Industrial Benchmark Reports */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>{t.globalReportTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Material Cost Benchmarks */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {state.language === 'ar' ? 'تقرير تكلفة شراء وإمدادات المواد الأولية' : 'Raw Materials Procurement Cost Benchmarks'}
            </h4>
            <div className="space-y-2 pt-1">
              {state.rawMaterials.map(rm => {
                const cump = calculatedValues.rawMaterialCumps[rm.id] || 0;
                return (
                  <div key={rm.id} className="flex justify-between items-center text-xs p-2 bg-slate-950/30 rounded-lg border border-slate-900/50">
                    <span className="text-slate-300 font-semibold">{rm.name}</span>
                    <span className="font-mono font-bold text-amber-500">{cump.toFixed(2)} DA / {rm.unit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Finished Product Production unit cost Benchmarks */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {state.language === 'ar' ? 'تقرير التكلفة والـ CMUP الصناعي للمنتجات تامة الصنع' : 'Finished Goods Cost of Production & CMUP'}
            </h4>
            <div className="space-y-2 pt-1">
              {state.products.map(p => {
                const cump = calculatedValues.finishedGoodsCumps[p.id] || 0;
                const unitCost = calculatedValues.productCosts[p.id]?.unitProductionCost || 0;
                return (
                  <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-slate-950/30 rounded-lg border border-slate-900/50">
                    <span className="text-slate-300 font-semibold">{p.name}</span>
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-500 block">{state.language === 'ar' ? 'تكلفة الإنتاج:' : 'Prod Cost:'} {unitCost.toFixed(2)} DA</span>
                      <span className="font-bold text-indigo-400">CMUP: {cump.toFixed(2)} DA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
