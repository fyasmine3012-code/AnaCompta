import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown, 
  Sparkles, 
  Layers, 
  Activity, 
  Target, 
  Flame, 
  Calculator, 
  ShieldAlert, 
  HelpCircle, 
  Phone, 
  Mail, 
  User, 
  Factory, 
  ShieldCheck, 
  Box, 
  Cpu, 
  Compass, 
  Building2, 
  DollarSign, 
  Users,
  CreditCard,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onEnterERP: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterERP }) => {
  const { state, updateState, calculatedValues } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);

  // For multi-step onboarding state
  const [formProfile, setFormProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [formCompany, setFormCompany] = useState({
    companyName: '',
    sector: 'المحاسبة التحليلية',
    employees: '11-50'
  });
  const [paymentOption, setPaymentOption] = useState('bank');

  const t = locales[state.language];
  const isRtl = state.language === 'ar';

  // Toggle dropdown item selection helper
  const handleSelectSector = (sector: string) => {
    setFormCompany(prev => ({ ...prev, sector }));
    setAppsDropdownOpen(false);
  };

  const startOnboarding = () => {
    setOnboardingStep(1);
    setShowOnboarding(true);
  };

  const handleNextStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      onEnterERP();
    }
  };

  const handlePrevStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  // Translations dictionary for Landing Page elements
  const ls: Record<string, any> = {
    ar: {
      tagline: "منصة سحابية مدعمة بالذكاء الاصطناعي لإدارة محاسبة التكاليف وتحليل الأداء المالي ودعم اتخاذ القرار داخل المؤسسات الصناعية",
      subTagline: "نظام رقمي وطني مبسط لحساب التكلفة المعيارية، إهلاك أعباء TRCI، تحليل هدر المواد، وتقييم مؤشرات الربحية خطوة بخطوة بدلالة نظام SCF الجزائري.",
      ctaDemo: "طلب عرض توضيحي",
      ctaTrial: "جرب مجاناً - 14 يوم مجانية",
      ctaLearn: "اكتشف المزيد",
      socialCompanies: "500+ مؤسسة جزائرية",
      socialAvailability: "99.9% جاهزية النظام",
      socialScf: "متوافق كلياً مع نظام SCF",
      probTitle: "لماذا تفقد الشركات الصناعية ربحيتها؟",
      probSub: "دراسة استقصائية لأكبر عوائق تضخم تكاليف المواد الأولية والتتبع الضعيف لأعباء الورش التوزيعية.",
      probCard: "المشاكل الحالية في المصانع",
      solCard: "حلول FyCompta الذكية",
      prob1: "تأخر متكرر في حساب سعر التكلفة النهائي (غالباً نهاية الشهر).",
      prob2: "توزيع تقديري وعشوائي للمصاريف غير المباشرة (TRCI).",
      prob3: "عدم تتبع الهدر الصناعي وخسائر المواد الأولية أثناء التشغيل.",
      prob4: "عجز عن قياس المساهمة التحليلية الفعلية لكل منتج.",
      sol1: "حساب فوري مباشر ومحاكاة لأسعار التكاليف في ثوانٍ.",
      sol2: "توزيع رياضي دقيق للأعباء الثانوية والأساسية في جدول TRCI المدمج.",
      sol3: "رادار هدر ذكي يحسب ويقيس كلفة المنتج الفاقد وتأثيره على الهامش.",
      sol4: "لوحة تحكم تفصيلية تفصل المنتجات الأعلى ربحية والمنتجات الخاسرة.",
      sol5: "توقعات أوتوماتيكية وتنبيهات طارئة مدعومة بالذكاء الاصطناعي لتفادي العجز.",
      featTitle: "كل ما تحتاجه منشأتك الصناعية للرقابة المالية",
      featSub: "مجموعة مدمجة من الأدوات المالية المصممة خصيصاً لتلبية متطلبات بيئة الإنتاج الجزائرية والشرق أوسطية.",
      feat1: "المحاسبة التحليلية الذكية",
      feat1_d: "تتبع تلقائي ودورات تكلفة كاملة من المادة الأولية إلى النتيجة التحليلية الصافية.",
      feat2: "حساب CUMP تلقائي ومباشر",
      feat2_d: "تكامل مباشر بين فواتير الشراء، بطاقات الجرد، ومخزون آخر الفترة لحساب التكلفة الوسطية المرجحة.",
      feat3: "رادار الهدر والفاقد",
      feat3_d: "كشف فوري لمعدلات التلف الفني للتشغيل وحساب الكلفة الحقيقية للمخلفات الصناعية.",
      feat4: "تحليل الانحرافات والتباين",
      feat4_d: "مقارنة حية لأسعار التكلفة الفعلية المحسوبة مقابل الأهداف المعيارية المرصودة.",
      feat5: "مساعد محاسبة ذكي (AI)",
      feat5_d: "روبوت حواري متكامل يحلل هيكل الأعباء ويقترح سيناريوهات بديلة لترشيد الإنفاق.",
      feat6: "توقعات مالية ديناميكية",
      feat6_d: "تحليل الحساسية لفهم تأثير رفع أسعار المازوت، اللوجستيات أو أجور اليد العاملة على هامش الأرباح.",
      flowTitle: "سلسلة التدفق الأوتوماتيكي للبيانات",
      flowSub: "كيف تتدفق مدخلاتك المحاسبية لتشكل النتيجة المالية الصافية للمؤسسة دون تكرار إدخال.",
      flowStep1: "جدول TRCI والمصاريف",
      flowStep2: "تكلفة الشراء والجرد",
      flowStep3: "تكلفة الإنتاج للورشات",
      flowStep4: "النتيجة والتحليل الإحصائي",
      pricingTitle: "اختر خطة الاشتراك المناسبة لمؤسستك",
      pricingSub: "تراخيص سنوية شفافة تدعم بيئة عمل سحابية آمنة مع دعم فني متكامل.",
      priceStarterName: "المؤسسات الناشئة والصغيرة",
      priceStarterSub: "تحسين مبيعات ومخزون منشأة واحدة بجرد مبسط.",
      priceProName: "المؤسسات المتوسطة",
      priceProSub: "أكثر الخطط شعبية للمصانع والورشات ذات خطوط الإنتاج المتعددة.",
      priceEnterpriseName: "المؤسسات الكبيرة",
      priceEnterpriseSub: "حلول مخصصة بالكامل مع خوادم معزولة وتكامل مع الأنظمة القديمة.",
      onboardingTitle: "مرحباً بك في عالم الإدارة الذكية",
      onboardingSub: "أكمل الخطوات التالية لتخصيص نسختك المجانية من FyCompta.",
      step1Title: "الملف الشخصي",
      step2Title: "بيانات المؤسسة",
      step3Title: "تفعيل الخدمة",
      step4Title: "بوابة الدفع",
      profileName: "الاسم الكامل",
      profileEmail: "البريد الإلكتروني التجاري",
      profilePhone: "رقم الهاتف",
      profilePass: "أنشئ كلمة مرور قوية",
      companyName: "اسم المؤسسة / المصنع",
      companySector: "قطاع النشاط الرئيسي",
      companyEmployees: "عدد العمال والموظفين",
      trialHeader: "تهانينا! فترتك التجريبية جاهزة الآن",
      trialText: "احصل على وصول كامل لمدة 14 يوماً لجميع أدوات المحاسبة التحليلية والأعباء المباشرة وغير المباشرة مع مساعد الذكاء الاصطناعي.",
      btnActivate: "تفعيل الفترة المجانية والبدء",
      paymentHeader: "بوابة الاشتراك وتأكيد الدفع",
      paymentText: "يرجى تحديد طريقة الدفع المفضلة لتفعيل اشتراكك السنوي التلقائي بعد نهاية الـ 14 يوماً مجاناً:",
      payBank: "حوالة بنكية / CCP (بنك مساهم)",
      payDoc: "طلب عرض أسعار برو فورما (Facture Proforma)",
      payCard: "البطاقة الذهبية / CIB الدفع السحابي",
      btnLaunch: "الدخول إلى لوحة التحكم والتحليل المالي"
    },
    fr: {
      tagline: "Transformez vos données comptables en intelligence de gestion",
      subTagline: "La plateforme n°1 en Algérie pour l'analyse des coûts standards, l'imputation analytique TRCI, et le suivi en temps réel de la rentabilité de vos ateliers.",
      ctaDemo: "Demander une démonstration",
      ctaTrial: "Essai gratuit 14 jours",
      ctaLearn: "En savoir plus",
      socialCompanies: "500+ Entreprises",
      socialAvailability: "99.9% Disponibilité",
      socialScf: "Compatible SCF Algérien",
      probTitle: "Pourquoi les entreprises perdent-elles leur rentabilité ?",
      probSub: "Une analyse des fuites de marge cachées par le manque de précision dans l'évaluation des stocks et des frais de transport direct.",
      probCard: "Problèmes actuels",
      solCard: "Solutions FyCompta",
      prob1: "Retard crucial dans le calcul du coût de revient (calculs mensuels tardifs).",
      prob2: "Allocation arbitraire des frais généraux et charges indirectes.",
      prob3: "Zéro point d'alerte sur le gaspillage de matières premières et le rebut.",
      prob4: "Incapacité de repérer le coût de revient unitaire standard par produit.",
      sol1: "Simulation instantanée des coûts de revient en un clic.",
      sol2: "Calcul automatique de la matrice TRCI avec clés de répartition logicisées.",
      sol3: "Radar de rebut qui isole la valorisation financière du gaspillage par produit.",
      sol4: "Tableau de bord listant les produits rentables vs. déficitaires.",
      sol5: "Forte intégration IA pour les prévisions financières et alertes de rentabilité.",
      featTitle: "Tout ce dont votre usine a besoin",
      featSub: "Un ensemble d'outils analytiques modernes formulé pour surmonter les défis réels du secteur comptable algérien.",
      feat1: "Comptabilité Analytique intelligente",
      feat1_d: "Chaîne complète de traçabilité des coûts, de la matière première à l'exercice d'imputation final.",
      feat2: "Calcul automatique du CUMP",
      feat2_d: "Mise à jour dynamique de la valorisation de vos fiches de stocks post-achats.",
      feat3: "Radar anti-gaspillage",
      feat3_d: "Capture immédiate du gaspillage et de la perte technique sur vos lignes de fabrication.",
      feat4: "Analyse des écarts (Variance)",
      feat4_d: "Comparaison graphique entre les coûts anticipés standards et la réalité financière.",
      feat5: "Consultant IA intégré",
      feat5_d: "Un conseiller connecté à vos stocks pour identifier les goulots d'étranglement logistiques.",
      feat6: "Prévisionnel Dynamique",
      feat6_d: "Simulations multicritères basées sur la hausse des cours de l'énergie et de la logistique.",
      flowTitle: "Chaîne d'automatisation des flux",
      flowSub: "Visualisez comment vos entrées comptables se synchronisent pour éditer la liasse analytique finale sans effort.",
      flowStep1: "Tableau TRCI & Budget",
      flowStep2: "Coûts d'Achats & Stocks",
      flowStep3: "Ateliers de Production",
      flowStep4: "Synthèse & Résultat",
      pricingTitle: "Tarifs adaptés à votre croissance",
      pricingSub: "Abonnements annuels transparents, hébergement cloud sécurisé, et support technique inclus.",
      priceStarterName: "Startups & Petites Entreprises",
      priceStarterSub: "Parfait pour structurer les coûts d'achat et la marge de votre premier produit.",
      priceProName: "Moyennes Entreprises",
      priceProSub: "Idéal pour piloter plusieurs ateliers de production complexes.",
      priceEnterpriseName: "Grandes Entreprises",
      priceEnterpriseSub: "SLA garanti, serveurs privés dédiés et intégration SAP/Oracle.",
      onboardingTitle: "Bienvenue sur FyCompta",
      onboardingSub: "Créez votre environnement de travail en quelques instants.",
      step1Title: "Votre Profil",
      step2Title: "Votre Entreprise",
      step3Title: "Activation",
      step4Title: "Option de paiement",
      profileName: "Nom Complet",
      profileEmail: "Email Professionnel",
      profilePhone: "Numéro de Téléphone",
      profilePass: "Mot de passe sécurisé",
      companyName: "Nom de l'Entreprise",
      companySector: "Secteur d'Activité",
      companyEmployees: "Nombre d'Employés",
      trialHeader: "Félicitations ! Votre accès de 14 jours est configuré",
      trialText: "Accédez instantanément à toute la puissance d'analyse industrielle avec les clés d'allocation de charges et le consultant IA.",
      btnActivate: "Activer mon essai gratuit",
      paymentHeader: "Garantie d'abonnement post-essai",
      paymentText: "Sélectionnez votre moyen de paiement idéal pour assurer la continuité de service après les 14 jours d'évaluation :",
      payBank: "Virement Bancaire (BFR / Banque d'Algérie)",
      payDoc: "Demander une Facture Proforma officielle",
      payCard: "Paiement en ligne (Carte CIB / Dahabia)",
      btnLaunch: "Lancer le tableau de bord"
    },
    en: {
      tagline: "Transform your accounting data into executive decisions",
      subTagline: "The #1 industrial platform in Algeria for standard costing, indirect TRCI material allocation, scrap radar monitoring, and product group profit analysis.",
      ctaDemo: "Request a Demo",
      ctaTrial: "14-Day Free Trial",
      ctaLearn: "Learn More",
      socialCompanies: "500+ National Entities",
      socialAvailability: "99.9% System Uptime",
      socialScf: "100% Algerian SCF Compliant",
      probTitle: "Why do industrial factories lose margin?",
      probSub: "An audit of direct logistics overhead leaking into raw material purchase ledger entries.",
      probCard: "Current Factory Roadblocks",
      solCard: "FyCompta Solutions",
      prob1: "Crucial delay in compiling unit cost prices (often calculated monthly).",
      prob2: "Arbitrary allocation formulas for workshop utilities and TRCI.",
      prob3: "Zero visibility on operational scrap weights and physical waste.",
      prob4: "Inability to perform dynamic variance calculations against standard goals.",
      sol1: "Instant cost of sales simulations in micro-seconds.",
      sol2: "Accurate TRCI division schema using dynamic allocation cells.",
      sol3: "Scrap radar determining cash impact of waste per manufacturing line.",
      sol4: "Bento KPI matrix classifying profitable vs loss-making items.",
      sol5: "AI-assisted forecasting and notifications to stop profitability decay.",
      featTitle: "Everything your industrial plant requires",
      featSub: "Comprehensive analytical accounting tools built to sustain competitive Algerian manufacturer operations.",
      feat1: "Smart Analytical Ledger",
      feat1_d: "End-to-end cost flow tracing from inbound ledger inventory to net analytics.",
      feat2: "Real-time CUMP valuation",
      feat2_d: "Always-updated weighted average unit cost mapping of physical inventory sheets.",
      feat3: "Operational Scrap Radar",
      feat3_d: "Financial capturing of residual waste percentage rates per item.",
      feat4: "Variance & Target Check",
      feat4_d: "Live benchmark dashboards checking computing rates against target budgets.",
      feat5: "AI Accountant Consultant",
      feat5_d: "Interactive sidebar expert suggesting margin boosting and logistics savings.",
      feat6: "Financial Forecasting",
      feat6_d: "Sensitivity simulators analyzing wages or shipping tariff spikes.",
      flowTitle: "Automated Data Flow Pipeline",
      flowSub: "How data flows instantly to compile the income statement without double entry.",
      flowStep1: "TRCI Matrice & Loads",
      flowStep2: "CUMP & Inventory cards",
      flowStep3: "Ateliers & Production",
      flowStep4: "Synthesis & Outcomes",
      pricingTitle: "Abonnement Packages for all scales",
      pricingSub: "Annual transparent licenses, highly secured cloud, and premium standby support.",
      priceStarterName: "Startups & Micro Plants",
      priceStarterSub: "Perfect to track your first product's purchase ledger and margins.",
      priceProName: "Medium Enterprises",
      priceProSub: "Best seller for factories running multiple custom workshops.",
      priceEnterpriseName: "Grandes Entreprises",
      priceEnterpriseSub: "Full dedicated high-speed servers, tailored SLAs, and SAP connectors.",
      onboardingTitle: "Welcome to FyCompta",
      onboardingSub: "Configure your company profile to activate your automated sandbox.",
      step1Title: "Your Profile",
      step2Title: "Your Organization",
      step3Title: "Activation",
      step4Title: "Payment Configuration",
      profileName: "Full Name",
      profileEmail: "Business Email",
      profilePhone: "Phone number",
      profilePass: "Create complex password",
      companyName: "Organization Name",
      companySector: "Core Segment",
      companyEmployees: "Total Employees Range",
      trialHeader: "Congratulations! Sandbox environment loaded",
      trialText: "Enjoy 14 days of complete premium features, analytical allocations, and AI standby audit.",
      btnActivate: "Activate my 14 Days Free trial",
      paymentHeader: "Secure Subscription Continuance",
      paymentText: "Choose your fallback payment method to ensure continuous system uptime after sandbox trial:",
      payBank: "Bank Wire Transfer (Banque d'Algérie / CCP)",
      payDoc: "Generate a Proforma Invoice draft",
      payCard: "Credit Card (Golden Dahabia / CIB cloud payment gateway)",
      btnLaunch: "Enter the Interactive Dashboard"
    }
  };

  const l = ls[state.language] || ls['ar'];

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* 1. Main Navigation Bar (White Background) */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onEnterERP}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-805 flex items-center justify-center text-white shadow shadow-indigo-500/25">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wide text-slate-900 flex items-center gap-1.5 font-sans">
                <span>FyCompta</span>
              </span>
              <span className="text-[9.5px] text-slate-500 font-bold block -mt-1">{state.language === 'ar' ? 'الذكاء الصناعي المحاسبي' : 'AI Industrial Accounting'}</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-650 ml-4 mr-4">
            <button onClick={onEnterERP} className="text-indigo-650 font-black hover:text-indigo-800 transition-all border-b-2 border-indigo-600 pb-0.5">
              {state.language === 'ar' ? 'الرئيسية' : 'Accueil'}
            </button>
            
            {/* Sector / Application Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setAppsDropdownOpen(!appsDropdownOpen)}
                className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-650 transition-all focus:outline-none"
              >
                <span>{state.language === 'ar' ? 'التطبيقات' : 'Applications'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${appsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {appsDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute mt-2.5 w-60 bg-white border border-slate-205 rounded-xl shadow-xl py-2 z-50 ${isRtl ? 'right-0' : 'left-0'}`}
                  >
                    {[
                      { l_ar: 'المحاسبة التحليلية', l_fr: 'Comptabilité Analytique', l_en: 'Analytical Costing' },
                      { l_ar: 'المحاسبة المالية والضرائب', l_fr: 'Comptabilité Financière', l_en: 'Financial Accounting' },
                      { l_ar: 'إدارة المبيعات والفواتير', l_fr: 'Gestion des Ventes', l_en: 'Sales & Invoicing' },
                      { l_ar: 'سجل المخزونات والمواد الأولية', l_fr: 'Gestion des Stocks', l_en: 'Inventory Sheets' },
                      { l_ar: 'إدارة الموارد البشرية واليد العاملة', l_fr: 'Ressources Humaines', l_en: 'Human Resources' },
                      { l_ar: 'مراقبة جودة الإنتاج وهدر الورشات', l_fr: 'Contrôle Industriel', l_en: 'Wastage Radar' }
                    ].map((item, index) => {
                      const label = state.language === 'ar' ? item.l_ar : (state.language === 'fr' ? item.l_fr : item.l_en);
                      return (
                        <button
                          key={index}
                          onClick={() => handleSelectSector(item.l_ar)}
                          className="w-full text-right bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 text-xs transition-all flex items-center justify-between"
                          style={{ textAlign: isRtl ? 'right' : 'left' }}
                        >
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#pricing" className="text-slate-700 hover:text-indigo-650 transition-all">
              {state.language === 'ar' ? 'الأسعار' : 'Tarification'}
            </a>
            <a href="#features" className="text-slate-700 hover:text-indigo-650 transition-all">
              {state.language === 'ar' ? 'المساعدة' : 'Aide'}
            </a>
          </div>
        </div>

        {/* Navigation Right (Auth, Lang Switcher, blue CTA) */}
        <div className="flex items-center gap-3">
          {/* Micro Lang button switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10.5px]">
            <button 
              onClick={() => updateState({ language: 'ar' })} 
              className={`px-1.5 py-1 rounded font-black ${state.language === 'ar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'}`}
            >
              عربي
            </button>
            <button 
              onClick={() => updateState({ language: 'fr' })} 
              className={`px-1.5 py-1 rounded font-black ${state.language === 'fr' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'}`}
            >
              FR
            </button>
          </div>

          <button 
            onClick={onEnterERP} 
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
          >
            <span>{state.language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}</span>
          </button>

          <button
            onClick={startOnboarding}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer hover:scale-[1.02]"
          >
            {l.ctaTrial}
          </button>
        </div>
      </nav>

      {/* 2. Hero Section (Professional Dark Blue Odoo/Oracle Background) */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        {/* Abstract background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text details */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-black">
              <Sparkles className="w-4 h-4 animate-spin-slow duration-1000" />
              <span>{state.language === 'ar' ? 'نظام المحاسبة التحليلية المطور للجزائر' : 'Analytic Platform for Algerian Manufacturers'}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.2] text-white tracking-tight">
              {l.tagline}
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              {l.subTagline}
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button
                onClick={startOnboarding}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                {l.ctaTrial}
              </button>
              <button
                onClick={onEnterERP}
                className="bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-100 font-bold text-xs px-5 py-3.5 rounded-xl transition-all hover:text-white"
              >
                {l.ctaDemo}
              </button>
            </div>
          </div>

          {/* Right illustration of Dark-mode Dynamic Dashboard displaying real-time calculations */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-[#090d16] border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Dashboard inner header simulating real calculation node */}
              <div className="border-b border-indigo-950/40 pb-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="font-mono text-slate-400">ANAC_PILOT_NODE_KPI</span>
                </div>
                <span className="font-bold text-slate-500 bg-slate-950 border border-slate-900 rounded px-2 py-0.5">ADMIN SANDBOX</span>
              </div>

              {/* Grid showcasing 3 Industrial KPIs: Marge, CA, Taux de gaspillage */}
              <div className="grid grid-cols-3 gap-3.5 mt-5">
                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
                  <span className="text-[9.5px] uppercase text-slate-500 tracking-wider block font-bold">
                    {state.language === 'ar' ? 'هامش الربح الافتراضي' : 'Marge de démonstration'}
                  </span>
                  <div className="text-sm md:text-lg font-black text-emerald-400 font-mono mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.5%</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
                  <span className="text-[9.5px] uppercase text-slate-500 tracking-wider block font-bold">
                    {state.language === 'ar' ? 'رقم أعمال توضيحي' : "Chiffre d'affaires démo"}
                  </span>
                  <div className="text-sm md:text-lg font-black text-white font-mono mt-1">
                    12,850,000 <span className="text-[9px] text-slate-500">DA</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-center">
                  <span className="text-[9.5px] uppercase text-slate-500 tracking-wider block font-bold">
                    {state.language === 'ar' ? 'معدل هدر نموذجي' : 'Taux de gaspillage type'}
                  </span>
                  <div className="text-sm md:text-lg font-black text-amber-500 font-mono mt-1 flex items-center justify-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>3.2%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Line/Chart visualizer mockup */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">{state.language === 'ar' ? 'منظومة حساب تكلفة الشراء والصيانة' : 'Unit Cost Variance Tracker'}</span>
                  <span className="text-[9px] text-teal-400 font-mono">OK / SCF COMPLIANT</span>
                </div>
                
                {/* Visual bar graph representation */}
                <div className="space-y-2 pt-1.5">
                  {[
                    { label: state.language === 'ar' ? 'عجينة البلاستيك PVC' : 'PVC Resin Material', val: '68%', col: 'bg-amber-500' },
                    { label: state.language === 'ar' ? 'أكياس التغليف الورقية' : 'Kraft Packing Bags', val: '40%', col: 'bg-indigo-500' },
                    { label: state.language === 'ar' ? 'مصاريف النقل واللوجستيات' : 'Direct Transport Overhead', val: '88%', col: 'bg-rose-400' }
                  ].map((row, i) => (
                    <div key={i} className="text-[10.5px] space-y-1 font-mono">
                      <div className="flex justify-between items-center text-slate-350">
                        <span>{row.label}</span>
                        <span>{row.val}</span>
                      </div>
                      <div className="w-full bg-[#111827] h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: row.val }} className={`h-full ${row.col}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Dynamic Social Proof Section at the bottom of hero */}
        <div className="bg-slate-950/40 border-t border-slate-800/65 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-around items-center gap-6 text-center">
            
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-505/10 bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <Building2 className="w-5.5 h-5.5" />
              </div>
              <span className="text-xl font-black text-white font-mono">500+</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{l.socialCompanies}</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 border-t md:border-t-0 md:border-r border-slate-800 pt-6 md:pt-0 pl-0 md:pl-12">
              <div className="w-10 h-10 rounded-xl bg-indigo-505/10 bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <span className="text-xl font-black text-white font-mono">99.9%</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{l.socialAvailability}</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 border-t md:border-t-0 md:border-r border-slate-800 pt-6 md:pt-0 pl-0 md:pl-12">
              <div className="w-10 h-10 rounded-xl bg-indigo-505/10 bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <Compass className="w-5.5 h-5.5" />
              </div>
              <span className="text-xl font-black text-white font-mono">SCF COMPATIBLE</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{l.socialScf}</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Problem & Solution Section (Deep crimson vs. Deep blue cards side-by-side) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-wide">{l.probTitle}</h2>
            <p className="text-slate-650 text-xs md:text-sm font-semibold leading-relaxed">{l.probSub}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Red Card: Problèmes Actuels */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-red-50/40 border border-red-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-100/80 text-red-650 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-red-950">{state.language === 'ar' ? 'المشاكل الحالية في المصانع' : 'Problèmes comptables actuels'}</h3>
              </div>

              <ul className="space-y-4">
                {[l.prob1, l.prob2, l.prob3, l.prob4].map((point, index) => (
                  <li key={index} className="flex gap-3 items-start text-xs md:text-sm text-red-900 leading-relaxed font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Blue Card: Solutions FyCompta */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-indigo-50/40 border border-indigo-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-indigo-950">{state.language === 'ar' ? 'حلول FyCompta الذكية' : 'Solutions FyCompta'}</h3>
              </div>

              <ul className="space-y-4 relative z-10">
                {[l.sol1, l.sol2, l.sol3, l.sol4, l.sol5].map((point, index) => {
                  const isSpecialIA = index === 4; // AI specific feature highlighted in bold
                  return (
                    <li 
                      key={index} 
                      className={`flex gap-3 items-start text-xs md:text-sm leading-relaxed ${
                        isSpecialIA ? 'text-indigo-950 font-black' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      <Sparkles className={`w-4 h-4 shrink-0 mt-1 ${isSpecialIA ? 'text-amber-500 animate-pulse' : 'text-indigo-600'}`} />
                      <span>{point}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. Features Section (6-Card Grid) */}
      <section id="features" className="py-20 bg-white border-b border-slate-205">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-wide">{l.featTitle}</h2>
            <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">{l.featSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Feature 1: Analytique */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-705 flex items-center justify-center">
                <Calculator className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat1}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat1_d}</p>
            </div>

            {/* Feature 2: CUMP */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-705 flex items-center justify-center">
                <Box className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat2}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat2_d}</p>
            </div>

            {/* Feature 3: Radar Rebut */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-705 flex items-center justify-center">
                <Flame className="w-5.5 h-5.5 text-amber-500" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat3}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat3_d}</p>
            </div>

            {/* Feature 4: Variance */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-705 flex items-center justify-center">
                <Target className="w-5.5 h-5.5 src-emerald-500" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat4}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat4_d}</p>
            </div>

            {/* Feature 5: AI Consult */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-705 flex items-center justify-center">
                <Sparkles className="w-5.5 h-5.5 text-indigo-650" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat5}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat5_d}</p>
            </div>

            {/* Feature 6: Dynamic forecasts */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-705 flex items-center justify-center">
                <Activity className="w-5.5 h-5.5 text-blue-500" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat6}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat6_d}</p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Industrial Process Flow Section (Illuminated nodes background) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,#1e1b4b,transparent_80%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">{l.flowTitle}</h2>
            <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">{l.flowSub}</p>
          </div>

          {/* Illuminated chain link */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 relative">
            <div className="hidden md:block absolute top-[43px] left-8 right-8 h-0.5 bg-gradient-to-r from-indigo-550 via-teal-500 to-amber-500 opacity-60 pointer-events-none" />

            {[
              { title: l.flowStep1, label: state.language === 'ar' ? 'الخطوة الأولى' : 'Étape 01', col: 'border-indigo-500 text-indigo-400', desc: state.language === 'ar' ? 'تحديد مدخلات الميزانية الإجمالية والأعباء الموزعة للورش.' : 'Determining TRCI matrix coefficients.' },
              { title: l.flowStep2, label: state.language === 'ar' ? 'الخطوة الثانية' : 'Étape 02', col: 'border-teal-500 text-teal-400', desc: state.language === 'ar' ? 'حساب كلفة الشراء وعقد بطاقات الجرد بالـ CUMP في ثوانٍ.' : 'Purchase receipts compiling CUMP values.' },
              { title: l.flowStep3, label: state.language === 'ar' ? 'الخطوة الثالثة' : 'Étape 03', col: 'border-amber-500 text-amber-400', desc: state.language === 'ar' ? 'استهلاك المواد وإضافة أعداد الـ UO الخاصة بالورش.' : 'Workshop output measurements.' },
              { title: l.flowStep4, label: state.language === 'ar' ? 'تحقيق الأثر الصافي' : 'Synthèse finale', col: 'border-rose-500 text-rose-400', desc: state.language === 'ar' ? 'نقل النتائج أوتوماتيكياً لحساب النتيجة التحليلي العام.' : 'Compiling margin analysis spreadsheets.' }
            ].map((node, index) => (
              <div key={index} className="bg-[#090d16] border border-slate-800 rounded-2xl p-5 text-center relative z-10 space-y-3 shadow-xl">
                <span className="text-[9.5px] uppercase text-slate-500 tracking-wider block font-black">{node.label}</span>
                <div className="w-11 h-11 rounded-full bg-slate-950 border-2 border-dashed flex items-center justify-center text-sm font-black mx-auto shadow-inner" style={{ borderColor: node.col.split(' ')[0] }}>
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-100">{node.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing Subscription Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-wide">{l.pricingTitle}</h2>
            <p className="text-slate-650 text-xs md:text-sm font-semibold leading-relaxed">{l.pricingSub}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            
            {/* Starter tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starter</span>
                <h3 className="text-lg font-black text-slate-900">{l.priceStarterName}</h3>
                <p className="text-xs text-slate-500 font-semibold">{l.priceStarterSub}</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">30,000</span>
                  <span className="text-sm font-bold text-slate-500"> DZD / {state.language === 'ar' ? 'سنة' : 'an'}</span>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'تتبع 1 منتج مع 3 مواد أولية' : '1 finished product with 3 materials'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'جدول توزيع TRCI مبسط' : 'Simplified TRCI workshop allocation'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'تفعيل 14 يوماً من المساعد الذكي' : '14-day free trial on AI consultant'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all shadow mt-6 cursor-pointer"
              >
                {state.language === 'ar' ? 'ابدأ كـ تجربة مجانية' : 'Commencer l\'essai gratuit'}
              </button>
            </div>

            {/* Pro tier */}
            <div className="bg-white border-2 border-indigo-650 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between transform scale-[1.02]">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black px-3.5 py-1.5 rounded-bl-xl uppercase tracking-widest">{state.language === 'ar' ? 'الأكثر طلباً' : 'Recommandé'}</div>
              
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider block">Pro Plan</span>
                <h3 className="text-lg font-black text-indigo-950">{l.priceProName}</h3>
                <p className="text-xs text-indigo-505/85 text-slate-550 font-semibold">{l.priceProSub}</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-indigo-900">Sur Devis / بطلب سعر</span>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-indigo-100 text-xs text-slate-850 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-650 shrink-0" />
                    <span>{state.language === 'ar' ? 'عدد غير محدود من المنتجات والورشات' : 'Unlimited products & custom workshops'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-650 shrink-0" />
                    <span>{state.language === 'ar' ? 'رادار هدر ذكي ونسب تلقائية' : 'Interactive scrap rates with manual adjust'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-650 shrink-0" />
                    <span>{state.language === 'ar' ? 'وصول دائم ودعم غير محدود من المساعد المالي' : 'Full access to AI accounts adviser'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md mt-6 cursor-pointer"
              >
                {state.language === 'ar' ? 'طلب تفاصيل العرض' : 'Contacter les ventes'}
              </button>
            </div>

            {/* Enterprise tier */}
            <div className="bg-white border border-slate-205 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Enterprise</span>
                <h3 className="text-lg font-black text-slate-900">{l.priceEnterpriseName}</h3>
                <p className="text-xs text-slate-500 font-semibold">{l.priceEnterpriseSub}</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">Sur Devis / عرض مخصص</span>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-605 text-indigo-500 shrink-0" />
                    <span>{state.language === 'ar' ? 'تكامل تام مع أنظمة SAP, Oracle' : 'Oracle & SAP data synchronizer pipelines'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-605 text-indigo-500 shrink-0" />
                    <span>{state.language === 'ar' ? 'خوادم مخصصة ذات حماية فائقة' : 'Private hosted database constraints'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-605 text-indigo-500 shrink-0" />
                    <span>{state.language === 'ar' ? 'دعم هاتفي مباشر ومرافقة محاسبية' : 'Dedicated accounts support advisor'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition-all shadow mt-6 cursor-pointer"
              >
                {state.language === 'ar' ? 'اتصل بفرق المبيعات' : 'Contacter les ventes'}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Multi-step Onboarding Modal / Section (Inspired by Steps 1-4) */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-5"
            >
              
              {/* Modal Core header with Horizontal Step indicator */}
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                    <span>{l.onboardingTitle}</span>
                  </h3>
                  <button 
                    onClick={() => setShowOnboarding(false)}
                    className="text-slate-400 hover:text-slate-650 p-1 rounded-lg hover:bg-slate-200/50 transition-all font-black text-[10.5px]"
                  >
                    {state.language === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                </div>

                {/* Stepper visual horizontal checklist */}
                <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-400 font-mono mt-2">
                  {[l.step1Title, l.step2Title, l.step3Title, l.step4Title].map((stepName, sIndex) => {
                    const sNum = sIndex + 1;
                    const isPassed = onboardingStep > sNum;
                    const isActive = onboardingStep === sNum;
                    return (
                      <div key={sNum} className="flex flex-col items-center flex-1 relative">
                        {/* Connecting Line */}
                        {sIndex > 0 && (
                          <div className={`absolute top-[13.5px] w-full right-1/2 h-0.5 ${onboardingStep >= sNum ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        )}
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-black pointer-events-none relative z-10 transition-all ${
                          isPassed ? 'bg-indigo-600 border-indigo-600 text-white' : (isActive ? 'bg-white border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-400')
                        }`}>
                          {isPassed ? "✓" : sNum}
                        </div>
                        <span className={`text-[9px] mt-1 font-sans ${isActive ? 'text-indigo-650 font-black' : 'text-slate-400'}`}>{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Onboarding forms content wrapper */}
              <div className="p-6 md:p-8 pt-0">
                
                {/* Step 1: Your Profile */}
                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Step 1: {l.step1Title}</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.profileName}</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-450 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder={state.language === 'ar' ? 'أدخل اسمك الكريم' : 'Ex: Karim Benyahia'}
                          value={formProfile.fullName}
                          onChange={e => setFormProfile({ ...formProfile, fullName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.profileEmail}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-450 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="email"
                          placeholder="Ex: company@domain.dz"
                          value={formProfile.email}
                          onChange={e => setFormProfile({ ...formProfile, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.profilePhone}</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-450 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Ex: +213 (0) 555 12 34 56"
                          value={formProfile.phone}
                          onChange={e => setFormProfile({ ...formProfile, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.profilePass}</label>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={formProfile.password}
                        onChange={e => setFormProfile({ ...formProfile, password: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Your Company */}
                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Step 2: {l.step2Title}</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.companyName}</label>
                      <input 
                        type="text"
                        placeholder={state.language === 'ar' ? 'أدخل اسم مصنعك أو هيئتك' : 'Ex: Sarl El-Amel Plastique'}
                        value={formCompany.companyName}
                        onChange={e => setFormCompany({ ...formCompany, companyName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.companySector}</label>
                      <select
                        value={formCompany.sector}
                        onChange={e => setFormCompany({ ...formCompany, sector: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="المحاسبة التحليلية">{state.language === 'ar' ? 'صناعة البلاستيك والبتروكيمياويات' : 'Synthèse Plastique & Chimie'}</option>
                        <option value="المحاسبة المالية">{state.language === 'ar' ? 'صناعات غذائية وتحويلية' : 'Agroalimentaire & Transformation'}</option>
                        <option value="المبيعات">{state.language === 'ar' ? 'صناعة النسيج والجلود' : 'Textile & Confection'}</option>
                        <option value="المخزونات">{state.language === 'ar' ? 'مواد البناء ومقاطع التعدين' : 'Matériaux de Construction'}</option>
                        <option value="الأخرى">{state.language === 'ar' ? 'قطاع الخدمات اللوجستية والنقل' : 'Prestations logistiques & services'}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.companyEmployees}</label>
                      <select
                        value={formCompany.employees}
                        onChange={e => setFormCompany({ ...formCompany, employees: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="1-10">1 - 10 {state.language === 'ar' ? 'موظفين' : 'salariés'}</option>
                        <option value="11-50">11 - 50 {state.language === 'ar' ? 'موظفين' : 'salariés'}</option>
                        <option value="51-200">51 - 200 {state.language === 'ar' ? 'عامل' : 'personnes'}</option>
                        <option value="200+">200+ {state.language === 'ar' ? 'كبار المجموعات' : 'grand groupe'}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Free Trial Activation */}
                {onboardingStep === 3 && (
                  <div className="space-y-4 text-center py-4">
                    <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl mx-auto mb-2 shadow-inner">
                      ✓
                    </div>
                    <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider">Step 3: {l.step3Title}</h4>
                    <h3 className="text-sm font-black text-slate-900">{l.trialHeader}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold px-4">
                      {l.trialText}
                    </p>
                  </div>
                )}

                {/* Step 4: Payment Confirmation */}
                {onboardingStep === 4 && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Step 4: {l.step4Title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {l.paymentText}
                    </p>

                    <div className="space-y-3">
                      <label className={`flex gap-3 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        paymentOption === 'bank' ? 'bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentOption === 'bank'} 
                          onChange={() => setPaymentOption('bank')} 
                          className="accent-indigo-650"
                        />
                        <div className="flex-1 text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                          <span className="text-xs font-bold text-slate-800 block">{l.payBank}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{state.language === 'ar' ? 'دفع تقليدي عبر الحساب البريدي الجاري الجاري أو الخزينة العامة' : 'Banque d\'Algérie or CPA traditional bank wire.'}</span>
                        </div>
                      </label>

                      <label className={`flex gap-3 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        paymentOption === 'proforma' ? 'bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentOption === 'proforma'} 
                          onChange={() => setPaymentOption('proforma')} 
                          className="accent-indigo-650"
                        />
                        <div className="flex-1 text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                          <span className="text-xs font-bold text-slate-800 block">{l.payDoc}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{state.language === 'ar' ? 'توليد فاتورة مبدئية مصادق عليها إلكترونياً للإمضاء' : 'Authorized downloadable Quotation pro forma document.'}</span>
                        </div>
                      </label>

                      <label className={`flex gap-3 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        paymentOption === 'card' ? 'bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentOption === 'card'} 
                          onChange={() => setPaymentOption('card')} 
                          className="accent-indigo-650"
                        />
                        <div className="flex-1 text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                          <span className="text-xs font-bold text-slate-800 block">{l.payCard}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{state.language === 'ar' ? 'ربط مباشر مع البطاقة الذهبية لبريد الجزائر وبطاقات CIB البنكية' : 'Algeria Dahabia Card gateway integration.'}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Onboarding buttons section */}
                <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-6">
                  {onboardingStep > 1 && onboardingStep < 4 ? (
                    <button
                      onClick={handlePrevStep}
                      className="bg-slate-105 border border-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      {state.language === 'ar' ? 'السابق' : 'Précédent'}
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleNextStep}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    {onboardingStep === 3 ? l.btnActivate : (onboardingStep === 4 ? l.btnLaunch : (state.language === 'ar' ? 'المتابعة' : 'Continuer'))}
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
