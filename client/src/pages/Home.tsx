/**
 * Design Philosophy: ヒューマンビジネス × 温かみのある信頼感
 * - Cream (#faf8f4) base, Terracotta (#c45e3a) primary, Forest Green (#2d5a3d) secondary
 * - Playfair Display + Noto Serif JP (headings) + Noto Sans JP (body)
 * - Asymmetric zigzag layout, story-driven narrative
 * - Interactive charts via Recharts, scroll-triggered animations
 */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { ChevronDown, TrendingUp, Users, Target, BarChart2, CheckCircle, ArrowRight, Phone, Mail, Star, Menu, X } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const snsUserData = [
  { year: "2019", LINE: 8200, Instagram: 3300, Facebook: 2600, X: 4500 },
  { year: "2020", LINE: 8600, Instagram: 3800, Facebook: 2700, X: 4500 },
  { year: "2021", LINE: 8900, Instagram: 4200, Facebook: 2800, X: 4500 },
  { year: "2022", LINE: 9200, Instagram: 4800, Facebook: 2900, X: 4500 },
  { year: "2023", LINE: 9500, Instagram: 5400, Facebook: 3000, X: 6700 },
  { year: "2024", LINE: 9700, Instagram: 6600, Facebook: 3100, X: 7200 },
];

const adCostComparisonData = [
  { name: "テレビCM\n(30秒)", cost: 300, reach: 60 },
  { name: "新聞広告\n(全5段)", cost: 200, reach: 30 },
  { name: "折込チラシ", cost: 50, reach: 20 },
  { name: "SNS広告", cost: 10, reach: 80 },
];

const roiData = [
  { month: "1ヶ月目", before: 100, after: 120 },
  { month: "2ヶ月目", before: 100, after: 145 },
  { month: "3ヶ月目", before: 100, after: 165 },
  { month: "4ヶ月目", before: 100, after: 190 },
  { month: "5ヶ月目", before: 100, after: 220 },
  { month: "6ヶ月目", before: 100, after: 260 },
];

const platformShareData = [
  { name: "Instagram", value: 38, color: "#c45e3a" },
  { name: "Facebook", value: 22, color: "#2d5a3d" },
  { name: "LINE", value: 25, color: "#d4a843" },
  { name: "X (Twitter)", value: 15, color: "#8b7355" },
];

const caseStudyRestaurantData = [
  { month: "導入前", visitors: 100, inquiries: 8 },
  { month: "1ヶ月後", visitors: 118, inquiries: 12 },
  { month: "2ヶ月後", visitors: 135, inquiries: 17 },
  { month: "3ヶ月後", visitors: 150, inquiries: 22 },
];

const caseStudySaasData = [
  { month: "導入前", cpa: 100, leads: 20 },
  { month: "1ヶ月後", cpa: 80, leads: 28 },
  { month: "2ヶ月後", cpa: 65, leads: 38 },
  { month: "3ヶ月後", cpa: 50, leads: 52 },
];

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e8e0d5] rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-[#2a2520] mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value.toLocaleString()}{entry.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Counter Hook ──────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Intersection Observer Hook ────────────────────────────────────────────────

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ value, unit, label, started }: { value: number; unit: string; label: string; started: boolean }) {
  const count = useCountUp(value, 2000, started);
  return (
    <div className="text-center p-6">
      <div className="stat-number text-5xl md:text-6xl text-[#c45e3a]">
        {count.toLocaleString()}<span className="text-3xl md:text-4xl">{unit}</span>
      </div>
      <p className="mt-2 text-[#5a4e42] font-medium text-sm">{label}</p>
    </div>
  );
}

// ── Tab Component ─────────────────────────────────────────────────────────────

function CaseStudyTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const cases = [
    {
      id: 0,
      title: "地域密着型 飲食店",
      subtitle: "Instagram広告で来店者数を150%に",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663398614048/d5xtg8vnZLnaH4bo9KDRzi/case-study-restaurant-LyRjhxTSk6sEvqT8RNfD4C.webp",
      challenge: "地域の新規顧客獲得に苦戦。チラシ配布のみでは費用対効果が低く、若い世代へのリーチが困難でした。",
      solution: "Instagramを活用した来店促進キャンペーンを実施。料理写真の最適化とターゲティング設定により、半径3km以内の潜在顧客へ集中的にアプローチしました。",
      results: [
        { label: "来店者数", value: "+50%", detail: "前月比150%" },
        { label: "フォロワー数", value: "+800人", detail: "3ヶ月で" },
        { label: "広告費ROI", value: "320%", detail: "投資対効果" },
      ],
      chartData: caseStudyRestaurantData,
      chartKey: "visitors",
      chartName: "来店者数指数",
    },
    {
      id: 1,
      title: "BtoB SaaS企業",
      subtitle: "Facebook広告でリード獲得単価を50%削減",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663398614048/d5xtg8vnZLnaH4bo9KDRzi/case-study-saas-2U9MV4Ly3cGiKdTRxCCL6T.webp",
      challenge: "リード獲得単価が高騰し、マーケティング予算を圧迫。ターゲット企業の意思決定者へのリーチが課題でした。",
      solution: "Facebook広告の詳細ターゲティングを活用し、業種・役職・会社規模で絞り込み。ホワイトペーパーのダウンロードを入口としたリードナーチャリングを設計しました。",
      results: [
        { label: "リード獲得単価", value: "-50%", detail: "大幅削減" },
        { label: "月間リード数", value: "+160%", detail: "3ヶ月後" },
        { label: "商談化率", value: "+35%", detail: "前期比" },
      ],
      chartData: caseStudySaasData,
      chartKey: "leads",
      chartName: "月間リード数",
    },
  ];

  const active = cases[activeTab];

  return (
    <div>
      <div className="flex gap-2 mb-8">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === c.id
                ? "bg-[#c45e3a] text-white shadow-md"
                : "bg-[#f0ece4] text-[#5a4e42] hover:bg-[#e8ddd0]"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
            <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
          </div>
          <h4 className="font-serif-jp text-xl font-bold text-[#2a2520] mb-3">{active.subtitle}</h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-[#c45e3a] uppercase tracking-wider mb-1">課題</p>
              <p className="text-[#5a4e42] text-sm leading-relaxed">{active.challenge}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#2d5a3d] uppercase tracking-wider mb-1">施策</p>
              <p className="text-[#5a4e42] text-sm leading-relaxed">{active.solution}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {active.results.map((r, i) => (
              <div key={i} className="bg-[#faf8f4] rounded-xl p-3 text-center border border-[#e8e0d5]">
                <div className="stat-number text-2xl text-[#c45e3a]">{r.value}</div>
                <div className="text-xs text-[#8b7355] mt-0.5">{r.detail}</div>
                <div className="text-xs font-semibold text-[#2a2520] mt-1">{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d5]">
          <h5 className="font-semibold text-[#2a2520] mb-4 text-sm">
            {activeTab === 0 ? "来店者数の推移（指数）" : "月間リード数・CPA推移（指数）"}
          </h5>
          <ResponsiveContainer width="100%" height={280}>
            {activeTab === 0 ? (
              <BarChart data={active.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b7355" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8b7355" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visitors" name="来店者数指数" fill="#c45e3a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inquiries" name="問い合わせ数" fill="#d4a843" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={active.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b7355" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8b7355" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="leads" name="月間リード数" stroke="#c45e3a" strokeWidth={3} dot={{ fill: "#c45e3a", r: 5 }} />
                <Line type="monotone" dataKey="cpa" name="CPA指数" stroke="#2d5a3d" strokeWidth={3} dot={{ fill: "#2d5a3d", r: 5 }} strokeDasharray="5 5" />
              </LineChart>
            )}
          </ResponsiveContainer>
          <p className="text-xs text-[#8b7355] mt-3 text-center">※ 導入前を100とした指数表示</p>
        </div>
      </div>
    </div>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({ name, price, adBudget, platforms, features, highlighted }: {
  name: string; price: string; adBudget: string; platforms: string; features: string[]; highlighted?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl p-6 border transition-all duration-300 card-hover ${
      highlighted
        ? "bg-[#c45e3a] text-white border-[#c45e3a] shadow-xl scale-105"
        : "bg-white text-[#2a2520] border-[#e8e0d5]"
    }`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4a843] text-white text-xs font-bold px-4 py-1 rounded-full">
          おすすめ
        </div>
      )}
      <h3 className={`font-serif-jp text-xl font-bold mb-1 ${highlighted ? "text-white" : "text-[#2a2520]"}`}>{name}</h3>
      <div className="flex items-baseline gap-1 my-4">
        <span className="stat-number text-4xl">{price}</span>
        <span className={`text-sm ${highlighted ? "text-white/80" : "text-[#8b7355]"}`}>万円/月</span>
      </div>
      <div className={`text-sm mb-4 pb-4 border-b ${highlighted ? "border-white/20 text-white/80" : "border-[#e8e0d5] text-[#5a4e42]"}`}>
        <p>広告費: <strong>{adBudget}</strong></p>
        <p>対応媒体: <strong>{platforms}</strong></p>
      </div>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${highlighted ? "text-white/90" : "text-[#5a4e42]"}`}>
            <CheckCircle size={15} className={`mt-0.5 flex-shrink-0 ${highlighted ? "text-white" : "text-[#2d5a3d]"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
        highlighted
          ? "bg-white text-[#c45e3a] hover:bg-[#faf8f4]"
          : "bg-[#faf8f4] text-[#c45e3a] border border-[#c45e3a] hover:bg-[#c45e3a] hover:text-white"
      }`}>
        このプランで相談する
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeChart, setActiveChart] = useState<"users" | "cost" | "roi" | "platform">("users");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const statsRef = useInView(0.3);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };



  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#2a2520]">

      {/* ── Navigation ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e8e0d5]" : "bg-transparent"
      }`}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c45e3a] rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-serif-jp font-bold text-[#2a2520]">SNS成長戦略</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5a4e42]">
            {[["課題", "challenges"], ["市場機会", "market"], ["サービス", "services"], ["料金", "pricing"], ["事例", "cases"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#c45e3a] transition-colors">{label}</button>
            ))}
            <button onClick={() => scrollTo("contact")} className="bg-[#c45e3a] text-white px-4 py-2 rounded-lg hover:bg-[#9e4a2c] transition-colors">
              無料相談
            </button>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#e8e0d5] px-4 py-4 space-y-3">
            {[["課題", "challenges"], ["市場機会", "market"], ["サービス", "services"], ["料金", "pricing"], ["事例", "cases"], ["お問い合わせ", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-2 text-[#5a4e42] font-medium hover:text-[#c45e3a]">{label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663398614048/d5xtg8vnZLnaH4bo9KDRzi/hero-sns-ads-aCfRu6Cr8w24QZVM3VQmFr.webp"
            alt="SNS広告運用代行"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a2520]/80 via-[#2a2520]/50 to-transparent" />
        </div>
        <div className="container relative z-10 pt-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d4a843]/20 border border-[#d4a843]/40 rounded-full px-4 py-1.5 mb-6">
              <Star size={12} className="text-[#d4a843]" fill="#d4a843" />
              <span className="text-[#d4a843] text-xs font-semibold tracking-wider">中小企業専門 SNS広告代行</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              貴社のビジネスを<br />
              <span className="text-[#d4a843]">加速させる</span><br />
              戦略的SNS広告<br />パートナー
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl">
              「SNS広告を始めたいが、何から手をつければ良いかわからない」そんな社長のお悩みを、専門チームが丸ごと解決します。戦略立案から運用・改善まで、成果にコミットします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("contact")}
                className="bg-[#c45e3a] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#9e4a2c] transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 justify-center"
              >
                無料相談を予約する <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo("cases")}
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                導入事例を見る
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => scrollTo("challenges")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* ── Stats Bar ── */}
      <section ref={statsRef.ref} className="bg-[#2a2520] py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <StatCard value={150} unit="%" label="平均来店者数増加率" started={statsRef.inView} />
            <StatCard value={50} unit="%" label="平均リード獲得単価削減" started={statsRef.inView} />
            <StatCard value={320} unit="%" label="平均広告費ROI" started={statsRef.inView} />
            <StatCard value={98} unit="%" label="顧客継続率" started={statsRef.inView} />
          </div>
        </div>
      </section>

      {/* ── Challenges ── */}
      <section id="challenges" className="py-20 bg-[#faf8f4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[#c45e3a] text-sm font-bold tracking-widest uppercase mb-3">こんなお悩みはありませんか？</p>
            <h2 className="font-serif-jp text-3xl md:text-4xl font-bold text-[#2a2520] leading-tight">
              多くの中小企業の社長が<br />抱えている課題
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target size={28} className="text-[#c45e3a]" />,
                title: "何から始めれば良いかわからない",
                desc: "どのSNS媒体を選べば良いか、ターゲット設定はどうすれば良いか——専門知識がなければ、最初の一歩を踏み出すことすら困難です。",
              },
              {
                icon: <Users size={28} className="text-[#c45e3a]" />,
                title: "日々の業務に追われて手が回らない",
                desc: "SNS運用の重要性は理解していても、専任担当者を置く余裕がなく、広告の作成・効果測定・改善に割ける時間がありません。",
              },
              {
                icon: <BarChart2 size={28} className="text-[#c45e3a]" />,
                title: "広告を出しても効果が出ない",
                desc: "試しに広告を出してみたが、思ったほどの効果が出ない。広告費が無駄になっているのではないかと不安を感じています。",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-[#e8e0d5] card-hover">
                <div className="w-12 h-12 bg-[#faf8f4] rounded-xl flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-serif-jp text-lg font-bold text-[#2a2520] mb-3">{item.title}</h3>
                <p className="text-[#5a4e42] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-[#2d5a3d] rounded-2xl p-8 text-white text-center">
            <p className="text-lg font-semibold">これらの課題は、<span className="text-[#d4a843] font-bold">専門家に任せることで、すべて解決できます。</span></p>
            <p className="text-white/70 text-sm mt-2">弊社のSNS広告運用代行サービスが、貴社の成長を全力でサポートします。</p>
          </div>
        </div>
      </section>

      {/* ── Market Opportunity ── */}
      <section id="market" className="py-20 bg-[#f0ece4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[#c45e3a] text-sm font-bold tracking-widest uppercase mb-3">Market Opportunity</p>
            <h2 className="font-serif-jp text-3xl md:text-4xl font-bold text-[#2a2520] leading-tight">
              なぜ今、SNS広告なのか？
            </h2>
            <p className="text-[#5a4e42] mt-4 leading-relaxed">
              国内SNSユーザーは年々増加し、ターゲット顧客へのリーチ効率は従来の広告媒体を大きく上回ります。データで見る市場の機会をご確認ください。
            </p>
          </div>

          {/* Chart Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              { key: "users", label: "SNSユーザー数推移" },
              { key: "cost", label: "広告費用比較" },
              { key: "roi", label: "ROI改善推移" },
              { key: "platform", label: "媒体別シェア" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveChart(key as any)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeChart === key
                    ? "bg-[#c45e3a] text-white shadow-md"
                    : "bg-white text-[#5a4e42] border border-[#e8e0d5] hover:border-[#c45e3a]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e8e0d5] shadow-sm">
            {activeChart === "users" && (
              <div>
                <h3 className="font-serif-jp text-lg font-bold text-[#2a2520] mb-2">国内主要SNSアクティブユーザー数推移（万人）</h3>
                <p className="text-sm text-[#8b7355] mb-6">Instagramは特に急成長。2024年には6,600万人を突破し、ビジネス活用の機会が拡大しています。</p>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={snsUserData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorLINE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4a843" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorIG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c45e3a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c45e3a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#8b7355" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#8b7355" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="LINE" name="LINE" stroke="#d4a843" fill="url(#colorLINE)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Instagram" name="Instagram" stroke="#c45e3a" fill="url(#colorIG)" strokeWidth={2} />
                    <Area type="monotone" dataKey="X" name="X (Twitter)" stroke="#8b7355" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="Facebook" name="Facebook" stroke="#2d5a3d" fill="none" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            {activeChart === "cost" && (
              <div>
                <h3 className="font-serif-jp text-lg font-bold text-[#2a2520] mb-2">広告媒体別 費用対効果比較</h3>
                <p className="text-sm text-[#8b7355] mb-6">SNS広告は少額の投資で高いリーチを実現。従来媒体と比較して圧倒的なコストパフォーマンスを誇ります。</p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={adCostComparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8b7355" }} interval={0} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#8b7355" }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#8b7355" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cost" name="費用（万円）" fill="#c45e3a" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="reach" name="リーチ率（%）" fill="#2d5a3d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-[#8b7355] text-center mt-2">※ 概算値。実際の効果は業種・地域・予算により異なります。</p>
              </div>
            )}
            {activeChart === "roi" && (
              <div>
                <h3 className="font-serif-jp text-lg font-bold text-[#2a2520] mb-2">SNS広告導入後のROI改善推移（平均値）</h3>
                <p className="text-sm text-[#8b7355] mb-6">弊社クライアントの平均データ。導入から6ヶ月で投資対効果が2.6倍に向上しています。</p>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={roiData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8b7355" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#8b7355" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="before" name="導入前（ベースライン）" stroke="#e8e0d5" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="after" name="導入後ROI指数" stroke="#c45e3a" strokeWidth={3} dot={{ fill: "#c45e3a", r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-[#8b7355] text-center mt-2">※ 導入前を100とした指数表示。実際の成果は業種・予算により異なります。</p>
              </div>
            )}
            {activeChart === "platform" && (
              <div>
                <h3 className="font-serif-jp text-lg font-bold text-[#2a2520] mb-2">SNS広告 媒体別活用シェア（中小企業向け）</h3>
                <p className="text-sm text-[#8b7355] mb-6">業種や目的によって最適な媒体は異なります。弊社では貴社に最適な媒体を選定・組み合わせてご提案します。</p>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={platformShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {platformShareData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "シェア"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 min-w-[200px]">
                    {platformShareData.map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <div>
                          <p className="font-semibold text-sm text-[#2a2520]">{p.name}</p>
                          <p className="text-xs text-[#8b7355]">活用率 {p.value}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 bg-[#faf8f4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[#c45e3a] text-sm font-bold tracking-widest uppercase mb-3">Our Services</p>
            <h2 className="font-serif-jp text-3xl md:text-4xl font-bold text-[#2a2520] leading-tight">
              弊社が選ばれる3つの理由
            </h2>
          </div>
          <div className="space-y-16">
            {[
              {
                num: "01",
                title: "専門家による戦略立案",
                desc: "貴社のビジネスモデル、ターゲット顧客、競合環境を徹底的に分析します。「なんとなくSNS広告を出す」のではなく、明確なKPIと戦略に基づいた広告設計を行います。最適なSNS媒体の選定から、ターゲティング設定、予算配分まで、すべてデータに基づいてご提案します。",
                points: ["ビジネス・競合分析", "KPI設計と目標設定", "最適媒体の選定"],
                reverse: false,
              },
              {
                num: "02",
                title: "高品質なクリエイティブ制作",
                desc: "ターゲットの心に響く広告コピーとビジュアルを制作します。A/Bテストを繰り返し、クリック率・コンバージョン率を継続的に改善します。「なんとなく作った広告」ではなく、心理学と行動データに基づいた、成果を出すクリエイティブを提供します。",
                points: ["広告コピー・デザイン制作", "A/Bテストによる最適化", "動画・静止画対応"],
                reverse: true,
              },
              {
                num: "03",
                title: "徹底した効果測定と改善",
                desc: "広告を出して終わりではありません。リアルタイムでパフォーマンスを監視し、毎月わかりやすいレポートで成果を「見える化」します。データに基づいた継続的な改善サイクルにより、広告費の無駄を排除し、ROIを最大化します。",
                points: ["リアルタイム監視", "月次レポート提供", "PDCAサイクルの徹底"],
                reverse: false,
              },
            ].map((item, i) => (
              <div key={i} className={`grid md:grid-cols-2 gap-10 items-center ${item.reverse ? "md:flex-row-reverse" : ""}`}>
                <div className={item.reverse ? "md:order-2" : ""}>
                  <div className="font-display text-7xl font-bold text-[#e8e0d5] leading-none mb-2">{item.num}</div>
                  <h3 className="font-serif-jp text-2xl font-bold text-[#2a2520] mb-4">{item.title}</h3>
                  <p className="text-[#5a4e42] leading-relaxed mb-6">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.points.map((p, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm font-semibold text-[#2d5a3d]">
                        <CheckCircle size={16} className="text-[#2d5a3d]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-[#f0ece4] rounded-2xl p-8 ${item.reverse ? "md:order-1" : ""}`}>
                  <div className="aspect-video bg-white rounded-xl flex items-center justify-center border border-[#e8e0d5]">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-[#c45e3a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {i === 0 && <Target size={32} className="text-[#c45e3a]" />}
                        {i === 1 && <Star size={32} className="text-[#c45e3a]" />}
                        {i === 2 && <BarChart2 size={32} className="text-[#c45e3a]" />}
                      </div>
                      <p className="font-serif-jp font-bold text-[#2a2520] text-lg">{item.title}</p>
                      <p className="text-[#8b7355] text-sm mt-2">専門チームが全力でサポート</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 bg-[#f0ece4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[#c45e3a] text-sm font-bold tracking-widest uppercase mb-3">Pricing Plans</p>
            <h2 className="font-serif-jp text-3xl md:text-4xl font-bold text-[#2a2520] leading-tight">
              料金プラン
            </h2>
            <p className="text-[#5a4e42] mt-4">
              貴社のご予算・ご要望に応じてカスタマイズも可能です。まずはお気軽にご相談ください。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <PlanCard
              name="ライトプラン"
              price="10"
              adBudget="5万円〜"
              platforms="1媒体"
              features={[
                "市場・競合分析",
                "広告戦略設計",
                "広告運用・最適化",
                "月次レポーティング",
                "メールサポート",
              ]}
            />
            <PlanCard
              name="スタンダードプラン"
              price="30"
              adBudget="15万円〜"
              platforms="2媒体"
              features={[
                "ライトプランの全内容",
                "クリエイティブ制作（月2本）",
                "A/Bテスト実施",
                "週次レポーティング",
                "電話・メールサポート",
              ]}
              highlighted
            />
            <PlanCard
              name="プレミアムプラン"
              price="50"
              adBudget="30万円〜"
              platforms="3媒体以上"
              features={[
                "スタンダードプランの全内容",
                "定例ミーティング（月1回）",
                "インフルエンサー施策支援",
                "LP制作サポート",
                "専任担当者アサイン",
              ]}
            />
          </div>
          <p className="text-center text-sm text-[#8b7355] mt-8">
            ※ 上記は税抜き価格です。広告費は別途必要です。詳細はお問い合わせください。
          </p>
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section id="cases" className="py-20 bg-[#faf8f4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[#c45e3a] text-sm font-bold tracking-widest uppercase mb-3">Case Studies</p>
            <h2 className="font-serif-jp text-3xl md:text-4xl font-bold text-[#2a2520] leading-tight">
              導入事例
            </h2>
            <p className="text-[#5a4e42] mt-4">
              実際のクライアント様の成果をご紹介します。業種を問わず、確かな成果を出しています。
            </p>
          </div>
          <CaseStudyTabs />
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 bg-[#2d5a3d]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[#d4a843] text-sm font-bold tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="font-serif-jp text-3xl md:text-4xl font-bold text-white leading-tight">
              導入の流れ
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "無料相談", desc: "現状のお悩みやご要望をヒアリング。最適なプランをご提案します。" },
              { step: "02", title: "戦略設計", desc: "市場分析・競合調査を実施し、SNS広告戦略とKPIを設計します。" },
              { step: "03", title: "広告運用開始", desc: "クリエイティブ制作・ターゲティング設定を行い、広告を配信します。" },
              { step: "04", title: "改善・報告", desc: "データを分析し、継続的に改善。月次レポートで成果をご報告します。" },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-white/20 z-0" style={{ width: "calc(100% - 2rem)", left: "calc(50% + 2rem)" }} />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-[#d4a843] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="font-serif-jp font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663398614048/d5xtg8vnZLnaH4bo9KDRzi/results-chart-bg-3za6YKhoV2qcndC8JFREKL.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2a2520]/70" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[#d4a843] text-sm font-bold tracking-widest uppercase mb-4">Contact Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              まずは無料相談から
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-10">
              「どのSNSを使えばいいか」「予算はどのくらい必要か」など、どんな些細なご質問でも構いません。専門コンサルタントが丁寧にお答えします。
            </p>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <a href="https://msl-booking.square.site/" target="_blank" rel="noopener noreferrer" className="w-full bg-[#c45e3a] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#9e4a2c] transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 inline-flex">
                無料相談を予約する（30分・オンライン）<ArrowRight size={20} />
              </a>
              <p className="text-white/50 text-xs mt-3">※ 無料相談はZoom・Google Meetにて実施します。費用は一切かかりません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#2a2520] py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#c45e3a] rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-serif-jp font-bold text-white">SNS成長戦略</span>
            </div>
            <p className="text-white/40 text-sm">© 2026 松田システム技研All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  );
}
