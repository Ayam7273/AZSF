document.addEventListener("DOMContentLoaded", function () {
  // Camberwell Islamic Centre, 188 Camberwell Road, London SE5 0ED
  var CENTER = { lat: 51.47539429587479, lng: -0.10668366460703787 };
  var RADIUS_KM = 38.22;

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function distanceKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  var gate = document.getElementById("geo-gate");
  var formSection = document.getElementById("apply-form-section");
  var latInput = document.getElementById("geo_lat");
  var lngInput = document.getElementById("geo_lng");

  if (!gate || !formSection || !latInput || !lngInput) return;

  var steps = {
    intro: document.getElementById("geo-gate-step-intro"),
    loading: document.getElementById("geo-gate-step-loading"),
    denied: document.getElementById("geo-gate-step-denied"),
    blocked: document.getElementById("geo-gate-step-blocked"),
  };

  function showStep(name) {
    Object.keys(steps).forEach(function (key) {
      steps[key].hidden = key !== name;
    });
  }

  function unlockForm(lat, lng) {
    latInput.value = lat;
    lngInput.value = lng;
    gate.hidden = true;
    formSection.classList.remove("gated");
    try {
      sessionStorage.setItem("azsf_geo_verified", JSON.stringify({ lat: lat, lng: lng }));
    } catch (e) {}
  }

  function handlePosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    if (distanceKm(lat, lng, CENTER.lat, CENTER.lng) <= RADIUS_KM) {
      unlockForm(lat, lng);
    } else {
      showStep("blocked");
    }
  }

  function handleError(error) {
    var messages = {
      1: "Location access was denied. Please allow location access in your browser settings and try again.",
      2: "We couldn't determine your location. Please check your connection and try again.",
      3: "Location request timed out. Please try again.",
    };
    document.getElementById("geo-gate-denied-message").textContent =
      messages[error.code] || "We couldn't access your location. Please try again.";
    showStep("denied");
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      document.getElementById("geo-gate-denied-message").textContent =
        "Your browser doesn't support location access. Please contact us for help with your application.";
      showStep("denied");
      return;
    }
    showStep("loading");
    navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  }

  document.getElementById("geo-gate-request").addEventListener("click", requestLocation);
  document.getElementById("geo-gate-retry").addEventListener("click", requestLocation);

  try {
    var cached = JSON.parse(sessionStorage.getItem("azsf_geo_verified") || "null");
    if (cached && typeof cached.lat === "number" && typeof cached.lng === "number") {
      unlockForm(cached.lat, cached.lng);
    }
  } catch (e) {}
});
