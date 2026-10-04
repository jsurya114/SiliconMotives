import { ImageResponse } from "next/og";
export const alt =
  "SiliconMotives — World-class software. Zero overhead.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#161616",
        color: "#f2f2f2",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "64px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 30 }}>
        siliconmotives<span style={{ color: "#e4e4e4" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 82,
          letterSpacing: -4,
          lineHeight: 1.05,
          marginTop: 55,
        }}
      >
        <span>World-class software.</span>
        <span style={{ color: "#9a9a9a" }}>Zero overhead.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "auto",
          fontSize: 20,
          color: "#bababa",
        }}
      >
        <span>Remote-first software engineering</span>
        <span>Kerala, India · Clients worldwide</span>
      </div>
    </div>,
    size,
  );
}
