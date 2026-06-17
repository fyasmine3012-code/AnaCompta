import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Sparkles, AlertTriangle, AlertCircle, Info, Check, CheckSquare, X, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationItem {
  id: string;
  category: 'critical' | 'warning' | 'info';
  timestamp: string;
  targetTab: string;
  unread: boolean;
  translations: {
    ar: {
      title: string;
      text: string;
      details: string;
      recommendations: string[];
    };
    fr: {
      title: string;
      text: string;
      details: string;
      recommendations: string[];
    };
    en: {
      title: string;
      text: string;
      details: string;
      recommendations: string[];
    };
  };
}

interface SmartNotificationsProps {
  onTabChange: (tabId: string) => void;
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({ onTabChange }) => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'alert-1',
      category: 'critical',
      timestamp: '10m',
      targetTab: 'production',
      unread: true,
      translations: {
        ar: {
          title: "تنبيه انحراف: تجاوز معدل الهدر في المواد الأولية",
          text: "تنبيه انحراف: تجاوز معدل الهدر في المواد الأولية (خشب الزان) النسبة المعيارية بـ 5.4% في ورشة التركيب.",
          details: "تم الكشف عن طفرة في استهلاك المواد المباشرة بورشة التركيب مقارنة بحجم الإنتاج الفعلي للفترة الحالية. يشير هذا الانحراف السالب إلى تزايد في كميات التلف أو عدم مطابقة تكنولوجية الاستغلال في خط الإنتاج.",
          recommendations: [
            "مراجعة نسبة رطوبة وجودة ألواح خشب الزان المسحوبة من المخزن.",
            "إعادة ضبط واختبار آلات القطع والتشكيل الدقيق والتأكد من مهارات عمال الورشة.",
            "تسجيل كميات الخشب التالف وتصنيفها محاسبياً لتقييم الفاقد الاستثنائي."
          ]
        },
        fr: {
          title: "Alerte d'écart : Gaspillage de matières premières",
          text: "Alerte d'écart : Le taux de perte en matière première (Bois de Hêtre) a dépassé la norme de 5.4% dans l'atelier d'assemblage.",
          details: "Une hausse anormale de la consommation de matières premières directes a été détectée dans l'atelier d'assemblage par rapport au volume de production réel de cette période. Cet écart négatif montre une augmentation du rebut.",
          recommendations: [
            "Vérifier le taux d'humidité et la qualité des planches de hêtre sorties du stock.",
            "Calibrer à nouveau les machines de découpe et de fraisage de précision.",
            "Enregistrer rigoureusement les déchets de bois pour évaluer la perte extraordinaire."
          ]
        },
        en: {
          title: "Variance Alert: Raw Material Waste Exceeded",
          text: "Variance Alert: The waste rate of raw materials (Beech Wood) exceeded the standard ratio by 5.4% in the assembly workshop.",
          details: "An abnormal spike in direct raw material consumption has been detected in the assembly workshop relative to the actual production volume. This negative variance indicates high wastage rates or machine calibration issues.",
          recommendations: [
            "Inspect moisture level and surface quality of the beech wood batches drawn from stock.",
            "Recalibrate precision cutting and milling machines immediately.",
            "Examine and log scrap wood volume separately to evaluate extraordinary losses."
          ]
        }
      }
    },
    {
      id: 'alert-2',
      category: 'warning',
      timestamp: '2h',
      targetTab: 'trci',
      unread: true,
      translations: {
        ar: {
          title: "عدم تطابق محاسبي في التوزيع الأولي",
          text: "عدم تطابق محاسبي: تم رصد خلل في توازن مجموع التوزيع الأولي مع الحساب 601، يرجى المراجعة.",
          details: "أظهرت مطابقة جداول توزيع الأعباء غير المباشرة وجود تباين غير مبرر بين إجمالي المبالغ الموزعة أولياً وقيمة المشتريات المستهلكة المسجلة بحساب المخطط الوطني للمحاسبة (PCF Account 601).",
          recommendations: [
            "مراجعة قيود اليومية الخاصة بالأعباء والخدمات الخارجية المسجلة بالصنف 6.",
            "التحقق من صحة مفاتيح التوزيع ومعايير تحميل مراكز التحليل المساعدة والأساسية.",
            "مقارنة قيم التوزيع الأولي مع رصيد ميزان المراجعة قبل الإقفال."
          ]
        },
        fr: {
          title: "Incohérence : Répartition primaire d'achats",
          text: "Incohérence : Un déséquilibre a été constaté entre le montant total de la répartition primaire et le compte 601.",
          details: "La réconciliation des tableaux de répartition des charges indirectes montre un écart inexpliqué entre les totaux répartis et le coût d'achat consommé inscrit dans le compte SCF 601.",
          recommendations: [
            "Revoir les écritures de journal des charges externes comptabilisées en classe 6.",
            "Vérifier la validité des clés de répartition primaire appliquées aux centres auxiliaires.",
            "Comparer les totaux de la répartition avec la balance de vérification d'essai."
          ]
        },
        en: {
          title: "Accounting Mismatch: Primary Distribution",
          text: "Accounting Mismatch: A balance discrepancy was flagged between the primary distribution sum and General Account 601.",
          details: "Reconciliation of indirect cost allocation sheets indicates a mismatch between aggregate allocated center expenses and the total consumed purchases logged in PCF Account 601.",
          recommendations: [
            "Audit Class 6 journal entries for outsourced services and materials.",
            "Ensure the primary allocation keys applied to auxiliary and main centers are correct.",
            "Cross-verify the primary allocation aggregate with the trial balance pre-closing ledger."
          ]
        }
      }
    },
    {
      id: 'alert-3',
      category: 'info',
      timestamp: '4h',
      targetTab: 'costPrice',
      unread: true,
      translations: {
        ar: {
          title: "إعادة حساب معدل C.M.U.P للمخرجات",
          text: "تحديث C.M.U.P: قام المساعد الذكي بإعادة احتساب السعر الوحدوي للمخرجات بنجاح بعد تعديل حجم الكمية المنتجة.",
          details: "بعد قيام المستخدم بتحديث وتعديل حجم الإنتاج الفعلي، قام النظام بإعادة تدوير المتوسط المرجح التراكمي (C.M.U.P) للمخرجات النهائية تلقائياً لضمان دقة رصيد المخزون النهائي وتكلفة الإنتاج المباع.",
          recommendations: [
            "الاطلاع على القيمة المحدثة للـ C.M.U.P في جدول سعر التكلفة والربحية.",
            "التحقق من تأثير التكلفة الوحدوية الجديدة على هامش المساهمة ومعدل المردودية.",
            "التأكد من مطابقة مخرجات الورشات لقيم الجرد الدفتري."
          ]
        },
        fr: {
          title: "Mise à jour du C.U.M.P des produits",
          text: "Mise à jour du C.U.M.P : Le système a recalculé avec succès le coût unitaire moyen pondéré suite au changement de volume.",
          details: "Suite à l'ajustement du volume réel produit, l'algorithme a automatiquement recalculé le C.U.M.P de sortie afin de maintenir l'exactitude du bilan des stocks et du coût de revient des produits vendus.",
          recommendations: [
            "Consulter le coût unitaire mis à jour dans le tableau de Coût de Revient.",
            "Analyser l'effet du nouveau C.U.M.P sur la marge brute et le seuil de rentabilité.",
            "Vérifier l'alignement des fiches de stock réelles avec l'inventaire théorique."
          ]
        },
        en: {
          title: "Standard C.M.U.P Updated for Outputs",
          text: "C.M.U.P Update: The intelligent system successfully recalculated the weighted average unit cost following the production volume adjustment.",
          details: "Now that production quantities have changed, the platform recalculated cumulative weighted average unit values automatically. This protects inventory evaluation integrity and cost of sales reports.",
          recommendations: [
            "Review the updated C.M.U.P rates in the Cost Price and Profitability sheet.",
            "Analyze the effect of the revised unit costs on gross margins and contribution ratios.",
            "Ensure manual warehouse logs match the computer-generated valuation ledger."
          ]
        }
      }
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Listen to clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
    setSelectedNotification(item);
  };

  const handleViewDetails = (item: NotificationItem) => {
    setIsOpen(false);
    setSelectedNotification(null);
    onTabChange(item.targetTab);
  };

  const isAr = state.language === 'ar';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button & Badge */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 bg-slate-950 hover:bg-slate-900 border ${
          isOpen ? 'border-indigo-500/50 text-indigo-400' : 'border-slate-800 text-slate-400 hover:text-indigo-400'
        } rounded-xl transition-all cursor-pointer flex items-center justify-center relative`}
        title={isAr ? 'الإشعارات والتنبيهات الذكية' : 'Smart Notifications'}
      >
        {unreadCount > 0 ? (
          <>
            <BellRing className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span 
              id="notification-badge"
              className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-slate-950 shadow shadow-rose-500/30"
            >
              {unreadCount}
            </span>
          </>
        ) : (
          <Bell className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Floating Notifications Dropdown Menu Panel */}
      {isOpen && (
        <div 
          id="notifications-panel"
          className={`absolute z-50 mt-3 w-80 md:w-96 bg-[#080d16] border border-slate-800/90 rounded-2xl shadow-2xl p-4 text-slate-200 overflow-hidden backdrop-blur-xl ${
            isAr ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
          }`}
          style={{ top: '100%' }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-black text-xs tracking-wider font-sans">
                {isAr ? 'التنبيهات والتحليلات الذكية' : 'Smart Business Intel'}
              </span>
            </div>
            {unreadCount > 0 && (
              <button 
                id="mark-all-read-btn"
                onClick={handleMarkAllRead}
                className="text-[10.5px] font-black text-indigo-400 hover:text-white transition-all bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded-lg flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                {isAr ? 'لا توجود تنبيهات حالياً' : 'No active alerts'}
              </div>
            ) : (
              notifications.map((item) => {
                const translation = item.translations[state.language as 'ar' | 'fr' | 'en'] || item.translations.ar;
                
                // Styling colors based on severity
                const borderAccent = 
                  item.category === 'critical' ? 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10 hover:bg-rose-950/20' :
                  item.category === 'warning' ? 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10 hover:bg-amber-950/20' :
                  'border-blue-500/30 hover:border-blue-500/60 bg-indigo-950/10 hover:bg-indigo-950/20';

                const iconColor =
                  item.category === 'critical' ? 'text-rose-400' :
                  item.category === 'warning' ? 'text-amber-400' :
                  'text-blue-400';

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative ${borderAccent} ${
                      item.unread ? 'ring-1 ring-indigo-500/10 font-bold' : 'opacity-70 font-normal'
                    }`}
                    onClick={() => handleNotificationClick(item)}
                  >
                    {/* Badge Indicator for state */}
                    {item.unread && (
                      <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow shadow-indigo-505" />
                    )}

                    <div className="flex gap-2 items-start justify-between">
                      {/* Meta/Time slug */}
                      <span className="text-[9.5px] text-slate-500 font-mono select-none">
                        {item.timestamp}
                      </span>
                      
                      {/* Title */}
                      <div className="flex gap-2 items-center text-slate-100">
                        <span className="text-xs font-black leading-tight text-right">
                          {translation.title}
                        </span>
                        {item.category === 'critical' ? (
                          <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                        ) : item.category === 'warning' ? (
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                        ) : (
                          <Info className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                        )}
                      </div>
                    </div>

                    {/* Brief snippet */}
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed text-right line-clamp-2">
                      {translation.text}
                    </p>

                    {/* Actions links footer */}
                    <div className="flex justify-start items-center gap-2 mt-2 pt-2 border-t border-slate-800/45 text-[10px] text-indigo-400 font-black">
                      <span className="hover:text-white transition-all flex items-center gap-0.5">
                        {isAr ? 'عرض التحليل والتوصيات' : 'Review Recommendations'}
                        {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Elegant Diagnostic recommendation drilldown detail dialog */}
      {selectedNotification && (() => {
        const trans = selectedNotification.translations[state.language as 'ar' | 'fr' | 'en'] || selectedNotification.translations.ar;
        const iconColor =
          selectedNotification.category === 'critical' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
          selectedNotification.category === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
          'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

        const categoryLabel = 
          selectedNotification.category === 'critical' ? (isAr ? 'حالة حرجة' : 'Critical') :
          selectedNotification.category === 'warning' ? (isAr ? 'تحذير محاسبي' : 'Warning') :
          (isAr ? 'إشعار تيسيري' : 'Information');

        return (
          <div 
            id="notification-detail-overlay"
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <div 
              id="notification-detail-box"
              className="bg-[#0b1329] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 text-right flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider mb-1 ${iconColor}`}>
                      {categoryLabel}
                    </span>
                    <h3 className="text-sm font-black text-slate-100">
                      {trans.title}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-xl border ${iconColor}`}>
                    {selectedNotification.category === 'critical' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : selectedNotification.category === 'warning' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Body content */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                <div>
                  <h4 className="text-xs font-black text-indigo-400 mb-1.5 uppercase tracking-wider">
                    {isAr ? 'التقرير التشخيصي للفترة الحالية:' : 'Diagnostic Summary:'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 border border-slate-800/40 rounded-xl">
                    {trans.details}
                  </p>
                </div>

                {/* Specific recommended operational guidelines */}
                {trans.recommendations && trans.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-indigo-400 mb-1.5 uppercase tracking-wider">
                      {isAr ? 'توصيات الذكاء الاصطناعي للمراجعة والمعالجة المالية:' : 'AI Corrective Recommendations:'}
                    </h4>
                    <div className="space-y-2">
                      {trans.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start justify-end bg-slate-955 p-3 rounded-lg border border-slate-800/10 text-xs">
                          <span className="text-slate-300 leading-relaxed text-right">{rec}</span>
                          <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-405 font-bold text-[10px] flex items-center justify-center shrink-0 border border-indigo-550 border-indigo-500/10">
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 text-xs font-black bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-all border border-slate-800 cursor-pointer"
                >
                  {isAr ? 'إغلاق النافذة' : 'Close window'}
                </button>
                <button
                  onClick={() => handleViewDetails(selectedNotification)}
                  className="px-5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-555 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAr ? 'الذهاب لجدول العمل' : 'Go to Worksheet'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
