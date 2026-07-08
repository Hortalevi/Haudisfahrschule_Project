import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const site = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0d0d0e",
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(239,60,97,0.4), transparent 42%), radial-gradient(circle at 88% 0%, rgba(255,248,41,0.18), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 40,
            fontWeight: 800,
            color: "white",
          }}
        >
          <span>Haudi</span>
          <span style={{ color: "#ef3c61" }}>&apos;s</span>
          <span>&nbsp;Verkehrsschule</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 60,
            fontWeight: 800,
            color: "white",
            maxWidth: 900,
            lineHeight: 1.15,
          }}
        >
          Dein Weg zum Führerausweis beginnt hier.
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "rgba(255,255,255,0.7)" }}>
          {`${site.addressCity}, ${site.addressRegion} · Auto & Motorrad · Mehrsprachig`}
        </div>
      </div>
    ),
    { ...size },
  );
}
