import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Fahrlehrer-Login",
  robots: { index: false, follow: false },
};

export default function InstructorLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-sand-100 px-5 py-16">
      <div className="w-full max-w-sm rounded-xl border border-navy-900/8 bg-white p-8 shadow-elevated">
        <h1 className="font-display text-2xl font-bold text-navy-950">Fahrlehrer-Login</h1>
        <p className="mt-1.5 text-sm text-sand-600">
          Melde dich an, um Kurse, Termine und Anmeldungen zu verwalten.
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-sand-600">
          Noch kein Konto? Bitte wende dich an die Fahrschulleitung.
        </p>
      </div>
    </div>
  );
}
