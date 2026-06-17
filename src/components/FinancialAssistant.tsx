import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { locales } from '../locales';
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCcw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export const FinancialAssistant: React.FC = () => {
  const { state, calculatedValues } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const t = locales[state.language];
  const isRtl = state.language === 'ar';

  // Autoscroll chat history
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Seed initial welcoming message based on language preferred
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = state.language === 'ar'
        ? "مرحباً بك! أنا مساعدك المالي الذكي لكلفة ومحاسبة FyCompta. لقد قمت بتحليل بيانات التكاليف والورشات وجاهز لمساعدتك في رصد الانحرافات، وتحليل الأرباح، واقتراح استراتيجيات خفض التكلفة. اسألني أي شيء!"
        : "Welcome! I am your FyCompta AI Financial Consultant. I have analyzed your structural matrix and workshops to provide strategic advice on profit margins, direct expense variances, and logistics optimization. How may I assist you today?";
      setMessages([{ sender: 'assistant', text: welcome }]);
    }
  }, [state.language]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim() || isLoading) return;

    // Append user message
    const updatedMessages = [...messages, { sender: 'user', text: messageText }];
    setMessages(updatedMessages);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    // 1. إدارة أو توليد الـ Session ID والاحتفاظ به في المتصفح
    let sessionId = localStorage.getItem('fycompta_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('fycompta_session_id', sessionId);
    }

    try {
      // Craft compact ERP data context to send to n8n
      const contextSummary = {
        language: state.language || 'ar',
        totalSales: calculatedValues?.corporateSummary?.totalSales || 0,
        totalCostPrice: calculatedValues?.corporateSummary?.totalCostPrice || 0,
        netCorporateProfit: calculatedValues?.corporateSummary?.netCorporateProfit || 0,
        workshopsCount: state.workshops?.length || 0,
        itemsCount: state.rawMaterials?.length || 0,
        productsCount: state.products?.length || 0,
        products: (state.products || []).map(p => {
          const results = calculatedValues?.netResults?.[p.id] || {};
          return {
            name: p.name || "",
            quantitySold: p.quantitySold || 0,
            sellingPrice: p.sellingPrice || 0,
            totalCostOfSales: results.costOfSales || 0,
            totalCostOfDistribution: results.distributionCost || 0,
            totalCostPrice: results.totalCostPrice || 0,
            totalRevenue: results.revenue || 0,
            netAnalyticMarge: results.analyticMarge || 0,
            standardUnitCost: p.standardUnitCost || 0,
            wastePercentage: p.wastePercentage || 0
          };
        }),
        workshops: (state.workshops || []).map(w => ({
          name: w.name || "",
          type: w.type || "",
          natureUO: w.natureUO || "",
          nombreUO: w.nombreUO || 0,
          secondarySum: calculatedValues?.trciTotals?.secondarySums?.[w.id] || 0,
          unitCostOfWorkUnit: calculatedValues?.trciTotals?.unitCosts?.[w.id] || 0
        }))
      };

      // 2. توجيه الطلب مباشرةً إلى الخادم المحلي المتصل بـ Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: (messages || []).slice(-10).map(m => ({
            role: m?.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m?.text || "" }]
          })),
          context: contextSummary
        })
      });

      let data: any = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.error("Failed to parse JSON response:", jsonErr);
        }
      }

      // 3. استقبال الرد الراجع من Gemini API وعرضه للمستخدم
      if (response.ok && data && data.text) {
        setMessages(prev => [...prev, { sender: 'assistant', text: data.text }]);
      } else {
        let errorMessage = "";
        if (response.status === 404) {
          errorMessage = state.language === 'ar'
            ? "عذراً! يبدو أن خادم الخلفية غير متاح حالياً أو أن واجهة برمجة التطبيقات (API/chat) غير معرّفة (خطأ 404). يرجى التحقق من تشغيل الخادم والمسارات المتوفرة."
            : "Sorry! The backend service appears to be unavailable, or the API endpoint was not found (404 Error). Please verify the server is running.";
        } else if (response.status === 504 || response.status === 502) {
          errorMessage = state.language === 'ar'
            ? "انتهت مهلة المساعد المحاسبي الذكي أثناء معالجة البيانات (خطأ في بوابة الخادم). يرجى المحاولة مرة أخرى لاحقاً."
            : "The financial assistant request timed out or received an invalid gateway response. Please try again later.";
        } else {
          errorMessage = data?.friendlyMessage || data?.error || (state.language === 'ar'
            ? `واجه خادم الذكاء الاصطناعي مشكلة أثناء معالجة الاستفسار (رمز الحالة: ${response.status}).`
            : `The AI server encountered an issue processing your query (Status code: ${response.status}).`);
        }
        throw new Error(errorMessage);
      }
    } catch (e: any) {
      console.error("AI assistant message fetch exception:", e);
      const errorFriendlyMessage = e.message || (state.language === 'ar'
        ? "عذراً، فشل الاتصال بالمساعد الذكي للأنظمة المحاسبية. يرجى التأكد من إدخال مفتاح Gemini API وتحديث الصفحة."
        : "Connection to the financial assistant failed. Please ensure your Gemini API key is configured.");
      setMessages(prev => [...prev, { sender: 'assistant', text: errorFriendlyMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = state.language === 'ar'
    ? [
        { label: "📉 حلل أرباحي وانحرافات المنتجات", query: "اعمل تحليل شامل للربحية الحالية وانحرافات التكاليف (Variance) بناءً على الأرقام الحالية." },
        { label: "🪵 ما هي ثغرات التكلفة في الورشات؟", query: "ما هي ورشات الإنتاج الأكثر تكلفة وغير الفعالة؟ وكيف تؤثر على أسعار البيع؟" },
        { label: "💡 كيف أخفض مصاريف الشحن واللوجستيات؟", query: "اقترح خطة عملية مبنية على مصاريف الشحن المسجلة للمواد الأولية لتقليص الأثر على هامش الربح." }
      ]
    : [
        { label: "📉 Analyze variances and product yields", query: "Provide a detailed audit of my current product margins and cost price variances." },
        { label: "🪵 Workshop cost leaks & bottlenecks", query: "Which production workshops have the highest cost impact? How can I optimize them?" },
        { label: "💡 Freight & logistics reduction guide", query: "Suggest practical recommendations to minimize direct raw material transport costs." }
      ];

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Sparkle Toggle Hub */}
      <div className="fixed bottom-6 z-50 shadow-2xl transition-all hover:scale-105 active:scale-95" style={{ [isRtl ? 'left' : 'right']: '24px' }}>
        <button
          onClick={toggleOpen}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white cursor-pointer relative group shadow-lg shadow-indigo-600/30"
        >
          {isOpen ? (
            <X className="w-6 h-6 animate-pulse" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-black items-center justify-center text-slate-950">AI</span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Slide-out Premium Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: isRtl ? -50 : 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: isRtl ? -50 : 50 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            className={`fixed bottom-24 z-50 w-[92vw] sm:w-[420px] h-[75vh] max-h-[640px] bg-[#090d16] border border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between ${
              isRtl ? 'left-6' : 'right-6'
            }`}
          >
            {/* Header Title with Sparkling Core */}
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-white shadow shadow-indigo-500/20">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-1">
                    <span>{state.language === 'ar' ? 'المستشار المحاسبي الذكي' : 'AI Accountancy Consultant'}</span>
                  </h3>
                  <span className="text-[10px] text-teal-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    <span>FyCompta Analysis Live</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border border-slate-800/80 hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message streams scroll area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20 scrollbar-none">
              {(Array.isArray(messages) ? messages : []).map((m, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    m.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
                  }`}
                  style={{ [m.sender === 'user' ? 'marginLeft' : 'marginRight']: 'auto' }}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-6.5 h-6.5 shrink-0 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">
                      AI
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl text-[11.5px] leading-relaxed border ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white border-transparent rounded-tr-none' 
                      : 'bg-[#121826] text-slate-200 border-slate-800 rounded-tl-none font-sans whitespace-pre-line'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {/* Animated typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5 max-w-[85%]">
                  <div className="w-6.5 h-6.5 shrink-0 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">
                    AI
                  </div>
                  <div className="p-3 bg-[#121826] text-slate-500 border border-slate-800 rounded-2xl rounded-tl-none text-[11px] flex items-center gap-1.5">
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>{state.language === 'ar' ? 'جاري تحليل الأرقام والخطط...' : 'Analyzing accounts & balances...'}</span>
                  </div>
                </div>
              )}
              
              <div ref={chatBottomRef} />
            </div>

            {/* Quick interactive starter options */}
            {messages.length < 3 && !isLoading && (
              <div className="p-3 bg-slate-950/40 border-t border-slate-900 space-y-2.5">
                <span className="text-[9.5px] text-slate-500 font-bold block">{state.language === 'ar' ? 'أسئلة مقترحة سريعة:' : 'Quick analytical starting prompts:'}</span>
                <div className="flex flex-col gap-1.5">
                  {(Array.isArray(samplePrompts) ? samplePrompts : []).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(p.query)}
                      className="text-right p-2 text-[10px] bg-slate-900 hover:bg-slate-950 text-slate-300 font-semibold border border-slate-800 rounded-xl transition-all cursor-pointer truncate hover:text-white"
                      title={p.label}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom text Input and send panel */}
            <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder={state.language === 'ar' ? "اسألني عن الأرباح، الورشات، التكلفة الطارئة..." : "Ask me about margins, indirect TRCI absorption, freight..."}
                className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                className="w-9 h-9 shrink-0 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-40"
                disabled={isLoading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};