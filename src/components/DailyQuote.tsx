import React, { useMemo } from "react";
import { Quote, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface DailyQuoteProps {
  className?: string;
}

const quotes = [
  {
    fa: "کتاب، بزرگ‌ترین اختراع بشر است.",
    en: "A book is the greatest invention of mankind.",
    author: "Unknown"
  },
  {
    fa: "هر کتابی که می‌خوانی، زندگی جدیدی را آغاز می‌کنی.",
    en: "Every book you read, you start a new life.",
    author: "Unknown"
  },
  {
    fa: "کتابخانه‌ها مخازن افکار بزرگ هستند.",
    en: "Libraries are the reservoirs of great thoughts.",
    author: "Unknown"
  },
  {
    fa: "مطالعه برای ذهن، مانند ورزش برای بدن است.",
    en: "Reading is to the mind what exercise is to the body.",
    author: "Joseph Addison"
  },
  {
    fa: "یک اتاق بدون کتاب، مانند بدنی بدون روح است.",
    en: "A room without books is like a body without a soul.",
    author: "Cicero"
  },
  {
    fa: "کتاب‌ها هدیه‌ای هستند که می‌توانید بارها و بارها آن را باز کنید.",
    en: "Books are a uniquely portable magic.",
    author: "Stephen King"
  },
  {
    fa: "امروز یک خواننده، فردا یک رهبر.",
    en: "Today a reader, tomorrow a leader.",
    author: "Margaret Fuller"
  }
];

export default function DailyQuote({ className }: DailyQuoteProps) {
  const dailyQuote = useMemo(() => {
    const today = new Date();
    const index = (today.getFullYear() + today.getMonth() + today.getDate()) % quotes.length;
    return quotes[index];
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/30 border border-primary/10 rounded-xl p-8 ${className}`}
    >
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      
      <div className="relative flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 shadow-inner">
          <Quote size={32} />
        </div>
        
        <div className="space-y-4 text-center flex-1">
          <div className="flex items-center justify-center gap-2 text-primary/60 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>جمله انگیزشی امروز</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-relaxed text-foreground">
              {dailyQuote.fa}
            </h3>
            <p className="text-sm font-medium text-muted-foreground italic font-sans">
              "{dailyQuote.en}"
            </p>
          </div>
          
          {dailyQuote.author !== "Unknown" && (
            <p className="text-xs font-bold text-primary/80">— {dailyQuote.author}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
