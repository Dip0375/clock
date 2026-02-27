const worldClocksContainer = document.getElementById("world-clocks");
const zonePicker = document.getElementById("zone-picker");
const addZoneButton = document.getElementById("add-zone");

const allZones = [
  { label: "UTC", zone: "UTC" },
  { label: "GMT", zone: "Europe/London" },
  { label: "EST", zone: "America/New_York" },
  { label: "IST", zone: "Asia/Kolkata" },
  { label: "PST", zone: "America/Los_Angeles" },
  { label: "CET", zone: "Europe/Berlin" },
  { label: "JST", zone: "Asia/Tokyo" },
  { label: "AEST", zone: "Australia/Sydney" },
  { label: "GST", zone: "Asia/Dubai" }
];

const selectedZones = new Map();

allZones.forEach(({ label, zone }) => {
  const option = document.createElement("option");
  option.value = zone;
  option.textContent = `${label} — ${zone}`;
  zonePicker.append(option);
});

function addZone(zone) {
  if (selectedZones.has(zone)) {
    return;
  }
  const meta = allZones.find((item) => item.zone === zone);
  if (!meta) {
    return;
  }

  const tile = document.createElement("article");
  tile.className = "clock-tile";
  tile.setAttribute("role", "listitem");
  tile.innerHTML = `
    <div class="clock-head">
      <h3 class="clock-label">${meta.label}</h3>
      <button class="remove-zone" aria-label="Remove ${meta.label}">Remove</button>
    </div>
    <p class="clock-time">--:--:--</p>
    <p class="clock-date">Loading...</p>
  `;

  tile.querySelector(".remove-zone").addEventListener("click", () => {
    selectedZones.delete(zone);
    tile.remove();
  });

  selectedZones.set(zone, tile);
  worldClocksContainer.append(tile);
}

function refreshClocks() {
  const now = new Date();
  selectedZones.forEach((tile, zone) => {
    tile.querySelector(".clock-time").textContent = new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: zone
    }).format(now);

    tile.querySelector(".clock-date").textContent = new Intl.DateTimeFormat([], {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: zone
    }).format(now);
  });
}

addZoneButton.addEventListener("click", () => addZone(zonePicker.value));

["UTC", "Europe/London", "America/New_York", "Asia/Kolkata"].forEach(addZone);
refreshClocks();
setInterval(refreshClocks, 1000);
