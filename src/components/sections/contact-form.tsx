"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactInput } from "@/lib/schemas";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "", consent: false },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <div className="rounded-xl border border-moss-500/20 bg-moss-100 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-moss-700" />
        <h2 className="mt-4 font-display text-xl font-bold text-navy-950">Nachricht gesendet!</h2>
        <p className="mx-auto mt-2 max-w-sm text-sand-700">
          Danke für deine Nachricht. Wir melden uns so schnell wie möglich bei dir.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
          Neue Nachricht
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy-900/8 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="font-display text-xl font-bold text-navy-950">Schreib uns</h2>
      <p className="mt-1 text-sm text-sand-600">
        Fragen zu einem Kurs, deiner Anmeldung oder etwas anderem? Wir freuen uns von dir zu hören.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" required>
              Name
            </Label>
            <Input id="name" invalid={!!errors.name} {...register("name")} />
            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Telefon (optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>
        </div>

        <div>
          <Label htmlFor="email" required>
            E-Mail
          </Label>
          <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="subject" required>
            Betreff
          </Label>
          <Input id="subject" invalid={!!errors.subject} {...register("subject")} />
          {errors.subject && <p className="mt-1.5 text-sm text-red-600">{errors.subject.message}</p>}
        </div>

        <div>
          <Label htmlFor="message" required>
            Nachricht
          </Label>
          <Textarea id="message" rows={5} invalid={!!errors.message} {...register("message")} />
          {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message.message}</p>}
        </div>

        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            className="focus-ring mt-1 h-4 w-4 shrink-0 rounded border-sand-300 text-ember-500"
            {...register("consent")}
          />
          <Label htmlFor="contact-consent" className="mb-0 font-normal">
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
            "Nachricht senden"
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
}
