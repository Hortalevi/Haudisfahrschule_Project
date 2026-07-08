import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().trim().min(2, "Bitte gib deinen Vornamen an."),
  lastName: z.string().trim().min(2, "Bitte gib deinen Nachnamen an."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an."),
  phone: z.string().trim().min(6, "Bitte gib eine gültige Telefonnummer an."),
  courseDateId: z.string().min(1, "Bitte wähle einen Kurs bzw. Termin aus."),
  language: z.string().min(1, "Bitte wähle deine bevorzugte Sprache aus."),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Bitte akzeptiere die Datenschutzerklärung.",
  }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen an."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an."),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Bitte gib einen Betreff an."),
  message: z.string().trim().min(10, "Deine Nachricht sollte mindestens 10 Zeichen enthalten."),
  consent: z.boolean().refine((v) => v === true, {
    message: "Bitte akzeptiere die Datenschutzerklärung.",
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const courseFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Bitte gib einen Slug an.")
    .regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Ziffern und Bindestriche."),
  title: z.string().trim().min(2, "Bitte gib einen Titel an."),
  tagline: z.string().trim().min(2, "Bitte gib einen Untertitel an."),
  icon: z.enum(["steering-wheel", "bike", "heart-pulse", "book-open", "clipboard-check", "truck", "car-taxi"]),
  category: z.enum(["pflicht", "auto", "motorrad", "zusatz"]),
  audience: z.enum(["auto", "motorrad", "nothelfer", "vku-btu", "boegle"]),
  priceFrom: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  priceUnit: z.string().trim().min(1, "Bitte gib eine Preiseinheit an."),
  priceNote: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().min(10, "Bitte beschreibe den Kurs kurz."),
  highlightsText: z.string().trim().min(1, "Bitte gib mindestens einen Punkt an."),
  languagesText: z.string().trim().optional().or(z.literal("")),
  duration: z.string().trim().optional().or(z.literal("")),
  ctaLabel: z.string().trim().min(2, "Bitte gib einen Button-Text an."),
  sectionsText: z.string().trim().min(1, "Bitte gib mindestens einen Abschnitt an."),
  costPerSession: z.coerce.number().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;

export const courseDateFormSchema = z.object({
  courseSlug: z.string().min(1, "Bitte wähle einen Kurs aus."),
  dateLabel: z.string().trim().min(2, "Bitte gib eine Datumsbezeichnung an."),
  timeSlotsText: z.string().trim().min(1, "Bitte gib mindestens eine Zeit an."),
  startsAt: z.string().min(1, "Bitte gib Start-Datum/-Zeit an."),
  endsAt: z.string().optional().or(z.literal("")),
  location: z.string().trim().min(2, "Bitte gib einen Ort an."),
  price: z.coerce.number().min(0),
  capacity: z.coerce.number().min(1),
  instructorId: z.string().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type CourseDateFormInput = z.infer<typeof courseDateFormSchema>;
