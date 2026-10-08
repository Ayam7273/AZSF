import { Redis } from "@upstash/redis";
import { formatSlotParts, listSlots, withAvailability } from "../lib/booking.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const slots = listSlots();
    const withStatus = await withAvailability(Redis.fromEnv(), slots);

    const result = withStatus.map((slot) => {
      const { dateLabel, timeLabel } = formatSlotParts(slot);
      return {
        id: slot.id,
        date: slot.date,
        time: slot.time,
        dateLabel,
        timeLabel,
        available: slot.available,
      };
    });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ slots: result });
  } catch (error) {
    console.error("SLOTS ERROR:", error);
    return res.status(500).json({ message: "Could not load appointment slots." });
  }
}
