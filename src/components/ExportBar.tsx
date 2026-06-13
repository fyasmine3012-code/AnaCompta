import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  FileText, 
  Check, 
  Cpu, 
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Building,
  Calendar,
  User,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as arabicPersianReshaper from 'arabic-persian-reshaper';

export function ExportBar() {
  const { state, calculatedValues } = useApp();
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [excelSuccess, setExcelSuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Configuration parameters for the dynamic PDF structure
  const [showConfig, setShowConfig] = useState(false);
  const [companyName, setCompanyName] = useState(
    state.language === 'ar' ? "مؤسسة النجاح الصناعية (AnaCompta)" : 
    state.language === 'fr' ? "Entreprise Succès Industriel (AnaCompta)" : 
    "Succes Industrial Enterprise (AnaCompta)"
  );
  const [financialPeriod, setFinancialPeriod] = useState(
    state.language === 'ar' ? "الربع الأول من عام 2026" : 
    state.language === 'fr' ? "Exercice Comptable - Q1 2026" : 
    "Financial Period - Q1 2026"
  );
  const [authorName, setAuthorName] = useState(
    state.language === 'ar' ? "أمين الصندوق والمكلّف المالي" : 
    state.language === 'fr' ? "Responsable Comptable & Financier" : 
    "Chief Financial Officer"
  );
  const [authorDept, setAuthorDept] = useState<'accounting' | 'management_control' | 'finance'>('finance');

  const lang = state.language;
  const isRtl = lang === 'ar';

  const deptDesignation = {
    ar: {
      finance: "الإدارة المالية",
      accounting: "قسم المحاسبة",
      management_control: "قسم مراقبة التسيير"
    },
    fr: {
      finance: "Direction Financière",
      accounting: "Département Comptabilité",
      management_control: "Contrôle de Gestion"
    },
    en: {
      finance: "Financial Administration",
      accounting: "Accounting Department",
      management_control: "Management Control"
    }
  }[lang === 'ar' || lang === 'fr' ? lang : 'en'][authorDept];

  const preparerLine = `${authorName} (${deptDesignation})`;

  const t = {
    ar: {
      exportModule: "وحدة التصدير والتسوية",
      downloadExcel: "تحميل Excel (.xlsx)",
      downloadPdf: "تحميل PDF (تقرير ديناميكي)",
      excelDesc: "كل الجداول المنظمة",
      excelStatus: "تم تصدير ملف الإكسل بنجاح!",
      pdfStatus: "تم تحميل تقرير PDF الذكي بنجاح!",
      analogueSync: "متزامن مع البيانات",
      customizeReport: "تخصيص بيانات التقرير المطبوع",
      lblCompany: "اسم المؤسسة / الشركة",
      lblPeriod: "الفترة المالية",
      lblAuthor: "اسم معد التقرير",
      lblDept: "الجهة المعدة للتقرير",
      deptAccounting: "قسم المحاسبة",
      deptManagementControl: "قسم مراقبة التسيير",
      deptFinance: "الإدارة المالية",
      pdfLoading: "جاري استدعاء محرك التصدير الذكي...",
      pdfSuccessMsg: "تم تجميع التقرير وتنزيله!",
      errDownload: "فشلت العملية، الرجاء المحاولة مجدداً"
    },
    fr: {
      exportModule: "Module Exportation & TRCI",
      downloadExcel: "Télécharger Excel (.xlsx)",
      downloadPdf: "Télécharger PDF (Rapport)",
      excelDesc: "Toutes les feuilles",
      excelStatus: "Excel compilé avec succès !",
      pdfStatus: "Rapport PDF intelligent généré !",
      analogueSync: "Synchronisé",
      customizeReport: "Personnaliser les Métadonnées du Rapport",
      lblCompany: "Nom de l'Entreprise",
      lblPeriod: "Période Financière",
      lblAuthor: "Préparé par (Nom)",
      lblDept: "Département émetteur",
      deptAccounting: "Département Comptabilité",
      deptManagementControl: "Contrôle de Gestion",
      deptFinance: "Direction Financière",
      pdfLoading: "Compilation du document PDF...",
      pdfSuccessMsg: "Rapport exporté !",
      errDownload: "Erreur d'exportation"
    },
    en: {
      exportModule: "Exportation & TRCI Module",
      downloadExcel: "Download Excel (.xlsx)",
      downloadPdf: "Download PDF (Report)",
      excelDesc: "All structured spreadsheets",
      excelStatus: "Excel workbook compiled successfully!",
      pdfStatus: "Smart PDF report created successfully!",
      analogueSync: "Data Synced",
      customizeReport: "Customize Report Metadata",
      lblCompany: "Company / Organization",
      lblPeriod: "Financial Period",
      lblAuthor: "Prepared By (Name)",
      lblDept: "Issuing Department",
      deptAccounting: "Accounting Department",
      deptManagementControl: "Management Control",
      deptFinance: "Financial Administration",
      pdfLoading: "Engaging Smart PDF engine...",
      pdfSuccessMsg: "PDF created & downloaded!",
      errDownload: "Download failed, retry"
    }
  }[lang];

  // Convert number to clean formatted text
  const formatNum = (v: number) => {
    return typeof v === 'number' && !isNaN(v) 
      ? v.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
      : '0.00';
  };

  // Real-time Date picker fallback
  const getFormattedDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Excel core exporter (unchanged logical data, styled properly)
  const generateExcelReport = () => {
    setIsExportingExcel(true);
    try {
      const wb = XLSX.utils.book_new();

      // 1. Charges Indirectes (الأعباء غير المباشرة)
      const sheet1Headers = ["Centre de coût", "Nature des charges", "Montant", "Clé de répartition", "Charges réparties"];
      const sheet1Rows: any[] = [];
      
      state.trciRows.forEach(row => {
        if (row.isActive && row.type === 'indirect') {
          state.workshops.forEach(ws => {
            const pct = row.pcts[ws.id] || 0;
            if (pct > 0) {
              const distributedSum = (pct / 100) * row.totalAmount;
              sheet1Rows.push({
                "Centre de coût": ws.name,
                "Nature des charges": `${row.accountCode} - ${row.accountName}`,
                "Montant": row.totalAmount,
                "Clé de répartition": `${pct}%`,
                "Charges réparties": distributedSum
              });
            }
          });
        }
      });
      const ws1 = XLSX.utils.json_to_sheet(sheet1Rows, { header: sheet1Headers });
      XLSX.utils.book_append_sheet(wb, ws1, "Charges Indirectes");

      // 2. Coût d’Achat (تكلفة الشراء)
      const sheet2Headers = ["Matière première", "Quantité", "Prix unitaire", "Frais d’achat", "Coût total"];
      const sheet2Rows: any[] = [];
      const approUnitCost = calculatedValues.trciTotals.unitCosts['appro'] || 0;
      
      state.rawMaterials.forEach(rm => {
        const basicAmt = rm.purchaseQ * rm.purchaseP;
        const unitDirectP = rm.directExpenseMode === 'percentage'
          ? rm.purchaseP * ((rm.directExpensePct || 0) / 100)
          : (rm.directExpenseP || 0);
        const directAmt = rm.purchaseQ * unitDirectP;
        const indirectAmt = rm.purchaseQ * approUnitCost;
        const totalFrais = directAmt + indirectAmt;
        const totalCost = basicAmt + totalFrais;
        
        sheet2Rows.push({
          "Matière première": rm.name,
          "Quantité": rm.purchaseQ,
          "Prix unitaire": rm.purchaseP,
          "Frais d’achat": totalFrais,
          "Coût total": totalCost
        });
      });
      const ws2 = XLSX.utils.json_to_sheet(sheet2Rows, { header: sheet2Headers });
      XLSX.utils.book_append_sheet(wb, ws2, "Coût d’Achat");

      // 3. Coût de Production (تكلفة الإنتاج)
      const sheet3Headers = ["Produit", "Quantité produite", "Coût matières", "Main d’œuvre", "Charges indirectes", "Coût total production"];
      const sheet3Rows: any[] = [];
      
      state.products.forEach(p => {
        const pCost = calculatedValues.productCosts[p.id] || {
          rawMaterialCost: 0,
          modCost: 0,
          workshopCost: 0,
          totalProductionCost: 0
        };
        sheet3Rows.push({
          "Produit": p.name,
          "Quantité produite": p.productionVolume,
          "Coût matières": pCost.rawMaterialCost,
          "Main d’œuvre": pCost.modCost,
          "Charges indirectes": pCost.workshopCost,
          "Coût total production": pCost.totalProductionCost
        });
      });
      const ws3 = XLSX.utils.json_to_sheet(sheet3Rows, { header: sheet3Headers });
      XLSX.utils.book_append_sheet(wb, ws3, "Coût de Production");

      // 4. Prix de Revient (سعر التكلفة)
      const sheet4Headers = ["Produit", "Coût de production", "Frais di distribution", "Prix de revient total"];
      const sheet4Rows: any[] = [];
      
      state.products.forEach(p => {
        const pResult = calculatedValues.netResults[p.id] || {
          costOfSales: 0,
          distributionCost: 0,
          directDistributionCost: 0,
          totalCostPrice: 0
        };
        const totalFraisDist = pResult.distributionCost + pResult.directDistributionCost;
        sheet4Rows.push({
          "Produit": p.name,
          "Coût de production": pResult.costOfSales,
          "Frais de distribution": totalFraisDist,
          "Prix de revient total": pResult.totalCostPrice
        });
      });
      const ws4 = XLSX.utils.json_to_sheet(sheet4Rows, { header: sheet4Headers });
      XLSX.utils.book_append_sheet(wb, ws4, "Prix de Revient");

      // 5. Analyse Financière (النتيجة التحليلية)
      const sheet5Headers = ["Chiffre d’affaires", "Coût total", "Résultat (Profit/Loss)", "Marge bénéficiaire %", "Résumé"];
      const summary = calculatedValues.corporateSummary;
      const profit = summary.netCorporateProfit;
      const netMargin = summary.totalSales > 0 ? (profit / summary.totalSales) * 100 : 0;
      
      const statusText = profit >= 0 
        ? (lang === 'ar' 
            ? `المنشأة تحقق ربحاً صافياً إجمالياً قدره ${profit.toLocaleString()} دج بهامش ربح يبلغ ${netMargin.toFixed(2)}%. الأداء المالي ممتاز وإيجابي بناءً على المدخلات الحالية في AnaCompta ERP.`
            : `The business generated a net corporate profit of ${profit.toLocaleString()} DA with a net profit margin of ${netMargin.toFixed(2)}%. The financial performance is sound and healthy.`)
        : (lang === 'ar'
            ? `المنشأة تسجل عجزاً أو خسارة كلية قدرها ${Math.abs(profit).toLocaleString()} دج بهامش سلبي يبلغ ${netMargin.toFixed(2)}%. يوصى بتحسين تشغيل الأقسام والتأكد من ملاءمة أسعار البيع والتحكم السليم بالأعب.`
            : `The business recorded a net corporate loss of ${Math.abs(profit).toLocaleString()} DA with a net margin of ${netMargin.toFixed(2)}%. Operations review is recommended.`);

      const sheet5Rows = [{
        "Chiffre d’affaires": summary.totalSales,
        "Coût total": summary.totalCostPrice,
        "Résultat (Profit/Loss)": profit,
        "Marge bénéficiaire %": `${netMargin.toFixed(2)}%`,
        "Résumé": statusText
      }];
      const ws5 = XLSX.utils.json_to_sheet(sheet5Rows, { header: sheet5Headers });
      XLSX.utils.book_append_sheet(wb, ws5, "Analyse Financière");

      XLSX.writeFile(wb, `AnaCompta_ERP_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      setExcelSuccess(true);
      setTimeout(() => setExcelSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to generate robust Excel sheet", err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const generatePDFReport = async () => {
    setIsExportingPdf(true);
    setPdfError(null);
    try {
      const totalSales = calculatedValues.corporateSummary.totalSales;
      const totalCostPrice = calculatedValues.corporateSummary.totalCostPrice;
      const netCorporateProfit = calculatedValues.corporateSummary.netCorporateProfit;
      const isProfitPositive = netCorporateProfit >= 0;

      let sumRMQty = 0;
      let sumRMTotal = 0;
      const approUnitCostVal = calculatedValues.trciTotals.unitCosts['appro'] || 0;

      state.rawMaterials.forEach(rm => {
        const basicAmt = rm.purchaseQ * rm.purchaseP;
        const unitDirectP = rm.directExpenseMode === 'percentage'
          ? rm.purchaseP * ((rm.directExpensePct || 0) / 100)
          : (rm.directExpenseP || 0);
        const directAmt = rm.purchaseQ * unitDirectP;
        const indirectAmt = rm.purchaseQ * approUnitCostVal;
        const totalCost = basicAmt + directAmt + indirectAmt;

        sumRMQty += rm.purchaseQ;
        sumRMTotal += totalCost;
      });

      let prodQtySum = 0;
      let prodTotalCostSum = 0;
      state.products.forEach(p => {
        const pCost = calculatedValues.productCosts[p.id] || { totalProductionCost: 0 };
        prodQtySum += p.productionVolume;
        prodTotalCostSum += pCost.totalProductionCost;
      });
      const prodUnitCostAvg = prodQtySum > 0 ? (prodTotalCostSum / prodQtySum) : 0;

      let distQtySum = 0;
      let distTotalCostSum = 0;
      state.products.forEach(p => {
        const pResult = calculatedValues.netResults[p.id] || { distributionCost: 0, directDistributionCost: 0 };
        distQtySum += p.quantitySold;
        distTotalCostSum += (pResult.distributionCost + pResult.directDistributionCost);
      });
      const distUnitCostAvg = distQtySum > 0 ? (distTotalCostSum / distQtySum) : 0;

      const costPriceQtySum = distQtySum;
      const costPriceTotalSum = totalCostPrice;
      const costPriceUnitAvg = costPriceQtySum > 0 ? (costPriceTotalSum / costPriceQtySum) : 0;

      const salesQtySum = distQtySum;
      const salesTotalSum = totalSales;
      const salesUnitPriceAvg = salesQtySum > 0 ? (salesTotalSum / salesQtySum) : 0;

      const resultQtySum = distQtySum;
      const resultTotalSum = netCorporateProfit;
      const resultUnitPriceAvg = resultQtySum > 0 ? (resultTotalSum / resultQtySum) : 0;

      const f = (v: number) => formatNum(v);

      const issueDateStr = getFormattedDate();

      let htmlTemplate = '';

      if (lang === 'ar') {
        const aiBoxContent = isProfitPositive ? `
          <div class="ai-box ai-positive">
              <span class="ai-box-title">🟢 تقييم الكفاءة والربحية:</span>
              توضح المؤشرات المحاسبية تحقيق كفاءة تشغيلية ممتازة وهوامش أمان مرتفعة نتيجة لـ:
              <ul>
                  <li><strong>الاستخدام الاستراتيجي للموارد:</strong> نجاح الإدارة في ضبط عمليات التشغيل والحد التام من هدر وضياع المواد الأولية وساعات العمل.</li>
                  <li><strong>تحقيق وفورات الحجم (Economies of Scale):</strong> استغلال الطاقة الإنتاجية بشكل ممتاز وزع الأعباء الثابتة على حجم إنتاج كبير، مما قلل السعر الوحدوي للتكلفة ورفع هامش الربحية.</li>
              </ul>
          </div>` : `
          <div class="ai-box ai-negative">
              <span class="ai-box-title">🔴 تشخيص حالة العجز والهدر:</span>
              تشير التحليلات الرقمية إلى وجود انحراف مالي سلبي يعود للمسببات الاستراتيجية التالية:
              <ul>
                  <li><strong>تضخم السعر الوحدوي للتكلفة:</strong> تجاوز سعر التكلفة النهائي للوحدة سعر البيع التنافسي المتاح في السوق، مما أدى لعدم قدرة الهامش على تغطية المصاريف.</li>
                  <li><strong>رصد بؤر هدر مباشر:</strong> تسجيل انحراف سلبي في معدلات استهلاك المواد الأولية لكل وحدة منتجة مقارنة بالمعايير الهندسية المصممة للمنتج.</li>
                  <li><strong>ضعف كفاءة استغلال الطاقة:</strong> تحمل المنتج أعباء ثابتة إضافية نتيجة عدم تشغيل المصنع بالطاقة الإنتاجية المثالية.</li>
              </ul>
          </div>`;

        htmlTemplate = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تقرير المحاسبة التحليلية النهائي</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: system-ui, sans-serif; background: #fff; color: #2d3748; margin: 0; direction: rtl; line-height: 1.5; font-size: 11pt; padding: 10px; }
        .report-header { text-align: center; margin-bottom: 25px; border-bottom: 3px double #2b6cb0; padding-bottom: 12px; }
        .main-title { font-size: 24pt; font-weight: bold; color: #1a365d; margin: 0; }
        .metadata-section { width: 100%; margin-bottom: 30px; border-collapse: collapse; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
        .metadata-section td { padding: 10px 15px; font-size: 10.5pt; color: #2d3748; border-bottom: 1px solid #edf2f7; }
        .metadata-section td strong { color: #2b6cb0; }
        h2 { font-size: 14pt; color: #1a365d; border-right: 5px solid #2b6cb0; padding-right: 12px; margin-top: 30px; margin-bottom: 15px; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        table.data-table th { background-color: #2b6cb0; color: #fff; font-weight: bold; padding: 10px; border: 1px solid #cbd5e0; font-size: 10pt; }
        table.data-table td { padding: 10px; border: 1px solid #e2e8f0; text-align: center; font-size: 10pt; }
        table.data-table tr.category-row { background-color: #ebf8ff; font-weight: bold; }
        table.data-table tr.category-row td { text-align: right; color: #2c5282; padding-right: 15px; }
        table.data-table tr.total-row { background-color: #edf2f7; font-weight: bold; }
        table.data-table tr.final-result-row { background-color: #feebc8; font-weight: bold; font-size: 11pt; border: 2px solid #dd6b20; }
        .ai-box { padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; }
        .ai-box-title { font-weight: bold; font-size: 11.5pt; margin-bottom: 8px; display: block; }
        .ai-negative { background-color: #fff5f5; border-right: 5px solid #e53e3e; color: #9b2c2c; }
        .ai-positive { background-color: #f0fff4; border-right: 5px solid #38a169; color: #22543d; }
        .recommendation-box { background-color: #f7fafc; border-right: 5px solid #4a5568; color: #2d3748; padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; }
        .recommendation-title { font-weight: bold; font-size: 11.5pt; color: #1a365d; margin-bottom: 8px; display: block; }
        ul { padding-right: 25px; margin: 6px 0 0 0; list-style-type: square; }
        li { margin-bottom: 6px; text-align: right; }
        .page-footer-custom { display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 30px; font-size: 9pt; color: #718096; }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="main-title">تقرير المحاسبة التحليلية النهائي</div>
    </div>
    <table class="metadata-section">
        <tr>
            <td style="width: 50%;"><strong>اسم المؤسسة:</strong> ${companyName || '-'}</td>
            <td style="width: 50%;"><strong>الفترة المالية:</strong> ${financialPeriod || '-'}</td>
        </tr>
        <tr>
            <td><strong>تاريخ الإصدار:</strong> ${issueDateStr || '-'}</td>
            <td><strong>إعداد:</strong> ${preparerLine || '-'}</td>
        </tr>
    </table>
    <h2>أولاً: الجدول الملخص للتكاليف والأسعار الوحدوية</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th>البيان (المادة / المنتج)</th>
                <th>الكمية</th>
                <th>السعر الوحدوي ($)</th>
                <th>المبلغ الإجمالي ($)</th>
            </tr>
        </thead>
        <tbody>
            <tr class="category-row"><td colspan="4">1. المواد الأولية (Raw Materials)</td></tr>
            <tr>
                <td style="text-align: right; padding-right: 25px;">• تكلفة شراء المادة الأولية</td>
                <td>${f(sumRMQty)}</td>
                <td>${f(sumRMQty > 0 ? (sumRMTotal / sumRMQty) : 0)}</td>
                <td>${f(sumRMTotal)}</td>
            </tr>
            <tr class="total-row">
                <td style="text-align: right;">إجمالي تكلفة شراء المواد</td>
                <td>${f(sumRMQty)}</td>
                <td>${f(sumRMQty > 0 ? (sumRMTotal / sumRMQty) : 0)}</td>
                <td>${f(sumRMTotal)}</td>
            </tr>
            <tr class="category-row"><td colspan="4">2. المنتجات المصنعة والجاهزة (Finished Products)</td></tr>
            <tr>
                <td style="text-align: right; padding-right: 25px;">• تكلفة إنتاج المنتج النهائي</td>
                <td>${f(prodQtySum)}</td>
                <td>${f(prodUnitCostAvg)}</td>
                <td>${f(prodTotalCostSum)}</td>
            </tr>
            <tr>
                <td style="text-align: right; padding-right: 25px;">• مصاريف التوزيع والبيع</td>
                <td>${f(distQtySum)}</td>
                <td>${f(distUnitCostAvg)}</td>
                <td>${f(distTotalCostSum)}</td>
            </tr>
            <tr class="total-row">
                <td style="text-align: right;">سعر التكلفة النهائي (Cost Price)</td>
                <td>${f(costPriceQtySum)}</td>
                <td>${f(costPriceUnitAvg)}</td>
                <td>${f(costPriceTotalSum)}</td>
            </tr>
            <tr>
                <td style="text-align: right; font-weight: bold; color: #2b6cb0;">• رقم الأعمال (إيرادات المبيعات)</td>
                <td>${f(salesQtySum)}</td>
                <td>${f(salesUnitPriceAvg)}</td>
                <td>${f(salesTotalSum)}</td>
            </tr>
            <tr class="final-result-row">
                <td style="text-align: right;">3. النتيجة التحليلية الصافية للمنتج</td>
                <td>${f(resultQtySum)}</td>
                <td>${f(resultUnitPriceAvg)}</td>
                <td>${f(resultTotalSum)}</td>
            </tr>
        </tbody>
    </table>
    <h2>ثانياً: ملخص وضعية المؤسسة (التحليل الذكي المدعوم بـ SSC)</h2>
    ${aiBoxContent}
    <h2>ثالثاً: توصيات وخطط مستقبلية استراتيجية</h2>
    <div class="recommendation-box">
        <span class="recommendation-title">📋 الإجراءات والخطط التصحيحية المقترحة من قِبل نظام SSC:</span>
        <ul>
            <li><strong>إعادة هندسة أسعار التكلفة:</strong> ضرورة العمل على تطبيق منهجية التكلفة المستهدفة (Target Costing) لربط عمليات التصميم والتصنيع بمتطلبات السوق مباشرة.</li>
            <li><strong>معالجة انحرافات المواد والهدر:</strong> تكثيف الرقابة على خطوط الإنتاج، وتدريب العمالة لتقليل نسب التالف والضياع في المواد الأولية.</li>
            <li><strong>تطوير سياسات الشراء اللوجستية:</strong> إعادة التفاوض على عقود التوريد للحصول على خصومات كمية تخفض من سعر التكلفة الوحدوي للمشتريات.</li>
            <li><strong>تحسين مزيج المبيعات:</strong> التركيز الاستراتيجي على المنتجات ذات الهوامش التحليلية المرتفعة، وإعادة النظر في تسعير أو خطوط إنتاج المنتجات الضعيفة أو الخاسرة.</li>
        </ul>
    </div>
    <div class="page-footer-custom">
        <span>نظام التقييم الاستراتيجي للتكاليف | SSC</span>
        <span>صفحة 1 من 1</span>
    </div>
</body>
</html>`;
      } else if (lang === 'fr') {
        const aiBoxContent = isProfitPositive ? `
          <div class="ai-box ai-positive">
              <span class="ai-box-title">🟢 Évaluation de l'Efficacité et de la Rentabilité:</span>
              Les indicateurs comptables démontrent une excellente efficacité opérationnelle et des marges de sécurité élevées grâce à:
              <ul>
                  <li><strong>Utilisation Stratégique des Ressources:</strong> Maîtrise rigoureuse des opérations par la direction, entraînant une réduction totale du gaspillage de matières premières et des heures de main-d'œuvre inactives.</li>
                  <li><strong>Réalisation d'Économies d'Échelle:</strong> L'exploitation optimale de la capacité de production a permis de répartir les charges fixes sur un volume important, réduisant ainsi le coût de revient unitaire et augmentant la rentabilité.</li>
              </ul>
          </div>` : `
          <div class="ai-box ai-negative">
              <span class="ai-box-title">🔴 Diagnostic de Déficit et de Gaspillage:</span>
              Les analyses numériques indiquent un écart financier négatif dû aux facteurs stratégiques suivants:
              <ul>
                  <li><strong>Inflation du Coût de Revient Unitaire:</strong> Le coût de revient final par unité a dépassé le prix de vente concurrentiel du marché, empêchant la marge de couvrir les charges globales.</li>
                  <li><strong>Détection de Gaspillage Direct:</strong> Un écart négatif a été enregistré dans les taux de consommation de matières premières par unité produite par rapport aux normes techniques du produit.</li>
                  <li><strong>Sous-utilisation de la Capacité:</strong> Le produit a absorbé des charges fixes supplémentaires en raison d'une exploitation sous-optimale de la capacité de production de l'usine.</li>
              </ul>
          </div>`;

        htmlTemplate = `
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Rapport Analytique Final</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: system-ui, sans-serif; background: #fff; color: #2d3748; margin: 0; direction: ltr; line-height: 1.5; font-size: 11pt; padding: 10px; }
        .report-header { text-align: center; margin-bottom: 25px; border-bottom: 3px double #2b6cb0; padding-bottom: 12px; }
        .main-title { font-size: 24pt; font-weight: bold; color: #1a365d; margin: 0; }
        .metadata-section { width: 100%; margin-bottom: 30px; border-collapse: collapse; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
        .metadata-section td { padding: 10px 15px; font-size: 10.5pt; color: #2d3748; border-bottom: 1px solid #edf2f7; }
        .metadata-section td strong { color: #2b6cb0; }
        h2 { font-size: 14pt; color: #1a365d; border-left: 5px solid #2b6cb0; padding-left: 12px; margin-top: 30px; margin-bottom: 15px; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        table.data-table th { background-color: #2b6cb0; color: #fff; font-weight: bold; padding: 10px; border: 1px solid #cbd5e0; font-size: 10pt; }
        table.data-table td { padding: 10px; border: 1px solid #e2e8f0; text-align: center; font-size: 10pt; }
        table.data-table tr.category-row { background-color: #ebf8ff; font-weight: bold; }
        table.data-table tr.category-row td { text-align: left; color: #2c5282; padding-left: 15px; }
        table.data-table tr.total-row { background-color: #edf2f7; font-weight: bold; }
        table.data-table tr.final-result-row { background-color: #feebc8; font-weight: bold; font-size: 11pt; border: 2px solid #dd6b20; }
        .ai-box { padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; }
        .ai-box-title { font-weight: bold; font-size: 11.5pt; margin-bottom: 8px; display: block; }
        .ai-negative { background-color: #fff5f5; border-left: 5px solid #e53e3e; color: #9b2c2c; }
        .ai-positive { background-color: #f0fff4; border-left: 5px solid #38a169; color: #22543d; }
        .recommendation-box { background-color: #f7fafc; border-left: 5px solid #4a5568; color: #2d3748; padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; }
        .recommendation-title { font-weight: bold; font-size: 11.5pt; color: #1a365d; margin-bottom: 8px; display: block; }
        ul { padding-left: 25px; margin: 6px 0 0 0; list-style-type: square; }
        li { margin-bottom: 6px; text-align: left; }
        .page-footer-custom { display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 30px; font-size: 9pt; color: #718096; }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="main-title">Rapport Analytique Final</div>
    </div>
    <table class="metadata-section">
        <tr>
            <td style="width: 50%;"><strong>Nom de l'Entreprise:</strong> ${companyName || '-'}</td>
            <td style="width: 50%;"><strong>Période Financière:</strong> ${financialPeriod || '-'}</td>
        </tr>
        <tr>
            <td><strong>Date d'Émission:</strong> ${issueDateStr || '-'}</td>
            <td><strong>Préparé par:</strong> ${preparerLine || '-'}</td>
        </tr>
    </table>
    <h2>I. Tableau Récapitulatif des Coûts et Prix Unitaires</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th>Désignation (Matière / Produit)</th>
                <th>Quantité</th>
                <th>Prix Unitaire ($)</th>
                <th>Montant Total ($)</th>
            </tr>
        </thead>
        <tbody>
            <tr class="category-row"><td colspan="4">1. Matières Premières</td></tr>
            <tr>
                <td style="text-align: left; padding-left: 25px;">• Coût d'Achat des Matières Premières</td>
                <td>${f(sumRMQty)}</td>
                <td>${f(sumRMQty > 0 ? (sumRMTotal / sumRMQty) : 0)}</td>
                <td>${f(sumRMTotal)}</td>
            </tr>
            <tr class="total-row">
                <td style="text-align: left;">Coût d'Achat Total des Matières</td>
                <td>${f(sumRMQty)}</td>
                <td>${f(sumRMQty > 0 ? (sumRMTotal / sumRMQty) : 0)}</td>
                <td>${f(sumRMTotal)}</td>
            </tr>
            <tr class="category-row"><td colspan="4">2. Produits Finis</td></tr>
            <tr>
                <td style="text-align: left; padding-left: 25px;">• Coût de Production du Produit Fini</td>
                <td>${f(prodQtySum)}</td>
                <td>${f(prodUnitCostAvg)}</td>
                <td>${f(prodTotalCostSum)}</td>
            </tr>
            <tr>
                <td style="text-align: left; padding-left: 25px;">• Frais de Distribution et de Vente</td>
                <td>${f(distQtySum)}</td>
                <td>${f(distUnitCostAvg)}</td>
                <td>${f(distTotalCostSum)}</td>
            </tr>
            <tr class="total-row">
                <td style="text-align: left;">Coût de Revient Final</td>
                <td>${f(costPriceQtySum)}</td>
                <td>${f(costPriceUnitAvg)}</td>
                <td>${f(costPriceTotalSum)}</td>
            </tr>
            <tr>
                <td style="text-align: left; font-weight: bold; color: #2b6cb0;">• Chiffre d'Affaires (Revenus des Ventes)</td>
                <td>${f(salesQtySum)}</td>
                <td>${f(salesUnitPriceAvg)}</td>
                <td>${f(salesTotalSum)}</td>
            </tr>
            <tr class="final-result-row">
                <td style="text-align: left;">3. Résultat Analytique Net du Produit</td>
                <td>${f(resultQtySum)}</td>
                <td>${f(resultUnitPriceAvg)}</td>
                <td>${f(resultTotalSum)}</td>
            </tr>
        </tbody>
    </table>
    <h2>II. Résumé de la Situation de l'Entreprise (Analyse IA par SSC)</h2>
    ${aiBoxContent}
    <h2>III. Recommandations et Plans Futurs Stratégiques</h2>
    <div class="recommendation-box">
        <span class="recommendation-title">📋 Actions Correctives et Plans Proposés par le Système SSC:</span>
        <ul>
            <li><strong>Réingénierie du Coût de Revient:</strong> Déployer la méthodologie du Coût Cible (Target Costing) pour aligner directement les processus de conception et de fabrication sur les exigences du marché.</li>
            <li><strong>Traitement des Écarts de Matières:</strong> Renforcer le contrôle sur les lignes de production et former le personnel pour réduire les taux de rebuts et de déchets de matières premières.</li>
            <li><strong>Optimisation de la Politique d'Achat:</strong> Renégocier les contrats d'approvisionnement pour obtenir des remises sur volume, abaissant ainsi le coût d'achat unitaire des matières.</li>
            <li><strong>Optimisation du Mix de Vente:</strong> Concentrer les efforts stratégiques sur les produits à forte marge analytique, tout en réévaluant les prix ou le maintien des lignes de produits non rentables.</li>
        </ul>
    </div>
    <div class="page-footer-custom">
        <span>Système d'Évaluation Stratégique des Coûts | SSC</span>
        <span>Page 1 de 1</span>
    </div>
</body>
</html>`;
      } else {
        const aiBoxContent = isProfitPositive ? `
          <div class="ai-box ai-positive">
              <span class="ai-box-title">🟢 Evaluation of Efficiency and Profitability:</span>
              Accounting indicators demonstrate excellent operational efficiency and high safety margins resulting from:
              <ul>
                  <li><strong>Strategic Resource Utilization:</strong> Successful management control over operations, resulting in the total minimization of raw material waste and idle labor hours.</li>
                  <li><strong>Achieving Economies of Scale:</strong> Optimal utilization of production capacity distributed fixed overheads over a large production volume, reducing unit cost price and increasing profitability margins.</li>
              </ul>
          </div>` : `
          <div class="ai-box ai-negative">
              <span class="ai-box-title">🔴 Diagnosis of Deficit and Waste:</span>
              Numerical analysis indicates a negative financial variance due to the following strategic factors:
              <ul>
                  <li><strong>Inflation of Unit Cost Price:</strong> The final cost price per unit exceeded the competitive market selling price, preventing the margin from covering total expenses.</li>
                  <li><strong>Detection of Direct Waste:</strong> A negative variance was recorded in raw material consumption rates per unit produced compared to the engineered standards of the product.</li>
                  <li><strong>Low Capacity Utilization Efficiency:</strong> The product absorbed additional fixed overheads due to underutilization of the plant's optimal production capacity.</li>
              </ul>
          </div>`;

        htmlTemplate = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Final Analytical Accounting Report</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: system-ui, sans-serif; background: #fff; color: #2d3748; margin: 0; direction: ltr; line-height: 1.5; font-size: 11pt; padding: 10px; }
        .report-header { text-align: center; margin-bottom: 25px; border-bottom: 3px double #2b6cb0; padding-bottom: 12px; }
        .main-title { font-size: 24pt; font-weight: bold; color: #1a365d; margin: 0; }
        .metadata-section { width: 100%; margin-bottom: 30px; border-collapse: collapse; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
        .metadata-section td { padding: 10px 15px; font-size: 10.5pt; color: #2d3748; border-bottom: 1px solid #edf2f7; }
        .metadata-section td strong { color: #2b6cb0; }
        h2 { font-size: 14pt; color: #1a365d; border-left: 5px solid #2b6cb0; padding-left: 12px; margin-top: 30px; margin-bottom: 15px; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        table.data-table th { background-color: #2b6cb0; color: #fff; font-weight: bold; padding: 10px; border: 1px solid #cbd5e0; font-size: 10pt; }
        table.data-table td { padding: 10px; border: 1px solid #e2e8f0; text-align: center; font-size: 10pt; }
        table.data-table tr.category-row { background-color: #ebf8ff; font-weight: bold; }
        table.data-table tr.category-row td { text-align: left; color: #2c5282; padding-left: 15px; }
        table.data-table tr.total-row { background-color: #edf2f7; font-weight: bold; }
        table.data-table tr.final-result-row { background-color: #feebc8; font-weight: bold; font-size: 11pt; border: 2px solid #dd6b20; }
        .ai-box { padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; }
        .ai-box-title { font-weight: bold; font-size: 11.5pt; margin-bottom: 8px; display: block; }
        .ai-negative { background-color: #fff5f5; border-left: 5px solid #e53e3e; color: #9b2c2c; }
        .ai-positive { background-color: #f0fff4; border-left: 5px solid #38a169; color: #22543d; }
        .recommendation-box { background-color: #f7fafc; border-left: 5px solid #4a5568; color: #2d3748; padding: 15px 20px; border-radius: 6px; margin-bottom: 25px; }
        .recommendation-title { font-weight: bold; font-size: 11.5pt; color: #1a365d; margin-bottom: 8px; display: block; }
        ul { padding-left: 25px; margin: 6px 0 0 0; list-style-type: square; }
        li { margin-bottom: 6px; text-align: left; }
        .page-footer-custom { display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 30px; font-size: 9pt; color: #718096; }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="main-title">Final Cost Price Accounting Report</div>
    </div>
    <table class="metadata-section">
        <tr>
            <td style="width: 50%;"><strong>Company Name:</strong> ${companyName || '-'}</td>
            <td style="width: 50%;"><strong>Financial Period:</strong> ${financialPeriod || '-'}</td>
        </tr>
        <tr>
            <td><strong>Issue Date:</strong> ${issueDateStr || '-'}</td>
            <td><strong>Prepared by:</strong> ${preparerLine || '-'}</td>
        </tr>
    </table>
    <h2>I. Summary Table of Costs and Unit Prices</h2>
    <table class="data-table">
        <thead>
            <tr>
                <th>Description (Material / Product)</th>
                <th>Quantity</th>
                <th>Unit Price ($)</th>
                <th>Total Amount ($)</th>
            </tr>
        </thead>
        <tbody>
            <tr class="category-row"><td colspan="4">1. Raw Materials</td></tr>
            <tr>
                <td style="text-align: left; padding-left: 25px;">• Raw Material Purchase Cost</td>
                <td>${f(sumRMQty)}</td>
                <td>${f(sumRMQty > 0 ? (sumRMTotal / sumRMQty) : 0)}</td>
                <td>${f(sumRMTotal)}</td>
            </tr>
            <tr class="total-row">
                <td style="text-align: left;">Total Materials Purchase Cost</td>
                <td>${f(sumRMQty)}</td>
                <td>${f(sumRMQty > 0 ? (sumRMTotal / sumRMQty) : 0)}</td>
                <td>${f(sumRMTotal)}</td>
            </tr>
            <tr class="category-row"><td colspan="4">2. Finished Products</td></tr>
            <tr>
                <td style="text-align: left; padding-left: 25px;">• Finished Product Production Cost</td>
                <td>${f(prodQtySum)}</td>
                <td>${f(prodUnitCostAvg)}</td>
                <td>${f(prodTotalCostSum)}</td>
            </tr>
            <tr>
                <td style="text-align: left; padding-left: 25px;">• Distribution and Sales Expenses</td>
                <td>${f(distQtySum)}</td>
                <td>${f(distUnitCostAvg)}</td>
                <td>${f(distTotalCostSum)}</td>
            </tr>
            <tr class="total-row">
                <td style="text-align: left;">Final Cost Price</td>
                <td>${f(costPriceQtySum)}</td>
                <td>${f(costPriceUnitAvg)}</td>
                <td>${f(costPriceTotalSum)}</td>
            </tr>
            <tr>
                <td style="text-align: left; font-weight: bold; color: #2b6cb0;">• Turnover (Sales Revenue)</td>
                <td>${f(salesQtySum)}</td>
                <td>${f(salesUnitPriceAvg)}</td>
                <td>${f(salesTotalSum)}</td>
            </tr>
            <tr class="final-result-row">
                <td style="text-align: left;">3. Net Analytical Result of the Product</td>
                <td>${f(resultQtySum)}</td>
                <td>${f(resultUnitPriceAvg)}</td>
                <td>${f(resultTotalSum)}</td>
            </tr>
        </tbody>
    </table>
    <h2>II. Company Status Summary (AI-Driven Analysis by SSC)</h2>
    ${aiBoxContent}
    <h2>III. Strategic Recommendations and Future Plans</h2>
    <div class="recommendation-box">
        <span class="recommendation-title">📋 Corrective Actions and Plans Proposed by the SSC System:</span>
        <ul>
            <li><strong>Cost Price Re-engineering:</strong> Implement Target Costing methodology to align design and manufacturing processes directly with market requirements.</li>
            <li><strong>Addressing Material Variances and Waste:</strong> Intensify shop-floor control and provide targeted training to reduce defect and scrap rates in raw materials.</li>
            <li><strong>Developing Logistics and Procurement Policies:</strong> Renegotiate supply contracts to secure volume discounts, lowering the unit purchase cost of materials.</li>
            <li><strong>Optimizing Sales Mix:</strong> Shift strategic focus toward products with higher analytical margins, while reviewing the pricing or continuation of low-performing or unprofitable product lines.</li>
        </ul>
    </div>
    <div class="page-footer-custom">
        <span>Smart Strategic Costing System | SSC</span>
        <span>Page 1 of 1</span>
    </div>
</body>
</html>`;
      }

      console.log("PDF Export: Generating dynamic HTML in sandboxed iframe...");

      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '800px';
      iframe.style.height = 'auto';
      document.body.appendChild(iframe);

      const docNode = iframe.contentDocument || iframe.contentWindow?.document;
      if (!docNode) {
        throw new Error("Cannot interface with iframe document context");
      }

      docNode.open();
      docNode.write(htmlTemplate);
      docNode.close();

      await new Promise((resolve) => setTimeout(resolve, 250));

      const iframeBody = docNode.body;
      const canvas = await html2canvas(iframeBody, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      if (heightLeft <= pageHeight + 2) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        while (heightLeft > 2) {
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
          position -= pageHeight;
          if (heightLeft > 2) {
            pdf.addPage();
          }
        }
      }

      pdf.save(`AnaCompta_Report_${companyName.trim().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '_')}_${financialPeriod.trim().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '_')}.pdf`);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 5000);
    } catch (err: any) {
      console.error("Failed compiling smart PDF report doc", err);
      setPdfError(`${t.errDownload}: ${err?.message || err || "Error"}`);
      setTimeout(() => setPdfError(null), 8000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div 
      id="anacompta-export-module-bar" 
      className="bg-[#0b1227] border border-indigo-950/70 p-4 sm:p-5 rounded-2xl flex flex-col gap-4 shadow-2xl text-slate-200"
    >
      {/* Upper banner section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and sync badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-650/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-100 font-sans">
                {t.exportModule}
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.analogueSync}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
              {lang === 'ar' 
                ? 'مستند مالي تفصيلي متعدد اللغات وقابل للتحميل والتعديل في ثوانٍ' 
                : 'Instantly download state-accurate multi-lingual financial spreadsheets and PDF summaries'}
            </p>
          </div>
        </div>

        {/* Dynamic Buttons and actions line */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Customizer Collapse click button */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 text-slate-300 rounded-xl cursor-pointertransition-all"
            title={t.customizeReport}
          >
            <span>{t.customizeReport}</span>
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Excel compilation downloads triggers */}
          <button
            id="btn-export-excel"
            disabled={isExportingExcel}
            onClick={generateExcelReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/15 disabled:opacity-50 cursor-pointer active:scale-95"
            title={t.downloadExcel}
          >
            {isExportingExcel ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px] font-extrabold">{t.downloadExcel}</span>
          </button>

          {/* High quality dynamic PDF report compiler */}
          <button
            id="btn-export-pdf"
            disabled={isExportingPdf}
            onClick={generatePDFReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 py-2 px-3.5 bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/15 disabled:opacity-50 cursor-pointer active:scale-95"
            title={t.downloadPdf}
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-indigo-100" />
            )}
            <span className="text-[11px] font-extrabold">{t.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Success/Error alert banner micro-animations */}
      <div className="flex flex-col gap-1.5">
        {excelSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.excelStatus}</span>
          </motion.div>
        )}

        {pdfSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 py-2 px-3 rounded-xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
            <span>{t.pdfStatus} ({preparerLine})</span>
          </motion.div>
        )}

        {pdfError && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-xl flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{pdfError}</span>
          </motion.div>
        )}

        {isExportingPdf && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-950/20 border border-indigo-500/15 py-2 px-3 rounded-xl flex items-center gap-2"
          >
            <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
            <span>{t.pdfLoading}</span>
          </motion.div>
        )}
      </div>

      {/* Collapsible Tuning panel row layout */}
      {showConfig && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-900 pt-4 mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 align-end font-sans"
        >
          {/* Company Name customizable field */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.lblCompany}</span>
            </span>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-850 p-2 text-xs text-slate-100 rounded-xl focus:outline-none focus:border-indigo-550 transition-colors"
              placeholder="E.g. AnaCompta Group"
            />
          </div>

          {/* Financial Period customizable field */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.lblPeriod}</span>
            </span>
            <input 
              type="text" 
              value={financialPeriod}
              onChange={(e) => setFinancialPeriod(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-850 p-2 text-xs text-slate-100 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Q1 2026"
            />
          </div>

          {/* Author Name customizable field */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.lblAuthor}</span>
            </span>
            <input 
              type="text" 
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-850 p-2 text-xs text-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

          {/* Author Department selector dropdown */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.lblDept}</span>
            </span>
            <select 
              value={authorDept}
              onChange={(e) => setAuthorDept(e.target.value as any)}
              className="w-full bg-slate-950/90 border border-slate-850 p-2 text-xs text-slate-100 rounded-xl cursor-pointer focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="finance">{t.deptFinance}</option>
              <option value="accounting">{t.deptAccounting}</option>
              <option value="management_control">{t.deptManagementControl}</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
}
