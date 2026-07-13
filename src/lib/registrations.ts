import "server-only";
import { apiGet } from "@/lib/api";

export type RegistrationRow = {
  id: string;
  courseDateId: string;
  courseTitle: string;
  dateLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  message: string | null;
  status: "CONFIRMED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID";
  internalNotes: string | null;
  assignedInstructorId: string | null;
  assignedInstructorName: string | null;
  createdAt: string;
};

export async function getAllRegistrations(): Promise<RegistrationRow[]> {
  return apiGet<RegistrationRow[]>("/registrations");
}
