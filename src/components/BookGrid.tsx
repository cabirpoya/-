import React from "react";
import { Star, BookOpen, Heart, ExternalLink } from "lucide-react";
import { Book } from "@/src/data/mockBooks";
import { cn } from "@/src/lib/utils";

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  isLoading?: boolean;
}

export default function BookGrid({ books, onBookClick, isLoading = false }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse">
            <div className="aspect-[2/3] bg-muted rounded-xl mb-4" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
          <BookOpen size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">کتابی یافت نشد</h3>
          <p className="text-muted-foreground">لطفاً عبارت دیگری را جستجو کنید یا دسته‌بندی را تغییر دهید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <div 
          key={book.id}
          onClick={() => onBookClick(book)}
          className="group bg-card rounded-lg p-4 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-md">
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur-md text-primary p-2 rounded-md shadow-sm hover:bg-primary hover:text-white transition-colors">
                <Heart size={16} />
              </div>
            </div>
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(book.link, '_blank');
                }}
                className="bg-white/90 backdrop-blur-md text-primary p-2 rounded-md shadow-sm hover:bg-primary hover:text-white transition-colors"
                title="مشاهده در گودریدز"
              >
                <ExternalLink size={16} />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-accent/90 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
              <Star size={12} className="fill-white" />
              {book.rating}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{book.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
            
            <div className="pt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                {book.category === 'fiction' ? 'داستانی' : 
                 book.category === 'history' ? 'تاریخی' : 
                 book.category === 'science' ? 'علمی' : 
                 book.category === 'psychology' ? 'روانشناسی' : 
                 book.category === 'philosophy' ? 'فلسفه' : 
                 book.category === 'biography' ? 'زندگینامه' : 'سایر'}
              </span>
              <div className="flex items-center gap-1 text-primary font-bold text-xs group-hover:translate-x-1 transition-transform">
                <span>جزئیات</span>
                <BookOpen size={14} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
