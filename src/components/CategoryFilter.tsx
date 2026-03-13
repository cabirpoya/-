import React from "react";
import { 
  Library, 
  BookOpen, 
  History, 
  FlaskConical, 
  Brain, 
  Scroll, 
  User 
} from "lucide-react";
import { categories } from "@/src/data/mockBooks";
import { cn } from "@/src/lib/utils";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

const iconMap: Record<string, any> = {
  Library,
  BookOpen,
  History,
  FlaskConical,
  Brain,
  Scroll,
  User,
};

export default function CategoryFilter({ activeCategory, setActiveCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Library;
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 border",
              isActive 
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
            )}
          >
            <Icon size={18} />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
