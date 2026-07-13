import "server-only";
import { apiGet } from "@/lib/api";
import type { RegistrationRow } from "@/lib/registrations";

export type StatsOverview = {
  activeCourses: number;
  upcomingDates: number;
  studentsThisMonth: number;
  revenueThisMonth: number;
  recentRegistrations: RegistrationRow[];
};

export async function getOverviewStats(): Promise<StatsOverview> {
  return apiGet<StatsOverview>("/stats/overview");
}

export type RevenueBreakdown = {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalStudents: number;
  perCourse: {
    slug: string;
    title: string;
    revenue: number;
    cost: number;
    students: number;
    sessions: number;
    profit: number;
  }[];
};

export async function getRevenueBreakdown(): Promise<RevenueBreakdown> {
  return apiGet<RevenueBreakdown>("/stats/revenue");
}

export type CommissionBreakdown = {
  instructors: {
    id: string;
    name: string;
    username: string;
    studentsAssigned: number;
    revenueGenerated: number;
  }[];
};

export async function getCommissionBreakdown(): Promise<CommissionBreakdown> {
  return apiGet<CommissionBreakdown>("/stats/commissions");
}
