"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { listToText } from "@/lib/course-content-format";
import { updateSiteSettings } from "./actions";
import type { SiteSettings } from "@/lib/site-settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, undefined);

  const openingHoursText = initial.openingHours.map((h) => `${h.days}: ${h.hours}`).join("\n");
  const socialsText = initial.socials.map((s) => `${s.label}|${s.href}`).join("\n");

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input id="name" name="name" defaultValue={initial.name} required />
        </div>
        <div>
          <Label htmlFor="shortName" required>
            Kurzname
          </Label>
          <Input id="shortName" name="shortName" defaultValue={initial.shortName} required />
        </div>
      </div>

      <div>
        <Label htmlFor="legalName" required>
          Rechtlicher Name
        </Label>
        <Input id="legalName" name="legalName" defaultValue={initial.legalName} required />
      </div>

      <div>
        <Label htmlFor="url" required>
          Website-URL
        </Label>
        <Input id="url" name="url" type="url" defaultValue={initial.url} required />
      </div>

      <div>
        <Label htmlFor="description" required>
          Beschreibung (für Suchmaschinen)
        </Label>
        <Textarea id="description" name="description" rows={3} defaultValue={initial.description} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="phone" required>
            Telefon (für Links)
          </Label>
          <Input id="phone" name="phone" defaultValue={initial.phone} placeholder="+41 79 604 44 44" required />
        </div>
        <div>
          <Label htmlFor="phoneDisplay" required>
            Telefon (Anzeige)
          </Label>
          <Input id="phoneDisplay" name="phoneDisplay" defaultValue={initial.phoneDisplay} required />
        </div>
        <div>
          <Label htmlFor="email" required>
            E-Mail
          </Label>
          <Input id="email" name="email" type="email" defaultValue={initial.email} required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="addressStreet" required>
            Strasse
          </Label>
          <Input id="addressStreet" name="addressStreet" defaultValue={initial.addressStreet} required />
        </div>
        <div>
          <Label htmlFor="addressCity" required>
            Ort
          </Label>
          <Input id="addressCity" name="addressCity" defaultValue={initial.addressCity} required />
        </div>
        <div>
          <Label htmlFor="addressPostalCode" required>
            PLZ
          </Label>
          <Input id="addressPostalCode" name="addressPostalCode" defaultValue={initial.addressPostalCode} required />
        </div>
        <div>
          <Label htmlFor="addressRegion" required>
            Kanton
          </Label>
          <Input id="addressRegion" name="addressRegion" defaultValue={initial.addressRegion} required />
        </div>
        <div>
          <Label htmlFor="addressCountry" required>
            Land
          </Label>
          <Input id="addressCountry" name="addressCountry" defaultValue={initial.addressCountry} required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="geoLatitude">Breitengrad (optional)</Label>
          <Input id="geoLatitude" name="geoLatitude" type="number" step="any" defaultValue={initial.geoLatitude ?? ""} />
        </div>
        <div>
          <Label htmlFor="geoLongitude">Längengrad (optional)</Label>
          <Input id="geoLongitude" name="geoLongitude" type="number" step="any" defaultValue={initial.geoLongitude ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="foundersText">Gründer:innen (eine Zeile pro Name)</Label>
        <Textarea id="foundersText" name="foundersText" rows={2} defaultValue={listToText(initial.founders)} />
      </div>

      <div>
        <Label htmlFor="openingHoursText">Öffnungszeiten (Format: Tage: Zeiten, eine Zeile pro Eintrag)</Label>
        <Textarea
          id="openingHoursText"
          name="openingHoursText"
          rows={3}
          defaultValue={openingHoursText}
          placeholder="Mo–Fr: 08:00–12:00, 13:30–18:30"
        />
      </div>

      <div>
        <Label htmlFor="socialsText">Social-Media-Links (Format: Label|URL, eine Zeile pro Eintrag)</Label>
        <Textarea id="socialsText" name="socialsText" rows={2} defaultValue={socialsText} placeholder="Instagram|https://instagram.com/..." />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-sm text-moss-700">Gespeichert.</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Änderungen speichern
      </Button>
    </form>
  );
}
