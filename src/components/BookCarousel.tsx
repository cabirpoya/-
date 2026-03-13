import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Star, ExternalLink } from "lucide-react";
import { Book } from "@/src/data/mockBooks";
import { cn } from "@/src/lib/utils";

interface BookCarouselProps {
  title: string;
  books: Book[];
  onBookClick: (book: Book) => void;
}

export default function BookCarousel({ title, books, onBookClick }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // In RTL, scrollLeft is negative or 0
      setCanScrollRight(scrollLeft < 0);
      setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "p-2 rounded-xl border border-border transition-all",
              canScrollRight ? "hover:bg-secondary text-foreground" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "p-2 rounded-xl border border-border transition-all",
              canScrollLeft ? "hover:bg-secondary text-foreground" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.map((book) => (
          <div 
            key={book.id}
            onClick={() => onBookClick(book)}
            className="shrink-0 w-40 md:w-48 group cursor-pointer snap-start"
          >
            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-border">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(book.link, '_blank');
                  }}
                  className="bg-black/60 backdrop-blur-md text-white p-1.5 rounded-md hover:bg-primary hover:text-white transition-colors"
                  title="مشاهده در گودریدز"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-accent px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <Star size={12} className="fill-accent" />
                {book.rating}
              </div>
            </div>
            <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
