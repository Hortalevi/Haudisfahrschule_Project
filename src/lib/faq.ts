import "server-only";
import { apiGet } from "@/lib/api";

export type FaqItem = { question: string; answer: string };

export async function getFaqItems(): Promise<FaqItem[]> {
  return apiGet<FaqItem[]>("/public/faq");
}
