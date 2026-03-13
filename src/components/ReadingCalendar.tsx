import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ReadingLog {
  [date: string]: string; // ISO date string -> Book Title
}

interface ReadingCalendarProps {
  logs: ReadingLog;
}

export default function ReadingCalendar({ logs }: ReadingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInShamsiMonth = (monthIndex: number, year: number) => {
    if (monthIndex < 6) return 31;
    if (monthIndex < 11) return 30;
    // Leap year logic for Hoot (simplified)
    const isLeap = (year % 4 === 3); 
    return isLeap ? 30 : 29;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesShamsi = [
    "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله",
    "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"
  ];

  const monthNamesMiladi = [
    "March/April", "April/May", "May/June", "June/July", "July/August", "August/September",
    "September/October", "October/November", "November/December", "December/January", "January/February", "February/March"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderDays = () => {
    const totalDays = getDaysInShamsiMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-full" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = new Date(year, month, d).toISOString().split('T')[0];
      const bookRead = logs[dateStr];
      const isToday = today.getTime() === new Date(year, month, d).getTime();

      days.push(
        <div 
          key={d} 
          className={cn(
            "h-12 w-full flex flex-col items-center justify-center rounded-xl relative transition-all group cursor-pointer",
            bookRead ? "bg-primary/10 text-primary" : "hover:bg-secondary",
            isToday && "border-2 border-primary"
          )}
          onClick={() => {
            if (bookRead) {
              alert(`در تاریخ ${dateStr} شما کتاب "${bookRead}" را مطالعه کردید.`);
            }
          }}
        >
          <div className="flex flex-col items-center">
            <span className={cn("text-sm font-bold", bookRead && "text-primary")}>{d}</span>
            <span className="text-[8px] opacity-40 font-medium">{(d + 20) % 31 || 31}</span>
          </div>
          {bookRead && (
            <CheckCircle2 size={10} className="absolute top-1 right-1 text-primary animate-pulse" />
          )}
          {bookRead && (
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
              {bookRead}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-primary" />
          <h4 className="font-bold">تقویم مطالعه (شمسی / میلادی)</h4>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center min-w-[140px]">
            <span className="text-sm font-bold">
              {monthNamesShamsi[month]} {year - 621}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {monthNamesMiladi[month]} {year}
            </span>
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["شنبه", "۱شنبه", "۲شنبه", "۳شنبه", "۴شنبه", "۵شنبه", "جمعه"].map(day => (
          <div key={day} className="text-[10px] font-bold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>روزهای مطالعه شده</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded border border-primary" />
          <span>امروز</span>
        </div>
      </div>
    </div>
  );
}
