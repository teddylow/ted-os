/* TED OS Widget v2
   Zoho CRM Widget: student-first dashboard for Deals.
   Safe read-only version.
*/

const state = {
  deals: [],
  processed: [],
  filters: {
    owner: "all",
    bucket: "all",
    search: ""
  }
};

const STAGE_BUCKETS = {
  applications: [
    "Preparing Documents",
    "Admissions",
    "Submitted",
    "Submitted (TOP University)"
  ],
  offer: [
    "Pending Offer (3 weeks passed)",
    "Pending Offer (8 weeks passed)",
    "Pending Offer (TOP University)",
    "Conditional Offer",
    "Unconditional Offer",
    "Conditional - Accepted (Insurance)",
    "Unconditional - Accepted (Insurance)",
    "Conditional - Accepted (Firm)",
    "Unconditional - Accepted (Firm)"
  ],
  cas: [
    "Request CAS",
    "Request COE",
    "Request Visa Letter"
  ],
  visa: [
    "Preparing Visa",
    "Visa Preparing",
    "Visa Submitted",
    "Biometrics",
    "Biometrics Completed",
    "Visa Processing",
    "Visa Approved",
    "Passport Returned",
    "Ready to Fly"
  ],
  won: [
    "Closed Won"
  ],
  lost: [
    "Closed Lost",
    "Closed-Lost to Competition",
    "DEFER"
  ]
};

const KPI_DEFS = [
  { key: "urgent", label: "Urgent", icon: "🔥" },
  { key: "applications", label: "Applications", icon: "📄" },
  { key: "offer", label: "Offer", icon: "🎓" },
  { key: "cas", label: "CAS / COE", icon: "📑" },
  { key: "visa", label: "Visa Queue", icon: "🛂" },
  { key: "won", label: "Approved / Won", icon: "✅" }
];

const $ = (id) => document.getElementById(id);

function log(message, data) {
  const pre = $("debugLog");
  const time = new Date().toLocaleTimeString();
  let line = `[${time}] ${message}`;
  if (data !== undefined) {
    try { line += "\n" + JSON.stringify(data, null, 2); }
    catch { line += "\n" + String(data); }
  }
  pre.textContent += line + "\n";
}

function setStatus(text, connected=false) {
  $("systemStatus").textContent = text;
  document.querySelector(".dot")?.classList.toggle("connected", connected);
}

function greet() {
  const hour = new Date().getHours();
  const text = hour < 12 ? "Good morning, Teddy" : hour < 18 ? "Good afternoon, Teddy" : "Good evening, Teddy";
  $("greeting").textContent = text;
}

function daysBetween(dateString, now = new Date()) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateString, now = new Date()) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

function getName(obj, fallback = "—") {
  if (!obj) return fallback;
  if (typeof obj === "string") return obj;
  return obj.name || fallback;
}

function bucketForStage(stage) {
  for (const [bucket, stages] of Object.entries(STAGE_BUCKETS)) {
    if (stages.includes(stage)) return bucket;
  }
  return "other";
}

function countryFlag(country) {
  const map = {
    "United Kingdom": "🇬🇧",
    "UK": "🇬🇧",
    "Australia": "🇦🇺",
    "New Zealand": "🇳🇿",
    "Canada": "🇨🇦",
    "USA": "🇺🇸",
    "Malaysia": "🇲🇾",
    "Singapore": "🇸🇬",
    "Europe": "🇪🇺",
    "Ireland": "🇮🇪",
    "Japan": "🇯🇵",
    "China": "🇨🇳",
    "Taiwan": "🇹🇼",
    "Korea": "🇰🇷"
  };
  return map[country] || "🌐";
}

function urgencyScore(deal) {
  const reasons = [];
  let score = 0;

  const stage = deal.Stage || "";
  const bucket = bucketForStage(stage);
  const stageAge = daysBetween(deal.Stage_Modified_Time || deal.Modified_Time || deal.Created_Time);
  const lastActivityAge = daysBetween(deal.Last_Activity_Time || deal.Modified_Time);
  const intakeStart = deal.Start_Date || null;
  const daysToStart = daysUntil(intakeStart);

  if (deal.Priority === true) {
    score += 35;
    reasons.push("Marked priority");
  }

  const priorityLevel = deal.Priority_Level;
  if (priorityLevel === "1") { score += 30; reasons.push("Priority level 1"); }
  if (priorityLevel === "2") { score += 20; reasons.push("Priority level 2"); }
  if (priorityLevel === "3") { score += 10; reasons.push("Priority level 3"); }

  if (stage === "Pending Offer (8 weeks passed)") {
    score += 45;
    reasons.push("Offer pending over 8 weeks");
  } else if (stage === "Pending Offer (3 weeks passed)") {
    score += 30;
    reasons.push("Offer pending over 3 weeks");
  }

  if (bucket === "cas" && stageAge !== null && stageAge >= 7) {
    score += 25;
    reasons.push(`CAS / COE stage for ${stageAge} days`);
  }

  if (bucket === "applications" && stageAge !== null && stageAge >= 14) {
    score += 18;
    reasons.push(`Application stage for ${stageAge} days`);
  }

  if (lastActivityAge !== null && lastActivityAge >= 7 && !["won", "lost"].includes(bucket)) {
    score += 18;
    reasons.push(`No recent activity for ${lastActivityAge} days`);
  }

  if (daysToStart !== null && daysToStart >= 0 && daysToStart <= 60 && !["won", "lost"].includes(bucket)) {
    score += 25;
    reasons.push(`Intake starts in ${daysToStart} days`);
  }

  if (deal.Request && String(deal.Request).trim()) {
    score += 12;
    reasons.push("Outstanding request description");
  }

  if (score >= 70) return { level: "Critical", color: "red", score, reasons };
  if (score >= 40) return { level: "High", color: "orange", score, reasons };
  if (score >= 20) return { level: "Watch", color: "yellow", score, reasons };
  return { level: "On track", color: "green", score, reasons };
}

function normalizeDeal(deal) {
  const stage = deal.Stage || "Unknown";
  const bucket = bucketForStage(stage);
  const urgency = urgencyScore(deal);

  const student = getName(deal.Contact_Name, "Unknown student");
  const university = getName(deal.Account_Name, "No institution");
  const owner = getName(deal.Owner, "Unassigned");
  const course = deal.Course_Title || deal.Program || deal.Deal_Name || "No course";
  const country = deal.Country || "—";
  const intake = [deal.Intake_Month, deal.Intake_Year].filter(Boolean).join(" ") || "No intake";
  const stageAge = daysBetween(deal.Stage_Modified_Time || deal.Modified_Time || deal.Created_Time);
  const startCountdown = daysUntil(deal.Start_Date);

  return {
    raw: deal,
    id: deal.id,
    student,
    university,
    owner,
    course,
    country,
    flag: countryFlag(country),
    intake,
    stage,
    bucket,
    urgency,
    stageAge,
    startCountdown,
    zia: deal.Zia_Score,
    lastActivity: deal.Last_Activity_Time,
    searchText: [student, university, course, country, intake, stage, owner].join(" ").toLowerCase()
  };
}

function buildKpis(items) {
  const counts = Object.fromEntries(KPI_DEFS.map(k => [k.key, 0]));

  for (const item of items) {
    if (item.urgency.score >= 40) counts.urgent += 1;
    if (counts[item.bucket] !== undefined) counts[item.bucket] += 1;
  }

  $("kpiGrid").innerHTML = KPI_DEFS.map(k => `
    <div class="kpi">
      <div class="icon">${k.icon}</div>
      <div class="label">${k.label}</div>
      <div class="value">${counts[k.key] || 0}</div>
    </div>
  `).join("");

  $("headline").textContent = `${counts.urgent || 0} cases need attention today`;
  $("subheadline").textContent = `${items.length} Deals loaded · ${counts.cas || 0} CAS / COE · ${counts.visa || 0} visa queue`;
}

function renderOwnerFilter(items) {
  const owners = [...new Set(items.map(i => i.owner).filter(Boolean))].sort();
  const current = state.filters.owner;
  $("ownerFilter").innerHTML = `<option value="all">All Counsellors</option>` +
    owners.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
  $("ownerFilter").value = owners.includes(current) ? current : "all";
}

function filteredItems() {
  const search = state.filters.search.trim().toLowerCase();
  return state.processed.filter(item => {
    if (state.filters.owner !== "all" && item.owner !== state.filters.owner) return false;
    if (state.filters.bucket === "urgent" && item.urgency.score < 40) return false;
    if (state.filters.bucket !== "all" && state.filters.bucket !== "urgent" && item.bucket !== state.filters.bucket) return false;
    if (search && !item.searchText.includes(search)) return false;
    return true;
  }).sort((a, b) => {
    const score = b.urgency.score - a.urgency.score;
    if (score !== 0) return score;
    return (b.stageAge || 0) - (a.stageAge || 0);
  });
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[ch]));
}

function renderCases() {
  const items = filteredItems();
  const container = $("caseList");

  if (!items.length) {
    container.innerHTML = `<div class="empty">No matching cases found.</div>`;
    return;
  }

  container.innerHTML = items.slice(0, 80).map(item => {
    const reasons = item.urgency.reasons.length
      ? `<ul class="reason-list">${item.urgency.reasons.slice(0, 3).map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>`
      : "";

    const stageAgeText = item.stageAge !== null ? `${item.stageAge}d in stage` : "Stage age n/a";
    const startText = item.startCountdown !== null
      ? (item.startCountdown >= 0 ? `Starts in ${item.startCountdown}d` : `Started ${Math.abs(item.startCountdown)}d ago`)
      : item.intake;

    return `
      <article class="case-card" data-id="${escapeHtml(item.id)}">
        <div class="case-top">
          <div>
            <div class="student-name">${escapeHtml(item.student)}</div>
            <div class="meta">
              ${escapeHtml(item.flag)} ${escapeHtml(item.university)} · ${escapeHtml(item.course)}<br/>
              ${escapeHtml(item.owner)}
            </div>
            <div class="badges">
              <span class="badge ${item.urgency.color}">${escapeHtml(item.urgency.level)}</span>
              <span class="badge blue">${escapeHtml(item.stage)}</span>
              <span class="badge">${escapeHtml(item.country)}</span>
              <span class="badge">${escapeHtml(startText)}</span>
              <span class="badge purple">${escapeHtml(stageAgeText)}</span>
            </div>
          </div>
          <div class="score">
            <strong>${item.urgency.score}</strong>
            <span>health risk</span>
          </div>
        </div>
        ${reasons}
      </article>
    `;
  }).join("");

  container.querySelectorAll(".case-card").forEach(card => {
    card.addEventListener("click", () => openDeal(card.dataset.id));
  });
}

function renderWorkload(items) {
  const groups = {};
  for (const i of items) {
    if (!groups[i.owner]) groups[i.owner] = { total: 0, urgent: 0 };
    groups[i.owner].total += 1;
    if (i.urgency.score >= 40) groups[i.owner].urgent += 1;
  }

  $("ownerWorkload").innerHTML = Object.entries(groups)
    .sort((a,b) => b[1].urgent - a[1].urgent || b[1].total - a[1].total)
    .slice(0, 10)
    .map(([owner, v]) => `
      <div class="workload-row">
        <strong>${escapeHtml(owner)}</strong>
        <span>${v.urgent} urgent · ${v.total} total</span>
      </div>
    `).join("") || `<div class="empty">No workload data.</div>`;
}

function renderSnapshot(items) {
  const order = [
    ["applications", "Applications"],
    ["offer", "Offer"],
    ["cas", "CAS / COE / Visa Letter"],
    ["visa", "Visa Queue"],
    ["won", "Approved / Won"],
    ["lost", "Lost / Deferred"],
    ["other", "Other"]
  ];
  const counts = {};
  for (const i of items) counts[i.bucket] = (counts[i.bucket] || 0) + 1;

  $("stageSnapshot").innerHTML = order.map(([key, label]) => `
    <div class="snapshot-row">
      <strong>${escapeHtml(label)}</strong>
      <span>${counts[key] || 0}</span>
    </div>
  `).join("");
}

function renderAll() {
  buildKpis(state.processed);
  renderOwnerFilter(state.processed);
  renderCases();
  renderWorkload(state.processed);
  renderSnapshot(state.processed);
}

async function loadDeals() {
  setStatus("Loading Deals…");
  log("Starting data load. SDK present?", { ZOHO: !!window.ZOHO, CRM: !!window.ZOHO?.CRM });

  try {
    if (!window.ZOHO || !window.ZOHO.CRM) {
      throw new Error("ZOHO CRM SDK not available.");
    }

    const all = [];
    for (let page = 1; page <= 4; page++) {
      const response = await ZOHO.CRM.API.getAllRecords({
        Entity: "Deals",
        sort_order: "desc",
        sort_by: "Modified_Time",
        page,
        per_page: 200
      });

      log(`getAllRecords page ${page}`, response);

      const rows = response?.data || [];
      all.push(...rows);
      if (rows.length < 200) break;
    }

    state.deals = all;
    state.processed = all.map(normalizeDeal);

    setStatus(`Connected · ${all.length} Deals loaded`, true);
    renderAll();
  } catch (err) {
    console.error(err);
    setStatus("Error loading CRM data");
    log("ERROR", { message: err.message, stack: err.stack });
    $("caseList").innerHTML = `<div class="empty">Could not load Deals. Open Debug Log below.</div>`;
  }
}

function openDeal(id) {
  if (!id) return;
  log("Opening deal", { id });
  try {
    if (ZOHO?.CRM?.UI?.Record?.open) {
      ZOHO.CRM.UI.Record.open({ Entity: "Deals", RecordID: id });
      return;
    }
  } catch (e) {
    log("Record open API failed, falling back", e.message);
  }
  window.open(`/crm/org/current/tab/Potentials/${id}`, "_blank");
}

function bindEvents() {
  $("refreshBtn").addEventListener("click", loadDeals);

  $("newStudentBtn").addEventListener("click", () => {
    try {
      if (ZOHO?.CRM?.UI?.Record?.create) {
        ZOHO.CRM.UI.Record.create({ Entity: "Deals" });
        return;
      }
    } catch (e) {
      log("Create record API failed", e.message);
    }
    window.open(`/crm/org/current/tab/Potentials/create`, "_blank");
  });

  $("ownerFilter").addEventListener("change", e => {
    state.filters.owner = e.target.value;
    renderCases();
  });

  $("bucketFilter").addEventListener("change", e => {
    state.filters.bucket = e.target.value;
    renderCases();
  });

  $("searchInput").addEventListener("input", e => {
    state.filters.search = e.target.value;
    renderCases();
  });

  document.querySelectorAll(".quick-actions button").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (["cas", "offer", "visa", "urgent"].includes(action)) {
        state.filters.bucket = action;
        $("bucketFilter").value = action;
        renderCases();
      } else {
        alert("Coming in TED OS v3: " + btn.textContent.trim());
      }
    });
  });
}

function init() {
  greet();
  bindEvents();

  if (window.ZOHO && ZOHO.embeddedApp) {
    ZOHO.embeddedApp.on("PageLoad", function(data) {
      log("PageLoad received", data || {});
    });

    ZOHO.embeddedApp.init()
      .then(function(result) {
        log("embeddedApp.init completed", result || "OK");
        loadDeals();
      })
      .catch(function(err) {
        log("embeddedApp.init failed", err);
        loadDeals();
      });
  } else {
    log("Zoho SDK not detected on initial load");
    setStatus("Zoho SDK not detected");
  }
}

document.addEventListener("DOMContentLoaded", init);
