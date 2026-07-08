"use client";

import { useTransition } from "react";
import { Mail, Phone, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cancelRegistration } from "./actions";

export function RegistrationRow({
  registration,
}: {
  registration: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
    message: string | null;
    status: string;
  };
}) {
  const [pending, startTransition] = useTransition();
  const cancelled = registration.status === "CANCELLED";

  return (
    <tr className={cancelled ? "opacity-50" : undefined}>
      <td className="py-2.5 pr-3 font-semibold text-navy-900">
        {registration.firstName} {registration.lastName}
      </td>
      <td className="py-2.5 pr-3 text-sand-600">
        <a href={`mailto:${registration.email}`} className="inline-flex items-center gap-1.5 hover:text-ember-800">
          <Mail className="h-3.5 w-3.5" />
          {registration.email}
        </a>
      </td>
      <td className="py-2.5 pr-3 text-sand-600">
        <a href={`tel:${registration.phone}`} className="inline-flex items-center gap-1.5 hover:text-ember-800">
          <Phone className="h-3.5 w-3.5" />
          {registration.phone}
        </a>
      </td>
      <td className="py-2.5 pr-3 text-sand-600">{registration.language}</td>
      <td className="py-2.5 pr-3">
        <Badge variant={cancelled ? "navy" : "moss"}>{cancelled ? "Storniert" : "Bestätigt"}</Badge>
      </td>
      <td className="py-2.5 text-right">
        {!cancelled && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => cancelRegistration(registration.id))}
            className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Stornieren
          </button>
        )}
      </td>
    </tr>
  );
}
