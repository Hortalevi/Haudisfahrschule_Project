// The instructor dashboard edits list/section fields as plain text areas
// instead of repeatable field arrays (much faster to build and use for a
// small, single-language content set). These helpers convert between the
// DB's structured JSON shape and that plain-text editing format.

export function listToText(items: string[] | undefined | null): string {
  return (items ?? []).join("\n");
}

export function textToList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export type Section = { heading: string; body: string[] };

export function sectionsToText(sections: Section[]): string {
  return sections
    .map((s) => [`## ${s.heading}`, ...s.body].join("\n"))
    .join("\n\n");
}

export function textToSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      current = { heading: line.slice(3).trim(), body: [] };
      sections.push(current);
    } else if (current) {
      current.body.push(line);
    }
  }

  return sections;
}
