import "server-only";
import { apiGet } from "@/lib/api";

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return apiGet<ProcessStep[]>("/public/process-steps");
}
