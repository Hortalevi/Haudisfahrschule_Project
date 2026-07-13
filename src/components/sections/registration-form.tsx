"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registrationSchema, type RegistrationInput } from "@/lib/schemas";
import type { CourseDate } from "@/content/course-dates";

const languages = ["Deutsch", "Italienisch", "Spanisch", "Französisch", "Englisch"];

export type RegistrationFormHandle = {
  setCourseDate: (courseDateId: string) => void;
};

export const RegistrationForm = forwardRef<
  RegistrationFormHandle,
  { defaultCourseDateId?: string; dates: CourseDate[]; instructors: { id: string; name: string }[] }
>(function RegistrationForm({ defaultCourseDateId, dates, instructors }, ref) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const containerRef = useRef<HTMLDivElement>(null);

    const {
      register,
      handleSubmit,
      control,
      setValue,
      reset,
      formState: { errors },
    } = useForm<RegistrationInput>({
      resolver: zodResolver(registrationSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        courseDateId: defaultCourseDateId ?? "",
        language: "Deutsch",
        message: "",
        recommendedInstructorId: "",
        consent: false,
      },
    });

    useImperativeHandle(ref, () => ({
      setCourseDate: (courseDateId: string) => {
        setValue("courseDateId", courseDateId, { shouldValidate: true });
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }));

    const onSubmit = async (data: RegistrationInput) => {
      setStatus("submitting");
      try {
        // Primes the XSRF-TOKEN cookie (see login-form.tsx for the same pattern) -
        // this is a public, unauthenticated endpoint but still CSRF-protected.
        await fetch("/api/backend/auth/csrf", { credentials: "include" });
        const csrfToken = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)?.[1];

        const { consent: _consent, ...body } = data;
        void _consent;
        const res = await fetch("/api/backend/public/registrations", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(csrfToken) } : {}),
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Request failed");
        setStatus("success");
        reset();
      } catch {
        setStatus("error");
      }
    };

    if (status === "success") {
      return (
        <div
          ref={containerRef}
          className="rounded-xl border border-moss-500/20 bg-moss-100 p-8 text-center"
        >
          <CheckCircle2 className="mx-auto h-12 w-12 text-moss-700" />
          <h2 className="mt-4 font-display text-xl font-bold text-navy-950">
            Anmeldung erhalten!
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sand-700">
            Danke für deine Anmeldung. Wir melden uns innerhalb von 24 Stunden bei dir, um die
            Details zu bestätigen.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
            Weitere Anmeldung
          </Button>
        </div>
      );
    }

    return (
      <div ref={containerRef} className="rounded-xl border border-navy-900/8 bg-white p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-xl font-bold text-navy-950">Jetzt anmelden</h2>
        <p className="mt-1 text-sm text-sand-600">
          Wähle deinen Kurs und fülle das Formular aus – wir bestätigen dir deinen Platz per E-Mail.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName" required>
                Vorname
              </Label>
              <Input id="firstName" invalid={!!errors.firstName} {...register("firstName")} />
              {errors.firstName && (
                <p className="mt-1.5 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" required>
                Nachname
              </Label>
              <Input id="lastName" invalid={!!errors.lastName} {...register("lastName")} />
              {errors.lastName && (
                <p className="mt-1.5 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="email" required>
                E-Mail
              </Label>
              <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone" required>
                Telefon
              </Label>
              <Input id="phone" type="tel" invalid={!!errors.phone} {...register("phone")} />
              {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <Label required>Kurs &amp; Termin</Label>
            <Controller
              control={control}
              name="courseDateId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Kurs & Termin" invalid={!!errors.courseDateId}>
                    <SelectValue placeholder="Kurs auswählen…" />
                  </SelectTrigger>
                  <SelectContent>
                    {dates.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.courseName} – {d.dateLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseDateId && (
              <p className="mt-1.5 text-sm text-red-600">{errors.courseDateId.message}</p>
            )}
          </div>

          <div>
            <Label required>Bevorzugte Sprache</Label>
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Bevorzugte Sprache" invalid={!!errors.language}>
                    <SelectValue placeholder="Sprache auswählen…" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {instructors.length > 0 && (
            <div>
              <Label htmlFor="recommendedInstructorId">Wer hat dich empfohlen? (optional)</Label>
              <Controller
                control={control}
                name="recommendedInstructorId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="recommendedInstructorId" aria-label="Wer hat dich empfohlen?">
                      <SelectValue placeholder="Keine Angabe" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div>
            <Label htmlFor="message">Nachricht (optional)</Label>
            <Textarea id="message" rows={3} {...register("message")} />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              className="focus-ring mt-1 h-4 w-4 shrink-0 rounded border-sand-300 text-ember-500"
              {...register("consent")}
            />
            <Label htmlFor="consent" className="mb-0 font-normal">
              Ich akzeptiere die{" "}
              <a href="/datenschutz" className="underline hover:text-ember-800">
                Datenschutzerklärung
              </a>
              .
            </Label>
          </div>
          {errors.consent && <p className="-mt-3 text-sm text-red-600">{errors.consent.message}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird gesendet…
              </>
            ) : (
              "Anmeldung senden"
            )}
          </Button>

          {status === "error" && (
            <p role="alert" className="text-center text-sm text-red-600">
              Etwas ist schiefgelaufen. Bitte versuch es erneut oder ruf uns an.
            </p>
          )}
        </form>
      </div>
    );
  },
);
