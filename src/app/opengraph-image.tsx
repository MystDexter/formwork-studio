import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name}: ideas, given their final form`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Satori needs a static font file; the static instance of Archivo ships with the repo for this.
  const font = await readFile(join(process.cwd(), "src/fonts/og/archivo-800.woff"));
  const guides = [128, 168, 292];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#e7e8e3",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Archivo",
        }}
      >
        {guides.map((y) => (
          <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y + 150, height: 2, background: "rgba(95,168,211,0.35)" }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, color: "#151515" }}>
          <div style={{ width: 22, height: 22, background: "#f2401d" }} />
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 116, lineHeight: 0.95, letterSpacing: -4, color: "#151515" }}>
          <span>Ideas, given their</span>
          <span>final form.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#4a4b4f" }}>Design and engineering studio</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: font, weight: 800, style: "normal" }] },
  );
}
