const ipInput = document.getElementById("ip-input");
const checkIpBtn = document.getElementById("check-ip");
const ipStatus = document.getElementById("ip-status");
const ipGrid = document.getElementById("ip-grid");
const ipScore = document.getElementById("ip-score");
const ipScoreNote = document.getElementById("ip-score-note");

function setStatus(message) {
  ipStatus.textContent = message;
}

function renderInfo(data) {
  ipGrid.innerHTML = "";

  const fields = [
    ["IP", data.query || data.ip || "-"],
    ["Country", data.country || data.country_name || "-"],
    ["Region", data.regionName || data.region || "-"],
    ["City", data.city || "-"],
    ["Timezone", data.timezone || "-"],
    ["ISP", data.isp || data.org || "-"],
    ["Organization", data.org || "-"],
    ["ASN", data.as || data.asn || "-"],
    ["Proxy", String(Boolean(data.proxy))],
    ["Hosting", String(Boolean(data.hosting))],
    ["Mobile", String(Boolean(data.mobile))],
    ["VPN / Anonymous", String(Boolean(data.vpn || data.anonymous || data.tor))]
  ];

  fields.forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "info-row";
    row.innerHTML = `<strong>${key}</strong><span>${value}</span>`;
    ipGrid.append(row);
  });
}

function calculateRiskScore(data) {
  let score = 5;
  if (data.proxy) score += 35;
  if (data.hosting) score += 25;
  if (data.mobile) score += 10;
  if (data.vpn || data.anonymous) score += 35;
  if (data.tor) score += 60;
  if ((data.isp || "").toLowerCase().includes("cloud")) score += 15;
  return Math.min(100, score);
}

function renderRisk(data) {
  const score = calculateRiskScore(data);
  ipScore.textContent = `${score} / 100`;
  if (score < 30) {
    ipScoreNote.textContent = "Low estimated risk based on available signals.";
  } else if (score < 70) {
    ipScoreNote.textContent = "Medium estimated risk. Consider additional checks.";
  } else {
    ipScoreNote.textContent = "High estimated risk. Treat activity from this IP cautiously.";
  }
}

async function fetchIpData(ip) {
  const query = ip ? ip : "";
  const response = await fetch(`https://ip-api.com/json/${encodeURIComponent(query)}?fields=status,message,country,regionName,city,timezone,isp,org,as,query,proxy,hosting,mobile`);
  if (!response.ok) {
    throw new Error("Failed to fetch IP data.");
  }
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message || "IP lookup failed.");
  }
  return data;
}

async function checkIp() {
  const input = ipInput.value.trim();
  setStatus("Checking IP details...");
  ipGrid.innerHTML = "";
  ipScore.textContent = "-- / 100";
  ipScoreNote.textContent = "No scan yet.";

  try {
    const data = await fetchIpData(input);
    renderInfo(data);
    renderRisk(data);
    setStatus("IP lookup completed.");
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  }
}

checkIpBtn.addEventListener("click", checkIp);
checkIp();
