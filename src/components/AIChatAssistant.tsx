import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "سلام! من دستیار هوشمند شما هستم. چطور می‌توانم در مورد کتاب‌ها یا هر موضوع دیگری به شما کمک کنم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat({ role: "user", text: userMessage }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are a helpful and knowledgeable AI assistant for a book library application called 'Kavoosh Pouya'. You can answer questions about books, authors, literature, and any other general topics the user asks about. Be polite, informative, and helpful. Answer in Persian (Farsi/Dari) as the primary language of the user is Persian.",
        }
      });

      const aiText = response.text || "متأسفانه نتوانستم پاسخی پیدا کنم.";
      setMessages(prev => [...prev, { role: "model", text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "متأسفانه مشکلی در برقراری ارتباط با هوش مصنوعی رخ داده است. لطفاً دوباره تلاش کنید." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "model", text: "گفتگو پاک شد. چطور می‌توانم کمک کنم؟" }]);
  };

  return (
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-xl overflow-hidden shadow-xl animate-fade-in-up">
      {/* Header */}
      <div className="p-6 border-b border-border bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold">دستیار هوشمند کاووش</h3>
            <p className="text-[10px] text-muted-foreground font-medium">پاسخگوی سوالات شما در مورد کتاب و غیره</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
          title="پاک کردن گفتگو"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
              msg.role === "user" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
            )}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-xl text-sm leading-relaxed shadow-sm",
              msg.role === "user" 
                ? "bg-secondary/50 rounded-tr-none" 
                : "bg-card border border-border rounded-tl-none"
            )}>
              <div className="markdown-body">
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 ml-auto animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-4 bg-card border border-border rounded-xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-xs font-medium">در حال تایپ...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-background">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="سوال خود را اینجا بپرسید..."
            className="w-full bg-secondary/50 border-none rounded-xl py-4 pr-6 pl-14 focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              input.trim() && !isLoading ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
            )}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
