import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  BarChart3,
  FileText,
  Printer,
  Mail,
  Sparkles,
  Bot,
  User,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  className?: string;
}

// Saudi Robot SVG Component with Shemagh
const SaudiRobotIcon: React.FC<{
  isAnimating?: boolean;
  className?: string;
}> = ({ isAnimating = false, className }) => (
  <svg
    viewBox="0 0 64 64"
    className={cn("w-full h-full", className)}
    style={{
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
    }}
  >
    {/* Shemagh (Headscarf) - Red & White Pattern */}
    <defs>
      <pattern
        id="shemagh-pattern"
        patternUnits="userSpaceOnUse"
        width="4"
        height="4"
      >
        <rect width="4" height="4" fill="#fff" />
        <rect width="2" height="2" fill="#c41e3a" />
        <rect x="2" y="2" width="2" height="2" fill="#c41e3a" />
      </pattern>
      <linearGradient id="robot-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2E3192" />
        <stop offset="100%" stopColor="#0e2841" />
      </linearGradient>
      <linearGradient id="robot-face" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#80d1e9" />
        <stop offset="100%" stopColor="#5cc4e0" />
      </linearGradient>
    </defs>

    {/* Shemagh Background */}
    <ellipse cx="32" cy="20" rx="20" ry="16" fill="url(#shemagh-pattern)" />
    <path
      d="M12 20 Q12 36 20 44 L32 48 L44 44 Q52 36 52 20"
      fill="url(#shemagh-pattern)"
      opacity="0.9"
    />

    {/* Agal (Black cord) */}
    <ellipse cx="32" cy="14" rx="16" ry="3" fill="#1a1a1a" />
    <ellipse cx="32" cy="14" rx="14" ry="2" fill="#333" />

    {/* Robot Face */}
    <rect
      x="18"
      y="18"
      width="28"
      height="24"
      rx="6"
      fill="url(#robot-body)"
      stroke="#80d1e9"
      strokeWidth="1"
    />

    {/* Face Screen */}
    <rect
      x="21"
      y="21"
      width="22"
      height="16"
      rx="4"
      fill="url(#robot-face)"
      opacity="0.9"
    />

    {/* Eyes */}
    <g className={isAnimating ? "animate-pulse" : ""}>
      <circle cx="27" cy="28" r="3" fill="#2E3192" />
      <circle cx="37" cy="28" r="3" fill="#2E3192" />
      <circle cx="28" cy="27" r="1" fill="#fff" />
      <circle cx="38" cy="27" r="1" fill="#fff" />
    </g>

    {/* Smile */}
    <path
      d="M27 33 Q32 36 37 33"
      fill="none"
      stroke="#2E3192"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Antenna */}
    <line x1="32" y1="10" x2="32" y2="6" stroke="#80d1e9" strokeWidth="2" />
    <circle
      cx="32"
      cy="5"
      r="2"
      fill="#80d1e9"
      className={isAnimating ? "animate-ping" : ""}
    />

    {/* Body */}
    <rect x="22" y="44" width="20" height="12" rx="4" fill="url(#robot-body)" />

    {/* Chest Light */}
    <circle
      cx="32"
      cy="50"
      r="3"
      fill="#80d1e9"
      className={isAnimating ? "animate-pulse" : ""}
    />

    {/* Arms (if waving) */}
    {isAnimating && (
      <>
        <path
          d="M18 48 L10 42"
          stroke="url(#robot-body)"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-bounce"
          style={{ animationDelay: "0.1s" }}
        />
        <circle cx="9" cy="41" r="3" fill="url(#robot-body)" />
      </>
    )}
    <path
      d="M46 48 L52 52"
      stroke="url(#robot-body)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="53" cy="53" r="3" fill="url(#robot-body)" />
  </svg>
);

// Demo responses for Abbas
const demoResponses: Record<string, string> = {
  default: `مرحباً! أنا عباس، كيف يمكنني مساعدتك اليوم؟

يمكنني مساعدتك في:
• تحليل بيانات الموظفين
• إنشاء التقارير
• طباعة المستندات
• إرسال الإيميلات
• تعديل وإضافة أي شيء في النظام

ما الذي تحتاجه؟`,

  تقرير: `بالتأكيد! يمكنني إنشاء تقارير متعددة لك:

📊 **التقارير المتاحة:**
1. تقرير الحضور الشهري
2. تقرير الرواتب
3. تقرير الإجازات
4. تقرير أداء الموظفين
5. تقرير الموارد البشرية الشامل

أي تقرير تريد أن أنشئه لك؟`,

  موظف: `لدينا حالياً **80 موظف** في النظام:

👥 **توزيع الموظفين:**
• الإدارة: 12 موظف
• الموارد البشرية: 8 موظفين
• المالية: 15 موظف
• تقنية المعلومات: 20 موظف
• العمليات: 25 موظف

هل تريد معلومات أكثر تفصيلاً؟`,

  حضور: `📅 **ملخص الحضور اليوم:**

✅ حاضر: 72 موظف (90%)
🏠 عن بعد: 5 موظفين (6.25%)
🏖️ إجازة: 2 موظفين (2.5%)
⚠️ متأخر: 1 موظف (1.25%)

**معدل الحضور هذا الأسبوع:** 94%

هل تريد تفاصيل أكثر أو تقرير مفصل؟`,

  إجازة: `🏖️ **ملخص الإجازات:**

• طلبات معلقة: 5
• موافق عليها هذا الشهر: 12
• مرفوضة: 2
• إجمالي أيام الإجازات: 45 يوم

**أكثر أنواع الإجازات:**
1. إجازة سنوية (60%)
2. إجازة مرضية (25%)
3. إجازة طوارئ (15%)

هل تريد الموافقة على طلب معين؟`,

  مساعدة: `أهلاً! أنا عباس، مساعدك الذكي 🤖

**يمكنني مساعدتك في:**

📊 **تحليل البيانات**
• عرض إحصائيات الموظفين
• تحليل معدلات الحضور
• مقارنة الأداء

📄 **التقارير**
• إنشاء تقارير مخصصة
• تصدير البيانات (PDF, Excel)
• إرسال التقارير بالإيميل

🖨️ **الطباعة**
• طباعة شهادات الراتب
• طباعة خطابات التعريف
• طباعة كشوف الحضور

✉️ **الإيميلات**
• إرسال إشعارات للموظفين
• إرسال التقارير للإدارة

اكتب ما تحتاجه وسأساعدك! 😊`,

  شكرا: `على الرحب والسعة! 😊

أنا سعيد أنني استطعت مساعدتك. إذا احتجت أي شيء آخر، أنا هنا دائماً!

**نصيحة:** يمكنك الضغط على زر عباس في أي وقت للحصول على المساعدة السريعة.

مع السلامة! 👋`,
};

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("تقرير") || lowerMessage.includes("report")) {
    return demoResponses["تقرير"];
  }
  if (lowerMessage.includes("موظف") || lowerMessage.includes("employee")) {
    return demoResponses["موظف"];
  }
  if (lowerMessage.includes("حضور") || lowerMessage.includes("attendance")) {
    return demoResponses["حضور"];
  }
  if (lowerMessage.includes("إجازة") || lowerMessage.includes("leave")) {
    return demoResponses["إجازة"];
  }
  if (lowerMessage.includes("مساعدة") || lowerMessage.includes("help")) {
    return demoResponses["مساعدة"];
  }
  if (lowerMessage.includes("شكرا") || lowerMessage.includes("thank")) {
    return demoResponses["شكرا"];
  }

  return demoResponses["default"];
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ className }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content: `السلام عليكم! 👋

مرحباً، أنا **عباس** الوكيل الذكي وأستطيع مساعدتك في:

• 📊 تحليل البيانات
• 📄 عمل التقارير
• 🖨️ طباعة المستندات
• ✉️ إرسال الإيميلات

بل هنالك شيء أفضل - أستطيع إضافة وتعديل أي شيء تريده في البرنامج!

أخبرني، **ماذا تريد؟**`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000),
    );

    const response = getResponse(inputValue);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const quickActions = [
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: "تقرير",
      action: "أريد تقرير",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "الموظفين",
      action: "معلومات الموظفين",
    },
    {
      icon: <Printer className="w-4 h-4" />,
      label: "طباعة",
      action: "طباعة مستند",
    },
    {
      icon: <Mail className="w-4 h-4" />,
      label: "إيميل",
      action: "إرسال إيميل",
    },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full",
          "flex items-center justify-center",
          "shadow-2xl transition-all duration-500",
          "bg-gradient-to-br from-[#2E3192] to-[#0e2841]",
          "hover:scale-110 hover:shadow-[0_0_40px_rgba(128,209,233,0.4)]",
          "before:absolute before:inset-0 before:rounded-full",
          "before:bg-gradient-to-br before:from-cyan-400/20 before:to-purple-500/20",
          "before:animate-pulse",
          isOpen && "scale-0 opacity-0",
          className,
        )}
      >
        <div className="w-12 h-12 relative">
          <SaudiRobotIcon isAnimating={isHovered} />
        </div>

        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />

        {/* Sparkle */}
        <Sparkles
          className={cn(
            "absolute -top-1 -right-1 w-5 h-5 text-yellow-400",
            "animate-bounce",
          )}
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 transition-all duration-300",
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
            "rounded-2xl overflow-hidden shadow-2xl",
            isGlass
              ? "bg-white/90 backdrop-blur-xl border border-[#2E3192]/20"
              : isDark
                ? "bg-gray-900 border border-gray-700"
                : "bg-white border border-gray-200",
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "h-16 px-4 flex items-center justify-between",
              "bg-gradient-to-r from-[#2E3192] to-[#0e2841]",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 p-1">
                <SaudiRobotIcon isAnimating={isTyping} />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  عباس
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </h3>
                <p className="text-xs text-white/70">
                  {isTyping ? "يكتب..." : "الوكيل الذكي"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto p-4 space-y-4",
                  "h-[calc(600px-16rem)]",
                )}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.type === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex-shrink-0",
                        message.type === "user"
                          ? "bg-[#2E3192] flex items-center justify-center"
                          : "bg-gradient-to-br from-cyan-400 to-[#2E3192] p-0.5",
                      )}
                    >
                      {message.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <SaudiRobotIcon />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3",
                        message.type === "user"
                          ? "bg-[#2E3192] text-white rounded-tr-md"
                          : isGlass
                            ? "bg-gray-100 text-[#2E3192] rounded-tl-md"
                            : isDark
                              ? "bg-gray-800 text-white rounded-tl-md"
                              : "bg-gray-100 text-gray-800 rounded-tl-md",
                      )}
                    >
                      <p
                        className="text-sm whitespace-pre-wrap"
                        dir="auto"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br />"),
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-[#2E3192] p-0.5">
                      <SaudiRobotIcon isAnimating />
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl rounded-tl-md px-4 py-3",
                        isGlass
                          ? "bg-gray-100"
                          : isDark
                            ? "bg-gray-800"
                            : "bg-gray-100",
                      )}
                    >
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div
                className={cn(
                  "px-4 py-2 border-t",
                  isGlass
                    ? "border-[#2E3192]/10"
                    : isDark
                      ? "border-gray-700"
                      : "border-gray-200",
                )}
              >
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(action.action);
                        handleSend();
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                        "whitespace-nowrap transition-all",
                        isGlass
                          ? "bg-[#2E3192]/10 text-[#2E3192] hover:bg-[#2E3192]/20"
                          : isDark
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div
                className={cn(
                  "p-4 border-t",
                  isGlass
                    ? "border-[#2E3192]/10"
                    : isDark
                      ? "border-gray-700"
                      : "border-gray-200",
                )}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="اكتب رسالتك..."
                    dir="auto"
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl text-sm",
                      "outline-none transition-all",
                      isGlass
                        ? "bg-gray-100 text-[#2E3192] placeholder-[#2E3192]/50 focus:ring-2 focus:ring-[#2E3192]/30"
                        : isDark
                          ? "bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/30"
                          : "bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#2E3192]/30",
                    )}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "transition-all",
                      inputValue.trim() && !isTyping
                        ? "bg-gradient-to-r from-[#2E3192] to-[#0e2841] text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed",
                    )}
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
