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
  const article = document.getElementById("articleInput").value;
  const mainKws = document.getElementById("mainKeywords").value.trim().split("\n").filter(Boolean);
  const lsiKws = document.getElementById("lsiKeywords").value.trim().split("\n").filter(Boolean);
  const sectionKws = document.getElementById("sectionKeywords").value.trim().split("\n").filter(Boolean);

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

// Copy text to clipboard
function copyToClipboard() {
  const el = document.createElement("textarea");
  el.value = document.getElementById("output").innerHTML;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  alert("HTML copied! Paste into a Google Doc using Ctrl+Shift+V for clean formatting.");
}

// Bold, Italic, Underline, Font Size, Font Family, etc.
function applyFormat(command) {
  document.execCommand(command, false, null);
}

// Font Size Increase/Decrease
function changeFontSize(action) {
  let fontSize = window.getComputedStyle(document.getElementById('articleInput')).fontSize;
  fontSize = parseInt(fontSize, 10);

  if (action === "increase" && fontSize < 24) {
    fontSize += 1;
  } else if (action === "decrease" && fontSize > 10) {
    fontSize -= 1;
  }

  document.getElementById("articleInput").style.fontSize = fontSize + "px";
}

// Set Font Family
function setFontFamily(font) {
  document.getElementById("articleInput").style.fontFamily = font;
}

// Set Font Size from Dropdown
function setFontSize(size) {
  document.getElementById("articleInput").style.fontSize = size + "px";
}

// Set Text Color
function setTextColor(color) {
  document.getElementById("articleInput").style.color = color;
}

// Set Background Color
function setBackgroundColor(color) {
  document.getElementById("articleInput").style.backgroundColor = color;
}

// Add event listeners for buttons
document.getElementById("boldBtn").addEventListener("click", () => applyFormat("bold"));
document.getElementById("italicBtn").addEventListener("click", () => applyFormat("italic"));
document.getElementById("underlineBtn").addEventListener("click", () => applyFormat("underline"));
document.getElementById("increaseFontBtn").addEventListener("click", () => changeFontSize("increase"));
document.getElementById("decreaseFontBtn").addEventListener("click", () => changeFontSize("decrease"));
document.getElementById("fontSelect").addEventListener("change", (e) => setFontFamily(e.target.value));
document.getElementById("fontSizeSelect").addEventListener("change", (e) => setFontSize(e.target.value));
document.getElementById("textColorSelect").addEventListener("change", (e) => setTextColor(e.target.value));
document.getElementById("bgColorSelect").addEventListener("change", (e) => setBackgroundColor(e.target.value));

