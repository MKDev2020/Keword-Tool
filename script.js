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

// Keyword highlighting
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

// Rendering Keyword Legend
function renderLegend(keywords) {
  const legendContainer = document.getElementById("legend");
  legendContainer.innerHTML = "";

  const unique = [];
  keywords.forEach(({ type, kw, color }) => {
    if (!unique.find(k => k.kw === kw)) {
      unique.push({ type, kw, color });
    }
  });

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

// Copy to Clipboard
function copyToClipboard() {
  const el = document.createElement("textarea");
  el.value = document.getElementById("output").innerHTML;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  alert("HTML copied! Paste into a Google Doc using Ctrl+Shift+V for clean formatting.");
}

// Text Formatting Functions
function setTextBold() {
  document.execCommand("bold");
}

function setTextItalic() {
  document.execCommand("italic");
}

function setTextUnderline() {
  document.execCommand("underline");
}

function increaseFontSize() {
  const article = document.getElementById("articleInput");
  const style = window.getComputedStyle(article);
  const currentSize = parseInt(style.fontSize, 10);
  article.style.fontSize = (currentSize + 1) + "px";
}

function decreaseFontSize() {
  const article = document.getElementById("articleInput");
  const style = window.getComputedStyle(article);
  const currentSize = parseInt(style.fontSize, 10);
  article.style.fontSize = (currentSize - 1) + "px";
}

function setFontSize(fontSize) {
  document.getElementById("articleInput").style.fontSize = fontSize + "px";
}

function setFontFamily(font) {
  document.getElementById("articleInput").style.fontFamily = font;
}

function setTextColor(color) {
  document.getElementById("articleInput").style.color = color;
}

function setTextHighlight(color) {
  document.getElementById("articleInput").style.backgroundColor = color;
}
