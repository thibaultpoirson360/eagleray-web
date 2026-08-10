import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getCustomerJourneyBySlug } from "@/lib/airtable";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Eagle Ray Expeditions — private expedition portal";

/**
 * We render the WhatsApp preview ourselves rather than pointing og:image at an
 * Airtable attachment, because Airtable now serves attachments from signed URLs
 * that expire after a couple of hours — a link shared on Monday would show a
 * broken thumbnail by Tuesday. This route lives on our own domain and stays
 * valid for as long as the page does.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let clientName = "";
  let leaderName = "";
  let boatName = "";
  try {
    const journey = await getCustomerJourneyBySlug(slug);
    clientName = journey?.clientName ?? "";
    leaderName = journey?.leader?.name ?? "";
    boatName = journey?.boat?.name ?? "";
  } catch {
    // A CMS hiccup must still yield a valid image — an unbranded grey box in a
    // WhatsApp thread looks worse than a generic Eagle Ray card.
  }

  const logo = await readFile(
    path.join(process.cwd(), "public/assets/img/logo-mark-navy.png"),
  ).then(
    (buffer) => `data:image/png;base64,${buffer.toString("base64")}`,
    () => null,
  );

  const INK = "#0e1b2b";
  const SURFACE = "#f7f6f1";

  const subline = [leaderName && `with ${leaderName}`, boatName]
    .filter(Boolean)
    .join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={76} height={48} alt="" />
          ) : null}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 21,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(14,27,43,0.55)",
            }}
          >
            Private Expedition Portal
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: clientName.length > 14 ? 78 : 92,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: -1.5,
            }}
          >
            {clientName ? `Welcome to Baja, ${clientName}` : "Welcome to Baja"}
          </div>

          {subline ? (
            <div
              style={{
                marginTop: 26,
                fontFamily: "monospace",
                fontSize: 26,
                color: "rgba(14,27,43,0.62)",
              }}
            >
              {subline}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${SURFACE}`,
            paddingTop: 28,
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(14,27,43,0.5)",
          }}
        >
          <span>Eagle Ray Expeditions</span>
          <span>24°12′37.6″ N · La Paz</span>
        </div>
      </div>
    ),
    size,
  );
}
