export interface Review {
  id: string;
  userName: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  description: string;
  coverImage: string;
  pages: number;
  publishedYear: string;
  link: string;
  isFeatured?: boolean;
  reviews?: Review[];
}

export const categories = [
  { id: "all", label: "همه کتاب‌ها", icon: "Library" },
  { id: "fiction", label: "داستانی", icon: "BookOpen" },
  { id: "history", label: "تاریخی", icon: "History" },
  { id: "science", label: "علمی", icon: "FlaskConical" },
  { id: "psychology", label: "روانشناسی", icon: "Brain" },
  { id: "philosophy", label: "فلسفه", icon: "Scroll" },
  { id: "biography", label: "زندگینامه", icon: "User" },
];

export const sidebarItems = [
  { id: "home", label: "خانه", icon: "Home" },
  { id: "browse", label: "مرور کتاب‌ها", icon: "Search" },
  { id: "favorites", label: "علاقه‌مندی‌ها", icon: "Heart" },
  { id: "reading", label: "در حال مطالعه", icon: "BookOpen" },
  { id: "finished", label: "تمام شده", icon: "CheckCircle" },
  { id: "admin", label: "مدیریت", icon: "ShieldCheck" },
  { id: "ai", label: "دستیار هوشمند", icon: "Sparkles" },
  { id: "profile", label: "پروفایل", icon: "User" },
  { id: "settings", label: "تنظیمات", icon: "Settings" },
];

export const books: Book[] = [
  {
    id: "1",
    title: "۱۹۸۴",
    author: "جورج اورول",
    category: "fiction",
    rating: 4.8,
    description: "رمانی پادآرمان‌شهری که در آن نظارت دولتی و دستکاری افکار عمومی به اوج خود رسیده است.",
    coverImage: "https://picsum.photos/seed/1984/400/600",
    pages: 328,
    publishedYear: "۱۹۴۹",
    link: "https://www.goodreads.com/book/show/40961427-1984",
    isFeatured: true,
    reviews: [
      { id: "r1", userName: "احمد", comment: "یک شاهکار بی نظیر که هر کسی باید بخواند.", rating: 5, date: "۱۴۰۲/۱۰/۱۲" },
      { id: "r2", userName: "سارا", comment: "کمی تلخ بود ولی واقعیت‌های جامعه را به خوبی نشان می‌داد.", rating: 4, date: "۱۴۰۲/۱۱/۰۵" }
    ]
  },
  {
    id: "2",
    title: "انسان در جستجوی معنا",
    author: "ویکتور فرانکل",
    category: "psychology",
    rating: 4.9,
    description: "خاطرات روان‌پزشک ویکتور فرانکل از تجربیاتش در اردوگاه‌های کار اجباری آلمان نازی.",
    coverImage: "https://picsum.photos/seed/meaning/400/600",
    pages: 200,
    publishedYear: "۱۹۴۶",
    link: "https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning",
    reviews: [
      { id: "r3", userName: "مریم", comment: "این کتاب دید من را به زندگی کاملاً تغییر داد.", rating: 5, date: "۱۴۰۲/۰۹/۲۰" }
    ]
  },
  {
    id: "3",
    title: "تاریخ بیهقی",
    author: "ابوالفضل بیهقی",
    category: "history",
    rating: 4.7,
    description: "یکی از مهم‌ترین آثار نثر فارسی و منبعی ارزشمند برای تاریخ غزنویان.",
    coverImage: "https://picsum.photos/seed/beyhaghi/400/600",
    pages: 800,
    publishedYear: "قرن ۵ هجری",
    link: "https://www.goodreads.com/book/show/6044732",
  },
  {
    id: "4",
    title: "دنیای سوفی",
    author: "یوستین گردر",
    category: "philosophy",
    rating: 4.6,
    description: "داستانی درباره تاریخ فلسفه که به زبان ساده برای نوجوانان و بزرگسالان نوشته شده است.",
    coverImage: "https://picsum.photos/seed/sophie/400/600",
    pages: 512,
    publishedYear: "۱۹۹۱",
    link: "https://www.goodreads.com/book/show/10959.Sophie_s_World",
  },
  {
    id: "5",
    title: "شازده کوچولو",
    author: "آنتوان دو سنت‌اگزوپری",
    category: "fiction",
    rating: 4.9,
    description: "داستانی فلسفی و خیال‌انگیز درباره دوستی، عشق و تنهایی.",
    coverImage: "https://picsum.photos/seed/prince/400/600",
    pages: 96,
    publishedYear: "۱۹۴۳",
    link: "https://www.goodreads.com/book/show/157993.The_Little_Prince",
  },
  {
    id: "6",
    title: "کوری",
    author: "ژوزه ساراماگو",
    category: "fiction",
    rating: 4.5,
    description: "رمانی درباره شهری که ساکنان آن به طور ناگهانی دچار نابینایی سفید می‌شوند.",
    coverImage: "https://picsum.photos/seed/blindness/400/600",
    pages: 352,
    publishedYear: "۱۹۹۵",
    link: "https://www.goodreads.com/book/show/2526.Blindness",
  },
  {
    id: "7",
    title: "سفر به انتهای شب",
    author: "لویی فردینان سلین",
    category: "fiction",
    rating: 4.4,
    description: "رمانی با لحنی تند و بدبینانه درباره تجربیات نویسنده در جنگ جهانی اول.",
    coverImage: "https://picsum.photos/seed/night/400/600",
    pages: 600,
    publishedYear: "۱۹۳۲",
    link: "https://www.goodreads.com/book/show/189567.Journey_to_the_End_of_the_Night",
  },
  {
    id: "8",
    title: "تاریخ هرودوت",
    author: "هرودوت",
    category: "history",
    rating: 4.3,
    description: "نخستین کتاب تاریخ جهان که به شرح جنگ‌های ایران و یونان می‌پردازد.",
    coverImage: "https://picsum.photos/seed/herodotus/400/600",
    pages: 700,
    publishedYear: "۴۴۰ پیش از میلاد",
    link: "https://www.goodreads.com/book/show/1362.The_Histories",
  },
  {
    id: "9",
    title: "ژن خودخواه",
    author: "ریچارد داکینز",
    category: "science",
    rating: 4.6,
    description: "کتابی درباره تکامل که از دیدگاه ژن‌ها به بررسی رفتار موجودات زنده می‌پردازد.",
    coverImage: "https://picsum.photos/seed/gene/400/600",
    pages: 360,
    publishedYear: "۱۹۷۶",
    link: "https://www.goodreads.com/book/show/61535.The_Selfish_Gene",
  },
  {
    id: "10",
    title: "چنین گفت زرتشت",
    author: "فریدریش نیچه",
    category: "philosophy",
    rating: 4.7,
    description: "اثری فلسفی و شاعرانه که به بیان مفاهیمی چون ابرانسان و بازگشت جاودانه می‌پردازد.",
    coverImage: "https://picsum.photos/seed/nietzsche/400/600",
    pages: 400,
    publishedYear: "۱۸۸۳",
    link: "https://www.goodreads.com/book/show/51893.Thus_Spoke_Zarathustra",
  },
  {
    id: "11",
    title: "استیو جابز",
    author: "والتر آیزاکسون",
    category: "biography",
    rating: 4.8,
    description: "زندگی‌نامه رسمی بنیان‌گذار شرکت اپل بر اساس مصاحبه‌های متعدد.",
    coverImage: "https://picsum.photos/seed/jobs/400/600",
    pages: 656,
    publishedYear: "۲۰۱۱",
    link: "https://www.goodreads.com/book/show/11084145-steve-jobs",
  },
  {
    id: "12",
    title: "تفکر، سریع و کند",
    author: "دانیل کانمن",
    category: "psychology",
    rating: 4.7,
    description: "بررسی دو سیستم فکری انسان و خطاهای شناختی که در تصمیم‌گیری‌ها رخ می‌دهد.",
    coverImage: "https://picsum.photos/seed/thinking/400/600",
    pages: 499,
    publishedYear: "۲۰۱۱",
    link: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
  },
  {
    id: "13",
    title: "فیزیک کوانتوم برای همه",
    author: "جان گریبین",
    category: "science",
    rating: 4.5,
    description: "توضیح مفاهیم پیچیده فیزیک کوانتوم به زبانی ساده و قابل فهم.",
    coverImage: "https://picsum.photos/seed/quantum/400/600",
    pages: 280,
    publishedYear: "۱۹۸۴",
    link: "https://www.goodreads.com/book/show/5113.In_Search_of_Schr_dinger_s_Cat",
  },
  {
    id: "14",
    title: "تاریخ تمدن",
    author: "ویل دورانت",
    category: "history",
    rating: 4.9,
    description: "مجموعه‌ای عظیم که به بررسی تاریخ و تمدن بشر از آغاز تا عصر مدرن می‌پردازد.",
    coverImage: "https://picsum.photos/seed/durant/400/600",
    pages: 10000,
    publishedYear: "۱۹۳۵-۱۹۷۵",
    link: "https://www.goodreads.com/book/show/110926.The_Story_of_Civilization",
  },
  {
    id: "15",
    title: "جمهور",
    author: "افلاطون",
    category: "philosophy",
    rating: 4.8,
    description: "یکی از تأثیرگذارترین آثار فلسفی جهان درباره عدالت و مدینه فاضله.",
    coverImage: "https://picsum.photos/seed/republic/400/600",
    pages: 450,
    publishedYear: "۳۷۵ پیش از میلاد",
    link: "https://www.goodreads.com/book/show/30289.The_Republic",
  },
  {
    id: "16",
    title: "صد سال تنهایی",
    author: "گابریل گارسیا مارکز",
    category: "fiction",
    rating: 4.9,
    description: "شاهکار رئالیسم جادویی که داستان هفت نسل از خانواده بوئندیا را روایت می‌کند.",
    coverImage: "https://picsum.photos/seed/marquez/400/600",
    pages: 417,
    publishedYear: "۱۹۶۷",
    link: "https://www.goodreads.com/book/show/320.One_Hundred_Years_of_Solitude",
  },
];

export const featuredBook = books.find((b) => b.isFeatured) || books[0];
