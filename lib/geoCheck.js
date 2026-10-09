// Camberwell Islamic Centre, 188 Camberwell Road, London SE5 0ED
export const SERVICE_AREA_CENTER = { lat: 51.47539429587479, lng: -0.10668366460703787 };
export const SERVICE_AREA_RADIUS_KM = 38.22;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function isWithinServiceArea(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return (
    distanceKm(lat, lng, SERVICE_AREA_CENTER.lat, SERVICE_AREA_CENTER.lng) <=
    SERVICE_AREA_RADIUS_KM
  );
}
