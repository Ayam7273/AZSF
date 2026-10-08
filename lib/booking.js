const TIMEZONE = "Europe/London";
const SLOT_TIMES = ["16:00", "16:20", "16:40", "17:00", "17:20", "17:40"];
const SLOT_MINUTES = 20;
const WEEKS_AHEAD = 8;
const MIN_LEAD_HOURS = 24;
const KEY_PREFIX = "azsf:booking:";

// Resolves a London wall-clock date/time (which may be GMT or BST) to the
// true UTC instant it represents, so DST transitions during the booking
// window (late October) don't shift the displayed appointment time.
function londonWallTimeToUTC(year, monthIndex, day, hour, minute) {
  const guess = new Date(Date.UTC(year, monthIndex, day, hour, minute));

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(guess)
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  const asIfUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    parts.hour === "24" ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  const offsetMs = asIfUTC - guess.getTime();

  return new Date(guess.getTime() - offsetMs);
}

function nextSundays(count, from) {
  const dates = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const daysUntilSunday = (7 - cursor.getUTCDay()) % 7;
  cursor.setUTCDate(cursor.getUTCDate() + daysUntilSunday);

  for (let i = 0; i < count; i++) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }

  return dates;
}

// Returns the list of valid, bookable slots (future Sundays, respecting the
// minimum lead time). This is the single source of truth used both to show
// availability and to validate a submitted booking server-side.
export function listSlots({ weeksAhead = WEEKS_AHEAD, minLeadHours = MIN_LEAD_HOURS, now = new Date() } = {}) {
  const sundays = nextSundays(weeksAhead, now);
  const slots = [];

  for (const sunday of sundays) {
    const dateStr = sunday.toISOString().slice(0, 10);
    const [y, m, d] = dateStr.split("-").map(Number);

    for (const time of SLOT_TIMES) {
      const [hh, mm] = time.split(":").map(Number);
      const startUTC = londonWallTimeToUTC(y, m - 1, d, hh, mm);

      if (startUTC.getTime() - now.getTime() < minLeadHours * 3600 * 1000) continue;

      slots.push({
        id: `${dateStr}T${time}`,
        date: dateStr,
        time,
        startUTC,
        endUTC: new Date(startUTC.getTime() + SLOT_MINUTES * 60000),
      });
    }
  }

  return slots;
}

export function findSlot(slotId, options) {
  return listSlots(options).find((slot) => slot.id === slotId) || null;
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIMEZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIMEZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatSlotParts(slot) {
  const dateLabel = DATE_FMT.format(slot.startUTC);
  const timeLabel = `${TIME_FMT.format(slot.startUTC)} – ${TIME_FMT.format(slot.endUTC)}`;
  return { dateLabel, timeLabel, fullLabel: `${dateLabel}, ${timeLabel}` };
}

export function formatSlotLabel(slot) {
  return formatSlotParts(slot).fullLabel;
}

function bookingKey(slotId) {
  return `${KEY_PREFIX}${slotId}`;
}

export async function withAvailability(redis, slots) {
  if (slots.length === 0) return [];

  const keys = slots.map((slot) => bookingKey(slot.id));
  const values = await redis.mget(...keys);

  return slots.map((slot, i) => ({ ...slot, available: values[i] == null }));
}

// Atomically reserves a slot (Redis SET NX) so two simultaneous submissions
// can't both succeed for the same time. Returns false if already taken.
export async function reserveSlot(redis, slot, payload) {
  const ttlSeconds = Math.max(3600, Math.floor((slot.endUTC.getTime() - Date.now()) / 1000) + 86400);

  const result = await redis.set(bookingKey(slot.id), JSON.stringify(payload), {
    nx: true,
    ex: ttlSeconds,
  });

  return result === "OK" || result === true;
}

export async function listBookings(redis) {
  const keys = await redis.keys(`${KEY_PREFIX}*`);
  if (keys.length === 0) return [];

  const values = await redis.mget(...keys);

  return keys
    .map((key, i) => {
      if (values[i] == null) return null;
      const slotId = key.slice(KEY_PREFIX.length);
      const slot = findSlot(slotId, { minLeadHours: -Infinity });
      let payload = {};
      try {
        payload = typeof values[i] === "string" ? JSON.parse(values[i]) : values[i];
      } catch {
        payload = {};
      }
      return {
        slotId,
        label: slot ? formatSlotLabel(slot) : slotId,
        startUTC: slot ? slot.startUTC : null,
        ...payload,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.startUTC && b.startUTC ? a.startUTC - b.startUTC : 0));
}

function toIcsUTC(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcsContent(slot, { summary, description, uid }) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Al-Ihsan Zakat and Sadaqat Foundation//Appointment//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUTC(new Date())}`,
    `DTSTART:${toIcsUTC(slot.startUTC)}`,
    `DTEND:${toIcsUTC(slot.endUTC)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText("Camberwell Islamic Centre, 188 Camberwell Road, London SE5 0ED")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
