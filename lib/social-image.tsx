import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

const size = {
  width: 1200,
  height: 630,
};

function StepperMark() {
  return (
    <div
      style={{
        display: "flex",
        height: 220,
        position: "relative",
        width: 220,
      }}
    >
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 999,
          height: 130,
          left: 116,
          position: "absolute",
          top: 18,
          width: 14,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 999,
          height: 90,
          left: 112,
          position: "absolute",
          top: 120,
          width: 16,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 999,
          height: 16,
          left: 112,
          position: "absolute",
          top: 194,
          width: 68,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 999,
          height: 46,
          left: 158,
          position: "absolute",
          top: 34,
          width: 18,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 16,
          height: 20,
          left: 176,
          position: "absolute",
          top: 34,
          width: 34,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 999,
          height: 26,
          left: 20,
          position: "absolute",
          top: 120,
          width: 26,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 12,
          height: 28,
          left: 50,
          position: "absolute",
          top: 150,
          width: 86,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 12,
          height: 28,
          left: 20,
          position: "absolute",
          top: 188,
          width: 94,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 12,
          height: 34,
          left: 74,
          position: "absolute",
          top: 90,
          width: 60,
        }}
      />
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 18,
          height: 92,
          left: 146,
          position: "absolute",
          top: 98,
          width: 58,
        }}
      />
    </div>
  );
}

function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#020617",
          color: "#f8fafc",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "720px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              color: "#94a3b8",
              display: "flex",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: 0,
              marginBottom: 34,
            }}
          >
            shadcn registry component
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              color: "#cbd5e1",
              display: "flex",
              fontSize: 38,
              lineHeight: 1.25,
              marginBottom: 48,
            }}
          >
            Guided multi-step flows for React, Next.js, and Tailwind CSS.
          </div>
          <div
            style={{
              alignItems: "center",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 18,
              color: "#e2e8f0",
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              padding: "22px 26px",
            }}
          >
            pnpm dlx shadcn@latest add @stepper/stepper
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 48,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.45)",
            display: "flex",
            height: 292,
            justifyContent: "center",
            width: 292,
          }}
        >
          <StepperMark />
        </div>
      </div>
    ),
    size
  );
}

export { createSocialImage, size as socialImageSize };
