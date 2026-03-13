import React, { useState } from "react";
import { X, Star, BookOpen, Clock, Calendar, Heart, Share2, Download, CheckCircle2, MessageSquare, Send, User } from "lucide-react";
import { Book, Review } from "@/src/data/mockBooks";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onLogReading: (title: string) => void;
  isReading: boolean;
  isFinished: boolean;
  onToggleReading: (id: string) => void;
  onToggleFinished: (id: string) => void;
  onAddReview: (bookId: string, review: { comment: string; rating: number }) => void;
}

export default function BookModal({ 
  book, 
  isOpen, 
  onClose, 
  onLogReading,
  isReading,
  isFinished,
  onToggleReading,
  onToggleFinished,
  onAddReview
}: BookModalProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  if (!book) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    onAddReview(book.id, { comment, rating });
    setComment("");
    setRating(5);
    toast.success("نظر شما با موفقیت ثبت شد.");
  };

  const handleLogReading = () => {
    onLogReading(book.title);
    toast.success(`مطالعه کتاب "${book.title}" برای امروز ثبت شد.`);
  };

  const handleToggleReading = () => {
    onToggleReading(book.id);
    if (!isReading) {
      toast.success(`کتاب "${book.title}" به لیست در حال مطالعه اضافه شد.`);
    } else {
      toast.info(`کتاب "${book.title}" از لیست در حال مطالعه حذف شد.`);
    }
  };

  const handleToggleFinished = () => {
    onToggleFinished(book.id);
    if (!isFinished) {
      toast.success(`تبریک! کتاب "${book.title}" به لیست تمام شده‌ها اضافه شد.`);
    } else {
      toast.info(`کتاب "${book.title}" از لیست تمام شده‌ها حذف شد.`);
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-300",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
    )}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-4xl bg-card rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500",
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
      )}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-10 p-2 bg-background/50 backdrop-blur-md rounded-full hover:bg-background transition-colors text-foreground"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image */}
        <div className="md:w-2/5 relative bg-secondary/30 flex items-center justify-center p-8">
          <div className="relative group cursor-pointer" onClick={() => window.open(book.link, '_blank')}>
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full max-w-[280px] aspect-[2/3] object-cover rounded-xl shadow-2xl shadow-black/20 transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                <BookOpen size={24} />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-xl shadow-xl flex flex-col items-center">
              <span className="text-2xl font-bold">{book.rating}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className={cn("fill-accent text-accent", i >= Math.floor(book.rating) && "fill-white/20 text-white/20")} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto max-h-[80vh] md:max-h-none">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <BookOpen size={16} />
                <span>{book.category}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">{book.title}</h2>
              <p className="text-xl text-muted-foreground font-medium">نویسنده: {book.author}</p>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-y border-border">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium">تعداد صفحات</span>
                <div className="flex items-center gap-2 font-bold">
                  <Clock size={16} className="text-primary" />
                  <span>{book.pages} صفحه</span>
                </div>
              </div>
              <div className="w-px bg-border mx-2" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium">سال انتشار</span>
                <div className="flex items-center gap-2 font-bold">
                  <Calendar size={16} className="text-primary" />
                  <span>{book.publishedYear}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold">درباره کتاب</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {book.description}
              </p>
            </div>

            <div className="pt-6 flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => window.open(book.link, '_blank')}
                  className="flex-1 bg-accent text-white px-8 py-4 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  <BookOpen size={20} />
                  مشاهده و خرید کتاب
                </button>
                <button 
                  onClick={handleLogReading}
                  className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  ثبت مطالعه امروز
                </button>
              </div>
              
              <div className="flex gap-2 w-full">
                <button 
                  onClick={handleToggleReading}
                  className={cn(
                    "flex-1 md:flex-none px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    isReading ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Clock size={20} />
                  {isReading ? "در حال مطالعه" : "شروع مطالعه"}
                </button>
                <button 
                  onClick={handleToggleFinished}
                  className={cn(
                    "flex-1 md:flex-none px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    isFinished ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <CheckCircle2 size={20} />
                  {isFinished ? "تمام شده" : "پایان مطالعه"}
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-12 space-y-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={24} className="text-primary" />
                  <h3 className="text-xl font-bold">نظرات و دیدگاه‌ها</h3>
                </div>
                <span className="text-sm text-muted-foreground">{book.reviews?.length || 0} نظر</span>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-secondary/20 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">امتیاز شما:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          className={cn(
                            star <= rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="نظر خود را در مورد این کتاب بنویسید..."
                    className="w-full bg-background border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[100px]"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="absolute bottom-4 left-4 bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-6">
                {book.reviews && book.reviews.length > 0 ? (
                  book.reviews.map((review) => (
                    <div key={review.id} className="space-y-3 p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <User size={16} />
                          </div>
                          <span className="font-bold text-sm">{review.userName}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={cn(
                                i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/20"
                              )} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                      <div className="text-[10px] text-muted-foreground/60 text-left">
                        {review.date}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>هنوز نظری برای این کتاب ثبت نشده است.</p>
                    <p className="text-xs">اولین کسی باشید که نظر می‌دهد!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
