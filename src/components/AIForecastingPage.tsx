import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  Cpu, 
  HelpCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingDown, 
  Info,
  Layers,
  Percent,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  GitBranch
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AIForecastingPage: React.FC = () => {
  const { state, calculatedValues } = useApp();
  const isAr = state.language === 'ar';
  const isFr = state.language === 'fr';

  // State for dynamic simulation variables
  const [selectedProductId, setSelectedProductId] = useState<string>(
    state.products[0]?.id || ''
  );
  
  // Slider states (in percentage offsets)
  // Slider 1: Expected change in raw material prices (%)
  const [rawMaterialPriceOffset, setRawMaterialPriceOffset] = useState<number>(0);
  // Slider 2: Change in targeted production volume (%)
  const [productionVolumeOffset, setProductionVolumeOffset] = useState<number>(0);
  // Slider 3: Change in indirect/energy and wages expenses (%)
  const [indirectExpensesOffset, setIndirectExpensesOffset] = useState<number>(0);

  // Selected product
  const product = state.products.find(p => p.id === selectedProductId);
  
  // Localization object tailored for this view
  const t = {
    ar: {
      title: "محرك التنبؤ والمحاكاة الذكي بالذكاء الاصطناعي",
      subtitle: "لوحة تخطيط السيناريوهات الاستباقية لتوقع تكاليف الإنتاج وهوامش الربحية وتوزيع الأعباء بناءً على متغيرات السوق",
      productSelect: "اختر المنتج المراد محاكاته:",
      rightPanelTitle: "معايير تخطيط ومدخلات السيناريو المالي",
      rightPanelSubtitle: "اضبط الأشرطة المنزلقة لمحاكاة تقلب أسعار السوق ومستوى الإنتاج والأعباء العامة",
      rawMaterialsSlider: "نسبة التغير المتوقعة في أسعار المواد الأولية (%)",
      prodVolumeSlider: "تغير حجم الإنتاج المستهدف (%)",
      indirectSlider: "التغير في التكاليف غير المباشرة وطاقة الرواتب (%)",
      leftPanelTitle: "النتائج المتوقعة بدعم من النماذج التحليلية المتقدمة",
      leftPanelSubtitle: "تقديرات مالية ديناميكية مبنية على قواعد المحاسبة التحليلية الوطنية ومؤشرات SCF",
      baseline: "الوضع المالي المرجعي الحالي",
      simulated: "السيناريو المتوقع بعد المحاكاة",
      unitCost: "سعر التكلفة الوحدوي (C.M.U.P)",
      totalCost: "إجمالي تكلفة الإنتاج للفترة",
      marginImpact: "معدل العائد وهامش الربحية الصافي",
      predictedCmupTitle: "سعر التكلفة الوسطي المرجح المتوقع (CMUP)",
      marginImpactTitle: "تأثير هامش الربح الإجمالي المتوقع",
      warningRadarTitle: "رادار الهدر والتشغيل الاستباقي (AI Warning)",
      baselineLabel: "الوضع المالي الأساسي",
      simulatedLabel: "الوضع المتوقع المحاكى",
      originalVal: "القيمة الأصلية",
      projectedVal: "القيمة المتوقعة",
      savingAlert: "تحسن في هوامش الربحية! السيناريو ممتاز للتشغيل.",
      costWarning: "تنبيه هامش سلبي: ارتفاع تكلفة المواد يهدد بربحية المنتج الصافية.",
      chartTitle: "مقارنة هيكل تكاليف المنتج بين الأساسي والمحاكى",
      costBreakdown: "تحليل العناصر: مواد أولية، يد عاملة مباشرة، أعباء الورشات",
      materialsCost: "تكلفة المواد الأولية",
      modCost: "أعباء اليد العاملة المباشرة",
      workshopCost: "أعباء الورشات غير المباشرة",
      saveScenario: "اعتماد وحفظ السيناريو كمرجع",
      resetSliders: "إعادة ضبط المؤشرات",
      radarNormal: "رادار الصناعة في وضع مستقر ومرن. مستويات الإنتاج الحالية تتناسب طردياً مع قدرة الورشات دون توليد فاقد ذو طابع فني.",
      radarWarningVolume: "تنبيه رادار الهدر: زيادة الإنتاج بنسبة {val}% يولد ضغطاً وتراكماً للأعباء غير المباشرة وقد يسبب فاقد هدر تقني إضافي بنسبة {loss}% بورشات الفرز والتجميع لعدم كفاية الصيانة الوقائية.",
      radarWarningMaterial: "تحذير الإمداد: ارتفاع تكلفة المواد الأولية بـ {val}% يضغط على مستويات السيولة المطلوبة لتأمين المشتريات من مخازن التوزيع للأشهر القادمة.",
      radarWarningIndirect: "مؤشر حرج: ارتفاع التكاليف العامة وعقود الطاقة والرواتب بـ {val}% يؤدي لارتفاع حد الحرج ونقطة التعادل المالي بنسبة كبيرة، مما يستوجب تخفيض الهدر.",
      profitIncrease: "تحسن وارتفاع بـ {val}%",
      profitDecrease: "انخفاض وتراجع بـ {val}%",
      neutral: "مستقر وبدون تغيير"
    },
    fr: {
      title: "Moteur de Simulation & Prévision Financière IA",
      subtitle: "Planifiez des scénarios proactifs pour estimer vos futurs coûts de revient, marges nettes et impacts sur la trésorerie.",
      productSelect: "Sélectionner le produit à simuler :",
      rightPanelTitle: "Paramètres de Simulation d'Éléments",
      rightPanelSubtitle: "Ajustez les curseurs pour simuler l'inflation, les volumes de fabrication et les coûts d'usine.",
      rawMaterialsSlider: "Évolution estimée du prix des matières premières (%)",
      prodVolumeSlider: "Variation du volume de production ciblé (%)",
      indirectSlider: "Évolution des charges indirectes et de l'énergie (%)",
      leftPanelTitle: "Résultats Prédictifs Appuyés par l'IA",
      leftPanelSubtitle: "Calculs de simulation rigoureux selon les règles d'évaluation du SCF algérien.",
      baseline: "Situation de Référence",
      simulated: "Scénario Prédictif Simulé",
      unitCost: "Coût Unitaire Moyen (C.U.M.P)",
      totalCost: "Coût de Production Total Période",
      marginImpact: "Impact Marges et Profitabilité",
      predictedCmupTitle: "C.U.M.P unitaire projeté",
      marginImpactTitle: "Impact sur la Marge Bénéficiaire",
      warningRadarTitle: "Radar de Gaspillage Proactif IA",
      baselineLabel: "Base Initiale",
      simulatedLabel: "Projeté Simulé",
      originalVal: "Valeur Initiale",
      projectedVal: "Valeur Projetée",
      savingAlert: "Amélioration des marges ! Conditions propices pour lancer la fabrication.",
      costWarning: "Attention : La hausse réduit significativement la rentabilité de ce produit.",
      chartTitle: "Structure Comparée des Coûts : Réel vs Simulé",
      costBreakdown: "Répartition analytique : matières, main d'oeuvre, charges d'ateliers",
      materialsCost: "Coût des Matières",
      modCost: "Main d'œuvre Directe",
      workshopCost: "Charges Indirectes Ateliers",
      saveScenario: "Sauvegarder ce Scénario",
      resetSliders: "Réinitialiser",
      radarNormal: "Fluide. Tous les voyants opérationnels sont corrects. La structure d'usine supporte ces volumes sans surcharge.",
      radarWarningVolume: "Radar de Surcharge : Une hausse de production de {val}% crée un goulot d'étranglement avec un surplus de rebut technique estimé à {loss}% par manque de maintenance préventive.",
      radarWarningMaterial: "Alerte Trésorerie : Une inflation de {val}% des composants fragilise les capacités de fonds de roulement d'achats.",
      radarWarningIndirect: "Seuil de Rentabilité : La hausse de {val}% des frais fixes répercute une hausse substantielle du point mort financier.",
      profitIncrease: "Hausse de {val}%",
      profitDecrease: "Baisse de {val}%",
      neutral: "Stable sans écart"
    },
    en: {
      title: "Smart AI Financial Forecasting & Simulation Engine",
      subtitle: "Execute proactive planning scenarios to predict production costs, net margins, and overhead distribution patterns.",
      productSelect: "Select product to simulate:",
      rightPanelTitle: "Financial Scenario Parameters & Drivers",
      rightPanelSubtitle: "Adjust sliders to simulate fluctuating markets, volume demands, and operation overheads.",
      rawMaterialsSlider: "Expected Raw Material Price Shift (%)",
      prodVolumeSlider: "Target Production Volume Shift (%)",
      indirectSlider: "Indirect Costs, Wages & Energy Change (%)",
      leftPanelTitle: "AI-Powered Predictive Performance Analysis",
      leftPanelSubtitle: "Frictionless reactive computations structured upon analytic accounting methodologies.",
      baseline: "Baseline Performance",
      simulated: "Projected Scenario",
      unitCost: "Unit Cost (C.M.U.P)",
      totalCost: "Total Production Cost For Period",
      marginImpact: "Profit Margin Impact",
      predictedCmupTitle: "Projected Weighted Avg. Unit Cost (C.M.U.P)",
      marginImpactTitle: "Expected Gross Profit Margin Shift",
      warningRadarTitle: "AI Proactive Waste & System Warning",
      baselineLabel: "Current Baseline",
      simulatedLabel: "Simulated Scenario",
      originalVal: "Baseline Value",
      projectedVal: "Projected Value",
      savingAlert: "Margin improvement detected! Optimal scenario to execute production.",
      costWarning: "Profitability warning: Rising costs significantly compress product net margin.",
      chartTitle: "Production Cost Structure Comparison: Base vs Sim",
      costBreakdown: "Analytic breakdown: raw materials, direct labor, and indirect workshops",
      materialsCost: "Raw Materials Cost",
      modCost: "Direct Labor Overheads",
      workshopCost: "Indirect Workshop Expenses",
      saveScenario: "Lock Strategy Template",
      resetSliders: "Reset Parameters",
      radarNormal: "Operational radar green and balanced. Current assembly load correlates safely with plant capabilities.",
      radarWarningVolume: "Bottleneck Warning: Production increase of {val}% creates assembly queue stress causing a projected {loss}% secondary technical wastage due to maintenance delay.",
      radarWarningMaterial: "Supply Risk Alert: An increase of {val}% in raw material pricing places high stress on purchase revolving funding requirements.",
      radarWarningIndirect: "Critical Threshold Alert: {val}% overhead inflation pushes break-even target thresholds higher, prompting cost reductions.",
      profitIncrease: "Increase of {val}%",
      profitDecrease: "Decrease of {val}%",
      neutral: "Stable, No deviation"
    }
  };

  const currT = t[state.language as 'ar' | 'fr' | 'en'] || t.ar;

  // Recalculations if product is selected
  const baseCost = calculatedValues.productCosts[selectedProductId] || {
    rawMaterialCost: 0,
    modCost: 0,
    workshopCost: 0,
    totalProductionCost: 0,
    unitProductionCost: 0
  };

  const baseVolume = product ? product.productionVolume : 1;
  const sellingPrice = product ? product.sellingPrice : 0;
  const quantitySold = product ? product.quantitySold : 0;

  // Let's compute simulated metrics in accordance with analytic accounting rules:
  // - Raw Materials scale strictly with Raw Material Price Offset (Slider 1)
  //   Notice: raw materials consumed are independent of the output volume field for a given period raw material expense,
  //   but the total production cost contains this raw material expense.
  const simRawMaterialCost = baseCost.rawMaterialCost * (1 + rawMaterialPriceOffset / 100);

  // - Direct labor (MOD) scales with indirect/labor offset (Slider 3)
  const simModCost = baseCost.modCost * (1 + indirectExpensesOffset / 100);

  // - Indirect workshop costs split into:
  //   * Variable part (40%): scales with Volume change (Slider 2) AND general cost offset (Slider 3)
  //   * Fixed part (60%): remains FIXED in total amount but scales with general cost offset (Slider 3)
  const baseWorkshopCost = baseCost.workshopCost;
  const workshopFixed = baseWorkshopCost * 0.60 * (1 + indirectExpensesOffset / 100);
  const workshopVariable = baseWorkshopCost * 0.40 * (1 + productionVolumeOffset / 100) * (1 + indirectExpensesOffset / 100);
  const simWorkshopCost = workshopFixed + workshopVariable;

  // Total production cost
  const simTotalProductionCost = simRawMaterialCost + simModCost + simWorkshopCost;

  // Simulated production volume
  const simVolume = Math.max(1, baseVolume * (1 + productionVolumeOffset / 100));

  // Simulated C.M.U.P = Total Cost / Output Volume
  const simUnitCost = simTotalProductionCost / simVolume;

  // Profit Margin Impact analysis
  // Base model margin
  const baseRevenue = sellingPrice * quantitySold;
  // Let's assume production cost of sales matches unit cost * quantitySold
  const baseCostOfSales = baseCost.unitProductionCost * quantitySold;
  const baseMarginAmt = baseRevenue - baseCostOfSales;
  const baseMarginPct = baseRevenue > 0 ? (baseMarginAmt / baseRevenue) * 100 : 0;

  // Sim model margin
  const simCostOfSales = simUnitCost * quantitySold;
  const simMarginAmt = baseRevenue - simCostOfSales;
  const simMarginPct = baseRevenue > 0 ? (simMarginAmt / baseRevenue) * 100 : 0;

  const marginChange = simMarginPct - baseMarginPct;

  // Reset function
  const handleReset = () => {
    setRawMaterialPriceOffset(0);
    setProductionVolumeOffset(0);
    setIndirectExpensesOffset(0);
  };

  // AI Radar warning generation text
  let aiRadarMessage = currT.radarNormal;
  let radarCategory: 'success' | 'warning' | 'critical' = 'success';

  if (productionVolumeOffset > 15) {
    const projectedLoss = (productionVolumeOffset * 0.12).toFixed(1);
    aiRadarMessage = currT.radarWarningVolume
      .replace('{val}', productionVolumeOffset.toString())
      .replace('{loss}', projectedLoss);
    radarCategory = 'warning';
  } else if (rawMaterialPriceOffset > 20) {
    aiRadarMessage = currT.radarWarningMaterial.replace('{val}', rawMaterialPriceOffset.toString());
    radarCategory = 'warning';
  } else if (indirectExpensesOffset > 10) {
    aiRadarMessage = currT.radarWarningIndirect.replace('{val}', indirectExpensesOffset.toString());
    radarCategory = 'critical';
  }

  // Create clean data points for custom SVG bar/line elements
  const maxCostValue = Math.max(
    baseCost.rawMaterialCost, simRawMaterialCost,
    baseCost.modCost, simModCost,
    baseCost.workshopCost, simWorkshopCost,
    1000
  );

  const getPercentHeight = (val: number) => {
    return (val / maxCostValue) * 100;
  };

  return (
    <div className="space-y-6" id="ai-forecasting-container">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#031525] via-[#04122d] to-slate-950 p-6 rounded-3xl border border-slate-900 shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-slate-100">{currT.title}</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            {currT.subtitle}
          </p>
        </div>

        {/* Product Selection drop-down inline */}
        <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 ml-1">{currT.productSelect}</span>
          <select
            id="forecasting-product-select"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {state.products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {product ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* RIGHT PANEL - INPUT SLIDERS */}
          <div className="lg:col-span-5 bg-[#080d16] border border-slate-900 rounded-3xl p-5 md:p-6 shadow-xl space-y-6">
            <div className="space-y-1 border-b border-slate-850 pb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>{currT.rightPanelTitle}</span>
                </h3>
                <button
                  id="reset-simulation-sliders"
                  onClick={handleReset}
                  className="text-[10px] font-black text-slate-400 hover:text-indigo-400 px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  {currT.resetSliders}
                </button>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                {currT.rightPanelSubtitle}
              </p>
            </div>

            {/* Slider 1: Expected change in raw material prices */}
            <div className="space-y-2.5 bg-slate-950/40 p-4 border border-slate-900/50 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{currT.rawMaterialsSlider}</span>
                <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                  rawMaterialPriceOffset > 0 ? 'text-rose-400 bg-rose-500/10' : rawMaterialPriceOffset < 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-indigo-400 bg-indigo-500/10'
                }`}>
                  {rawMaterialPriceOffset > 0 ? '+' : ''}{rawMaterialPriceOffset}%
                </span>
              </div>
              <input
                id="slider-raw-materials"
                type="range"
                min="-50"
                max="100"
                step="1"
                value={rawMaterialPriceOffset}
                onChange={e => setRawMaterialPriceOffset(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                <span>-50% ({isAr ? 'تنزيل' : 'Reduction'})</span>
                <span>0% ({isAr ? 'معياري' : 'Standard'})</span>
                <span>+100% ({isAr ? 'تضخم مضاعف' : 'Double Price'})</span>
              </div>
            </div>

            {/* Slider 2: Target production volume */}
            <div className="space-y-2.5 bg-slate-950/40 p-4 border border-slate-900/50 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{currT.prodVolumeSlider}</span>
                <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                  productionVolumeOffset > 0 ? 'text-cyan-400 bg-cyan-500/10' : productionVolumeOffset < 0 ? 'text-amber-400 bg-amber-500/10' : 'text-indigo-400 bg-indigo-500/10'
                }`}>
                  {productionVolumeOffset > 0 ? '+' : ''}{productionVolumeOffset}%
                </span>
              </div>
              <input
                id="slider-production-volume"
                type="range"
                min="-50"
                max="100"
                step="5"
                value={productionVolumeOffset}
                onChange={e => setProductionVolumeOffset(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                <span>-50% ({isAr ? 'نصف الطاقة' : 'Half Target'})</span>
                <span>0% ({isAr ? 'المستوى الأساسي' : 'Baseline'})</span>
                <span>+100% ({isAr ? 'كامل الطاقة' : 'Double Production'})</span>
              </div>
            </div>

            {/* Slider 3: Change in indirect workshop & wages expenses */}
            <div className="space-y-2.5 bg-slate-950/40 p-4 border border-slate-900/50 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{currT.indirectSlider}</span>
                <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                  indirectExpensesOffset > 0 ? 'text-rose-450 text-rose-450 text-rose-400 bg-rose-500/10' : indirectExpensesOffset < 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-indigo-400 bg-indigo-500/10'
                }`}>
                  {indirectExpensesOffset > 0 ? '+' : ''}{indirectExpensesOffset}%
                </span>
              </div>
              <input
                id="slider-indirect-charges"
                type="range"
                min="-30"
                max="100"
                step="1"
                value={indirectExpensesOffset}
                onChange={e => setIndirectExpensesOffset(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                <span>-30% ({isAr ? 'ترشيد أعباء' : 'Savings'})</span>
                <span>0% ({isAr ? 'طبيعي' : 'Standard'})</span>
                <span>+100% ({isAr ? 'ارتفاع عام' : 'Double Overheads'})</span>
              </div>
            </div>

            {/* Simulated target metrics preview table */}
            <div className="bg-slate-950 p-4 border border-slate-900 rounded-2xl space-y-2.5">
              <span className="text-[10.5px] font-bold text-slate-400 block border-b border-slate-900 pb-1.5">
                {isAr ? 'المعطيات الكمية المتزامنة للمحاكاة:' : 'Simulated Period Quantities:'}
              </span>
              <div className="grid grid-cols-2 gap-3 text-[11px] font-medium font-mono text-slate-300">
                <div className="bg-[#0b1329] p-2 rounded-xl text-center border border-slate-900">
                  <span className="text-[9.5px] text-slate-500 block mb-0.5">{isAr ? 'الكمية المنتجة المخططة' : 'Planned Volume'}</span>
                  <span className="text-xs font-black text-cyan-400">{Math.round(simVolume).toLocaleString()} وحدة</span>
                </div>
                <div className="bg-[#0b1329] p-2 rounded-xl text-center border border-slate-900">
                  <span className="text-[9.5px] text-slate-500 block mb-0.5">{isAr ? 'معدل سعر المواد المعدل' : 'Adjusted Mat Rate'}</span>
                  <span className="text-xs font-black text-rose-400">+{rawMaterialPriceOffset}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT PANEL - PREDICTIVE OUTPUTS & RADAR */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Predictive Results Summary Section */}
            <div className="bg-[#080d16] border border-slate-900 rounded-3xl p-5 md:p-6 shadow-xl space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{currT.leftPanelTitle}</span>
                </h3>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  {currT.leftPanelSubtitle}
                </p>
              </div>

              {/* 3 Quick Prediction Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* CARD 1: Predicted CMUP */}
                <div className="bg-[#0b1329]/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/20 transition-all shadow-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-wider text-cyan-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 shrink-0" />
                      <span>{isAr ? 'التكلفة الوحدوية المتوقعة' : 'PREDICTED C.M.U.P'}</span>
                    </span>
                    <h4 className="text-[11.5px] font-black text-slate-100 leading-snug">
                      {currT.predictedCmupTitle}
                    </h4>
                  </div>
                  <div className="pt-3">
                    <span className="text-lg font-black text-cyan-455 text-cyan-45" style={{ color: '#22d3ee' }}>
                      {simUnitCost.toFixed(2)} DA
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1">
                      <span>{currT.originalVal}:</span>
                      <span className="line-through font-mono font-semibold">{baseCost.unitProductionCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Profit Margin Impact */}
                <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-md relative overflow-hidden group ${
                  marginChange > 0 
                    ? 'bg-[#0f1d1f] border-emerald-500/20 hover:border-emerald-500/30' 
                    : marginChange < 0 
                      ? 'bg-[#1a0f18] border-rose-500/20 hover:border-rose-500/30' 
                      : 'bg-[#0b1329] border-slate-800'
                }`}>
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black tracking-wider flex items-center gap-1 ${
                      marginChange > 0 ? 'text-emerald-400' : marginChange < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {marginChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                      <span>{isAr ? 'هامش الربحية الصافي' : 'MARGIN SHIFT'}</span>
                    </span>
                    <h4 className="text-[11.5px] font-black text-slate-100 leading-snug">
                      {currT.marginImpactTitle}
                    </h4>
                  </div>
                  <div className="pt-3">
                    <span className={`text-lg font-black ${
                      marginChange > 0 ? 'text-emerald-400' : marginChange < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {marginChange === 0 ? currT.neutral : (marginChange > 0 ? `+${marginChange.toFixed(2)}%` : `${marginChange.toFixed(2)}%`)}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1">
                      <span>{isAr ? 'الهامش المتوقع:' : 'Expected Margin:'}</span>
                      <span className="font-mono font-bold text-slate-300">{simMarginPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: AI Warning Signal */}
                <div className="bg-[#0b1329]/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/20 transition-all shadow-md relative overflow-hidden group">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-wider text-indigo-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                      <span>{isAr ? 'رادار التحليل الاستباقي' : 'PREDICTIVE SIGNAL'}</span>
                    </span>
                    <h4 className="text-[11.5px] font-black text-slate-100 leading-snug">
                      {currT.warningRadarTitle}
                    </h4>
                  </div>
                  <div className="pt-3">
                    <span className="text-xs font-black text-orange-400 line-clamp-2 leading-relaxed">
                      {rawMaterialPriceOffset === 0 && productionVolumeOffset === 0 && indirectExpensesOffset === 0 ? (
                        isAr ? 'جميع المؤشرات تعمل بمستويات مستقرة وآمنة في ورشات العمل.' : 'All production indicators stable.'
                      ) : (
                        isAr ? 'تم رصد تغير تكتيكي في بيئة التكاليف. يرجى قراءة رادار الهدر.' : 'Tactical shifts found in costing environments.'
                      )}
                    </span>
                  </div>
                </div>

              </div>

              {/* AI Warning Radar Panel Box */}
              <div className={`p-4 rounded-2xl border text-right transition-all flex gap-3.5 items-start ${
                radarCategory === 'critical' ? 'bg-rose-950/15 border-rose-900/30' :
                radarCategory === 'warning' ? 'bg-amber-950/10 border-amber-900/30' :
                'bg-indigo-950/20 border-indigo-900/30'
              }`}>
                {/* Icon wrapper */}
                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  radarCategory === 'critical' ? 'text-rose-450 bg-rose-500/10 border-rose-500/10' :
                  radarCategory === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/10' :
                  'text-[#22d3ee] bg-cyan-500/10 border-cyan-500/10'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1 select-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {isAr ? 'رادار الهدر واليقظة الصناعية المستمر (AI Warning Radar):' : 'AI Continuous Operations & Waste Radar:'}
                  </span>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    {aiRadarMessage}
                  </p>
                </div>
              </div>

            </div>

            {/* Custom SVG Bar Chart comparing baseline vs simulated structures */}
            <div className="bg-[#080d16] border border-slate-900 rounded-3xl p-5 md:p-6 shadow-xl">
              <div className="space-y-1 border-b border-slate-850 pb-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-right">
                <div>
                  <h3 className="text-sm font-black text-slate-100 flex items-center justify-start gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>{currT.chartTitle}</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                    {currT.costBreakdown}
                  </p>
                </div>
                
                {/* Legends */}
                <div className="flex flex-wrap gap-3 text-[10px] font-bold">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-slate-700 rounded-sm" />
                    <span>{currT.baselineLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" />
                    <span>{currT.simulatedLabel}</span>
                  </div>
                </div>
              </div>

              {/* Graphical representation comparing Raw Materials, MOD, and Workshops */}
              <div className="space-y-5">
                
                {/* Group 1: Raw Materials Cost */}
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] font-bold text-slate-400">{currT.materialsCost}</span>
                    <div className="flex gap-3 font-mono font-bold text-[11px]">
                      <span className="text-slate-500">{Math.round(baseCost.rawMaterialCost).toLocaleString()} DA</span>
                      <span className="text-indigo-400">→ {Math.round(simRawMaterialCost).toLocaleString()} DA</span>
                    </div>
                  </div>
                  {/* Two comparative bars */}
                  <div className="h-6 w-full bg-slate-900/40 rounded-lg relative overflow-hidden flex flex-col justify-center border border-slate-900 p-0.5 space-y-0.5">
                    {/* Baseline bar */}
                    <div 
                      className="h-1/2 bg-slate-700/60 transition-all duration-300 rounded"
                      style={{ width: `${Math.min(100, getPercentHeight(baseCost.rawMaterialCost))}%` }}
                    />
                    {/* Simulated bar */}
                    <div 
                      className="h-1/2 bg-indigo-650 bg-indigo-500 transition-all duration-300 rounded"
                      style={{ width: `${Math.min(100, getPercentHeight(simRawMaterialCost))}%` }}
                    />
                  </div>
                </div>

                {/* Group 2: MOD Cost */}
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] font-bold text-slate-400">{currT.modCost}</span>
                    <div className="flex gap-3 font-mono font-bold text-[11px]">
                      <span className="text-slate-500">{Math.round(baseCost.modCost).toLocaleString()} DA</span>
                      <span className="text-indigo-400">→ {Math.round(simModCost).toLocaleString()} DA</span>
                    </div>
                  </div>
                  {/* Two comparative bars */}
                  <div className="h-6 w-full bg-slate-900/40 rounded-lg relative overflow-hidden flex flex-col justify-center border border-slate-900 p-0.5 space-y-0.5">
                    {/* Baseline bar */}
                    <div 
                      className="h-1/2 bg-slate-700/60 transition-all duration-300 rounded"
                      style={{ width: `${Math.min(100, getPercentHeight(baseCost.modCost))}%` }}
                    />
                    {/* Simulated bar */}
                    <div 
                      className="h-1/2 bg-indigo-650 bg-indigo-550 bg-indigo-500 transition-all duration-300 rounded"
                      style={{ width: `${Math.min(100, getPercentHeight(simModCost))}%` }}
                    />
                  </div>
                </div>

                {/* Group 3: Indirect Workshop Costs */}
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] font-bold text-slate-400">{currT.workshopCost}</span>
                    <div className="flex gap-3 font-mono font-bold text-[11px]">
                      <span className="text-slate-500">{Math.round(baseCost.workshopCost).toLocaleString()} DA</span>
                      <span className="text-indigo-400">→ {Math.round(simWorkshopCost).toLocaleString()} DA</span>
                    </div>
                  </div>
                  {/* Two comparative bars */}
                  <div className="h-6 w-full bg-slate-900/40 rounded-lg relative overflow-hidden flex flex-col justify-center border border-slate-900 p-0.5 space-y-0.5">
                    {/* Baseline bar */}
                    <div 
                      className="h-1/2 bg-slate-700/60 transition-all duration-300 rounded"
                      style={{ width: `${Math.min(100, getPercentHeight(baseCost.workshopCost))}%` }}
                    />
                    {/* Simulated bar */}
                    <div 
                      className="h-1/2 bg-indigo-650 bg-indigo-550 bg-indigo-500 transition-all duration-300 rounded"
                      style={{ width: `${Math.min(100, getPercentHeight(simWorkshopCost))}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Interactive micro info helper notice or guidelines */}
              <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex gap-1.5 items-start justify-end leading-relaxed">
                <span className="text-right">
                  {isAr 
                    ? "تنويه محاسبي: أعباء الورشات تقسم بنسبة 60% أعباء ثابتة و 40% أعباء غيبر مباشرة متغيرة تتبع طردياً حجم الإنتاج والتكاليف كمعايير تتبع المخطط الوطني للمحاسبة SCF." 
                    : "Accounting disclosure: Expenses reflect 60% fixed cost load and 40% variable elements in accordance with SCF guidelines."}
                </span>
                <Info className="w-4.5 h-4.5 mt-0.5 text-slate-600 shrink-0" />
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-sm text-slate-500">
          {isAr ? 'لم يتم العثور على منتجات نشطة حالياً لإجراء المحاكاة.' : 'No active products found to simulate.'}
        </div>
      )}
    </div>
  );
};
