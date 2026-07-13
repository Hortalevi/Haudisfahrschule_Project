"use client";

import { useRef, useState, useTransition } from "react";
import { Mail, Phone, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cancelRegistration, deleteRegistration, setNotes, setPaymentStatus } from "./actions";
import type { RegistrationRow as RegistrationRowData } from "@/lib/registrations";

export function RegistrationRow({ registration }: { registration: RegistrationRowData }) {
  const [pending, startTransition] = useTransition();
  const [notes, setNotesValue] = useState(registration.internalNotes ?? "");
  const savedNotesRef = useRef(registration.internalNotes ?? "");
  const cancelled = registration.status === "CANCELLED";
  const paid = registration.paymentStatus === "PAID";

  function saveNotesIfChanged() {
    if (notes === savedNotesRef.current) return;
    savedNotesRef.current = notes;
    startTransition(() => setNotes(registration.id, notes));
  }

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
      <td className="py-2.5 pr-3 text-sand-600">{registration.assignedInstructorName ?? "–"}</td>
      <td className="py-2.5 pr-3">
        <button
          type="button"
          disabled={pending || cancelled}
          onClick={() => startTransition(() => setPaymentStatus(registration.id, !paid))}
          className="focus-ring disabled:opacity-50"
        >
          <Badge variant={paid ? "moss" : "ember"}>{paid ? "Bezahlt" : "Ausstehend"}</Badge>
        </button>
      </td>
      <td className="py-2.5 pr-3">
        <input
          type="text"
          defaultValue={registration.internalNotes ?? ""}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={saveNotesIfChanged}
          placeholder="Notiz…"
          className="focus-ring w-32 rounded-md border border-sand-300 bg-white px-2 py-1 text-xs text-navy-900 placeholder:text-sand-400"
        />
      </td>
      <td className="py-2.5 pr-3">
        <Badge variant={cancelled ? "navy" : "moss"}>{cancelled ? "Storniert" : "Bestätigt"}</Badge>
      </td>
      <td className="py-2.5 text-right">
        <div className="flex items-center justify-end gap-3">
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
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm(`Anmeldung von ${registration.firstName} ${registration.lastName} endgültig löschen?`)) return;
              startTransition(() => deleteRegistration(registration.id));
            }}
            className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-sand-500 hover:text-red-600 hover:underline disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Löschen
          </button>
        </div>
      </td>
    </tr>
  );
}
