const domainInput = document.getElementById("domain-input");
const checkDnsBtn = document.getElementById("check-dns");
const dnsStatus = document.getElementById("dns-status");
const dnsResults = document.getElementById("dns-results");

const recordTypes = ["A", "AAAA", "MX", "NS", "TXT", "CNAME"];

function setDnsStatus(message) {
  dnsStatus.textContent = message;
}

function normalizeDomain(value) {
  return value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

async function fetchRecord(domain, type) {
  const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`);
  if (!res.ok) {
    throw new Error(`Lookup failed for ${type}`);
  }
  return res.json();
}

function renderRecordCard(type, data) {
  const card = document.createElement("article");
  card.className = "card nested-card";

  const title = document.createElement("h2");
  title.textContent = `${type} Records`;
  card.append(title);

  const list = document.createElement("ul");
  list.className = "record-list";

  const answers = Array.isArray(data.Answer) ? data.Answer : [];
  if (!answers.length) {
    const empty = document.createElement("li");
    empty.textContent = "No records found.";
    list.append(empty);
  } else {
    answers.forEach((answer) => {
      const li = document.createElement("li");
      li.textContent = answer.data;
      list.append(li);
    });
  }

  card.append(list);
  return card;
}

async function checkDns() {
  const domain = normalizeDomain(domainInput.value);
  if (!domain) {
    setDnsStatus("Please enter a domain, for example: example.com");
    return;
  }

  setDnsStatus("Fetching DNS records...");
  dnsResults.innerHTML = "";

  try {
    const results = await Promise.all(recordTypes.map(async (type) => ({
      type,
      data: await fetchRecord(domain, type)
    })));

    results.forEach(({ type, data }) => {
      dnsResults.append(renderRecordCard(type, data));
    });

    setDnsStatus(`DNS lookup completed for ${domain}.`);
  } catch (error) {
    setDnsStatus(`Error: ${error.message}`);
  }
}

checkDnsBtn.addEventListener("click", checkDns);
domainInput.value = "example.com";
checkDns();
