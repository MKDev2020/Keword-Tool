const colors = [
  "#fbc531", "#4cd137", "#00a8ff", "#9c88ff", "#e84118",
  "#00cec9", "#fab1a0", "#74b9ff", "#e84393", "#a29bfe"
];

let keywordColors = {};
let colorIndex = 0;

function getColorForKeyword(keyword) {
  if (!keywordColors[keyword]) {
    keywordColors[keyword] = colors[colorIndex % colors.length];
    colorIndex++;
  }
  return keywordColors[keyword];
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText() {
  const article = document.getElementById("articleText").value;  // Match with HTML ID
  const mainKws = document.getElementById("mainKws").value.trim().split("\n").filter(Boolean);  // Match with HTML ID
  const lsiKws = document.getElementById("lsiKws").value.trim().split("\n").filter(Boolean);  // Match with HTML ID
  const sectionKws = document.getElementById("sectionKws").value.trim().split("\n").filter(Boolean);  // Match with HTML ID

  let output = article;

  keywordColors = {};
  colorIndex = 0;

  const allKeywords = [];

  mainKws.forEach(kw => {
    const color = getColorForKeyword(kw);
    const regex = new RegExp(`\\b(${escapeRegExp(kw)})\\b`, "gi");
    output = output.replace(regex, `<span class="highlight" style="background-color:${color}">$1</span>`);
    allKeywords.push({ type: "Main", kw, color });
  });

  lsiKws.forEach(kw => {
    const color = "#dcd6f7";
    const regex = new RegExp(`\\b(${escapeRegExp(kw)})\\b`, "gi");
    output = output.replace(regex, `<span class="highlight" style="background-color:${color}">$1</span>`);
    allKeywords.push({ type: "LSI", kw, color });
  });

  sectionKws.forEach(kw => {
    const regex = new RegExp(`\\b(${escapeRegExp(kw)})\\b`, "gi");
    output = output.replace(regex, `<span class="bolded">$1</span>`);
    allKeywords.push({ type: "Section", kw, color: "bold" });
  });

  document.getElementById("output").innerHTML = output;
  renderLegend(allKeywords);
}

function renderLegend(keywords) {
  const legendContainer = document.getElementById("legend");
  legendContainer.innerHTML = "";

  // Remove duplicates
  const unique = [];
  keywords.forEach(({ type, kw, color }) => {
    if (!unique.find(k => k.kw === kw)) {
      unique.push({ type, kw, color });
    }
  });

  // Sort by type: Main → LSI → Section
  const typeOrder = { "Main": 0, "LSI": 1, "Section": 2 };
  unique.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

  unique.forEach(({ kw, color }) => {
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.background = (color === "bold") ? "#2f3640" : color;

    const label = document.createElement("span");
    label.textContent = kw;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);

    legendContainer.appendChild(legendItem);
  });
}

function copyToClipboard() {
  const el = document.createElement("textarea");
  el.value = document.getElementById("output").innerHTML;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  alert("HTML copied! Paste into a Google Doc using Ctrl+Shift+V for clean formatting.");
}

// Add event listeners for button clicks
document.getElementById("highlightBtn").addEventListener("click", highlightText);
document.getElementById("copyBtn").addEventListener("click", copyToClipboard);
