const searchInput = document.getElementById("symptom-search");
const chipInputs = document.querySelectorAll(".chip-input");
const selectedCount = document.getElementById("selected-count");
const runBtn = document.getElementById("run-btn");
const results = document.getElementById("results");
const triageBanner = document.getElementById("triage-banner");
const diseaseList = document.getElementById("disease-list");
const errorMsg = document.getElementById("error-msg");

function updateSelectedCount() {
  const n = document.querySelectorAll(".chip-input:checked").length;
  selectedCount.textContent = n === 1 ? "1 symptom selected" : `${n} symptoms selected`;
  runBtn.disabled = n === 0;
}

chipInputs.forEach((input) => input.addEventListener("change", updateSelectedCount));

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".chip-wrap").forEach((wrap) => {
    const label = wrap.dataset.label;
    wrap.classList.toggle("hidden", query.length > 0 && !label.includes(query));
  });
});

function renderResults(data) {
  errorMsg.classList.add("hidden");

  const { level, message } = data.triage;
  triageBanner.className = `triage-banner ${level}`;
  const levelLabel = { emergency: "Emergency", urgent: "Urgent", moderate: "Moderate", routine: "Routine" }[level];
  triageBanner.innerHTML = `<strong>${levelLabel}</strong>${message}`;

  diseaseList.innerHTML = "";
  if (data.results.length === 0) {
    diseaseList.innerHTML = `<p class="matched-symptoms">No confident match found for these symptoms \u2014 consider consulting a doctor for a proper evaluation.</p>`;
  } else {
    data.results.forEach((r) => {
      const card = document.createElement("div");
      card.className = "disease-card";
      card.innerHTML = `
        <div class="disease-card-top">
          <h3>${r.disease}</h3>
          <span>${r.confidence}% match</span>
        </div>
        <div class="confidence-track"><div class="confidence-fill" style="width:0%"></div></div>
        <div class="matched-symptoms">Matched: ${r.matched_symptoms.join(", ").replace(/_/g, " ")}</div>
      `;
      diseaseList.appendChild(card);
      requestAnimationFrame(() => {
        card.querySelector(".confidence-fill").style.width = `${r.confidence}%`;
      });
    });
  }

  results.classList.remove("hidden");
  requestAnimationFrame(() => results.classList.add("visible"));
}

runBtn.addEventListener("click", async () => {
  const symptoms = Array.from(document.querySelectorAll(".chip-input:checked")).map((i) => i.value);
  runBtn.disabled = true;
  runBtn.textContent = "Analyzing\u2026";

  try {
    const res = await fetch("/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.error || "Something went wrong. Please try again.";
      errorMsg.classList.remove("hidden");
      results.classList.add("hidden");
      results.classList.remove("visible");
    } else {
      renderResults(data);
    }
  } catch (err) {
    errorMsg.textContent = "Couldn't reach the server. Check that the app is running and try again.";
    errorMsg.classList.remove("hidden");
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "Run diagnosis";
  }
});
