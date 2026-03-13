import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  User, 
  Moon, 
  Sun, 
  Menu,
  ChevronDown,
  Library,
  Home,
  Heart,
  BookOpen,
  CheckCircle,
  X
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onMenuClick: () => void;
  bookCount: number;
  activeItem: string;
  setActiveItem: (id: string) => void;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  isDarkMode, 
  toggleDarkMode,
  onMenuClick,
  bookCount,
  activeItem,
  setActiveItem
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "خانه", icon: Home },
    { id: "favorites", label: "علاقه‌مندی‌ها", icon: Heart },
    { id: "reading", label: "در حال مطالعه", icon: BookOpen },
    { id: "finished", label: "تمام شده", icon: CheckCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground border-b-4 border-accent px-4 md:px-8 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveItem("home")}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
              <Library size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white hidden sm:block">کاووش پویا</h1>
          </div>

          {/* Actions (Mobile) */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setActiveItem("profile")}
              className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs"
            >
              ک
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                  isActive 
                    ? "bg-accent text-white shadow-sm" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon size={16} className={cn(isActive && "text-white")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64 relative group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-accent transition-colors" size={16} />
            <input
              type="text"
              placeholder="جستجوی کتاب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 focus:border-accent rounded-xl py-2 pr-10 pl-4 transition-all text-sm outline-none text-white placeholder:text-white/50"
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
              title={isDarkMode ? "حالت روشن" : "حالت تاریک"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="relative p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-2 left-2 w-2 h-2 bg-accent rounded-full border-2 border-primary" />
            </button>

            <div className="h-6 w-px bg-white/20 mx-1" />

            <button 
              onClick={() => setActiveItem("profile")}
              className="flex items-center gap-2 p-1 pr-2 hover:bg-white/10 rounded-xl transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">
                ک
              </div>
              <ChevronDown size={14} className="text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-4 animate-fade-in-up">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    isActive 
                      ? "bg-accent text-white" 
                      : "text-white/70 hover:bg-white/10"
                  )}
                >
                  <Icon size={18} className={cn(isActive && "text-white")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
