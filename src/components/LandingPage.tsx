import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { FyComptaLogo } from './FyComptaLogo';
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
  BellRing,
  RotateCcw,
  BarChart4
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

  // Live Interactive Dashboard Mockup states
  const [allocationMethod, setAllocationMethod] = useState<'direct' | 'step'>('step');
  const [assemblyCost, setAssemblyCost] = useState(55000);
  const [maintenanceCost, setMaintenanceCost] = useState(48000);
  const [energyCost, setEnergyCost] = useState(46900);
  const [adminCost, setAdminCost] = useState(24000);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Chat/AI Copilot states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: state.language === 'ar' 
        ? "مرحباً بك! أنا مساعد التكاليف الذكي لمنصة FyCompta. لقد قمت بتحليل تفاصيل اليومية المحاسبية ومراكز التكلفة بمصنعكم تلقائياً. يمكنك الضغط على الأسئلة المقترحة أو سؤالي مباشرة عن نسب الهدر وطرق خفض التكلفة المحددة لـ Alloy Valve X-2."
        : "Welcome! I am FyCompta's smart cost assistant. I have automatically analyzed your factory's ledger entries and cost centers. Click on any prompt below or ask me about raw material waste and savings."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handlePromptClick = (promptText: string) => {
    // Prevent double submissions while typing
    if (isTyping) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: promptText }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (promptText.includes('نصائح') || promptText.includes('tips') || promptText.includes('conseils') || promptText.includes('هدر')) {
        reply = state.language === 'ar'
          ? "بناءً على المعطيات والتحليلات الحالية لمصنع FyCompta، إليك 3 إجراءات فورية للتنفيذ:\n\n1. **معالجة تباين المواد الخام**: تم رصد فائض هدر في ورشة التركيب بمعدل 2.8% وهو ما يتجاوز المعيار (1.5%). يُوصى بالتحقق من معايرة آلات التشغيل ومراكز التدفق.\n2. **توزيع أعباء الصيانة**: إعادة التوزيع التنازلي لورشة الصيانة يوضح أن 12% من الوقت المستهلك يذهب للورشة الثانوية دون تحميل مباشر.\n3. **تحسين هامش المساهمة**: يبلغ هامش الربح الإجمالي الحالي 31.5%؛ برفع استخدام مجمع الطاقة بنسبة 5%، يمكن خفض التكلفة بمقدار 240,000 دج شهرياً."
          : "Based on FyCompta's active calculations, here are 3 instant measures:\n\n1. **Waste Control**: A raw material variance of 2.8% is detected in the assembly workshop (benchmark is 1.5%).\n2. **Stepdown Correction**: Changing from direct to step-down secondary allocation reveals 12% secondary distortion.\n3. **Contribution Margin**: Raising total power production utilization by 5% will reduce unabsorbed fixed overheads by 240,000 DZD.";
      } else if (promptText.includes('Alloy') || promptText.includes('هوامش') || promptText.includes('marge') || promptText.includes('صمامات') || promptText.includes('الربح')) {
        reply = state.language === 'ar'
          ? "التحليل المالي لربحية منتج Alloy Valve X-2 بمصنعكم:\n- **سعر التكلفة الإجمالي (Coût de Revient)**: 4,500 دج للوحدة.\n- **نسبة المواد الأولية واليد العاملة المباشرة**: 58%.\n- **أعباء الورش المشتركة المحملة**: 24%.\n- **الهامش الإجمالي**: 31.5%.\n- **التوجيه**: تفعيل خيار 'التوزيع التنازلي' يمنح دقة محاسبية قدرها 98.4% لقرارات التصدير والتسعير وتجنب الأخطاء الورقية."
          : "Financial analysis for Alloy Valve X-2:\n- **Full Cost Price**: 4,500 DZD per unit.\n- **Direct Elements (Material + Labor)**: 58%.\n- **Absorbed Indirect Overhead**: 24%.\n- **Gross Margin**: 31.5%.\n- **Guidance**: Activating Step-down allocation optimizes export price modeling up to 98.4% accuracy.";
      } else {
        reply = state.language === 'ar'
          ? "تحليل شامل لمراكز التكلفة غير المباشرة لورش المصنع من FyCompta:\n1. **مجمع الطاقة والكهرباء**: يمتص العبء الأكبر بنسبة 28% من التكاليف غير المباشرة.\n2. **ورشة صيانة الآلات**: تساهم بـ 18%.\n3. **توصية المحاكي**: اعتماد طريقة التوزيع التنازلي يفرز دقة مذهلة ويعالج تشوهات الطريقة المباشرة الكلاسيكية بمعدل 4.2% لصالح هوامش الأقسام الإنتاجية."
          : "Indirect Cost Centre analysis:\n1. **Energy & Power Center**: Absorbs the largest chunk (28% of indirect loads).\n2. **Machine Maintenance**: Accounts for 18%.\n3. **Recommendation**: Step-down secondary allocation corrects direct method deviations by 4.2% across primary production lines.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 850);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput('');
    handlePromptClick(txt);
  };

  const handleResetSimulator = () => {
    setAssemblyCost(55000);
    setMaintenanceCost(48000);
    setEnergyCost(46900);
    setAdminCost(24000);
    setAllocationMethod('step');
  };

  // For multi-step onboarding state
  const [formProfile, setFormProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [formCompany, setFormCompany] = useState({
    companyName: '',
    sector: '',
    employees: '11-50',
    customSector: ''
  });
  const [formErrors, setFormErrors] = useState<{ companyName?: string; sector?: string; customSector?: string }>({});
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
    if (onboardingStep === 2) {
      const errors: { companyName?: string; sector?: string; customSector?: string } = {};
      
      if (!formCompany.companyName.trim()) {
        errors.companyName = state.language === 'ar' 
          ? 'يرجى إدخال اسم المؤسسة' 
          : 'Veuillez saisir le nom de l\'entreprise';
      }
      
      if (!formCompany.sector) {
        errors.sector = state.language === 'ar' 
          ? 'يرجى اختيار قطاع النشاط' 
          : 'Veuillez choisir un secteur d\'activité';
      }
      
      if (formCompany.sector === 'أخرى / Autres' && !formCompany.customSector.trim()) {
        errors.customSector = state.language === 'ar' 
          ? 'يرجى تحديد النشاط بالتفصيل' 
          : 'Veuillez préciser votre activité';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    setFormErrors({});
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
      tagline: "منصة سحابية مدعمة بالذكاء الاصطناعي لإدارة محاسبة التكاليف وتحليل الأداء المالي ودعم اتخاذ القرار للمؤسسات الصناعية",
      subTagline: "أتمتة العمليات بواسطة FyCompta والتكامل مع المساعد الذكي لتوزيع التكاليف و لمراقبة هوامش لأرباح تحليل هدر المواد ودعم الإدارة المالية خطوة بخطوة بدلالة نظام SCF الجزائري",
      ctaDemo: "احجز جلسة عرض مخصصة للمنشأة",
      ctaTrial: "ابدأ نسخة التجربة المجانية للبرنامج",
      ctaLearn: "اكتشف المزيد",
      socialCompanies: "500+ مؤسسة جزائرية",
      socialAvailability: "99.9% جاهزية النظام",
      socialScf: "متوافق كلياً مع نظام SCF",
      probTitle: "محاسبة التكاليف لا يجب أن تعتمد على جداول أوراق Excel الهشة واليدوية",
      probSub: "دراسة استقصائية لأكبر عوائق تضخم تكاليف المواد الأولية والتتبع الضعيف لأعباء الورش التوزيعية والتعقيدات التشغيلية التقليدية.",
      probCard: "المشاكل والتعقيدات التشغيلية التقليدية (Legacy Operational Bottlenecks)",
      solCard: "حلول FyCompta الذكية للمنشآت (Modern Automated Allocations)",
      prob1: "الاعتماد الكامل على جداول أوراق Excel الهشة والمعرضة للخطأ اليدوي.",
      prob2: "الغموض والتقدير العشوائي في توزيع التكاليف المشتركة والمصاريف غير المباشرة.",
      prob3: "الغياب التام لأي رادار لتتبع هدر وخسائر المواد الأولية أثناء خطوط التشغيل.",
      prob4: "شلل في حساب سعر التكلفة الفعلي والمتوسط المرجح (CUMP) لكل منتج نهائي.",
      sol1: "ربط رقمي للواردات يغني تماماً عن أوراق وجداول الإدخال اليدوي القابلة للتلف.",
      sol2: "توزيع رياضي دقيق للأعباء بالطريقة المباشرة والتنازلية (Step-down & Direct).",
      sol3: "رادار ذكي وفوري يسلط الضوء على هوامش الفائد ومواقع الهدر لكل ورشة صناعية.",
      sol4: "بناء أسعار تكلفة دقيقة لجميع المنتجات والصناعات (CUMP / Coût Price).",
      sol5: "مساعد محاسبي ذكي (AI Copilot) ومستشار متعدد اللغات يدعم رصد وتحليل الانحرافات.",
      featTitle: "حلول صممت لإيجاد وإصلاح الهدر المالي وتحسين الربحية",
      featSub: "مجموعة مدمجة من الأدوات المالية المصممة خصيصاً لتلبية متطلبات بيئة الإنتاج الجزائرية والشرق أوسطية.",
      feat1: "المحاسبة التحليلية الذكية",
      feat1_d: "توزيع متسق وفوري لجميع التكاليف الثابتة والمتغيرة لكل قسم وورشة داخل مصنعك.",
      feat2: "حساب CUMP تلقائي ومباشر",
      feat2_d: "حساب دائم لمتوسط تكلفة التصنيع المرجح تلقائياً عند استلام أي كميات أو مواد خام جديدة لتفادي فروقات الجرد والأسعار.",
      feat3: "رادار الهدر والفواقد",
      feat3_d: "يقارن الاستهلاك الفعلي للموارد والمواد بالكميات المعيارية للورود لتقارير فورية عن أي انحراف في التصنيع.",
      feat4: "توقعات مالية ديناميكية (AI)",
      feat4_d: "استخدم الذكاء الاصطناعي للتنبؤ بتقلبات أسعار شراء الطاقة والمواد الخام والتناسب في مستلزمات الإنتاج القادمة.",
      feat5: "تحليل الانحرافات والتباين للمخازن",
      feat5_d: "مراقبة متكاملة لمدى تطابق تكلفة الإنتاج المتوقعة بالفعلي المسجل لتصحيح مواضع الخلل على الفور.",
      feat6: "مساعد محاسبي قوي مدعوم بالذكاء الاصطناعي",
      feat6_d: "مساعد محاسبة متكامل يسرد تقارير التكاليف، ويشرح المعادلات المالية للمديرين التشغيليين بدون تعقيد.",
      flowTitle: "سلسلة التدفق الأوتوماتيكي للبيانات",
      flowSub: "كيف تتدفق مدخلاتك المحاسبية لتشكل النتيجة المالية الصافية للمؤسسة دون تكرار إدخال.",
      flowStep1: "جدول TRCI والمصاريف",
      flowStep2: "تكلفة الشراء والجرد",
      flowStep3: "تكلفة الإنتاج للورشات",
      flowStep4: "النتيجة والتحليل الإحصائي",
      pricingTitle: "باقات اشتراكات مرنة تناسب حجم وتطور أعمالك",
      pricingSub: "تراخيص سنوية شفافة تدعم بيئة عمل سحابية آمنة مع دعم فني متكامل.",
      priceStarterName: "المؤسسات الناشئة والصغيرة (باقة المبتدئين)",
      priceStarterSub: "المثالية للمؤسسات والشركات الصناعية الصغيرة التي ترغب في أتمتة الدفتر المحاسبي وتجريب توزيع التكاليف.",
      priceProName: "المؤسسات المتوسطة (باقة المحترفين)",
      priceProSub: "مصممة لمصانع الإنتاج المتنامية لتوزيع التكاليف بشكل تنازلي مستمر.",
      priceEnterpriseName: "المؤسسات الكبيرة (الباقة المتمثلة)",
      priceEnterpriseSub: "ربط متكامل للشركات ذات الفروع المتعددة والمصانع المتكاملة مع حوسبة مخصصة.",
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
      tagline: "Une plateforme cloud propulsée par l'IA pour la gestion de la comptabilité analytique, l'analyse des performances financières et l'aide à la décision pour les entreprises industrielles",
      subTagline: "Automatisation des processus par FyCompta et intégration avec l'assistant intelligent pour la répartition des coûts, le suivi des marges bénéficiaires, l'analyse du gaspillage des matières et le support de la gestion financière étape par étape selon le système SCF algérien",
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
      tagline: "An AI-powered cloud platform for cost accounting management, financial performance analysis, and decision support for industrial enterprises",
      subTagline: "Process automation by FyCompta and integration with the smart assistant for cost distribution, profit margin monitoring, material waste analysis, and step-by-step financial management support aligned with the Algerian SCF system",
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
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow shadow-slate-900/10">
              <FyComptaLogo size={34} />
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
              className={`px-1.5 py-1 rounded font-black ${state.language === 'ar' ? 'bg-[#396ef6] text-white shadow-sm' : 'text-slate-600'}`}
            >
              عربي
            </button>
            <button 
              onClick={() => updateState({ language: 'fr' })} 
              className={`px-1.5 py-1 rounded font-black ${state.language === 'fr' ? 'bg-[#396ef6] text-white shadow-sm' : 'text-slate-600'}`}
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
            className="bg-[#3979f6] hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer hover:scale-[1.02] border border-[#ffffff]"
          >
            {l.ctaTrial}
          </button>
        </div>
      </nav>

      {/* 2. Hero Section (Professional Dark Blue Odoo/Oracle Background) */}
      <section className="bg-[#0b1329] text-white py-16 md:py-24 relative overflow-hidden">
        {/* Abstract background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 ml-0 pl-0 pr-0 mr-0 mt-0"></div>
        
        <div className={`max-w-4xl mx-auto px-4 md:px-8 relative z-10 flex flex-col ${isRtl ? 'items-end text-right' : 'items-start text-left'}`}>
          
          {/* Typography & Action Buttons */}
          <div className="space-y-6 w-full flex flex-col" style={{ textAlign: isRtl ? 'right' : 'left', alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
            <div 
              className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-black pt-[6px]"
              style={{ marginLeft: '300px' }}
            >
              <Sparkles className="w-4 h-4 animate-spin-slow duration-1000 shrink-0" />
              <span>
                {state.language === 'ar' 
                  ? 'نظام المحاسبة التحليلية المطور للجزائر' 
                  : state.language === 'fr' 
                    ? 'Système de Comptabilité Analytique pour l\'Algérie' 
                    : 'Analytical Costing System for Algeria'}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-[1.3] text-white tracking-tight w-full mt-0 pt-0 pb-0" style={{ color: '#f0f3fc', textAlign: 'center' }}>
              {l.tagline}
            </h1>
            
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl w-full mb-6" style={{ color: '#a1a8b1', textAlign: 'center', marginLeft: '117px' }}>
              {l.subTagline}
            </p>

            <div className={`flex flex-wrap gap-3 w-full pt-0 ${isRtl ? 'justify-end' : 'justify-start'}`} style={{ marginLeft: '200px' }}>
              <button
                onClick={startOnboarding}
                className="bg-blue-600 hover:bg-blue-505 text-white font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                {l.ctaTrial}
              </button>
              <button
                onClick={onEnterERP}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs px-5 py-3.5 rounded-xl transition-all hover:text-white"
                style={{ color: '#afb3bc' }}
              >
                {l.ctaDemo}
              </button>
            </div>
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

      {/* 2.5 Interactive Embedded Live Dashboard Section (Sample View) */}
      <section className="py-20 bg-slate-900 border-b border-slate-950 relative overflow-hidden">
        {/* Decorative ambient rays */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-black">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{state.language === 'ar' ? 'نموذج محاكاة القيادة بدقة عالية' : 'High-Fidelity Simulation Sandbox'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight" style={{ color: '#d7dbe4' }}>
              {state.language === 'ar' ? 'لوحة القيادة والمحاكاة التحليلية المباشرة' : 'Live Analytical Dashboard & Simulation'}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: '#a1a8b1' }}>
              {state.language === 'ar' 
                ? 'قاعدة تتبع وحوسبة التكاليف الصناعية غير المباشرة وتعديل الأسعار التنازلية بالوقت الفعلي لمصنعكم.'
                : 'Track and absorb indirect industrial overheads and simulate real-time cascade allocations.'}
            </p>
          </div>

          {/* Core Simulator Card Container */}
          <div className="bg-[#070b14] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />

            {/* Dashboard Mockup Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 font-extrabold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{state.language === 'ar' ? 'نشط الموزع المالي بدقة' : 'Active: Cost Ratio Allocator'}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-450 font-black tracking-wider uppercase text-[10px]">
                  SOC2 Certified
                </div>
              </div>

              <button 
                onClick={handleResetSimulator}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 hover:text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
                <span>{state.language === 'ar' ? 'إعادة تعيين القيم الأصلية' : 'Reset Default Values'}</span>
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 relative group">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-bold leading-relaxed">
                    {state.language === 'ar' ? 'هامش الربح الإجمالي للمصنع (الافتراضي)' : 'Factory Gross Margin (Default)'}
                  </span>
                  <div className="p-1 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] flex items-center gap-1 shadow-sm font-mono shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.5%</span>
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-mono mt-3">
                  31.5%
                </div>
                <span className="text-[10px] text-slate-500 font-bold block mt-1.5 uppercase tracking-wider">
                  {state.language === 'ar' ? 'نشط - التوزيع التنازلي دقيق' : 'Active - Precise stepdown'}
                </span>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 relative group">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-bold leading-relaxed">
                    {state.language === 'ar' ? 'رقم أعمال المنشأة الإجمالي Q2' : 'Aggregated Total Revenue Q2'}
                  </span>
                  <span className="text-[9.5px] text-blue-400 font-mono font-black bg-blue-950/45 px-2 py-1 rounded-md border border-blue-900/30 shrink-0">
                    Q2 REVENUE
                  </span>
                </div>
                <div className="text-3xl font-black text-blue-400 font-mono mt-3">
                  1,450,000 <span className="text-xs font-sans text-slate-500">{state.language === 'ar' ? 'دج' : 'DZD'}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold block mt-1.5 uppercase tracking-wider">
                  {state.language === 'ar' ? 'مجموع الربع الثاني الموحد' : 'Aggregated cumulative sum'}
                </span>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 relative group">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-bold leading-relaxed">
                    {state.language === 'ar' ? 'معدل تشغيل وهدر نموذجي' : 'Standard Scrap & Waste Rate'}
                  </span>
                  <span className="p-1 px-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-black shrink-0">
                    OPTIMIZED
                  </span>
                </div>
                <div className="text-3xl font-black text-rose-500 font-mono mt-3">
                  2.8%
                </div>
                <span className="text-[10px] text-slate-500 font-bold block mt-1.5 uppercase tracking-wider">
                  {state.language === 'ar' ? 'تحت المستويات المعيارية المقبولة' : 'Below maximum limit threshold'}
                </span>
              </div>
            </div>

            {/* Deep Dive Interactive Simulator Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Cost allocation with interactive Sliders (Colspan 7) */}
              <div className="lg:col-span-7 bg-[#040811] border border-slate-850 rounded-2xl p-5 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm md:text-base font-black text-white" style={{ color: '#c0c6d5' }}>
                      {state.language === 'ar' ? 'محرك توزيع التكلفة والخدمات المتبادلة' : 'Cost Allocation & Cascading Overheads'}
                    </h3>
                    <p className="text-[10.5px] text-slate-400" style={{ color: '#c0c6d5' }}>
                      {state.language === 'ar' ? 'اضبط أوزان نفقات الورش وشاهد إعادة هيكلة وتحميل الأعباء بالجدول فورا.' : 'Slide to change basic workshop costs and witness cascade allocation ratios recalculate.'}
                    </p>
                  </div>

                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10.5px] self-end sm:self-auto shrink-0">
                    <button 
                      onClick={() => setAllocationMethod('direct')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${allocationMethod === 'direct' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {state.language === 'ar' ? 'الطريقة المباشرة' : 'Direct Method'}
                    </button>
                    <button 
                      onClick={() => setAllocationMethod('step')}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${allocationMethod === 'step' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {state.language === 'ar' ? 'طريقة التوزيع التنازلي' : 'Step-down Method'}
                    </button>
                  </div>
                </div>

                {/* Sliders Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slider 1 */}
                  <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-900">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-350 font-bold">{state.language === 'ar' ? 'ورشة التركيب والتجميع' : 'Assembly & Prep line'}</span>
                      <span className="font-mono text-blue-400 font-extrabold">{assemblyCost.toLocaleString()} {state.language === 'ar' ? 'دج' : 'DA'}</span>
                    </div>
                    <input 
                      type="range"
                      min="10000"
                      max="150000"
                      step="1000"
                      value={assemblyCost}
                      onChange={(e) => setAssemblyCost(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-900 h-1 rounded appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-900">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-350 font-bold">{state.language === 'ar' ? 'ورشة صيانة الآلات' : 'Maintenance Team'}</span>
                      <span className="font-mono text-blue-400 font-extrabold">{maintenanceCost.toLocaleString()} {state.language === 'ar' ? 'دج' : 'DA'}</span>
                    </div>
                    <input 
                      type="range"
                      min="10000"
                      max="150000"
                      step="1000"
                      value={maintenanceCost}
                      onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-900 h-1 rounded appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-900">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-350 font-bold">{state.language === 'ar' ? 'مجمع الطاقة والكهرباء' : 'Energy & Power Center'}</span>
                      <span className="font-mono text-blue-400 font-extrabold">{energyCost.toLocaleString()} {state.language === 'ar' ? 'دج' : 'DA'}</span>
                    </div>
                    <input 
                      type="range"
                      min="10000"
                      max="150000"
                      step="1000"
                      value={energyCost}
                      onChange={(e) => setEnergyCost(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-900 h-1 rounded appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider 4 */}
                  <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-900">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-350 font-bold">{state.language === 'ar' ? 'إدارة وموظفي المصنع' : 'Plant Logistics & Admin'}</span>
                      <span className="font-mono text-blue-400 font-extrabold">{adminCost.toLocaleString()} {state.language === 'ar' ? 'دج' : 'DA'}</span>
                    </div>
                    <input 
                      type="range"
                      min="10000"
                      max="150000"
                      step="1000"
                      value={adminCost}
                      onChange={(e) => setAdminCost(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-900 h-1 rounded appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Segmented bar graph mockup */}
                <div className="bg-slate-950/50 p-4 border border-slate-900 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart4 className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase">
                      {state.language === 'ar' ? 'حركة التكاليف المشتركة الممتصة للورش بعد التخصيص غير المباشر' : 'Tracing Indirect Absorbances across Primary Workshops'}
                    </span>
                  </div>

                  <div className="space-y-4 pt-1">
                    {[
                      { 
                        name_ar: 'ورشة التركيب والتجميع', 
                        name_en: 'Assembly & Prep', 
                        direct: assemblyCost, 
                        allocated: allocationMethod === 'direct' ? assemblyCost * 0.35 : assemblyCost * 0.58 
                      },
                      { 
                        name_ar: 'ورشة صيانة الآلات', 
                        name_en: 'Machine Maintenance', 
                        direct: maintenanceCost, 
                        allocated: allocationMethod === 'direct' ? maintenanceCost * 0.28 : maintenanceCost * 0.44 
                      },
                      { 
                        name_ar: 'مجمع الطاقة والكهرباء', 
                        name_en: 'Energy & Power Hub', 
                        direct: energyCost, 
                        allocated: allocationMethod === 'direct' ? energyCost * 0.15 : energyCost * 0.35 
                      },
                      { 
                        name_ar: 'إدارة وموظفي المصنع', 
                        name_en: 'Factory Admin Division', 
                        direct: adminCost, 
                        allocated: allocationMethod === 'direct' ? adminCost * 0.05 : adminCost * 0.15 
                      }
                    ].map((item, id) => {
                      const displayLabel = state.language === 'ar' ? item.name_ar : item.name_en;
                      const sum = item.direct + item.allocated;
                      const cap = 250000;
                      const dPercent = Math.min(100, (item.direct / cap) * 100);
                      const iPercent = Math.min(100, (item.allocated / cap) * 100);

                      return (
                        <div key={id} className="space-y-1 text-xs">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-300 font-bold">{displayLabel}</span>
                            <span className="font-mono text-slate-400">
                              {state.language === 'ar' ? 'المجموع المحمل:' : 'Allocated Sum:'}{' '}
                              <span className="text-white font-black">{Math.round(sum).toLocaleString()} دج</span>
                            </span>
                          </div>

                          <div className="space-y-1">
                            {/* Direct cost (blue) */}
                            <div className="flex items-center gap-2">
                              <span className="w-14 text-[8.5px] text-slate-500 font-mono tracking-widest uppercase">DIRECT</span>
                              <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div style={{ width: `${dPercent}%` }} className="bg-blue-600 h-full rounded transition-all duration-300" />
                              </div>
                              <span className="w-14 font-mono text-[9.5px] text-right text-blue-400 font-extrabold">{Math.round(item.direct).toLocaleString()}</span>
                            </div>

                            {/* Indirect cost (purple) */}
                            <div className="flex items-center gap-2">
                              <span className="w-14 text-[8.5px] text-slate-500 font-mono tracking-widest uppercase">ABSORBED</span>
                              <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div style={{ width: `${iPercent}%` }} className="bg-purple-500 h-full rounded transition-all duration-300" />
                              </div>
                              <span className="w-14 font-mono text-[9.5px] text-right text-purple-400 font-extrabold">{Math.round(item.allocated).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend bar */}
                  <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-900 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                      <span>{state.language === 'ar' ? 'أعباء إنتاج مباشرة' : 'Direct Production Loads'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-purple-500" />
                      <span>{state.language === 'ar' ? 'أعباء ثانوية موزعة (TRCI)' : 'Absorbed Indirect Overheads'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Copilot chat simulator (Colspan 5) */}
              <div className="lg:col-span-5 bg-[#040811] border border-slate-850 rounded-2xl p-5 md:p-6 flex flex-col h-[520px]">
                
                {/* Header info */}
                <div className="pb-3.5 border-b border-slate-900 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7.5 h-7.5 bg-blue-500/10 border border-blue-500/25 rounded-md flex items-center justify-center text-blue-400">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-100" style={{ color: '#dae0ed' }}>{state.language === 'ar' ? 'تحليلات واستفسارات التدقيق الفورية' : 'Instant Audit AI Consultant'}</h4>
                      <div className="flex items-center gap-1 text-[9.5px] text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>STANDBY ONLINE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages pane */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ms-auto flex-row-reverse' : 'me-auto text-slate-200'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          Fy
                        </div>
                      )}
                      <div 
                        className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md' : 'bg-slate-950 border border-slate-900 text-slate-250 rounded-tl-none font-semibold'}`}
                        style={index === 0 ? { color: '#c9d1de' } : undefined}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 max-w-[85%] me-auto">
                      <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                        Fy
                      </div>
                      <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl rounded-tl-none text-slate-550 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendation prompt chips */}
                <div className="space-y-2 pb-3">
                  <span className="text-[9.5px] uppercase font-bold text-slate-500 block">
                    {state.language === 'ar' ? 'استفسارات محاسبية مقترحة:' : 'Recommended finance prompts:'}
                  </span>
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => handlePromptClick(state.language === 'ar' ? 'أبرز لنا 3 نصائح فورية لخفض التكاليف وعلاج الهدر بمصنعنا' : 'Give us 3 immediate cost-savings & waste optimization tips')}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-350 hover:text-white px-3 py-2 text-right rounded-xl text-[10.5px] font-bold transition-all shadow-sm"
                      style={{ color: '#e9ebf1' }}
                    >
                      {state.language === 'ar' ? '💡 خفض التكاليف وضبط نسب الهدر' : '💡 Review factory waste optimization'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => handlePromptClick(state.language === 'ar' ? 'حلل هوامش أرباح صمامات صنف Alloy Valve X-2 وكلفة الورشة' : 'Analyze gross margins for Alloy Valve X-2 production')}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-350 hover:text-white px-3 py-2 text-right rounded-xl text-[10.5px] font-bold transition-all shadow-sm"
                      style={{ color: '#e7ebee' }}
                    >
                      {state.language === 'ar' ? '⚙️ تحليل التكلفة الموزعة لـ Alloy Valve X-2' : '⚙️ Calculate pricing for Alloy Valve X-2'}
                    </button>
                  </div>
                </div>

                {/* Chat direct submission form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text"
                    disabled={isTyping}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={state.language === 'ar' ? 'اكتب تساؤلاً مالياً حول مصنعكم هنا...' : 'Ask about ledger elements or CUMP...'}
                    className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-40"
                  />
                  <button 
                    type="submit"
                    disabled={isTyping || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-505 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:scale-100 active:scale-95 text-white font-black px-4 py-2.5 rounded-xl transition-all text-xs cursor-pointer font-sans shrink-0"
                  >
                    {state.language === 'ar' ? 'إرسال' : 'Send'}
                  </button>
                </form>

              </div>

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
              className="bg-blue-50/40 border border-blue-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">{state.language === 'ar' ? 'حلول FyCompta الذكية' : 'Solutions FyCompta'}</h3>
              </div>

              <ul className="space-y-4 relative z-10">
                {[l.sol1, l.sol2, l.sol3, l.sol4, l.sol5].map((point, index) => {
                  const isSpecialIA = index === 4; // AI specific feature highlighted in bold
                  return (
                    <li 
                      key={index} 
                      className={`flex gap-3 items-start text-xs md:text-sm leading-relaxed ${
                        isSpecialIA ? 'text-slate-950 font-black' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      <Sparkles className={`w-4 h-4 shrink-0 mt-1 ${isSpecialIA ? 'text-amber-500 animate-pulse' : 'text-blue-600'}`} />
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
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Calculator className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat1}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat1_d}</p>
            </div>

            {/* Feature 2: CUMP */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Box className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat2}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat2_d}</p>
            </div>

            {/* Feature 3: Radar Rebut */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Flame className="w-5.5 h-5.5 text-amber-500" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat3}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat3_d}</p>
            </div>

            {/* Feature 4: Variance */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Target className="w-5.5 h-5.5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat4}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat4_d}</p>
            </div>

            {/* Feature 5: AI Consult */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-5.5 h-5.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{l.feat5}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{l.feat5_d}</p>
            </div>

            {/* Feature 6: Dynamic forecasts */}
            <div className="bg-slate-50 hover:bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 transition-all shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
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
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide" style={{ color: '#d7dbff' }}>{l.flowTitle}</h2>
            <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed" style={{ color: '#a1a8b1' }}>{l.flowSub}</p>
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
                <span className="text-[9.5px] uppercase text-slate-500 tracking-wider block font-black" style={{ color: '#e1e7f1' }}>{node.label}</span>
                <div className="w-11 h-11 rounded-full bg-slate-950 border-2 border-dashed flex items-center justify-center text-sm font-black mx-auto shadow-inner" style={{ borderColor: node.col.split(' ')[0] }}>
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-100" style={{ color: '#525c74' }}>{node.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed" style={{ color: '#dce2ea' }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing Subscription Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-wide">{l.pricingTitle}</h2>
            <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">{l.pricingSub}</p>

            {/* Billing Switcher Trigger */}
            <div className="inline-flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm justify-center mt-2">
              <span className={`text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
                {state.language === 'ar' ? 'فوترة شهرية' : 'Billing Monthly'}
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6.5 rounded-full bg-slate-100 border border-slate-300 p-1 flex items-center transition-all focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-blue-600 transition-all duration-300 shadow ${billingCycle === 'yearly' ? (isRtl ? 'translate-x-0' : 'translate-x-[22px]') : (isRtl ? 'translate-x-[22px]' : 'translate-x-0')}`}
                />
              </button>
              <span className={`text-xs font-black flex items-center gap-1.5 transition-all ${billingCycle === 'yearly' ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
                <span>{state.language === 'ar' ? 'فوترة سنوية' : 'Billing Yearly'}</span>
                <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  {state.language === 'ar' ? 'توفير 20%' : 'Save 20%'}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            
            {/* Starter tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starter Pack</span>
                <h3 className="text-lg font-black text-slate-900">{l.priceStarterName}</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">{l.priceStarterSub}</p>
                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    {billingCycle === 'yearly' ? '30,000' : '3,000'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {' '}{state.language === 'ar' ? 'دج' : 'DZD'} / {billingCycle === 'yearly' ? (state.language === 'ar' ? 'سنة' : 'year') : (state.language === 'ar' ? 'شهر' : 'month')}
                  </span>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'رفع ومطابقة القيود بالملفات الذكية' : 'Upload ledger and match layout accounts'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'تفعيل 14 يوماً من المساعد الذكي' : '14-Day assistant trial license'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'الطريقة المباشرة لتوزيع التكاليف' : 'Direct analytical allocation method only'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'استخراج التقارير وجداول الإدارة بصيغة Excel' : 'Export standard sheets & reports to Excel'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow mt-6 cursor-pointer hover:scale-[1.01]"
              >
                {state.language === 'ar' ? 'ابدأ كـ تجربة مجانية' : 'Commencer l\'essai gratuit'}
              </button>
            </div>

            {/* Pro tier (Highlighted/Best Choice) */}
            <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between transform scale-[1.02]">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-3.5 py-1.5 rounded-bl-xl uppercase tracking-widest">
                {state.language === 'ar' ? 'الأكثر طلباً' : 'Best Choice'}
              </div>
              
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-blue-650 tracking-wider block font-black text-blue-600 font-sans">Pro Plan</span>
                <h3 className="text-lg font-black text-slate-900">{l.priceProName}</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">{l.priceProSub}</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-blue-600">
                    {state.language === 'ar' ? 'طلب السعر (Sur Devis)' : 'Sur Devis (Quotations)'}
                  </span>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-blue-100 text-xs text-slate-700 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'توزيع التكاليف المشتركة بالطريقة التنازلية (Stepdown)' : 'Cascade step-down analytical overhead allocations'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'مساعد ذكي متكامل بدون حدود (AI Copilot)' : 'Unlimited AI assistant ledger chat & advice'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'حساب سعر التكلفة ومتوسط CUMP لجميع المنتجات' : 'Full cost price and automated CUMP value tracking'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'تتبع انحرافات أسعار الخامات مع رادار الهدر' : 'Inventory standard variance track & waste radar'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md mt-6 cursor-pointer hover:scale-[1.01]"
              >
                {state.language === 'ar' ? 'طلب السعر المخصص للمؤسسة' : 'Contacter les ventes'}
              </button>
            </div>

            {/* Enterprise tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-black font-sans">Enterprise Plan</span>
                <h3 className="text-lg font-black text-slate-900">{l.priceEnterpriseName}</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">{l.priceEnterpriseSub}</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {state.language === 'ar' ? 'طلب السعر (Sur Devis)' : 'Sur Devis (Enterprise)'}
                  </span>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'تكامل آلي ومباشر مع أنظمة SAP, Oracle, Sylob, Sage' : 'Native API links for Sage, SAP, Sylob & Oracle data'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'خوادم محاسبية مخصصة للمنشأة (On-Premises / Dedicated Cloud)' : 'On premises high-guaranteed or dedicated hosting'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'حساب فوري متقاطع ومعقد للتكاليف المتعددة للفروع' : 'Cross-border entity analytical consolidation'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{state.language === 'ar' ? 'اتفاقية مستوى الخدمة والإنتاجية العالية (SLA 99.99%)' : 'Premium SLA backing and system availability'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow mt-6 cursor-pointer hover:scale-[1.01]"
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
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-white shrink-0 shadow-sm shadow-slate-900/10">
                      <FyComptaLogo size={24} />
                    </div>
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
                          <div className={`absolute top-[13.5px] w-full right-1/2 h-0.5 ${onboardingStep >= sNum ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        )}
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-black pointer-events-none relative z-10 transition-all ${
                          isPassed ? 'bg-blue-600 border-blue-600 text-white' : (isActive ? 'bg-white border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-400')
                        }`}>
                          {isPassed ? "✓" : sNum}
                        </div>
                        <span className={`text-[9px] mt-1 font-sans ${isActive ? 'text-blue-600 font-black' : 'text-slate-400'}`}>{stepName}</span>
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
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Step 1: {l.step1Title}</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">{l.profileName}</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-450 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder={state.language === 'ar' ? 'أدخل اسمك الكريم' : 'Ex: Karim Benyahia'}
                          value={formProfile.fullName}
                          onChange={e => setFormProfile({ ...formProfile, fullName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none focus:border-blue-500"
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
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none focus:border-blue-500"
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
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none focus:border-blue-500"
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
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Your Company */}
                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Step 2: {l.step2Title}</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block text-right">
                        {state.language === 'ar' ? 'اسم المؤسسة / المصنع' : "Nom de l'Entreprise / Usine"} <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
                        <input 
                          type="text"
                          placeholder={state.language === 'ar' ? 'أدخل الاسم الرسمي للشركة... (مثال: سبيكة الجزائر للصلب)' : 'Nom de l\'entreprise (Ex: El-Amel Plastique)'}
                          value={formCompany.companyName}
                          onChange={e => {
                            setFormCompany({ ...formCompany, companyName: e.target.value });
                            if (e.target.value.trim() && formErrors.companyName) {
                              setFormErrors({ ...formErrors, companyName: undefined });
                            }
                          }}
                          className={`w-full bg-slate-50 border ${
                            formErrors.companyName ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : 'border-slate-200/80 focus:border-blue-500'
                          } rounded-xl py-2 px-9 text-xs font-semibold focus:outline-none text-right`}
                          style={{ direction: 'rtl' }}
                        />
                      </div>
                      {formErrors.companyName && (
                        <span className="text-[10px] text-red-500 font-bold block text-right mt-1">
                          {formErrors.companyName}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block text-right">
                        {state.language === 'ar' ? 'قطاع النشاط الرئيسي للمؤسسة' : 'Secteur d\'activité principal'} <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <select
                        value={formCompany.sector}
                        onChange={e => {
                          const val = e.target.value;
                          setFormCompany({ ...formCompany, sector: val });
                          if (val && formErrors.sector) {
                            setFormErrors({ ...formErrors, sector: undefined });
                          }
                          if (val !== 'أخرى / Autres' && formErrors.customSector) {
                            setFormErrors({ ...formErrors, customSector: undefined });
                          }
                        }}
                        className={`w-full bg-slate-50 border ${
                          formErrors.sector ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : 'border-slate-200/80 focus:border-blue-500'
                        } rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none text-right`}
                        style={{ direction: 'rtl' }}
                      >
                        <option value="">{state.language === 'ar' ? '-- يرجى اختيار قطاع النشاط --' : '-- Choisir le secteur d\'activité --'}</option>
                        <option value="الصناعات التحويلية والإنتاج">{state.language === 'ar' ? 'الصناعات التحويلية والإنتاج' : 'Industries manufacturières & Production'}</option>
                        <option value="الصناعات الغذائية والزراعية">{state.language === 'ar' ? 'الصناعات الغذائية والزراعية' : 'Industries agroalimentaires & Agriculture'}</option>
                        <option value="صناعة المعادن والصلب والحديد">{state.language === 'ar' ? 'صناعة المعادن والصلب والحديد' : 'Métallurgie, Acier & Fer'}</option>
                        <option value="صناعة النسيج والملابس والجلود">{state.language === 'ar' ? 'صناعة النسيج والملابس والجلود' : 'Textile, Habillement & Cuir'}</option>
                        <option value="الخدمات اللوجستية والتوزيع">{state.language === 'ar' ? 'الخدمات اللوجستية والتوزيع' : 'Services logistiques & Distribution'}</option>
                        <option value="صناعات التكنولوجيا والأجهزة الدقيقة">{state.language === 'ar' ? 'صناعات التكنولوجيا والأجهزة الدقيقة' : 'Technologies & Instruments de précision'}</option>
                        <option value="أخرى / Autres">أخرى / Autres</option>
                      </select>
                      {formErrors.sector && (
                        <span className="text-[10px] text-red-500 font-bold block text-right mt-1">
                          {formErrors.sector}
                        </span>
                      )}
                    </div>

                    {/* Conditional other input field (Reactive Behavior) */}
                    <AnimatePresence>
                      {formCompany.sector === 'أخرى / Autres' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="space-y-1 overflow-hidden"
                        >
                          <label className="text-xs font-bold text-blue-600 block text-right mt-2">
                            <span className="text-red-550 font-extrabold text-red-500">*</span> يرجى تحديد النشاط / Veuillez préciser l'activité
                          </label>
                          <input 
                            type="text"
                            placeholder="أدخل قطاع نشاط مؤسستك هنا... / Ex: Industrie Textile"
                            value={formCompany.customSector || ''}
                            onChange={e => {
                              setFormCompany({ ...formCompany, customSector: e.target.value });
                              if (e.target.value.trim() && formErrors.customSector) {
                                setFormErrors({ ...formErrors, customSector: undefined });
                              }
                            }}
                            className={`w-full bg-slate-50 border ${
                              formErrors.customSector ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : 'border-slate-200/80 focus:border-blue-500'
                            } rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none text-right`}
                            style={{ direction: 'rtl' }}
                          />
                          {formErrors.customSector && (
                            <span className="text-[10px] text-red-500 font-bold block text-right mt-1">
                              {formErrors.customSector}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block text-right">{l.companyEmployees}</label>
                      <select
                        value={formCompany.employees}
                        onChange={e => setFormCompany({ ...formCompany, employees: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none text-right"
                        style={{ direction: 'rtl' }}
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
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Step 3: {l.step3Title}</h4>
                    <h3 className="text-sm font-black text-slate-900">{l.trialHeader}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold px-4">
                      {l.trialText}
                    </p>
                  </div>
                )}

                {/* Step 4: Payment Confirmation */}
                {onboardingStep === 4 && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Step 4: {l.step4Title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {l.paymentText}
                    </p>

                    <div className="space-y-3">
                      <label className={`flex gap-3 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        paymentOption === 'bank' ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentOption === 'bank'} 
                          onChange={() => setPaymentOption('bank')} 
                          className="accent-blue-600"
                        />
                        <div className="flex-1 text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                          <span className="text-xs font-bold text-slate-800 block">{l.payBank}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{state.language === 'ar' ? 'دفع تقليدي عبر الحساب البريدي الجاري الجاري أو الخزينة العامة' : 'Banque d\'Algérie or CPA traditional bank wire.'}</span>
                        </div>
                      </label>

                      <label className={`flex gap-3 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        paymentOption === 'proforma' ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentOption === 'proforma'} 
                          onChange={() => setPaymentOption('proforma')} 
                          className="accent-blue-600"
                        />
                        <div className="flex-1 text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                          <span className="text-xs font-bold text-slate-800 block">{l.payDoc}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{state.language === 'ar' ? 'توليد فاتورة مبدئية مصادق عليها إلكترونياً للإمضاء' : 'Authorized downloadable Quotation pro forma document.'}</span>
                        </div>
                      </label>

                      <label className={`flex gap-3 items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        paymentOption === 'card' ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentOption === 'card'} 
                          onChange={() => setPaymentOption('card')} 
                          className="accent-blue-600"
                        />
                        <div className="flex-1 text-right" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                          <span className="text-xs font-bold text-slate-800 block">{l.payCard}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{state.language === 'ar' ? 'ربط مباشر مع البطاقة الذهبية لبريد الجزائر وبطاقات CIB البنكية' : 'Algeria Dahabia Card gateway integration.'}</span>
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
                      className="bg-slate-105 border border-slate-300 text-slate-705 font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      {state.language === 'ar' ? 'السابق' : 'Précédent'}
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
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
