import React, { useState, useMemo, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Upload, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  FileText, 
  Download,
  Moon,
  Sun,
  Bell,
  ChevronDown
} from "lucide-react";
import Header from "@/src/components/Header";
import FeaturedBook from "@/src/components/FeaturedBook";
import BookCarousel from "@/src/components/BookCarousel";
import CategoryFilter from "@/src/components/CategoryFilter";
import BookGrid from "@/src/components/BookGrid";
import BookModal from "@/src/components/BookModal";
import ReadingCalendar from "@/src/components/ReadingCalendar";
import ReadingAnalytics from "@/src/components/ReadingAnalytics";
import Achievements from "@/src/components/Achievements";
import DailyQuote from "@/src/components/DailyQuote";
import AIChatAssistant from "@/src/components/AIChatAssistant";
import { books as initialBooks, featuredBook, Book, categories } from "@/src/data/mockBooks";
import { cn } from "@/src/lib/utils";
import { generateBookMetadata, generateCoverImage } from "@/src/services/aiService";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function App() {
  // Core State
  const [allBooks, setAllBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSidebarItem, setActiveSidebarItem] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardView, setDashboardView] = useState<"day" | "week" | "month" | "year">("week");

  // Admin & AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    category: "fiction",
    rating: 4.5,
    description: "",
    coverImage: "https://picsum.photos/seed/newbook/400/600",
    pages: 200,
    publishedYear: "۲۰۲۶",
  });

  // Lists State
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["1", "5"]));
  const [readingList, setReadingList] = useState<Set<string>>(new Set(["2", "12"]));
  const [finishedList, setFinishedList] = useState<Set<string>>(new Set(["4", "16"]));

  // Reading Logs (Date -> Book Title)
  const [readingLogs, setReadingLogs] = useState<Record<string, string>>({
    "2026-03-01": "۱۹۸۴",
    "2026-02-28": "شازده کوچولو",
    "2026-02-25": "انسان در جستجوی معنا",
    "2026-03-05": "دنیای سوفی"
  });

  // Theme Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Profile Alert
  useEffect(() => {
    if (activeSidebarItem === "profile") {
      toast.success("به بخش پروفایل خوش آمدید!");
    }
  }, [activeSidebarItem]);

  // Simulate Initial Load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filtering Logic
  const filteredBooks = useMemo(() => {
    let baseBooks = allBooks;

    if (activeSidebarItem === "favorites") {
      baseBooks = allBooks.filter(b => favorites.has(b.id));
    } else if (activeSidebarItem === "reading") {
      baseBooks = allBooks.filter(b => readingList.has(b.id));
    } else if (activeSidebarItem === "finished") {
      baseBooks = allBooks.filter(b => finishedList.has(b.id));
    }

    return baseBooks.filter((book) => {
      const matchesSearch = 
        book.title.includes(searchQuery) || 
        book.author.includes(searchQuery) ||
        book.description.includes(searchQuery);
      
      const matchesCategory = 
        activeCategory === "all" || book.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allBooks, searchQuery, activeCategory, activeSidebarItem, favorites, readingList, finishedList]);

  const topRatedBooks = useMemo(() => {
    return [...allBooks]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [allBooks]);

  // Handlers
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const logReading = (bookTitle: string) => {
    const today = new Date().toISOString().split('T')[0];
    setReadingLogs(prev => ({
      ...prev,
      [today]: bookTitle
    }));
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ");
        }
        return text;
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }
    } catch (e) {
      console.error("Text extraction error", e);
    }
    return "";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    toast.info("در حال تحلیل فایل و تولید محتوا توسط هوش مصنوعی...");

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.length < 50) {
        toast.error("متن کافی برای تحلیل یافت نشد.");
        return;
      }

      const metadata = await generateBookMetadata(text);
      if (metadata) {
        const imageUrl = await generateCoverImage(metadata.visualDescription || metadata.title || "book cover");
        
        setNewBook(prev => ({
          ...prev,
          title: metadata.title || prev.title,
          author: metadata.author || prev.author,
          category: metadata.category || prev.category,
          description: metadata.description || prev.description,
          coverImage: imageUrl || prev.coverImage,
        }));
        toast.success("اطلاعات و جلد کتاب با موفقیت تولید شد!");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در پردازش فایل توسط هوش مصنوعی.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCoverAsPDF = () => {
    if (!newBook.coverImage) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("جلد کتاب تولید شده توسط کاووش پویا", 105, 20, { align: "center" });
    doc.addImage(newBook.coverImage, "PNG", 40, 40, 130, 180);
    doc.save(`${newBook.title || "book"}_cover.pdf`);
    toast.success("فایل PDF جلد آماده دانلود شد.");
  };

  const toggleReading = (id: string) => {
    setReadingList(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        // If adding to reading, remove from finished
        setFinishedList(f => {
          const nf = new Set(f);
          nf.delete(id);
          return nf;
        });
      }
      return next;
    });
  };

  const toggleFinished = (id: string) => {
    setFinishedList(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        // If adding to finished, remove from reading
        setReadingList(r => {
          const nr = new Set(r);
          nr.delete(id);
          return nr;
        });
      }
      return next;
    });
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) {
      toast.error("لطفاً نام کتاب و نویسنده را وارد کنید.");
      return;
    }

    const bookToAdd: Book = {
      ...newBook as Book,
      id: Math.random().toString(36).substr(2, 9),
    };

    setAllBooks(prev => [bookToAdd, ...prev]);
    toast.success(`کتاب "${bookToAdd.title}" با موفقیت اضافه شد.`);
    setNewBook({
      title: "",
      author: "",
      category: "fiction",
      rating: 4.5,
      description: "",
      coverImage: `https://picsum.photos/seed/${Math.random()}/400/600`,
      pages: 200,
      publishedYear: "۲۰۲۶",
    });
  };

  const handleDeleteBook = (id: string) => {
    setAllBooks(prev => prev.filter(b => b.id !== id));
    toast.info("کتاب حذف شد.");
  };

  const handleAddReview = (bookId: string, reviewData: { comment: string; rating: number }) => {
    const newReview = {
      id: Math.random().toString(36).substr(2, 9),
      userName: "کاربر مهمان",
      comment: reviewData.comment,
      rating: reviewData.rating,
      date: new Date().toLocaleDateString('fa-AF', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setAllBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          reviews: [newReview, ...(book.reviews || [])]
        };
      }
      return book;
    }));

    if (selectedBook?.id === bookId) {
      setSelectedBook(prev => prev ? {
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])]
      } : null);
    }
  };

  const renderContent = () => {
    if (activeSidebarItem === "ai") {
      return (
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">دستیار هوشمند</h3>
            <p className="text-muted-foreground text-sm">هر سوالی دارید بپرسید، من اینجا هستم تا کمک کنم</p>
          </div>
          <AIChatAssistant />
        </div>
      );
    }

    if (activeSidebarItem === "admin") {
      return (
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">مدیریت کتابخانه</h3>
            <p className="text-muted-foreground text-sm">افزودن و مدیریت کتاب‌های موجود در سیستم</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus size={20} className="text-primary" />
                    <h4 className="font-bold">افزودن کتاب جدید</h4>
                  </div>
                  <label className="cursor-pointer group">
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={isGenerating} />
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                      isGenerating ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    )}>
                      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      تولید هوشمند
                    </div>
                  </label>
                </div>

                <form onSubmit={handleAddBook} className="space-y-4">
                  <div className="relative aspect-[2/3] w-32 mx-auto rounded-xl overflow-hidden shadow-lg border border-border group">
                    <img src={newBook.coverImage} className="w-full h-full object-cover" alt="Preview" />
                    {newBook.coverImage?.startsWith('data:') && (
                      <button 
                        type="button"
                        onClick={downloadCoverAsPDF}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Download size={24} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">نام کتاب</label>
                    <input 
                      type="text" 
                      value={newBook.title}
                      onChange={e => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-secondary/50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="مثلاً: بوف کور"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">نویسنده</label>
                    <input 
                      type="text" 
                      value={newBook.author}
                      onChange={e => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full bg-secondary/50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="مثلاً: صادق هدایت"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">دسته‌بندی</label>
                      <select 
                        value={newBook.category}
                        onChange={e => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-secondary/50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">سال انتشار</label>
                      <input 
                        type="text" 
                        value={newBook.publishedYear}
                        onChange={e => setNewBook(prev => ({ ...prev, publishedYear: e.target.value }))}
                        className="w-full bg-secondary/50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">توضیحات کوتاه</label>
                    <textarea 
                      rows={3}
                      value={newBook.description}
                      onChange={e => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-secondary/50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    افزودن به لیست
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h4 className="font-bold">لیست کتاب‌های موجود</h4>
                <div className="text-xs text-muted-foreground">{allBooks.length} کتاب</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-secondary/30 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-bold">نام کتاب</th>
                      <th className="px-6 py-4 font-bold">نویسنده</th>
                      <th className="px-6 py-4 font-bold">دسته‌بندی</th>
                      <th className="px-6 py-4 font-bold text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allBooks.map(book => (
                      <tr key={book.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-bold">{book.title}</td>
                        <td className="px-6 py-4">{book.author}</td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary px-2 py-1 rounded text-[10px] font-bold">
                            {categories.find(c => c.id === book.category)?.label || book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeSidebarItem === "profile") {
      return (
        <div className="space-y-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter">داشبورد من</h2>
              <p className="text-muted-foreground font-medium">خلاصه فعالیت‌ها و دستاوردهای شما در کاووش پویا</p>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white/20 p-2 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col pr-2 pl-4">
                <span className="text-xs font-black">سطح طلایی</span>
                <span className="text-[10px] text-muted-foreground font-bold">۱۲۴۰ امتیاز</span>
              </div>
            </div>
          </div>

          <ReadingAnalytics />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Achievements />
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-lg">تقویم مطالعه</h4>
              <ReadingCalendar logs={readingLogs} />
            </div>
          </div>
        </div>
      );
    }

    if (activeSidebarItem === "settings") {
      return (
        <div className="animate-fade-in-up space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tight text-primary/80">تنظیمات داشبورد</h3>
              <p className="text-muted-foreground text-sm font-medium">شخصی‌سازی محیط مطالعه و مدیریت زمان</p>
            </div>
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-sm">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20">دانشجو</button>
              <button className="px-4 py-2 hover:bg-white/50 rounded-xl text-xs font-bold transition-colors">کلاس</button>
              <button className="px-4 py-2 hover:bg-white/50 rounded-xl text-xs font-bold transition-colors">استاد</button>
            </div>
          </div>

          {/* Main Glass Container */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-100/50 via-white/40 to-pink-100/50 backdrop-blur-2xl border border-white/40 rounded-xl p-8 md:p-12 shadow-2xl shadow-primary/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Sidebar Info (mimicking the image) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white/60 backdrop-blur-md rounded-xl p-8 border border-white/40 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-200/50">
                      ک
                    </div>
                    <div>
                      <h4 className="font-black text-lg">کاربر مهمان</h4>
                      <p className="text-xs text-muted-foreground font-bold">شناسه: ۱۴۰۴-۱۷۱۰</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/40">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-bold">حمل، ۱۴۰۵</span>
                        <span className="text-[10px] text-muted-foreground/50">March/April 2026</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronDown className="rotate-90" size={14} /></button>
                        <button className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronDown className="-rotate-90" size={14} /></button>
                      </div>
                    </div>
                    {/* Small Mini Calendar Visual */}
                    <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold">
                      {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => <div key={d} className="text-muted-foreground/50 py-1">{d}</div>)}
                      {Array.from({length: 31}).map((_, i) => (
                        <div key={i} className={cn(
                          "py-1.5 rounded-lg transition-colors",
                          i === 17 ? "bg-primary text-white shadow-md shadow-primary/30" : "hover:bg-white/80"
                        )}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-white/40 shadow-sm space-y-4">
                  <h5 className="font-black text-sm">پیام صبحگاهی</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    سلام کاربر عزیز! امروز ۵ برنامه مطالعه برای شما تنظیم شده است. موفق باشید!
                  </p>
                  <div className="flex justify-center pt-4">
                    <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                      <BookOpen className="text-primary/40" size={48} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Main Content ( mimiking the timetable grid but with settings) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between bg-white/40 backdrop-blur-md p-2 rounded-xl border border-white/20">
                  <div className="flex gap-2">
                    {(["day", "week", "month", "year"] as const).map((view) => (
                      <button 
                        key={view}
                        onClick={() => setDashboardView(view)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                          dashboardView === view 
                            ? "bg-white text-primary shadow-sm" 
                            : "hover:bg-white/60 text-muted-foreground"
                        )}
                      >
                        {view === "day" ? "روز" : view === "week" ? "هفته" : view === "month" ? "ماه" : "سال"}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col items-end px-4">
                    <h4 className="text-sm font-black">حمل، ۱۴۰۵</h4>
                    <span className="text-[10px] text-muted-foreground font-bold">March/April 2026</span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-xl p-8 border border-white/40 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-black text-lg">حالت تاریک (Dark Mode)</h4>
                      <p className="text-xs text-muted-foreground font-medium">تغییر تم برنامه برای مطالعه در شب</p>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={cn(
                        "w-16 h-8 rounded-full transition-all duration-500 relative p-1 shadow-inner",
                        isDarkMode ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 flex items-center justify-center",
                        isDarkMode ? "translate-x-0" : "translate-x-8"
                      )}>
                        {isDarkMode ? <Moon size={12} className="text-primary" /> : <Sun size={12} className="text-amber-500" />}
                      </div>
                    </button>
                  </div>

                  <div className="pt-8 border-t border-white/40">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-black text-lg">
                        {dashboardView === "day" ? "برنامه امروز" : 
                         dashboardView === "week" ? "برنامه هفته" : 
                         dashboardView === "month" ? "تقویم ماهانه" : "آمار سالانه"}
                      </h4>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">فعال</span>
                    </div>

                    {dashboardView === "month" ? (
                      <ReadingCalendar logs={readingLogs} />
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {dashboardView === "day" && (
                          <div className="space-y-4">
                            {[
                              { time: "۰۸:۰۰", task: "مطالعه کتاب‌های علمی", color: "bg-blue-100 text-blue-600" },
                              { time: "۱۰:۳۰", task: "مرور یادداشت‌ها", color: "bg-pink-100 text-pink-600" },
                              { time: "۱۴:۰۰", task: "تحقیق در مورد هوش مصنوعی", color: "bg-purple-100 text-purple-600" }
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/20">
                                <span className="text-xs font-black text-muted-foreground">{item.time}</span>
                                <div className={cn("flex-1 p-3 rounded-xl text-xs font-bold", item.color)}>
                                  {item.task}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {dashboardView === "week" && (
                          <div className="grid grid-cols-7 gap-2">
                            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, i) => (
                              <div key={i} className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground">{day}</span>
                                <div className={cn(
                                  "w-full h-24 rounded-xl border border-white/40 flex flex-col items-center justify-end p-1 gap-1",
                                  i % 2 === 0 ? "bg-blue-50/30" : "bg-pink-50/30"
                                )}>
                                  <div className="w-full bg-primary/40 rounded-md" style={{ height: `${20 + (i * 10)}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {dashboardView === "year" && (
                          <div className="grid grid-cols-4 gap-4">
                            {["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"].map((m, i) => (
                              <div key={i} className="p-4 rounded-xl bg-white/40 border border-white/20 text-center space-y-2">
                                <span className="text-[10px] font-bold text-muted-foreground">{m}</span>
                                <div className="text-xs font-black text-primary">{Math.floor(Math.random() * 10) + 2} کتاب</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-white/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Bell size={20} />
                      </div>
                      <h5 className="font-bold text-sm">اعلان‌های مطالعه</h5>
                      <p className="text-[10px] text-muted-foreground">یادآوری برای زمان‌های مطالعه تنظیم شده</p>
                    </div>
                    <div className="p-6 rounded-xl bg-pink-50/50 border border-pink-100 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                        <Sparkles size={20} />
                      </div>
                      <h5 className="font-bold text-sm">هوش مصنوعی</h5>
                      <p className="text-[10px] text-muted-foreground">تنظیمات تولید محتوا و تحلیل کتاب‌ها</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Content Area (Left side in RTL, but visually main) */}
        <div className="flex-1 space-y-12 order-2 xl:order-1">
          {activeSidebarItem === "home" && !searchQuery && activeCategory === "all" && (
            <FeaturedBook book={featuredBook} onBookClick={handleBookClick} />
          )}

          {activeSidebarItem === "home" && !searchQuery && activeCategory === "all" && (
            <BookCarousel title="برترین کتاب‌های هفته" books={topRatedBooks} onBookClick={handleBookClick} />
          )}

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">
                  {searchQuery ? `نتایج جستجو برای "${searchQuery}"` : 
                   activeSidebarItem === "favorites" ? "کتاب‌های مورد علاقه" :
                   activeSidebarItem === "reading" ? "در حال مطالعه" :
                   activeSidebarItem === "finished" ? "کتاب‌های تمام شده" :
                   "مرور کتابخانه‌ی من"}
                </h3>
                <p className="text-muted-foreground text-sm">{filteredBooks.length} کتاب در دسترس است</p>
              </div>
              <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            </div>

            <BookGrid books={filteredBooks} onBookClick={handleBookClick} isLoading={isLoading} />
          </div>
        </div>

        {/* Side Panel (Right side in RTL, order 1 on mobile) */}
        {activeSidebarItem === "home" && !searchQuery && activeCategory === "all" && (
          <div className="w-full xl:w-80 shrink-0 space-y-8 order-1 xl:order-2">
            <DailyQuote />
            
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h4 className="font-bold text-lg mb-4">تقویم مطالعه</h4>
              <ReadingCalendar logs={readingLogs} />
            </div>

            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold">آمار این هفته</h4>
                  <p className="text-xs text-muted-foreground">۳ کتاب در حال مطالعه</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">هدف هفتگی</span>
                  <span className="font-bold">۱۲۰ صفحه</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col",
      isDarkMode ? "dark" : ""
    )}>
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onMenuClick={() => setIsSidebarOpen(true)}
        bookCount={filteredBooks.length}
        activeItem={activeSidebarItem}
        setActiveItem={setActiveSidebarItem}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      <footer className="py-6 px-8 border-t border-border/50 text-center text-muted-foreground text-xs">
        <p>© ۲۰۲۶ کاووش پویا - طراحی شده برای عاشقان کتاب</p>
      </footer>

      <BookModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogReading={logReading}
        isReading={selectedBook ? readingList.has(selectedBook.id) : false}
        isFinished={selectedBook ? finishedList.has(selectedBook.id) : false}
        onToggleReading={toggleReading}
        onToggleFinished={toggleFinished}
        onAddReview={handleAddReview}
      />

      <Toaster position="bottom-left" richColors />
    </div>
  );
}
