// Mock fixtures — shaped to satisfy every Zod schema from T0.6.
// Each entity list is large enough to exercise pagination.

import type { Project } from "@/types/domain";
import type { Holding, PerformanceSeries, GeoDistribution, PortfolioSummary } from "@/lib/schemas/portfolio";
import type { Activity, Investment } from "@/lib/schemas/investment";
import type { Payout, PayoutMethod, IncomeSummary } from "@/lib/schemas/payout";
import type { Report } from "@/lib/schemas/report";
import type { User, Notification } from "@/lib/schemas/user";
import type { CashConfig } from "@/lib/schemas/cash";
import type { Ticket } from "@/lib/schemas/support";
import type { DashboardSummary } from "@/types/domain";

// ─── Projects (10 items → 2 pages of 8 / 5) ───────────────────────────────────

// Capacities are now multi-megawatt. sharePrice is Toman per watt; minInvestment
// equals the price of 1 kW (the minimum share), so the cheapest entry is ۸۰ میلیون تومان.
export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "نیروگاه خورشیدی اصفهان ۱",
    location: "اصفهان",
    images: ["/Images/projects/project-1.jpg"],
    status: "active",
    targetYield: 18.5,
    minInvestment: 100_000_000,
    sharePrice: 100_000,
    soldPercent: 72,
    totalCapacityWatts: 2_000_000,
    description: "نیروگاه خورشیدی ۲ مگاواتی در شمال اصفهان",
    createdAt: "2024-03-01T00:00:00Z",
    operationStartDate: "2025-09-01T00:00:00Z",
  },
  {
    id: "proj-2",
    name: "نیروگاه شیراز آفتاب",
    location: "شیراز",
    images: ["/Images/projects/project-2.jpg"],
    status: "funding",
    targetYield: 21.0,
    minInvestment: 95_000_000,
    sharePrice: 95_000,
    soldPercent: 34,
    totalCapacityWatts: 1_500_000,
    description: "نیروگاه ۱.۵ مگاواتی در جنوب شیراز با بازده بالا",
    createdAt: "2024-04-15T00:00:00Z",
    operationStartDate: "2026-03-01T00:00:00Z",
    progressPercent: 45,
  },
  {
    id: "proj-3",
    name: "مجتمع انرژی کرمان",
    location: "کرمان",
    images: ["/Images/projects/project-1.jpg"],
    status: "active",
    targetYield: 22.3,
    minInvestment: 120_000_000,
    sharePrice: 120_000,
    soldPercent: 89,
    totalCapacityWatts: 5_000_000,
    description: "بزرگ‌ترین نیروگاه خورشیدی بخش خصوصی استان کرمان با ظرفیت ۵ مگاوات",
    createdAt: "2023-11-20T00:00:00Z",
    operationStartDate: "2025-01-01T00:00:00Z",
  },
  {
    id: "proj-4",
    name: "سپهر انرژی تهران",
    location: "تهران",
    images: ["/Images/projects/project-2.jpg"],
    status: "funding",
    targetYield: 16.8,
    minInvestment: 85_000_000,
    sharePrice: 85_000,
    soldPercent: 12,
    totalCapacityWatts: 1_000_000,
    description: "نیروگاه شهری ۱ مگاواتی در حومه تهران",
    createdAt: "2024-05-10T00:00:00Z",
    operationStartDate: "2026-06-01T00:00:00Z",
    progressPercent: 20,
  },
  {
    id: "proj-5",
    name: "طلوع خورشید یزد",
    location: "یزد",
    images: ["/Images/projects/project-1.jpg"],
    status: "active",
    targetYield: 24.1,
    minInvestment: 110_000_000,
    sharePrice: 110_000,
    soldPercent: 95,
    totalCapacityWatts: 3_000_000,
    description: "نیروگاه ۳ مگاواتی در استان آفتابی یزد",
    createdAt: "2023-08-01T00:00:00Z",
    operationStartDate: "2024-12-01T00:00:00Z",
  },
  {
    id: "proj-6",
    name: "نور مهر بوشهر",
    location: "بوشهر",
    images: ["/Images/projects/project-2.jpg"],
    status: "active",
    targetYield: 19.7,
    minInvestment: 90_000_000,
    sharePrice: 90_000,
    soldPercent: 61,
    totalCapacityWatts: 1_800_000,
    description: "نیروگاه ساحلی ۱.۸ مگاواتی در استان بوشهر",
    createdAt: "2024-01-15T00:00:00Z",
    operationStartDate: "2025-05-01T00:00:00Z",
  },
  {
    id: "proj-7",
    name: "انرژی سبز خراسان",
    location: "مشهد",
    images: ["/Images/projects/project-1.jpg"],
    status: "funding",
    targetYield: 17.5,
    minInvestment: 80_000_000,
    sharePrice: 80_000,
    soldPercent: 28,
    totalCapacityWatts: 1_200_000,
    description: "نیروگاه ۱.۲ مگاواتی در حومه مشهد مقدس",
    createdAt: "2024-06-01T00:00:00Z",
    operationStartDate: "2026-08-01T00:00:00Z",
    progressPercent: 35,
  },
  {
    id: "proj-8",
    name: "آفتاب زاگرس لرستان",
    location: "خرم‌آباد",
    images: ["/Images/projects/project-2.jpg"],
    status: "active",
    targetYield: 20.2,
    minInvestment: 105_000_000,
    sharePrice: 105_000,
    soldPercent: 53,
    totalCapacityWatts: 2_500_000,
    description: "نیروگاه کوهستانی ۲.۵ مگاواتی در لرستان",
    createdAt: "2024-02-20T00:00:00Z",
    operationStartDate: "2025-03-01T00:00:00Z",
  },
  {
    id: "proj-9",
    name: "پرتو سپید گیلان",
    location: "رشت",
    images: ["/Images/projects/project-1.jpg"],
    status: "funding",
    targetYield: 14.5,
    minInvestment: 80_000_000,
    sharePrice: 80_000,
    soldPercent: 7,
    totalCapacityWatts: 1_000_000,
    description: "نیروگاه ۱ مگاواتی با تکنولوژی پنل دو رو در گیلان",
    createdAt: "2024-06-10T00:00:00Z",
    operationStartDate: "2026-09-01T00:00:00Z",
    progressPercent: 15,
  },
  {
    id: "proj-10",
    name: "مهتاب انرژی سمنان",
    location: "سمنان",
    images: ["/Images/projects/project-2.jpg"],
    status: "closed",
    targetYield: 23.0,
    minInvestment: 130_000_000,
    sharePrice: 130_000,
    soldPercent: 100,
    totalCapacityWatts: 4_000_000,
    description: "نیروگاه تمام‌فروخته ۴ مگاواتی در بیابان‌های سمنان",
    createdAt: "2023-06-01T00:00:00Z",
    operationStartDate: "2024-06-01T00:00:00Z",
  },
];

// ─── Dashboard summary ─────────────────────────────────────────────────────────

// Strictly ascending series (oldest → newest): value grows from ~40% to `end`,
// with a tiny wobble that never breaks the upward trend.
function makeSeries(months: number, end: number): PerformanceSeries[] {
  const series: PerformanceSeries[] = [];
  const now = new Date("2025-06-01");
  const start = Math.round(end * 0.4);
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const t = months > 1 ? (months - 1 - i) / (months - 1) : 1; // 0 oldest → 1 newest
    const wobble = Math.round(Math.sin(i) * end * 0.01);
    series.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(start + (end - start) * t) + wobble,
    });
  }
  return series;
}

export const MOCK_DASHBOARD: DashboardSummary = {
  cashBalance: 42_500_000,
  totalInvested: 185_000_000,
  currentValue: 213_750_000,
  incomeEarned: 28_300_000,
  energyProducedKwh: 142_600,
  investedSeries: makeSeries(12, 185_000_000),
  allocation: [
    { name: "اصفهان ۱", value: 55_000_000, watts: 5_000 },
    { name: "یزد", value: 72_000_000, watts: 6_000 },
    { name: "بوشهر", value: 38_000_000, watts: 4_000 },
    { name: "زاگرس", value: 20_000_000, watts: 2_000 },
  ],
};

// ─── Portfolio ─────────────────────────────────────────────────────────────────

export const MOCK_HOLDINGS: Holding[] = [
  {
    projectId: "proj-1",
    projectName: "نیروگاه خورشیدی اصفهان ۱",
    projectLocation: "اصفهان",
    sharesOwned: 5_500,
    purchasePrice: 10_000,
    currentPrice: 10_850,
    totalValue: 59_675_000,
    totalInvested: 55_000_000,
    pnl: 4_675_000,
    pnlPercent: 8.5,
    ownershipPercent: 1.1,
  },
  {
    projectId: "proj-5",
    projectName: "طلوع خورشید یزد",
    projectLocation: "یزد",
    sharesOwned: 6_545,
    purchasePrice: 11_000,
    currentPrice: 12_400,
    totalValue: 81_158_000,
    totalInvested: 72_000_000,
    pnl: 9_158_000,
    pnlPercent: 12.7,
    ownershipPercent: 0.87,
  },
  {
    projectId: "proj-6",
    projectName: "نور مهر بوشهر",
    projectLocation: "بوشهر",
    sharesOwned: 4_000,
    purchasePrice: 9_500,
    currentPrice: 9_920,
    totalValue: 39_680_000,
    totalInvested: 38_000_000,
    pnl: 1_680_000,
    pnlPercent: 4.4,
    ownershipPercent: 1.0,
  },
  {
    projectId: "proj-8",
    projectName: "آفتاب زاگرس لرستان",
    projectLocation: "خرم‌آباد",
    sharesOwned: 1_905,
    purchasePrice: 10_500,
    currentPrice: 11_200,
    totalValue: 21_336_000,
    totalInvested: 20_000_000,
    pnl: 1_336_000,
    pnlPercent: 6.68,
    ownershipPercent: 0.32,
  },
];

export const MOCK_PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalAssetsValue: 213_849_000,
  totalInvested: 185_000_000,
  incomeEarned: 28_300_000,
  netReturn: 28_849_000,
  netReturnPercent: 15.6,
};

export const MOCK_PERFORMANCE_SERIES: PerformanceSeries[] = makeSeries(18, 185_000_000);

export const MOCK_GEO: GeoDistribution[] = [
  { city: "اصفهان", ownershipPercent: 27.9, projectsCount: 1 },
  { city: "یزد", ownershipPercent: 36.5, projectsCount: 1 },
  { city: "بوشهر", ownershipPercent: 18.6, projectsCount: 1 },
  { city: "خرم‌آباد", ownershipPercent: 9.3, projectsCount: 1 },
  { city: "سایر", ownershipPercent: 7.7, projectsCount: 0 },
];

// ─── Activities (recent — dashboard) ──────────────────────────────────────────

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "buy",
    description: "خرید وات — نیروگاه اصفهان ۱",
    amount: 55_000_000,
    shares: 5_500,
    projectName: "نیروگاه خورشیدی اصفهان ۱",
    date: "2025-03-10T09:15:00Z",
  },
  {
    id: "act-2",
    type: "deposit",
    description: "واریز وجه",
    amount: 100_000_000,
    date: "2025-03-08T14:30:00Z",
  },
  {
    id: "act-3",
    type: "buy",
    description: "خرید وات — طلوع خورشید یزد",
    amount: 72_000_000,
    shares: 6_545,
    projectName: "طلوع خورشید یزد",
    date: "2025-02-20T11:00:00Z",
  },
  {
    id: "act-4",
    type: "buy",
    description: "خرید وات — نور مهر بوشهر",
    amount: 38_000_000,
    shares: 4_000,
    projectName: "نور مهر بوشهر",
    date: "2025-01-15T10:45:00Z",
  },
  {
    id: "act-5",
    type: "withdraw",
    description: "برداشت وجه",
    amount: 10_000_000,
    date: "2025-01-05T16:00:00Z",
  },
  {
    id: "act-6",
    type: "sell",
    description: "فروش وات — مهتاب انرژی سمنان",
    amount: 26_000_000,
    shares: 2_000,
    projectName: "مهتاب انرژی سمنان",
    date: "2024-12-20T13:20:00Z",
  },
];

// ─── Investments (order history) ───────────────────────────────────────────────

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: "inv-1",
    type: "buy",
    projectId: "proj-1",
    projectName: "نیروگاه خورشیدی اصفهان ۱",
    sharesCount: 5_500,
    pricePerShare: 10_000,
    totalAmount: 55_825_000,
    fee: 825_000,
    status: "completed",
    date: "2025-03-10T09:15:00Z",
  },
  {
    id: "inv-2",
    type: "buy",
    projectId: "proj-5",
    projectName: "طلوع خورشید یزد",
    sharesCount: 6_545,
    pricePerShare: 11_000,
    totalAmount: 73_080_750,
    fee: 1_080_750,
    status: "completed",
    date: "2025-02-20T11:00:00Z",
  },
  {
    id: "inv-3",
    type: "buy",
    projectId: "proj-6",
    projectName: "نور مهر بوشهر",
    sharesCount: 4_000,
    pricePerShare: 9_500,
    totalAmount: 38_570_000,
    fee: 570_000,
    status: "completed",
    date: "2025-01-15T10:45:00Z",
  },
  {
    id: "inv-4",
    type: "sell",
    projectId: "proj-10",
    projectName: "مهتاب انرژی سمنان",
    sharesCount: 2_000,
    pricePerShare: 13_000,
    totalAmount: 25_610_000,
    fee: 390_000,
    status: "completed",
    date: "2024-12-20T13:20:00Z",
  },
  {
    id: "inv-5",
    type: "buy",
    projectId: "proj-8",
    projectName: "آفتاب زاگرس لرستان",
    sharesCount: 1_905,
    pricePerShare: 10_500,
    totalAmount: 20_300_250,
    fee: 300_250,
    status: "completed",
    date: "2024-11-05T08:30:00Z",
  },
  {
    id: "inv-6",
    type: "buy",
    projectId: "proj-1",
    projectName: "نیروگاه خورشیدی اصفهان ۱",
    sharesCount: 3_200,
    pricePerShare: 10_000,
    totalAmount: 32_480_000,
    fee: 480_000,
    status: "completed",
    date: "2024-10-12T09:10:00Z",
  },
  {
    id: "inv-7",
    type: "sell",
    projectId: "proj-5",
    projectName: "طلوع خورشید یزد",
    sharesCount: 1_500,
    pricePerShare: 11_500,
    totalAmount: 16_990_500,
    fee: 259_500,
    status: "completed",
    date: "2024-09-28T14:40:00Z",
  },
  {
    id: "inv-8",
    type: "buy",
    projectId: "proj-6",
    projectName: "نور مهر بوشهر",
    sharesCount: 4_800,
    pricePerShare: 9_500,
    totalAmount: 46_284_000,
    fee: 684_000,
    status: "completed",
    date: "2024-09-03T10:05:00Z",
  },
  {
    id: "inv-9",
    type: "buy",
    projectId: "proj-10",
    projectName: "مهتاب انرژی سمنان",
    sharesCount: 2_600,
    pricePerShare: 13_000,
    totalAmount: 34_307_000,
    fee: 507_000,
    status: "completed",
    date: "2024-08-18T11:30:00Z",
  },
  {
    id: "inv-10",
    type: "buy",
    projectId: "proj-8",
    projectName: "آفتاب زاگرس لرستان",
    sharesCount: 2_100,
    pricePerShare: 10_500,
    totalAmount: 22_375_500,
    fee: 330_500,
    status: "completed",
    date: "2024-07-22T08:50:00Z",
  },
  {
    id: "inv-11",
    type: "sell",
    projectId: "proj-1",
    projectName: "نیروگاه خورشیدی اصفهان ۱",
    sharesCount: 1_200,
    pricePerShare: 10_200,
    totalAmount: 12_058_800,
    fee: 181_200,
    status: "completed",
    date: "2024-06-30T15:15:00Z",
  },
  {
    id: "inv-12",
    type: "buy",
    projectId: "proj-5",
    projectName: "طلوع خورشید یزد",
    sharesCount: 5_000,
    pricePerShare: 11_000,
    totalAmount: 55_825_000,
    fee: 825_000,
    status: "completed",
    date: "2024-06-08T09:40:00Z",
  },
  {
    id: "inv-13",
    type: "buy",
    projectId: "proj-6",
    projectName: "نور مهر بوشهر",
    sharesCount: 3_400,
    pricePerShare: 9_500,
    totalAmount: 32_785_000,
    fee: 485_000,
    status: "completed",
    date: "2024-05-19T12:20:00Z",
  },
  {
    id: "inv-14",
    type: "buy",
    projectId: "proj-10",
    projectName: "مهتاب انرژی سمنان",
    sharesCount: 1_800,
    pricePerShare: 13_000,
    totalAmount: 23_751_000,
    fee: 351_000,
    status: "completed",
    date: "2024-04-26T10:00:00Z",
  },
  {
    id: "inv-15",
    type: "sell",
    projectId: "proj-8",
    projectName: "آفتاب زاگرس لرستان",
    sharesCount: 900,
    pricePerShare: 10_800,
    totalAmount: 9_576_000,
    fee: 144_000,
    status: "completed",
    date: "2024-04-02T13:05:00Z",
  },
];

// ─── Cash flows config (deposit / withdraw / payment methods) ─────────────────

export const MOCK_CASH_CONFIG: CashConfig = {
  userAccounts: [
    { id: "acc-mellat",   bankName: "بانک ملت",     cardNumber: "۶۱۰۴-۳۳۷۲-۱۲۳۴-۵۶۷۸", brandColor: "text-red-base" },
    { id: "acc-saman",    bankName: "بانک سامان",   cardNumber: "۶۲۱۹-۸۶۱۹-۴۴۵۵-۶۶۷۷", brandColor: "text-blue-base" },
    { id: "acc-pasargad", bankName: "بانک پاسارگاد", cardNumber: "۵۰۲۲-۲۹۴۰-۱۱۲۲-۳۳۴۴", brandColor: "text-amber-deep" },
  ],
  platformAccounts: [
    { id: "pf-mellat",  bankName: "حساب پلتفرم — بانک ملت",   cardNumber: "۶۱۰۴-۱۲۰۰-۸۸۴۵-۰۰۱۱", brandColor: "text-red-base" },
    { id: "pf-saman",   bankName: "حساب پلتفرم — بانک سامان", cardNumber: "۶۲۱۹-۸۰۱۰-۵۵۳۱-۲۲۳۳", brandColor: "text-blue-base" },
  ],
  gateways: [
    { id: "gw-saman",  label: "درگاه بانک سامان (سامان کیش)" },
    { id: "gw-mellat", label: "درگاه بانک ملت (به‌پرداخت)" },
    { id: "gw-melli",  label: "درگاه بانک ملی (سداد)" },
  ],
  recentWithdrawAmounts: [39_000_000, 21_000_000, 13_000_000],
  dailyWithdrawCap: 332_739_000,
};

// ─── Support tickets (conversations) ──────────────────────────────────────────

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "tk-3",
    category: "financial",
    subject: "تأخیر در واریز سود ماهانه",
    status: "answered",
    createdAt: "2026-06-27T10:15:00Z",
    messages: [
      {
        id: "tk-3-m1",
        sender: "user",
        text: "سود این ماه پروژه یزد هنوز به حساب من واریز نشده است. لطفاً بررسی کنید.",
        date: "2026-06-27T10:15:00Z",
      },
      {
        id: "tk-3-m2",
        sender: "admin",
        text: "با سلام، واریز سود پروژه یزد در حال پردازش است و تا ۴۸ ساعت آینده به حساب شما واریز می‌شود.",
        date: "2026-06-27T12:40:00Z",
      },
      {
        id: "tk-3-m3",
        sender: "user",
        text: "ممنون از پاسخ‌تان. آیا امکان دارد زمان دقیق‌تری اعلام کنید؟",
        date: "2026-06-27T13:05:00Z",
      },
      {
        id: "tk-3-m4",
        sender: "admin",
        text: "بله، طبق پیگیری انجام‌شده واریز فردا صبح انجام خواهد شد.",
        date: "2026-06-27T13:30:00Z",
      },
      {
        id: "tk-3-m5",
        sender: "user",
        text: "عالی است. اگر تا فردا ظهر واریز نشد دوباره اطلاع می‌دهم.",
        date: "2026-06-27T13:45:00Z",
      },
      {
        id: "tk-3-m6",
        sender: "admin",
        text: "حتماً. در خدمت شما هستیم. تیکت تا زمان واریز باز نگه داشته می‌شود.",
        date: "2026-06-27T14:00:00Z",
      },
      {
        id: "tk-3-m7",
        sender: "user",
        text: "سپاسگزارم از پیگیری شما.",
        date: "2026-06-27T14:10:00Z",
      },
    ],
  },
  {
    id: "tk-2",
    category: "technical",
    subject: "خطا در بارگذاری نمودار سبد دارایی",
    status: "open",
    createdAt: "2026-06-25T16:40:00Z",
    messages: [
      {
        id: "tk-2-m1",
        sender: "user",
        text: "در صفحه دارایی‌ها نمودار عملکرد گاهی بارگذاری نمی‌شود و باید صفحه را رفرش کنم.",
        date: "2026-06-25T16:40:00Z",
      },
    ],
  },
  {
    id: "tk-1",
    category: "account",
    subject: "تغییر شماره موبایل حساب",
    status: "closed",
    createdAt: "2026-06-21T09:05:00Z",
    messages: [
      {
        id: "tk-1-m1",
        sender: "user",
        text: "می‌خواهم شماره موبایل ثبت‌شده در حساب کاربری‌ام را تغییر دهم.",
        date: "2026-06-21T09:05:00Z",
      },
      {
        id: "tk-1-m2",
        sender: "admin",
        text: "درخواست شما ثبت شد. شماره جدید با موفقیت جایگزین شد. در صورت نیاز دوباره در ارتباط باشید.",
        date: "2026-06-21T11:20:00Z",
      },
    ],
  },
];

// ─── Payouts (12 items → 2 pages of 8 / 5) ────────────────────────────────────

export const MOCK_PAYOUTS: Payout[] = Array.from({ length: 12 }, (_, i) => ({
  id: `pay-${i + 1}`,
  projectId: ["proj-1", "proj-5", "proj-6", "proj-8"][i % 4],
  projectName: [
    "نیروگاه خورشیدی اصفهان ۱",
    "طلوع خورشید یزد",
    "نور مهر بوشهر",
    "آفتاب زاگرس لرستان",
  ][i % 4],
  amount: [2_300_000, 3_100_000, 1_400_000, 820_000][i % 4],
  periodStart: new Date(2025, 5 - i, 1).toISOString().slice(0, 10),
  periodEnd: new Date(2025, 5 - i + 1, 0).toISOString().slice(0, 10),
  status: i === 0 ? "processing" : "paid",
  date: new Date(2025, 5 - i + 1, 5).toISOString().slice(0, 10),
}));

export const MOCK_PAYOUT_METHOD: PayoutMethod = {
  id: "method-1",
  type: "bank",
  name: "بانک ملی ایران",
  details: "****-****-****-1234",
  isDefault: true,
};

export const MOCK_INCOME_SUMMARY: IncomeSummary = {
  totalIncome: 28_300_000,
  totalPayment: 25_100_000,
  thisMonthIncome: 7_620_000,
  cashBalance: 42_500_000,
  monthlyBars: [
    { month: "۱۴۰۳/۰۴", amount: 4_900_000 },
    { month: "۱۴۰۳/۰۵", amount: 5_200_000 },
    { month: "۱۴۰۳/۰۶", amount: 5_050_000 },
    { month: "۱۴۰۳/۰۷", amount: 5_600_000 },
    { month: "۱۴۰۳/۰۸", amount: 5_900_000 },
    { month: "۱۴۰۳/۰۹", amount: 5_750_000 },
    { month: "۱۴۰۳/۱۰", amount: 6_100_000 },
    { month: "۱۴۰۳/۱۱", amount: 5_800_000 },
    { month: "۱۴۰۳/۱۲", amount: 6_400_000 },
    { month: "۱۴۰۴/۰۱", amount: 6_900_000 },
    { month: "۱۴۰۴/۰۲", amount: 7_100_000 },
    { month: "۱۴۰۴/۰۳", amount: 7_620_000 },
  ],
};

// ─── Reports (14 items → 2 pages of 8 / 6) ────────────────────────────────────

const REPORT_TITLES = [
  "گزارش مالی سه‌ماهه اول ۱۴۰۴",
  "گزارش فنی بهره‌برداری اصفهان",
  "اسناد حقوقی مالکیت وات",
  "گزارش مالی سال ۱۴۰۳",
  "گزارش عملکرد یزد — فصل بهار",
  "اسناد قرارداد بوشهر",
  "گزارش فنی تعمیرات زاگرس",
  "گزارش مالی سه‌ماهه دوم ۱۴۰۳",
  "گزارش ریسک و کاهش پنل",
  "اسناد مجوز بهره‌برداری",
  "گزارش عملکرد کل سبد",
  "گزارش مالی سه‌ماهه سوم ۱۴۰۳",
  "گزارش فنی بهار ۱۴۰۴",
  "اسناد بیمه نیروگاه‌ها",
];

export const MOCK_REPORTS: Report[] = REPORT_TITLES.map((title, i) => ({
  id: `rep-${i + 1}`,
  title,
  category: (["quarterly", "technical", "legal", "financial"] as const)[i % 4],
  projectId: i % 3 !== 0 ? MOCK_PROJECTS[i % MOCK_PROJECTS.length].id : undefined,
  projectName: i % 3 !== 0 ? MOCK_PROJECTS[i % MOCK_PROJECTS.length].name : undefined,
  date: new Date(2025, 5 - Math.floor(i / 2), 15).toISOString().slice(0, 10),
  sizeKb: 200 + i * 150,
  downloadUrl: `/mock-reports/report-${i + 1}.pdf`,
}));

// ─── User ─────────────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: "user-1",
  username: "admin",
  name: "علی رضایی",
  email: "ali.rezaei@example.com",
  phone: "09121234567",
  role: "مدیر سبد",
  verificationStatus: "verified",
};

// ─── Notifications (8 items) ───────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "payout",
    title: "پرداخت درآمد ماهانه",
    body: "درآمد فروردین ماه نیروگاه اصفهان واریز شد",
    timestamp: "2025-06-05T08:00:00Z",
    read: false,
  },
  {
    id: "notif-2",
    type: "performance",
    title: "عملکرد بالاتر از هدف",
    body: "نیروگاه یزد ۱۲٪ بالاتر از هدف تولید کرد",
    timestamp: "2025-06-03T14:30:00Z",
    read: false,
  },
  {
    id: "notif-3",
    type: "payout",
    title: "پرداخت درآمد ماهانه",
    body: "درآمد فروردین ماه نیروگاه یزد واریز شد",
    timestamp: "2025-06-05T08:10:00Z",
    read: true,
  },
  {
    id: "notif-4",
    type: "performance",
    title: "گزارش عملکرد ماهانه آماده شد",
    body: "گزارش عملکرد اردیبهشت ماه منتشر شد",
    timestamp: "2025-05-31T10:00:00Z",
    read: true,
  },
  {
    id: "notif-5",
    type: "payout",
    title: "پرداخت درآمد ماهانه",
    body: "درآمد اردیبهشت ماه نیروگاه بوشهر واریز شد",
    timestamp: "2025-05-05T09:00:00Z",
    read: true,
  },
  {
    id: "notif-6",
    type: "performance",
    title: "کاهش موقت تولید",
    body: "تولید زاگرس به دلیل گرد و غبار ۴٪ کاهش یافت",
    timestamp: "2025-04-20T16:00:00Z",
    read: true,
  },
  {
    id: "notif-7",
    type: "payout",
    title: "پرداخت درآمد ماهانه",
    body: "درآمد فروردین ماه نیروگاه زاگرس واریز شد",
    timestamp: "2025-04-05T08:30:00Z",
    read: true,
  },
  {
    id: "notif-8",
    type: "performance",
    title: "رکورد تولید ثبت شد",
    body: "نیروگاه اصفهان در اسفند ۱۴۰۳ رکورد تولید را شکست",
    timestamp: "2025-03-15T12:00:00Z",
    read: true,
  },
];
