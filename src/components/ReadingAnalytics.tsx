import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, BookOpen, Clock, Target } from "lucide-react";

const weeklyData = [
  { day: "شنبه", pages: 12 },
  { day: "۱شنبه", pages: 45 },
  { day: "۲شنبه", pages: 30 },
  { day: "۳شنبه", pages: 65 },
  { day: "۴شنبه", pages: 20 },
  { day: "۵شنبه", pages: 55 },
  { day: "جمعه", pages: 40 },
];

const categoryData = [
  { name: "داستانی", value: 40, color: "#10b981" },
  { name: "تاریخی", value: 25, color: "#3b82f6" },
  { name: "علمی", value: 20, color: "#f59e0b" },
  { name: "سایر", value: 15, color: "#6366f1" },
];

export default function ReadingAnalytics() {
  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "کتاب‌های تمام شده", value: "۱۲", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "ساعت مطالعه", value: "۴۸", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "صفحات خوانده شده", value: "۱,۲۴۰", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "هدف ماهانه", value: "۸۵٪", icon: Target, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex flex-col items-center text-center space-y-2">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white/50 backdrop-blur-sm border border-white/20 p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">فعالیت هفتگی (صفحه)</h4>
            <div className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-lg font-bold">۷ روز اخیر</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="pages" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/50 backdrop-blur-sm border border-white/20 p-6 rounded-xl space-y-6">
          <h4 className="font-bold text-lg">توزیع موضوعی</h4>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-3 w-full">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black">{cat.value}٪</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
