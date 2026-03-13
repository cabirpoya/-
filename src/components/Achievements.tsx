import React from "react";
import { Trophy, Star, Flame, Zap, Award, Book } from "lucide-react";
import { cn } from "@/src/lib/utils";

const achievements = [
  { id: 1, title: "کرم کتاب", description: "مطالعه ۱۰ کتاب اول", icon: Book, color: "text-blue-500", bg: "bg-blue-500/10", progress: 100, isUnlocked: true },
  { id: 2, title: "قهرمان هفته", description: "۷ روز مطالعه متوالی", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", progress: 85, isUnlocked: false },
  { id: 3, title: "سریع و خشن", description: "خواندن ۵۰ صفحه در یک ساعت", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10", progress: 100, isUnlocked: true },
  { id: 4, title: "منتقد برتر", description: "ثبت ۵ نظر برای کتاب‌ها", icon: Star, color: "text-purple-500", bg: "bg-purple-500/10", progress: 40, isUnlocked: false },
  { id: 5, title: "کتابخوان حرفه‌ای", description: "تمام کردن ۱۰۰ کتاب", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", progress: 12, isUnlocked: false },
  { id: 6, title: "پژوهشگر", description: "مطالعه در ۳ دسته‌بندی مختلف", icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10", progress: 100, isUnlocked: true },
];

export default function Achievements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg">دستاوردها و نشان‌ها</h4>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <span>۳ از ۶ باز شده</span>
          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={cn(
              "relative overflow-hidden p-5 rounded-xl border transition-all duration-300 group",
              achievement.isUnlocked 
                ? "bg-white/50 backdrop-blur-sm border-white/20 shadow-lg shadow-black/5" 
                : "bg-secondary/20 border-border/50 grayscale opacity-60"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-inner",
                achievement.bg,
                achievement.color
              )}>
                <achievement.icon size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <h5 className="font-bold text-sm">{achievement.title}</h5>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">{achievement.description}</p>
                
                {!achievement.isUnlocked && (
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-muted-foreground">
                      <span>پیشرفت</span>
                      <span>{achievement.progress}٪</span>
                    </div>
                    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${achievement.progress}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {achievement.isUnlocked && (
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary rotate-12 group-hover:rotate-0 transition-transform">
                <Award size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
