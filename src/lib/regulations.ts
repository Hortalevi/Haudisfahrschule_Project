import "server-only";
import { apiGet } from "@/lib/api";

export type RegulationSection = {
  question: string;
  answer: string[];
};

export async function getAutoRegulations(): Promise<RegulationSection[]> {
  return apiGet<RegulationSection[]>("/public/regulations?vehicleType=AUTO");
}

export async function getMotorradRegulations(): Promise<RegulationSection[]> {
  return apiGet<RegulationSection[]>("/public/regulations?vehicleType=MOTORRAD");
}
