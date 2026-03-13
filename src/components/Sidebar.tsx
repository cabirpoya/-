import React from "react";
import { 
  Home, 
  Search, 
  Heart, 
  BookOpen, 
  CheckCircle, 
  Settings, 
  Library, 
  Menu, 
  X,
  ShieldCheck,
  User
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { sidebarItems } from "@/src/data/mockBooks";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const iconMap: Record<string, any> = {
  Home,
  Search,
  Heart,
  BookOpen,
  CheckCircle,
  Settings,
  ShieldCheck,
  User,
};

export default function Sidebar({ activeItem, setActiveItem, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-0 right-0 h-full bg-background/80 backdrop-blur-xl border-l border-white/20 z-50 transition-transform duration-300 md:translate-x-0 w-64 md:bg-transparent md:border-none",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6 md:pr-8 md:pl-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/30">
              <Library size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white md:text-white drop-shadow-md">کاووش پویا</h1>
            <button 
              className="md:hidden mr-auto p-2 hover:bg-white/10 rounded-lg text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-hide">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-6 px-4">منوی اصلی</p>
            {sidebarItems.map((item) => {
              const Icon = iconMap[item.icon] || Home;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-white text-primary shadow-xl shadow-black/10 scale-[1.02]" 
                      : "hover:bg-white/10 text-white/80 hover:text-white"
                  )}
                >
                  <Icon size={20} className={cn(
                    "transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            })}

            <div className="pt-8 space-y-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4">منابع معتبر کتاب</p>
              <div className="space-y-1">
                <a href="https://fidibo.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  فیدیبو (Fidibo)
                </a>
                <a href="https://taaghche.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  طاقچه (Taaghche)
                </a>
                <a href="https://www.ketabrah.ir" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  کتابراه (Ketabrah)
                </a>
              </div>
            </div>
          </nav>

          {/* User Info / Footer */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <button 
              onClick={() => {
                setActiveItem("profile");
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/5 hover:bg-white/20 transition-all text-right"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary font-black shadow-lg">
                ک
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">کاربر مهمان</span>
                <span className="text-[10px] text-white/60 font-medium truncate">مشاهده داشبورد</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
