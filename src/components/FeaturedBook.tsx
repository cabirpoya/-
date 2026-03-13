import React from "react";
import { Star, BookOpen, Clock, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { Book } from "@/src/data/mockBooks";
import { cn } from "@/src/lib/utils";

interface FeaturedBookProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export default function FeaturedBook({ book, onBookClick }: FeaturedBookProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 md:p-12 shadow-2xl shadow-primary/20">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row gap-8 md:items-center">
        {/* Book Cover */}
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="relative group cursor-pointer" onClick={() => onBookClick(book)}>
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-48 h-72 md:w-56 md:h-80 object-cover rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <BookOpen size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Star size={14} className="fill-accent text-accent" />
              <span>کتاب برگزیده هفته</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">{book.title}</h2>
            <p className="text-xl text-primary-foreground/80 font-medium">اثر {book.author}</p>
          </div>

          <p className="text-lg leading-relaxed text-primary-foreground/90 max-w-2xl line-clamp-3">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-accent" />
              <span>{book.pages} صفحه</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              <span>انتشار: {book.publishedYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} className="fill-accent text-accent" />
              <span>امتیاز {book.rating}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={() => onBookClick(book)}
              className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              مشاهده جزئیات
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={() => window.open(book.link, '_blank')}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              مشاهده در گودریدز
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
