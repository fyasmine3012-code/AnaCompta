import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Layers, 
  Box, 
  Activity, 
  Percent, 
  Target, 
  AlertTriangle,
  Flame,
  CheckCircle,
  TrendingUp as ProfitIcon,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { state, updateProduct, calculatedValues } = useApp();
  const t = locales[state.language];

  const sum = calculatedValues.corporateSummary;
  const isLoss = sum.netCorporateProfit < 0;

  // Calculate Profit Margin Ratio (نسبة هامش الربح)
  const marginRatio = sum.totalSales > 0 ? (sum.netCorporateProfit / sum.totalSales) * 105 : 0;
  // Let's cap margin ratio to realistic scale or let it render naturally
  const displayMarginRatio = sum.totalSales > 0 ? (sum.netCorporateProfit / sum.totalSales) * 100 : 0;

  // Compute stats
  const activeMatCount = state.rawMaterials.length;
  const activeProdCount = state.products.length;
  const activeWshCount = state.workshops.filter(w => w.type === 'main').length;

  // 1. Data Integrity Warnings
  const warnings: string[] = [];
  state.trciRows.forEach(row => {
    if (row.isActive && row.type === 'indirect') {
      const rowSum = Object.values(row.pcts).reduce((a: number, b: any) => a + Number(b), 0) as number;
      if (Math.abs(rowSum - 100) > 0.01) {
        warnings.push(`${state.language === 'ar' ? 'اختلال التوزيع في حساب الأعباء غير المباشرة' : 'Allocation mismatch for account'} ${row.accountCode}: ${rowSum}%`);
      }
    }
  });

  state.rawMaterials.forEach(rm => {
    const cmup = calculatedValues.rawMaterialCumps[rm.id] || 0;
    if (cmup === 0 && rm.purchaseQ > 0) {
      warnings.push(`${state.language === 'ar' ? 'قيمة مخزون المادة الأولية مساوية للصفر' : 'Zero inventory ledger valuation for raw material'} ${rm.name}`);
    }
  });

  // 2. Waste & Loss Pie Chart Calculations (دائرة نسبية)
  // Calculate scrap weight per product = production volume * (wastePercentage / 100)
  const productsWithWaste = state.products.map(p => {
    const rate = p.wastePercentage || 0;
    const wasteVol = p.productionVolume * (rate / 100);
    return {
      id: p.id,
      name: p.name,
      rate,
      wasteVol
    };
  });

  const totalWasteVol = productsWithWaste.reduce((acc, current) => acc + current.wasteVol, 0);

  // Stacking slices for dynamic SVG Pie Chart
  let accumulatedPercent = 0;
  const colors = ['#f59e0b', '#6366f1', '#10b981', '#ef4444', '#06b6d4', '#ec4899'];
  const pieSlices = productsWithWaste
    .filter(p => p.wasteVol > 0)
    .map((p, index) => {
      const share = totalWasteVol > 0 ? p.wasteVol / totalWasteVol : 0;
      const startAngle = accumulatedPercent * 360;
      accumulatedPercent += share;
      const endAngle = accumulatedPercent * 360;

      const radius = 50;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (share * circumference);
      const rotation = startAngle - 90; // Rotate starting point to top
      const color = colors[index % colors.length];

      return {
        ...p,
        share,
        circumference,
        strokeDashoffset,
        rotation,
        color
      };
    });

  // 3. Product Performance classification (الأعلى ربحية vs الأقل ربحية)
  const performanceList = state.products.map(p => {
    const results = calculatedValues.netResults[p.id] || { revenue: 0, totalCostPrice: 0, analyticMarge: 0 };
    const marginPct = results.revenue > 0 ? (results.analyticMarge / results.revenue) * 100 : 0;
    return {
      id: p.id,
      name: p.name,
      margin: results.analyticMarge,
      marginPct
    };
  }).sort((a, b) => b.margin - a.margin);

  const bestProducts = performanceList.filter(p => p.margin > 0);
  const deficientProducts = performanceList.filter(p => p.margin <= 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide">{t.overview}</h2>
          <p className="text-xs text-slate-400 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400 shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t.systemLive}</span>
        </div>
      </div>

      {/* Corporate KPI Grid (Turnover, Cost, Margin, Corporate Net Score) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Sales */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-5 border border-slate-800/85 flex items-center justify-between shadow-xl"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.totalSales}</span>
            <h3 className="text-xl font-black text-white font-mono">
              {Math.round(sum.totalSales).toLocaleString()} <span className="text-xs text-slate-500">DA</span>
            </h3>
            <p className="text-[9.5px] text-emerald-400 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>{state.language === 'ar' ? '+14.2% مقارنة بالمستهدف' : '+14.2% vs target'}</span>
            </p>
          </div>
          <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-2xl">
            <ShoppingCart className="w-5.5 h-5.5" />
          </div>
        </motion.div>

        {/* Metric 2: Cumulative Cost Price */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel rounded-2xl p-5 border border-slate-800/85 flex items-center justify-between shadow-xl"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.totalCosts}</span>
            <h3 className="text-xl font-black text-white font-mono">
              {Math.round(sum.totalCostPrice).toLocaleString()} <span className="text-xs text-slate-500">DA</span>
            </h3>
            <p className="text-[9.5px] text-amber-500 flex items-center gap-1 font-bold">
              <Activity className="w-3 h-3" />
              <span>{Math.round(sum.totalSales > 0 ? (sum.totalCostPrice / sum.totalSales) * 100 : 0)}% {state.language === 'ar' ? 'من رقم الأعمال' : 'of sales turnover'}</span>
            </p>
          </div>
          <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center rounded-2xl">
            <Layers className="w-5.5 h-5.5" />
          </div>
        </motion.div>

        {/* Metric 3: Profit Margin Ratio (نسبة هامش الربح) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-5 border border-slate-800/85 flex items-center justify-between shadow-xl"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{state.language === 'ar' ? 'نسبة هامش الربح' : 'Profit Margin Ratio'}</span>
            <h3 className={`text-xl font-black font-mono ${displayMarginRatio < 0 ? 'text-rose-400' : 'text-teal-400'}`}>
              {displayMarginRatio.toFixed(2)}%
            </h3>
            <p className="text-[9.5px] text-slate-400 flex items-center gap-1 font-bold">
              <Percent className="w-3 h-3 text-indigo-400" />
              <span>{state.language === 'ar' ? 'العائد الصافي لكل مبيعة' : 'Net return on sales'}</span>
            </p>
          </div>
          <div className="w-11 h-11 bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center rounded-2xl">
            <Percent className="w-5.5 h-5.5" />
          </div>
        </motion.div>

        {/* Metric 4: Net Corporate Profit */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`glass-panel rounded-2xl p-5 border relative overflow-hidden shadow-xl ${
            isLoss ? 'border-amber-500/30 bg-amber-950/10' : 'border-emerald-500/30 bg-emerald-950/10'
          }`}
        >
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{t.netCorporateProfit}</span>
            <h3 className={`text-xl font-black font-mono ${isLoss ? 'text-amber-400' : 'text-emerald-400'}`}>
              {Math.round(sum.netCorporateProfit).toLocaleString()} <span className="text-[10px] opacity-75">DA</span>
            </h3>
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${
              isLoss ? 'bg-amber-950 text-amber-400 border border-amber-500/20' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
            }`}>
              {isLoss ? t.perteMessage : t.beneficeMessage}
            </span>
          </div>
          <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none rounded-full blur-2xl ${
            isLoss ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
        </motion.div>

      </div>

      {/* Integrity Warnings banner */}
      {warnings.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-start shadow-md"
        >
          <div className="bg-amber-500/20 text-amber-400 rounded-lg p-1.5 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-400">{state.language === 'ar' ? 'تنبيهات جودة البيانات والرقابة المحاسبية' : 'Data Integrity Audits'}</h4>
            <ul className="list-disc leading-relaxed text-[10.5px] text-slate-300 mr-4 ml-4 mt-1.5 space-y-1">
              {warnings.map((w, index) => <li key={index}>{w}</li>)}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Main Charts & Analytics rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Card 1: Cost Analysis per Product (تحليل التكاليف حسب كل منتج) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                {state.language === 'ar' ? 'تحليل هيكل التكاليف حسب كل منتج' : 'Industrial Cost structure per Product'}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{state.language === 'ar' ? 'تقسيم كلفة الإنتاج إلى: مواد أولية، يد عاملة، وأعباء غير مباشرة للورشات' : 'Decomposition into materials, labor, and workshop allocation'}</p>
            </div>
            <Box className="w-4 h-4 text-violet-400 shrink-0" />
          </div>

          <div className="space-y-6 pt-2">
            {state.products.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8">{t.noData}</p>
            ) : (
              state.products.map(p => {
                const costs = calculatedValues.productCosts[p.id] || { rawMaterialCost: 0, modCost: 0, workshopCost: 0, totalProductionCost: 0 };
                const total = costs.totalProductionCost || 1;
                const matPct = (costs.rawMaterialCost / total) * 100;
                const laborPct = (costs.modCost / total) * 100;
                const indirectPct = (costs.workshopCost / total) * 100;

                return (
                  <div key={p.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">{p.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Total {Math.round(costs.totalProductionCost).toLocaleString()} DA
                      </span>
                    </div>

                    {/* Segmented Stacked progress Line */}
                    <div className="w-full h-3 bg-slate-950 rounded-lg overflow-hidden flex border border-slate-900 shadow-inner">
                      {/* Raw Materials - Amber */}
                      {costs.rawMaterialCost > 0 && (
                        <div 
                          style={{ width: `${matPct}%` }}
                          className="h-full bg-amber-500"
                          title={`Raw Materials: ${Math.round(costs.rawMaterialCost).toLocaleString()} DA (${matPct.toFixed(1)}%)`}
                        />
                      )}
                      {/* Direct MOD - Indigo */}
                      {costs.modCost > 0 && (
                        <div 
                          style={{ width: `${laborPct}%` }}
                          className="h-full bg-indigo-505 bg-indigo-500"
                          title={`Execution MOD hourly: ${Math.round(costs.modCost).toLocaleString()} DA (${laborPct.toFixed(1)}%)`}
                        />
                      )}
                      {/* Indirect Workshop cost centres - Emerald */}
                      {costs.workshopCost > 0 && (
                        <div 
                          style={{ width: `${indirectPct}%` }}
                          className="h-full bg-emerald-500"
                          title={`Workshops Indirect load: ${Math.round(costs.workshopCost).toLocaleString()} DA (${indirectPct.toFixed(1)}%)`}
                        />
                      )}
                    </div>

                    {/* Legend of stacked costs in Arabic/French */}
                    <div className="flex flex-wrap justify-between gap-2 text-[9px] text-slate-500 font-bold font-mono">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{state.language === 'ar' ? 'مواد أولية:' : 'Materials:'} {matPct.toFixed(0)}%</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 bg-indigo-500" />
                        <span>{state.language === 'ar' ? 'يد عاملة MOD:' : 'Labor MOD:'} {laborPct.toFixed(0)}%</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{state.language === 'ar' ? 'أعباء ورشات:' : 'Workshops:'} {indirectPct.toFixed(0)}%</span>
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 2: Interactive Waste/Loss Pie Chart (دائرة نسبية للهدر) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                {state.language === 'ar' ? 'نسبة الهدر الصناعي التراكمي (دائرة نسبية)' : 'Accumulated Industrial Scrap & Waste Chart'}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{state.language === 'ar' ? 'توزيع نسبة التلف والهدر الفنية للمواد حسب المنتجات' : 'Dynamic relative distribution of loss rates per product'}</p>
            </div>
            <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-center">
            
            {/* SVG Pie Chart core */}
            <div className="flex flex-col items-center justify-center">
              {totalWasteVol === 0 ? (
                <div className="w-28 h-28 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-center text-[10px] text-slate-500 font-semibold p-4">
                  {state.language === 'ar' ? 'حدد نسبة هدر للمنتجات بالأسفل لتشغيل المخطط' : 'Increase product waste rate below to view pie slices'}
                </div>
              ) : (
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                    {/* Ring circles back-tracks */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#090d16" strokeWidth="12" />
                    {pieSlices.map((slice, i) => (
                      <circle
                        key={slice.id}
                        cx="60"
                        cy="60"
                        r="46"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="11"
                        strokeDasharray={slice.circumference}
                        strokeDashoffset={slice.strokeDashoffset}
                        transform={`rotate(${slice.rotation} 60 60)`}
                        className="transition-all duration-500"
                        style={{ transformOrigin: "center" }}
                      />
                    ))}
                  </svg>
                  {/* Inside Center Ring indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Scrap Vol</span>
                    <span className="text-xs font-black text-rose-400 font-mono">{Math.round(totalWasteVol).toLocaleString()}</span>
                  </div>
                </div>
              )}
              {totalWasteVol > 0 && (
                <span className="text-[10px] text-slate-500 font-bold block mt-2 text-center">
                  {state.language === 'ar' ? 'توزع الأطنان المهدورة كلياً' : 'Distribution of total scrap weight'}
                </span>
              )}
            </div>

            {/* Config Sliders to adjust Waste rates intuitively */}
            <div className="space-y-4">
              <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase block">{state.language === 'ar' ? 'تعديل نسبة التلف (%):' : 'Adjust Scrap Coefficient (%):'}</span>
              
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {state.products.map((p, index) => {
                  const slice = pieSlices.find(s => s.id === p.id);
                  const bulletColor = slice ? slice.color : '#475569';
                  
                  return (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-300 font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bulletColor }} />
                          <span>{p.name}</span>
                        </span>
                        <span className="font-mono font-bold text-amber-500">{p.wastePercentage || 0}%</span>
                      </div>
                      
                      <input 
                        type="range"
                        min="0"
                        max="25"
                        step="0.5"
                        value={p.wastePercentage || 0}
                        onChange={e => updateProduct(p.id, { wastePercentage: parseFloat(e.target.value) || 0 })}
                        className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row: Variance Analysis & Product Performance (الانحرافات والمطابقة) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Table/Card: Variance Analysis (الانحرافات) */}
         <div className="xl:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
           <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
             <div>
               <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                 {state.language === 'ar' ? 'تحليل الانحرافات المحاسبية (Variance Analysis)' : 'Cost Price & Variance Analysis'}
               </h3>
               <p className="text-[10px] text-slate-500 mt-0.5">{state.language === 'ar' ? 'مقارنة سعر التكلفة الفعلي للوحدة مع التكلفة المعيارية (القصوى المستهدفة)' : 'Compares computed industrial cost against target standard criteria'}</p>
             </div>
             <Target className="w-4 h-4 text-emerald-400 shrink-0" />
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-center border-collapse text-xs font-mono">
               <thead>
                 <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold">
                   <th className="text-right p-3">{state.language === 'ar' ? 'المنتج' : 'Product'}</th>
                   <th>{state.language === 'ar' ? 'كلفة فعلية (وحدة)' : 'Actual Cost (Unit)'}</th>
                   <th>{state.language === 'ar' ? 'كلفة معيارية مستهدفة' : 'Budget-Std Target'}</th>
                   <th>{state.language === 'ar' ? 'الانحراف (DA)' : 'Variance (DA)'}</th>
                   <th>{state.language === 'ar' ? 'حالة الانحراف' : 'Status'}</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
                 {state.products.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="p-8 text-slate-500 font-semibold">{t.noData}</td>
                   </tr>
                 ) : (
                   state.products.map(p => {
                     const results = calculatedValues.netResults[p.id] || { totalCostPrice: 0 };
                     const unitCost = p.quantitySold > 0 ? (results.totalCostPrice / p.quantitySold) : 0;
                     const target = p.standardUnitCost || 0;
                     const hasTarget = target > 0;
                     const variance = unitCost - target;

                     let flagColor = "text-slate-500";
                     let flagText = state.language === 'ar' ? "لم يحدد مستهدف" : "No budget set";
                     let flagBg = "bg-slate-900/30 border-slate-800";

                     if (hasTarget) {
                       if (variance < 0) {
                         flagColor = "text-emerald-400 font-bold";
                         flagText = state.language === 'ar' ? "ملائم Favorable (وفر)" : "Favorable (Gain)";
                         flagBg = "bg-emerald-950/10 border-emerald-500/20";
                       } else if (variance > 0) {
                         flagColor = "text-rose-400 font-bold";
                         flagText = state.language === 'ar' ? "غير ملائم Unfavorable (عجز)" : "Unfavorable (Loss)";
                         flagBg = "bg-rose-950/10 border-rose-500/20";
                       } else {
                         flagColor = "text-slate-300 font-bold";
                         flagText = state.language === 'ar' ? "متطابق" : "Identical";
                       }
                     }

                     return (
                       <tr key={p.id} className="hover:bg-slate-900/10">
                         <td className="text-right p-3 font-semibold text-slate-300 font-sans">{p.name}</td>
                         <td className="p-2 text-slate-300 font-bold">{unitCost.toFixed(2)}</td>
                         <td className="p-2 font-semibold">
                           <div className="flex items-center justify-center gap-1">
                             <input 
                               type="number"
                               placeholder="..."
                               value={p.standardUnitCost || ""}
                               onChange={e => updateProduct(p.id, { standardUnitCost: parseFloat(e.target.value) || undefined })}
                               className="w-16 bg-slate-950 border border-slate-800 rounded p-0.5 text-center font-bold text-amber-400 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                             />
                           </div>
                         </td>
                         <td className={`p-2 font-black ${hasTarget ? (variance > 0 ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-500'}`}>
                           {hasTarget ? `${variance > 0 ? '+' : ''}${Math.round(variance).toLocaleString()}` : "-"}
                         </td>
                         <td className="p-1.5">
                           <span className={`inline-block px-2.5 py-1 rounded-lg text-[9.5px] border ${flagBg} ${flagColor}`}>
                             {flagText}
                           </span>
                         </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
           </div>
         </div>

         {/* Product Performance Matrix list */}
         <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
           <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
             <div>
               <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                 {state.language === 'ar' ? 'سجل الأداء والمقترحات' : 'Performance Ranking Matrix'}
               </h3>
               <p className="text-[10px] text-slate-500 mt-0.5">{state.language === 'ar' ? 'تصنيف المنتجات حسب مساهمتها وصافي هامشها' : 'Stars vs loss-makers and strategic proposals'}</p>
             </div>
             <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
           </div>

           <div className="space-y-4">
             {/* Stars list */}
             <div className="space-y-2">
               <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block flex items-center gap-1">
                 <CheckCircle className="w-3.5 h-3.5" />
                 <span>{state.language === 'ar' ? 'الأعلى ربحية (الأكثر ملاءمة)' : 'Profitable stars'}</span>
               </span>
               <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                 {bestProducts.length === 0 ? (
                   <p className="text-slate-500 text-[10px] italic">{state.language === 'ar' ? 'لا توجد منتجات رابحة في الفترة الحالية' : 'No net profits logged yet.'}</p>
                 ) : (
                   bestProducts.map(p => (
                     <div key={p.id} className="flex justify-between items-center bg-emerald-950/5 border border-emerald-500/10 p-2 rounded-xl text-xs">
                       <span className="text-slate-300 font-semibold">{p.name}</span>
                       <span className="font-mono text-emerald-400 font-bold">+{p.marginPct.toFixed(1)}%</span>
                     </div>
                   ))
                 )}
               </div>
             </div>

             {/* Risks list */}
             <div className="space-y-2 pt-2 border-t border-slate-900">
               <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 block flex items-center gap-1">
                 <Flame className="w-3.5 h-3.5 animate-pulse" />
                 <span>{state.language === 'ar' ? 'تحتاج إجراءات فورية (عجز)' : 'Critical margins'}</span>
               </span>
               <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                 {deficientProducts.length === 0 ? (
                   <p className="text-slate-500 text-[10px] italic">{state.language === 'ar' ? 'رائع! لا توجد منتجات خاسرة' : 'All margins are favorable!'}</p>
                 ) : (
                   deficientProducts.map(p => (
                     <div key={p.id} className="flex flex-col gap-1 bg-rose-950/5 border border-rose-500/15 p-2 rounded-xl text-[11px]">
                       <div className="flex justify-between items-center">
                         <span className="text-slate-200 font-bold">{p.name}</span>
                         <span className="font-mono text-rose-400 font-bold">{p.marginPct.toFixed(1)}%</span>
                       </div>
                       {/* Contextual recommendation */}
                       <span className="text-[9.5px] text-amber-500 font-semibold italic mt-0.5 block leading-relaxed">
                         {state.language === 'ar' 
                           ? `🛠️ إجراء مقترح: رفع السعر بـ ${Math.abs(Math.round(p.marginPct) || 10)}% أو دمج مصاريف الورشة للحد من العجز.`
                           : `🛠️ Action: Boost sales rate by ${Math.abs(Math.round(p.marginPct) || 10)}% or minimize routing costs.`}
                       </span>
                     </div>
                   ))
                 )}
               </div>
             </div>
           </div>
         </div>

      </div>

    </div>
  );
};
