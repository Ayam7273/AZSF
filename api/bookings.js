import { Redis } from "@upstash/redis";
import { escapeHtml } from "../lib/spamCheck.js";
import { listBookings } from "../lib/booking.js";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secret = process.env.ADMIN_SECRET;

  if (!secret || req.query.key !== secret) {
    return res.status(404).json({ message: "Not found" });
  }

  try {
    const bookings = await listBookings(redis);

    const rows = bookings
      .map(
        (b) => `
          <tr>
            <td>${escapeHtml(b.label)}</td>
            <td>${escapeHtml(b.name || "")}</td>
            <td>${escapeHtml(b.email || "")}</td>
            <td>${escapeHtml(b.phone || "")}</td>
          </tr>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Appointment Bookings</title>
        <meta name="robots" content="noindex, nofollow">
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #131313; }
          table { border-collapse: collapse; width: 100%; max-width: 900px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
          th { background: #07A550; color: #fff; }
        </style>
      </head>
      <body>
        <h1>Upcoming Appointment Bookings</h1>
        <p>${bookings.length} booking(s)</p>
        <table>
          <tr><th>Appointment</th><th>Name</th><th>Email</th><th>Phone</th></tr>
          ${rows || '<tr><td colspan="4">No bookings yet.</td></tr>'}
        </table>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(html);
  } catch (error) {
    console.error("BOOKINGS ERROR:", error);
    return res.status(500).json({ message: "Could not load bookings." });
  }
}
