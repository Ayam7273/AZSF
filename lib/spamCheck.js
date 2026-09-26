const META_FIELDS = ["g-recaptcha-response", "hp_website", "form_ts"];
const URL_PATTERN = /(https?:\/\/|www\.)\S+/gi;

export function fieldValue(fields, name) {
  const value = Array.isArray(fields[name]) ? fields[name][0] : fields[name];
  return String(value ?? "").trim();
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function contentFields(fields) {
  return Object.entries(fields).filter(([key]) => !META_FIELDS.includes(key));
}

// Returns a reason string when the submission looks like spam, otherwise null.
export function detectSpam(fields) {
  if (fieldValue(fields, "hp_website")) return "honeypot filled";

  const timestamp = Number(fieldValue(fields, "form_ts"));
  if (!timestamp) return "missing form timestamp";
  const elapsed = Date.now() - timestamp;
  if (elapsed >= 0 && elapsed < 2000) return "submitted too fast";

  for (const [key] of contentFields(fields)) {
    const text = fieldValue(fields, key);
    const linkCount = (text.match(URL_PATTERN) || []).length;
    const isMessage = key.toLowerCase() === "message";
    if (linkCount > (isMessage ? 1 : 0)) return `links in ${key}`;
    if (text.length > 5000) return `${key} too long`;
  }

  return null;
}
