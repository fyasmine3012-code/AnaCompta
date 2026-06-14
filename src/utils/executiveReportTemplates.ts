export interface ExecutiveTemplateData {
  company_name: string;
  report_id: string;
  financial_period: string;
  issue_date: string;
  issue_time: string;
  profit_or_loss_status: string;
  improvement_status: string;
  business_health_score: number;
  health_status_label: string;
  kpi_turnover: string;
  kpi_total_cost_price: string;
  kpi_net_result: string;
  kpi_waste_value: string;
  profit_margin_percentage: string;
  product_name_1: string;
  prod_cost_1: string;
  prod_sale_1: string;
  prod_margin_1: string;
  prod_status_1: string;
  product_name_2: string;
  prod_cost_2: string;
  prod_sale_2: string;
  prod_margin_2: string;
  prod_status_2: string;
  most_profitable_prod: string;
  least_profitable_prod: string;
  score_profitability_val: number;
  profitability_label: string;
  score_cost_control_val: number;
  score_prod_efficiency_val: number;
  score_ops_val: number;
  score_resources_val: number;
  score_stability_val: number;
  most_impactful_cost_element: string;
  waste_percentage: string;
  highest_waste_workshop: string;
  standard_cost_total: string;
  actual_cost_total: string;
  variance_value: string;
  variance_direction_label: string;
  financial_risk_level_label: string;
  pred_purchase_cost: string;
  pred_production_cost: string;
  pred_cost_price: string;
  pred_waste_ratio: string;
  ai_confidence_score: number;
  report_digital_fingerprint: string;
}

export function getExecutiveReportTemplate(lang: 'ar' | 'fr' | 'en', d: ExecutiveTemplateData): string {
  if (lang === 'ar') {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>التقرير التنفيذي الذكي - AnaCompta AI</title>
    <style>
        @page {
            size: A4;
            margin: 15mm 15mm;
            @bottom-left { 
                content: "صفحة " counter(page) " من " counter(pages); 
                font-family: system-ui, sans-serif; 
                font-size: 8.5pt; 
                color: #a0aec0; 
            }
            @bottom-right { 
                content: "تقرير تنفيذي مؤتمت | منصة AnaCompta AI"; 
                font-family: system-ui, sans-serif; 
                font-size: 8.5pt; 
                color: #a0aec0; 
            }
        }
        
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background-color: #ffffff; 
            color: #2d3748; 
            margin: 0; 
            direction: rtl; 
            line-height: 1.4; 
            font-size: 10pt; 
        }

        .page-1 { page-break-after: always; }
        .page-2 { page-break-inside: avoid; }

        .exec-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2b6cb0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .platform-branding { font-size: 10pt; font-weight: bold; color: #4a5568; text-align: left;}
        .platform-branding span { color: #3182ce; }
        .company-branding { font-size: 12pt; font-weight: bold; color: #1a365d; }
        .report-main-title { font-size: 20pt; font-weight: 800; color: #1a365d; text-align: center; margin: 10px 0; }

        .meta-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: #f7fafc;
            border: 1px solid #e2e8f0;
        }
        .meta-grid td { padding: 8px 12px; border: 1px solid #edf2f7; font-size: 9.5pt;}
        .meta-grid td strong { color: #2b6cb0; }

        h2.section-title {
            font-size: 13pt;
            color: #1a365d;
            background: #ebf8ff;
            padding: 6px 12px;
            border-right: 4px solid #2b6cb0;
            margin-top: 15px;
            margin-bottom: 10px;
        }

        .executive-summary-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 6px;
            font-size: 10pt;
            text-align: justify;
        }

        .kpi-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        .kpi-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .kpi-card.blue { border-top: 3px solid #3182ce; }
        .kpi-card.green { border-top: 3px solid #38a169; }
        .kpi-card.orange { border-top: 3px solid #dd6b20; }
        .kpi-card.red { border-top: 3px solid #e53e3e; }
        .kpi-label { font-size: 8.5pt; color: #718096; display: block; margin-bottom: 4px; }
        .kpi-value { font-size: 13pt; font-weight: bold; color: #1a365d; }

        .score-flex-layout {
            display: flex;
            gap: 15px;
            align-items: center;
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .gauge-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: conic-gradient(#38a169 calc(${d.business_health_score} * 1%), #edf2f7 0);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .gauge-circle::before {
            content: "";
            position: absolute;
            width: 72px;
            height: 72px;
            background: white;
            border-radius: 50%;
        }
        .gauge-inner-text {
            position: relative;
            font-size: 14pt;
            font-weight: 800;
            color: #1a365d;
            text-align: center;
            line-height: 1;
        }
        .gauge-inner-text span { font-size: 9pt; color: #718096; display: block; font-weight: normal; margin-top: 2px;}

        .score-analysis-text { flex: 1; font-size: 9.5pt; }
        .score-status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 5px;
        }
        .status-excellent { background: #f0fff4; color: #22543d; border: 1px solid #c6f6d5; }
        .status-good { background: #feebc8; color: #744210; border: 1px solid #ffe3e3; }

        .compact-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .compact-table th { background: #2b6cb0; color: white; padding: 6px; font-size: 9pt; border: 1px solid #cbd5e0; }
        .compact-table td { padding: 6px; font-size: 9pt; border: 1px solid #e2e8f0; text-align: center; white-space: nowrap;}
        
        .indicator-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 15px;
        }
        .indicator-row {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .indicator-header-flex {
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .progress-bar-bg {
            width: 100%;
            background: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background: #3182ce;
            border-radius: 4px;
        }

        .split-box-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .insight-box {
            border-radius: 6px;
            padding: 12px;
            font-size: 9.5pt;
        }
        .insight-box.grey { background: #f7fafc; border: 1px solid #e2e8f0; border-right: 4px solid #4a5568; }
        .insight-box.amber { background: #fffaf0; border: 1px solid #feebc8; border-right: 4px solid #dd6b20; }
        
        ul.tight-list { padding-right: 18px; margin: 5px 0 0 0; }
        ul.tight-list li { margin-bottom: 4px; }

        .automated-footer {
            margin-top: 20px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            text-align: center;
            font-size: 8pt;
            color: #718096;
        }
    </style>
</head>
<body>

    <div class="page-1">
        <div class="exec-header">
            <div class="company-branding">[شعار المؤسسة] ${d.company_name}</div>
            <div class="platform-branding">تحليل ذكي بواسطة <span>AnaCompta AI</span></div>
        </div>

        <div class="report-main-title">التقرير التنفيذي الشامل للوضعية المالية</div>

        <table class="meta-grid">
            <tr>
                <td><strong>رقم التقرير:</strong> ${d.report_id}</td>
                <td><strong>الفترة المالية:</strong> ${d.financial_period}</td>
            </tr>
            <tr>
                <td><strong>تاريخ الإصدار:</strong> ${d.issue_date} - ${d.issue_time}</td>
                <td><strong>إعداد وتدقيق:</strong> الإدارة المالية / قسم مراقبة التسيير المحاسبي</td>
            </tr>
        </table>

        <h2 class="section-title">أولاً: الملخص التنفيذي العام (AI Executive Summary)</h2>
        <div class="executive-summary-box">
            بناءً على المعطيات المستخرجة والمحللة محاسبياً، فإن المؤسسة تسجل وضعيّة ماليّة ${d.profit_or_loss_status}. هناك ${d.improvement_status} في الأداء الكلي مقارنة بالدورة المحاسبية السابقة. على الرغم من استقرار التدفقات، يُرصد مؤشر خطر يرتبط بارتفاع نسب الهدر والانحرافات في بعض الورشات التشغيلية، مما يستدعي تدخلاً تنظيمياً لضبط الأعباء التجارية وتكاليف إنتاج الوحدة.
        </div>

        <h2 class="section-title">ثانياً: مؤشر صحة المؤسسة والأداء الذكي (Business Health Score)</h2>
        <div class="score-flex-layout">
            <div class="gauge-circle">
                <div class="gauge-inner-text">${d.business_health_score}<span>من 100</span></div>
            </div>
            <div class="score-analysis-text">
                <div class="score-status-badge status-excellent">${d.health_status_label}</div>
                <div><strong>التحليل الذكي للمؤشر:</strong> يعود استحقاق هذه الدرجة كحصيلة مباشرة لتحقيق مستويات كفاءة إنتاجية متقدمة والتحكم النسبي في الأعباء المباشرة، بينما يتأثر المؤشر سلباً بوجود انحراف مالي في تكلفة شراء المواد الأولية وضياع في الطاقة التشغيلية لبعض خطوط الإنتاج.</div>
            </div>
        </div>

        <h2 class="section-title">ثالثاً: بطاقات مؤشرات الأداء القياسية الأساسية (Key Performance Indicators)</h2>
        <div class="kpi-container">
            <div class="kpi-card blue">
                <span class="kpi-label">رقم الأعمال</span>
                <span class="kpi-value">${d.kpi_turnover} دج</span>
            </div>
            <div class="kpi-card orange">
                <span class="kpi-label">سعر التكلفة الإجمالي</span>
                <span class="kpi-value">${d.kpi_total_cost_price} دج</span>
            </div>
            <div class="kpi-card green">
                <span class="kpi-label">النتيجة التحليلية الصافية</span>
                <span class="kpi-value">${d.kpi_net_result} دج</span>
            </div>
            <div class="kpi-card red">
                <span class="kpi-label">القيمة المالية للهدر</span>
                <span class="kpi-value">${d.kpi_waste_value} دج</span>
            </div>
        </div>

        <h2 class="section-title">رابعاً: تحليل هيكل الربحية وأداء المنتجات (Profitability & Products Analysis)</h2>
        <div style="font-size: 9.5pt; margin-bottom: 8px;">
            بلغ إجمالي الإيرادات المحققة <strong>${d.kpi_turnover} دج</strong> مقابل تكاليف كلية بلغت <strong>${d.kpi_total_cost_price} دج</strong>، مما يمنح المؤسسة صافي هامش ربح يقدر بـ <strong>${d.profit_margin_percentage}%</strong>. الجدول أدناه يفصل كفاءة المنتجات:
        </div>
        <table class="compact-table">
            <thead>
                <tr>
                    <th>اسم المنتج</th>
                    <th>سعر التكلفة وحدوي</th>
                    <th>سعر البيع وحدوي</th>
                    <th>هامش ربح الوحدة</th>
                    <th>حالة المنتج التشغيلية</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${d.product_name_1}</td>
                    <td>${d.prod_cost_1} دج</td>
                    <td>${d.prod_sale_1} دج</td>
                    <td>${d.prod_margin_1} دج</td>
                    <td style="color: #38a169; font-weight:bold;">🟢 ${d.prod_status_1}</td>
                </tr>
                <tr>
                    <td>${d.product_name_2}</td>
                    <td>${d.prod_cost_2} دج</td>
                    <td>${d.prod_sale_2} دج</td>
                    <td>${d.prod_margin_2} دج</td>
                    <td style="color: #dd6b20; font-weight:bold;">🟡 ${d.prod_status_2}</td>
                </tr>
            </tbody>
        </table>
        <div style="font-size: 9.5pt; display: flex; justify-content: space-between; background: #f7fafc; padding: 6px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <span><strong>المنتج الأكثر ربحية:</strong> 🏆 ${d.most_profitable_prod}</span>
            <span><strong>المنتج الأقل ربحية (أو خاسر):</strong> ⚠️ ${d.least_profitable_prod}</span>
        </div>
    </div>


    <div class="page-2">
        <div class="exec-header">
            <div class="company-branding">[شعار المؤسسة] ${d.company_name}</div>
            <div class="platform-branding">لوحة التحكم الذكية | <span>AnaCompta AI</span></div>
        </div>

        <h2 class="section-title">خامساً: لوحة مؤشرات الكفاءة والتحكم والسيولة التشغيلية</h2>
        <div class="indicator-grid">
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>مؤشر الربحية الشامل (Profitability Score)</span>
                    <span style="color: #38a169;">${d.score_profitability_val}% [${d.profitability_label}]</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_profitability_val}%; background: #38a169;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>التحكم في التكاليف (Cost Control)</span>
                    <span style="color: #dd6b20;">${d.score_cost_control_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_cost_control_val}%; background: #dd6b20;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>كفاءة العمليات والإنتاج (Production Efficiency)</span>
                    <span style="color: #3182ce;">${d.score_prod_efficiency_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_prod_efficiency_val}%; background: #3182ce;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>مؤشر السيولة التشغيلية (Operational Liquidity)</span>
                    <span style="color: #3182ce;">${d.score_ops_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_ops_val}%; background: #3182ce;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>كفاءة استخدام الموارد والعمالة</span>
                    <span style="color: #38a169;">${d.score_resources_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_resources_val}%; background: #38a169;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>استقرار التكاليف عبر الفترات الزمنية</span>
                    <span style="color: #4a5568;">${d.score_stability_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_stability_val}%; background: #4a5568;"></div></div>
            </div>
        </div>

        <h2 class="section-title">سادساً: التحليل المعمق للتحملات، بؤر الهدر والانحرافات الماليّة</h2>
        <div class="split-box-container">
            <div class="insight-box grey">
                <strong>📉 توزيع التكاليف وهدر الموارد:</strong>
                <ul class="tight-list">
                    <li>العنصر الأكثر تأثيراً وضغطاً على التكلفة هو: <span style="color:#e53e3e; font-weight:bold;">${d.most_impactful_cost_element}</span>.</li>
                    <li>نسبة الهدر العام سجلت <span style="color:#e53e3e; font-weight:bold;">${d.waste_percentage}%</span> بقيمة مالية تبلغ <strong>${d.kpi_waste_value} دج</strong>.</li>
                    <li><strong>تفسير الذكاء الاصطناعي للهدر:</strong> تتركز بؤر الضياع أساساً في <span style="font-weight:bold;">${d.highest_waste_workshop}</span> نتيجة لتلف المواد الأولية أثناء مرحلة التحضير وعطل فني متكرر في الآلات التشغيلية.</li>
                </ul>
            </div>
            <div class="insight-box amber">
                <strong>📊 تقييم الانحرافات والمخاطر المالية:</strong>
                <ul class="tight-list">
                    <li><strong>التكلفة المعيارية المقدرة:</strong> ${d.standard_cost_total} دج</li>
                    <li><strong>التكلفة الفعلية المسجلة:</strong> ${d.actual_cost_total} دج</li>
                    <li><strong>قيمة الانحراف الكلي:</strong> <span style="font-weight:bold;">${d.variance_value} دج</span> (${d.variance_direction_label}).</li>
                    <li><strong>مستوى المخاطر المالية العام:</strong> 
                        <span style="padding:1px 6px; border-radius:4px; font-weight:bold; font-size:8.5pt; background:#fff5f5; color:#e53e3e;">${d.financial_risk_level_label}</span>
                    </li>
                </ul>
            </div>
        </div>

        <h2 class="section-title">سابعاً: النمذجة التنبؤية ومؤشر الثقة في التوقعات (AI Future Predictions)</h2>
        <div style="font-size: 9.5pt; margin-bottom: 8px;">
            بناءً على السلاسل الزمنية المحاسبية السابقة، يتوقع النظام المالي للحقبة القادمة المعطيات التالية:
        </div>
        <table class="compact-table">
            <thead>
                <tr>
                    <th>المؤشر المتوقع</th>
                    <th>تكلفة الشراء</th>
                    <th>تكلفة الإنتاج</th>
                    <th>سعر التكلفة النهائي</th>
                    <th>نسبة الهدر المتوقع</th>
                    <th>نسبة موثوقية التنبؤ (Confidence)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>القيمة المتوقعة</strong></td>
                    <td>${d.pred_purchase_cost} دج</td>
                    <td>${d.pred_production_cost} دج</td>
                    <td>${d.pred_cost_price} دج</td>
                    <td>${d.pred_waste_ratio}%</td>
                    <td>
                        <span style="color:#2b6cb0; font-weight:bold;">🎯 ${d.ai_confidence_score}%</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="section-title">ثامناً: التوصيات الاستراتيجية والخلاصة التنفيذية والقرارات</h2>
        <div class="split-box-container" style="margin-bottom: 5px;">
            <div class="insight-box grey" style="border-right-color: #3182ce; background: #f0fff4;">
                <strong>📋 التوصيات الذكية لتخفيض التكاليف:</strong>
                <ul class="tight-list" style="font-size: 9pt;">
                    <li>تفعيل الشراء المخطط ومراجعة عقود الموردين لكبح جماح انحراف أسعار المواد الأولية.</li>
                    <li>صيانة وتحديث الآلات في الورشة الأكثر هدراً لتقليل الفاقد الفني والتالف من المنتجات.</li>
                    <li>اعتماد معايير محاسبة التكاليف المستهدفة لضبط نفقات الأعباء التجارية غير المباشرة.</li>
                </ul>
            </div>
            <div class="insight-box grey" style="border-right-color: #1a365d;">
                <strong>💡 الخلاصة التنفيذية وصناعة القرار:</strong>
                <p style="margin:0; font-size: 9pt; text-align: justify;">
                    تعتبر المؤسسة في <strong>وضع مالي مستقر مع ربحية جيدة لكنها محفوفة بالمخاطر الهيكلية للتشغيل</strong>. الإجراء التصحيحي المستعجل المطلوب من الإدارة العليا هو تجميد الزيادة في الأعباء غير المباشرة وإعادة موازنة خطوط إنتاج المنتجات ضعيفة الهامش بشكل فوري لحماية التنافسية السوقية للمؤسسة.
                </p>
            </div>
        </div>

        <div class="automated-footer">
            تم إنشاء هذا التقرير وتحليله برمتّه بشكل آلي بواسطة منصة <strong>AnaCompta AI</strong> اعتماداً بالكامل على البيانات الفعلية الحالية للمؤسسة والمخزنة في النظام.<br>
            <strong>معرّف البصمة الرقمية للتقرير:</strong> ${d.report_digital_fingerprint} | <strong>تاريخ الاستخراج:</strong> ${d.issue_date} في تمام الساعة ${d.issue_time}
        </div>
    </div>

</body>
</html>`;
  } else if (lang === 'fr') {
    return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Rapport Exécutif Intelligent - AnaCompta AI</title>
    <style>
        @page {
            size: A4;
            margin: 15mm 15mm;
            @bottom-left { 
                content: "Page " counter(page) " de " counter(pages); 
                font-family: system-ui, sans-serif; 
                font-size: 8.5pt; 
                color: #a0aec0; 
            }
            @bottom-right { 
                content: "Rapport Exécutif Automatisé | AnaCompta AI"; 
                font-family: system-ui, sans-serif; 
                font-size: 8.5pt; 
                color: #a0aec0; 
            }
        }
        
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background-color: #ffffff; 
            color: #2d3748; 
            margin: 0; 
            direction: ltr; 
            line-height: 1.4; 
            font-size: 10pt; 
        }

        .page-1 { page-break-after: always; }
        .page-2 { page-break-inside: avoid; }

        .exec-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2b6cb0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .platform-branding { font-size: 10pt; font-weight: bold; color: #4a5568; text-align: right;}
        .platform-branding span { color: #3182ce; }
        .company-branding { font-size: 12pt; font-weight: bold; color: #1a365d; }
        .report-main-title { font-size: 20pt; font-weight: 800; color: #1a365d; text-align: center; margin: 10px 0; }

        .meta-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: #f7fafc;
            border: 1px solid #e2e8f0;
        }
        .meta-grid td { padding: 8px 12px; border: 1px solid #edf2f7; font-size: 9.5pt;}
        .meta-grid td strong { color: #2b6cb0; }

        h2.section-title {
            font-size: 13pt;
            color: #1a365d;
            background: #ebf8ff;
            padding: 6px 12px;
            border-left: 4px solid #2b6cb0;
            margin-top: 15px;
            margin-bottom: 10px;
        }

        .executive-summary-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 6px;
            font-size: 10pt;
            text-align: justify;
        }

        .kpi-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        .kpi-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .kpi-card.blue { border-top: 3px solid #3182ce; }
        .kpi-card.orange { border-top: 3px solid #dd6b20; }
        .kpi-card.green { border-top: 3px solid #38a169; }
        .kpi-card.red { border-top: 3px solid #e53e3e; }
        .kpi-label { font-size: 8.5pt; color: #718096; display: block; margin-bottom: 4px; }
        .kpi-value { font-size: 13pt; font-weight: bold; color: #1a365d; }

        .score-flex-layout {
            display: flex;
            gap: 15px;
            align-items: center;
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .gauge-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: conic-gradient(#38a169 calc(${d.business_health_score} * 1%), #edf2f7 0);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .gauge-circle::before {
            content: "";
            position: absolute;
            width: 72px;
            height: 72px;
            background: white;
            border-radius: 50%;
        }
        .gauge-inner-text {
            position: relative;
            font-size: 14pt;
            font-weight: 800;
            color: #1a365d;
            text-align: center;
            line-height: 1;
        }
        .gauge-inner-text span { font-size: 9pt; color: #718096; display: block; font-weight: normal; margin-top: 2px;}

        .score-analysis-text { flex: 1; font-size: 9.5pt; }
        .score-status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 5px;
        }
        .status-excellent { background: #f0fff4; color: #22543d; border: 1px solid #c6f6d5; }
        .status-good { background: #feebc8; color: #744210; border: 1px solid #ffe3e3; }

        .compact-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .compact-table th { background: #2b6cb0; color: white; padding: 6px; font-size: 9pt; border: 1px solid #cbd5e0; }
        .compact-table td { padding: 6px; font-size: 9pt; border: 1px solid #e2e8f0; text-align: center; white-space: nowrap;}
        
        .indicator-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 15px;
        }
        .indicator-row {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .indicator-header-flex {
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .progress-bar-bg {
            width: 100%;
            background: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background: #3182ce;
            border-radius: 4px;
        }

        .split-box-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .insight-box {
            border-radius: 6px;
            padding: 12px;
            font-size: 9.5pt;
        }
        .insight-box.grey { background: #f7fafc; border: 1px solid #e2e8f0; border-left: 4px solid #4a5568; }
        .insight-box.amber { background: #fffaf0; border: 1px solid #feebc8; border-left: 4px solid #dd6b20; }
        
        ul.tight-list { padding-left: 18px; margin: 5px 0 0 0; }
        ul.tight-list li { margin-bottom: 4px; }

        .automated-footer {
            margin-top: 20px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            text-align: center;
            font-size: 8pt;
            color: #718096;
        }
    </style>
</head>
<body>

    <div class="page-1">
        <div class="exec-header">
            <div class="company-branding">[Logo de l'Entreprise] ${d.company_name}</div>
            <div class="platform-branding">Diagnostic IA par <span>AnaCompta AI</span></div>
        </div>

        <div class="report-main-title">Rapport Exécutif de la Situation Financière</div>

        <table class="meta-grid">
            <tr>
                <td><strong>ID Rapport:</strong> ${d.report_id}</td>
                <td><strong>Période Financière:</strong> ${d.financial_period}</td>
            </tr>
            <tr>
                <td><strong>Date d'Émission:</strong> ${d.issue_date} - ${d.issue_time}</td>
                <td><strong>Préparé & Certifié:</strong> Direction Financière / Contrôle de Gestion</td>
            </tr>
        </table>

        <h2 class="section-title">I. Résumé Exécutif Général (AI Executive Summary)</h2>
        <div class="executive-summary-box">
            Sur la base des données comptables analysées, l'entreprise se trouve dans une situation financière ${d.profit_or_loss_status}. On observe une ${d.improvement_status} de l'activité globale par rapport à la même période de l'exercice précédent. Bien que l'exploitation reste stable, la vigilance est de mise en ce qui concerne les pertes et le taux de gaspillage dans certains ateliers de fabrication, nécessitant des interventions d'optimisation.
        </div>

        <h2 class="section-title">II. Score de Santé de l'Entreprise (Business Health Score)</h2>
        <div class="score-flex-layout">
            <div class="gauge-circle">
                <div class="gauge-inner-text">${d.business_health_score}<span>de 100</span></div>
            </div>
            <div class="score-analysis-text">
                <div class="score-status-badge status-excellent">${d.health_status_label}</div>
                <div><strong>Analyse IA du score:</strong> Ce score résulte de l'excellence de l'efficacité opérationnelle industrielle et d'une maîtrise relative des coûts salariaux directs (MOD), tout en restant affecté par des pertes directes de matériel observées au niveau des ateliers.</div>
            </div>
        </div>

        <h2 class="section-title">III. Indicateurs Clés de Performance (KPIs)</h2>
        <div class="kpi-container">
            <div class="kpi-card blue">
                <span class="kpi-label">Chiffre d'Affaires</span>
                <span class="kpi-value">${d.kpi_turnover} DA</span>
            </div>
            <div class="kpi-card orange">
                <span class="kpi-label">Coût de Revient Total</span>
                <span class="kpi-value">${d.kpi_total_cost_price} DA</span>
            </div>
            <div class="kpi-card green">
                <span class="kpi-label">Résultat Analytique Net</span>
                <span class="kpi-value">${d.kpi_net_result} DA</span>
            </div>
            <div class="kpi-card red">
                <span class="kpi-label">Valeur du Gaspillage</span>
                <span class="kpi-value">${d.kpi_waste_value} DA</span>
            </div>
        </div>

        <h2 class="section-title">IV. Analyse de la Rentabilité et des Produits (Profitability & Products)</h2>
        <div style="font-size: 9.5pt; margin-bottom: 8px;">
            Le chiffre d'affaires total enregistré s'élève à <strong>${d.kpi_turnover} DA</strong> contre un coût de revient complet de <strong>${d.kpi_total_cost_price} DA</strong>, dégageant un taux de marge nette de <strong>${d.profit_margin_percentage}%</strong>. Analyse par produit :
        </div>
        <table class="compact-table">
            <thead>
                <tr>
                    <th>Désignation du Produit</th>
                    <th>Coût de Revient Unit.</th>
                    <th>Prix de Vente Unit.</th>
                    <th>Marge Unitaire</th>
                    <th>Statut Opérationnel</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${d.product_name_1}</td>
                    <td>${d.prod_cost_1} DA</td>
                    <td>${d.prod_sale_1} DA</td>
                    <td>${d.prod_margin_1} DA</td>
                    <td style="color: #38a169; font-weight:bold;">🟢 ${d.prod_status_1}</td>
                </tr>
                <tr>
                    <td>${d.product_name_2}</td>
                    <td>${d.prod_cost_2} DA</td>
                    <td>${d.prod_sale_2} DA</td>
                    <td>${d.prod_margin_2} DA</td>
                    <td style="color: #dd6b20; font-weight:bold;">🟡 ${d.prod_status_2}</td>
                </tr>
            </tbody>
        </table>
        <div style="font-size: 9.5pt; display: flex; justify-content: space-between; background: #f7fafc; padding: 6px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <span><strong>Produit le plus rentable:</strong> 🏆 ${d.most_profitable_prod}</span>
            <span><strong>Produit le moins rentable:</strong> ⚠️ ${d.least_profitable_prod}</span>
        </div>
    </div>


    <div class="page-2">
        <div class="exec-header">
            <div class="company-branding">[Logo de l'Entreprise] ${d.company_name}</div>
            <div class="platform-branding">Pupitre de Contrôle IA | <span>AnaCompta AI</span></div>
        </div>

        <h2 class="section-title">V. Tableau de Bord d'Efficacité Opérationnelle et Rentabilité</h2>
        <div class="indicator-grid">
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Performance de Rentabilité</span>
                    <span style="color: #38a169;">${d.score_profitability_val}% [${d.profitability_label}]</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_profitability_val}%; background: #38a169;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Contrôle des Charges (Cost Control)</span>
                    <span style="color: #dd6b20;">${d.score_cost_control_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_cost_control_val}%; background: #dd6b20;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Efficacité Globale de Production</span>
                    <span style="color: #3182ce;">${d.score_prod_efficiency_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_prod_efficiency_val}%; background: #3182ce;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Indice de Liquidité d'Exploitation</span>
                    <span style="color: #3182ce;">${d.score_ops_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_ops_val}%; background: #3182ce;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Efficacité d'Utilisation des Ressources</span>
                    <span style="color: #38a169;">${d.score_resources_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_resources_val}%; background: #38a169;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Stabilité des Coûts Globaux</span>
                    <span style="color: #4a5568;">${d.score_stability_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_stability_val}%; background: #4a5568;"></div></div>
            </div>
        </div>

        <h2 class="section-title">VI. Analyse Interne des Coûts, Pertes et Gaspillages</h2>
        <div class="split-box-container">
            <div class="insight-box grey">
                <strong>📉 Structure des Charges & Gaspillages :</strong>
                <ul class="tight-list">
                    <li>Le compte le plus lourd ayant le plus de pression est : <span style="color:#e53e3e; font-weight:bold;">${d.most_impactful_cost_element}</span>.</li>
                    <li>Le taux de perte global s'établit à <span style="color:#e53e3e; font-weight:bold;">${d.waste_percentage}%</span> pour un impact de <strong>${d.kpi_waste_value} DA</strong>.</li>
                    <li><strong>Diagnostic Intelligent :</strong> Le gaspillage provient en grande majorité de l'unité <span style="font-weight:bold;">${d.highest_waste_workshop}</span> due à un rejet de matériel brut en phase de préparation.</li>
                </ul>
            </div>
            <div class="insight-box amber">
                <strong>📊 Écarts Budgétaires et Risque Financier :</strong>
                <ul class="tight-list">
                    <li><strong>Coût Standard Prévu :</strong> ${d.standard_cost_total} DA</li>
                    <li><strong>Coût Réel Réalisé :</strong> ${d.actual_cost_total} DA</li>
                    <li><strong>Écart de Rendement Global :</strong> <span style="font-weight:bold;">${d.variance_value} DA</span> (${d.variance_direction_label})</li>
                    <li><strong>Niveau de Risque d'Exploitation :</strong> 
                        <span style="padding:1px 6px; border-radius:4px; font-weight:bold; font-size:8.5pt; background:#fff5f5; color:#e53e3e;">${d.financial_risk_level_label}</span>
                    </li>
                </ul>
            </div>
        </div>

        <h2 class="section-title">VII. Modélisation Prédictive et Statistique (AI Future Predictions)</h2>
        <div style="font-size: 9.5pt; margin-bottom: 8px;">
            En s'appuyant sur les schémas historiques internes, l'algorithme financier estime la structure de coûts suivante pour l'exercice suivant :
        </div>
        <table class="compact-table">
            <thead>
                <tr>
                    <th>Période Prévue</th>
                    <th>Coût d'Achat Prévu</th>
                    <th>Coût de Prod. Prévu</th>
                    <th>Coût de Revient Prévu</th>
                    <th>Taux de Gaspillage Prévu</th>
                    <th>Fiabilité de Prediction (Confidence)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Prochain Exercice</strong></td>
                    <td>${d.pred_purchase_cost} DA</td>
                    <td>${d.pred_production_cost} DA</td>
                    <td>${d.pred_cost_price} DA</td>
                    <td>${d.pred_waste_ratio}%</td>
                    <td>
                        <span style="color:#2b6cb0; font-weight:bold;">🎯 ${d.ai_confidence_score}%</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="section-title">VIII. Orientations d'Optimisation et Prise de Décision</h2>
        <div class="split-box-container" style="margin-bottom: 5px;">
            <div class="insight-box grey" style="border-left-color: #3182ce; background: #f0fff4;">
                <strong>📋 Actions de Réduction des Coûts :</strong>
                <ul class="tight-list" style="font-size: 9pt;">
                    <li>Mettre en place des contrats-cadres fournisseurs pérennes pour stabiliser le coût des matériaux.</li>
                    <li>Planifier de la maintenance préventive dans l'Atelier pour juguler les temps de panne et le rebut physique.</li>
                    <li>Instaurer une politique de target costing sur l'ensemble de la distribution directe.</li>
                </ul>
            </div>
            <div class="insight-box grey" style="border-left-color: #1a365d;">
                <strong>💡 Note de Synthèse Opérationnelle :</strong>
                <p style="margin:0; font-size: 9pt; text-align: justify;">
                    L'entreprise évolue dans un <strong>contexte stable avec des taux de rentabilité nets robustes, mais présente des risques d'origine opérationnelle interne</strong>. Établir une discipline de contrôle stricte s'avère indispensable pour préserver la marge des périodes futures.
                </p>
            </div>
        </div>

        <div class="automated-footer">
            Rapport entièrement modélisé et structuré de manière automatisée par la suite logicielle <strong>AnaCompta AI</strong> à partir des données de rentabilité réelles.<br>
            <strong>Empreinte Numérique :</strong> ${d.report_digital_fingerprint} | <strong>Extrait le :</strong> ${d.issue_date} à ${d.issue_time}
        </div>
    </div>

</body>
</html>`;
  } else {
    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Smart Executive Report - AnaCompta AI</title>
    <style>
        @page {
            size: A4;
            margin: 15mm 15mm;
            @bottom-left { 
                content: "Page " counter(page) " of " counter(pages); 
                font-family: system-ui, sans-serif; 
                font-size: 8.5pt; 
                color: #a0aec0; 
            }
            @bottom-right { 
                content: "Automated Executive Report | AnaCompta AI"; 
                font-family: system-ui, sans-serif; 
                font-size: 8.5pt; 
                color: #a0aec0; 
            }
        }
        
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background-color: #ffffff; 
            color: #2d3748; 
            margin: 0; 
            direction: ltr; 
            line-height: 1.4; 
            font-size: 10pt; 
        }

        .page-1 { page-break-after: always; }
        .page-2 { page-break-inside: avoid; }

        .exec-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2b6cb0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .platform-branding { font-size: 10pt; font-weight: bold; color: #4a5568; text-align: right;}
        .platform-branding span { color: #3182ce; }
        .company-branding { font-size: 12pt; font-weight: bold; color: #1a365d; }
        .report-main-title { font-size: 20pt; font-weight: 800; color: #1a365d; text-align: center; margin: 10px 0; }

        .meta-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: #f7fafc;
            border: 1px solid #e2e8f0;
        }
        .meta-grid td { padding: 8px 12px; border: 1px solid #edf2f7; font-size: 9.5pt;}
        .meta-grid td strong { color: #2b6cb0; }

        h2.section-title {
            font-size: 13pt;
            color: #1a365d;
            background: #ebf8ff;
            padding: 6px 12px;
            border-left: 4px solid #2b6cb0;
            margin-top: 15px;
            margin-bottom: 10px;
        }

        .executive-summary-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 6px;
            font-size: 10pt;
            text-align: justify;
        }

        .kpi-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        .kpi-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .kpi-card.blue { border-top: 3px solid #3182ce; }
        .kpi-card.orange { border-top: 3px solid #dd6b20; }
        .kpi-card.green { border-top: 3px solid #38a169; }
        .kpi-card.red { border-top: 3px solid #e53e3e; }
        .kpi-label { font-size: 8.5pt; color: #718096; display: block; margin-bottom: 4px; }
        .kpi-value { font-size: 13pt; font-weight: bold; color: #1a365d; }

        .score-flex-layout {
            display: flex;
            gap: 15px;
            align-items: center;
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .gauge-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: conic-gradient(#38a169 calc(${d.business_health_score} * 1%), #edf2f7 0);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .gauge-circle::before {
            content: "";
            position: absolute;
            width: 72px;
            height: 72px;
            background: white;
            border-radius: 50%;
        }
        .gauge-inner-text {
            position: relative;
            font-size: 14pt;
            font-weight: 800;
            color: #1a365d;
            text-align: center;
            line-height: 1;
        }
        .gauge-inner-text span { font-size: 9pt; color: #718096; display: block; font-weight: normal; margin-top: 2px;}

        .score-analysis-text { flex: 1; font-size: 9.5pt; }
        .score-status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 5px;
        }
        .status-excellent { background: #f0fff4; color: #22543d; border: 1px solid #c6f6d5; }
        .status-good { background: #feebc8; color: #744210; border: 1px solid #ffe3e3; }

        .compact-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .compact-table th { background: #2b6cb0; color: white; padding: 6px; font-size: 9pt; border: 1px solid #cbd5e0; }
        .compact-table td { padding: 6px; font-size: 9pt; border: 1px solid #e2e8f0; text-align: center; white-space: nowrap;}
        
        .indicator-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 15px;
        }
        .indicator-row {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .indicator-header-flex {
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .progress-bar-bg {
            width: 100%;
            background: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background: #3182ce;
            border-radius: 4px;
        }

        .split-box-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .insight-box {
            border-radius: 6px;
            padding: 12px;
            font-size: 9.5pt;
        }
        .insight-box.grey { background: #f7fafc; border: 1px solid #e2e8f0; border-left: 4px solid #4a5568; }
        .insight-box.amber { background: #fffaf0; border: 1px solid #feebc8; border-left: 4px solid #dd6b20; }
        
        ul.tight-list { padding-left: 18px; margin: 5px 0 0 0; }
        ul.tight-list li { margin-bottom: 4px; }

        .automated-footer {
            margin-top: 20px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            text-align: center;
            font-size: 8pt;
            color: #718096;
        }
    </style>
</head>
<body>

    <div class="page-1">
        <div class="exec-header">
            <div class="company-branding">[Enterprise Logo] ${d.company_name}</div>
            <div class="platform-branding">AI-Driven Intelligence by <span>AnaCompta AI</span></div>
        </div>

        <div class="report-main-title">Comprehensive Financial Executive Report</div>

        <table class="meta-grid">
            <tr>
                <td><strong>Report ID:</strong> ${d.report_id}</td>
                <td><strong>Financial Period:</strong> ${d.financial_period}</td>
            </tr>
            <tr>
                <td><strong>Issue Date:</strong> ${d.issue_date} - ${d.issue_time}</td>
                <td><strong>Prepared & Certified:</strong> Financial Administration / Management Control Dept</td>
            </tr>
        </table>

        <h2 class="section-title">1. AI Executive Summary</h2>
        <div class="executive-summary-box">
            Based on the parsed and analyzed accounting records, the organization demonstrates a ${d.profit_or_loss_status} financial position. There is a ${d.improvement_status} in overall operations compared to the previous period. Although operating cash flows remain stable, vigilance is advised regarding material waste rates and operational variances in certain workshops, requiring focused cost-control intervention on unit manufacturing and distribution costs.
        </div>

        <h2 class="section-title">2. Business Health Score</h2>
        <div class="score-flex-layout">
            <div class="gauge-circle">
                <div class="gauge-inner-text">${d.business_health_score}<span>/ 100</span></div>
            </div>
            <div class="score-analysis-text">
                <div class="score-status-badge status-excellent">${d.health_status_label}</div>
                <div><strong>AI Diagnostics:</strong> This rating reflects highly advanced industrial manufacturing efficiency and reasonable control over direct labor (MOD) wages, while being slightly constrained by indirect overhead burdens and periodic workshop material scrap weights.</div>
            </div>
        </div>

        <h2 class="section-title">3. Key Performance Indicators (KPIs)</h2>
        <div class="kpi-container">
            <div class="kpi-card blue">
                <span class="kpi-label">Revenue / Sales</span>
                <span class="kpi-value">$${d.kpi_turnover}</span>
            </div>
            <div class="kpi-card orange">
                <span class="kpi-label">Total Cost Price</span>
                <span class="kpi-value">$${d.kpi_total_cost_price}</span>
            </div>
            <div class="kpi-card green">
                <span class="kpi-label">Net Analytic Result</span>
                <span class="kpi-value">$${d.kpi_net_result}</span>
            </div>
            <div class="kpi-card red">
                <span class="kpi-label">Financial Scrap Impact</span>
                <span class="kpi-value">$${d.kpi_waste_value}</span>
            </div>
        </div>

        <h2 class="section-title">4. Profitability & Products Analysis</h2>
        <div style="font-size: 9.5pt; margin-bottom: 8px;">
            Total recorded revenue reached <strong>$${d.kpi_turnover}</strong> against a cost price of <strong>$${d.kpi_total_cost_price}</strong>, yielding an overall net profit margin of <strong>${d.profit_margin_percentage}%</strong>. The product performance breakdown is detailed below:
        </div>
        <table class="compact-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Unit Cost Price</th>
                    <th>Unit Selling Price</th>
                    <th>Unit Net Margin</th>
                    <th>Operational Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${d.product_name_1}</td>
                    <td>$${d.prod_cost_1}</td>
                    <td>$${d.prod_sale_1}</td>
                    <td>$${d.prod_margin_1}</td>
                    <td style="color: #38a169; font-weight:bold;">🟢 ${d.prod_status_1}</td>
                </tr>
                <tr>
                    <td>${d.product_name_2}</td>
                    <td>$${d.prod_cost_2}</td>
                    <td>$${d.prod_sale_2}</td>
                    <td>$${d.prod_margin_2}</td>
                    <td style="color: #dd6b20; font-weight:bold;">🟡 ${d.prod_status_2}</td>
                </tr>
            </tbody>
        </table>
        <div style="font-size: 9.5pt; display: flex; justify-content: space-between; background: #f7fafc; padding: 6px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <span><strong>Most Profitable Product:</strong> 🏆 ${d.most_profitable_prod}</span>
            <span><strong>Least Profitable Product:</strong> ⚠️ ${d.least_profitable_prod}</span>
        </div>
    </div>


    <div class="page-2">
        <div class="exec-header">
            <div class="company-branding">[Enterprise Logo] ${d.company_name}</div>
            <div class="platform-branding">AI Analytics Console | <span>AnaCompta AI</span></div>
        </div>

        <h2 class="section-title">5. Efficiency, Control & Operating Liquidity Balance Scorecard</h2>
        <div class="indicator-grid">
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Overall Profitability Score</span>
                    <span style="color: #38a169;">${d.score_profitability_val}% [${d.profitability_label}]</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_profitability_val}%; background: #38a169;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Cost Control Discipline</span>
                    <span style="color: #dd6b20;">${d.score_cost_control_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_cost_control_val}%; background: #dd6b20;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Production Operations Efficiency</span>
                    <span style="color: #3182ce;">${d.score_prod_efficiency_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_prod_efficiency_val}%; background: #3182ce;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Operational Liquidity Index</span>
                    <span style="color: #3182ce;">${d.score_ops_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_ops_val}%; background: #3182ce;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Strategic Resource & Labor Utilization</span>
                    <span style="color: #38a169;">${d.score_resources_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_resources_val}%; background: #38a169;"></div></div>
            </div>
            <div class="indicator-row">
                <div class="indicator-header-flex">
                    <span>Cost Structure Stability</span>
                    <span style="color: #4a5568;">${d.score_stability_val}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${d.score_stability_val}%; background: #4a5568;"></div></div>
            </div>
        </div>

        <h2 class="section-title">6. In-Depth Operational Analysis, Waste & Variances</h2>
        <div class="split-box-container">
            <div class="insight-box grey">
                <strong>📉 Cost Posture & Waste Metrics:</strong>
                <ul class="tight-list">
                    <li>Most influential cost driver is currently: <span style="color:#e53e3e; font-weight:bold;">${d.most_impactful_cost_element}</span>.</li>
                    <li>Overall industrial waste rate is <span style="color:#e53e3e; font-weight:bold;">${d.waste_percentage}%</span> representing an implied cash leakage of <strong>$${d.kpi_waste_value}</strong>.</li>
                    <li><strong>AI Diagnostics:</strong> Material leaks are heavily concentrated in <span style="font-weight:bold;">${d.highest_waste_workshop}</span> due to raw material prep scrap and recurring machine calibration errors.</li>
                </ul>
            </div>
            <div class="insight-box amber">
                <strong>📊 Budgetary Variances & Risk Rating:</strong>
                <ul class="tight-list">
                    <li><strong>Standard Budgeted Cost:</strong> $${d.standard_cost_total}</li>
                    <li><strong>Actual Operations Cost:</strong> $${d.actual_cost_total}</li>
                    <li><strong>Total Variance Level:</strong> <span style="font-weight:bold;">$${d.variance_value}</span> (${d.variance_direction_label})</li>
                    <li><strong>Financial Risk Exposure:</strong> 
                        <span style="padding:1px 6px; border-radius:4px; font-weight:bold; font-size:8.5pt; background:#fff5f5; color:#e53e3e;">${d.financial_risk_level_label}</span>
                    </li>
                </ul>
            </div>
        </div>

        <h2 class="section-title">7. Predictive Modeling & Forecasting (AI Future Predictions)</h2>
        <div style="font-size: 9.5pt; margin-bottom: 8px;">
            Trained on historic accounting trends, the system forecasts the following operational markers for the next fiscal period:
        </div>
        <table class="compact-table">
            <thead>
                <tr>
                    <th>Forecast Period</th>
                    <th>Est. Purchase Cost</th>
                    <th>Est. Production Cost</th>
                    <th>Est. Unit Cost Price</th>
                    <th>Est. Waste & Scrap Rate</th>
                    <th>Model Margin of Accuracy (Confidence)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Next Q1</strong></td>
                    <td>$${d.pred_purchase_cost}</td>
                    <td>$${d.pred_production_cost}</td>
                    <td>$${d.pred_cost_price}</td>
                    <td>${d.pred_waste_ratio}%</td>
                    <td>
                        <span style="color:#2b6cb0; font-weight:bold;">🎯 ${d.ai_confidence_score}%</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="section-title">8. Strategic Action Guidelines & Executive Conclusion</h2>
        <div class="split-box-container" style="margin-bottom: 5px;">
            <div class="insight-box grey" style="border-left-color: #3182ce; background: #f0fff4;">
                <strong>📋 Intelligent Mitigation Initiatives:</strong>
                <ul class="tight-list" style="font-size: 9pt;">
                    <li>Engage structured bulk supply contracts to lock in purchase prices and mitigate material premiums.</li>
                    <li>Optimize equipment in high-scrap workshops to curb physical leaks during production.</li>
                    <li>Utilize target costing frameworks to proactively contain indirect commercial distribution overhead.</li>
                </ul>
            </div>
            <div class="insight-box grey" style="border-left-color: #1a365d;">
                <strong>💡 Operational Synergy Summary:</strong>
                <p style="margin:0; font-size: 9pt; text-align: justify;">
                    The company is in a <strong>stable financial position with clean net margins, yet retains localized operational risks</strong>. Leadership's primary imperative is containing the growth of general indirect expenses and stabilizing margins for underperforming items.
                </p>
            </div>
        </div>

        <div class="automated-footer">
            This document is automatically processed and analyzed by <strong>AnaCompta AI</strong> based strictly on current validated operations.<br>
            <strong>Digital Fingerprint:</strong> ${d.report_digital_fingerprint} | <strong>Extracted on:</strong> ${d.issue_date} at ${d.issue_time}
        </div>
    </div>

</body>
</html>`;
  }
}
