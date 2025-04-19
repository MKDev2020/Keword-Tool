// Keyword Analysis and Editor Tool

document.getElementById("analyzeButton").addEventListener("click", analyzeKeywords);
document.getElementById("copyButton").addEventListener("click", copyFormattedText);

function getKeywordsFromInput(id) {
  return document.getElementById(id)
    .value.split(",")
    .map((kw) => kw.trim().toLowerCase())
    .filter((kw) => kw);
}

function countKeywordOccurrences(text, keywords) {
  const counts = {};
  const cleanText = text.replace(/<[^>]*>/g, " ").toLowerCase();

  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "gi");
    const matches = cleanText.match(regex);
    counts[kw] = matches ? matches.length : 0;
  });
  return counts;
}

function analyzeKeywords() {
  const articleText = document.getElementById("articleInput").value;
  const tableKeywords = getKeywordsFromInput("tableKeywords");
  const lsiKeywords = getKeywordsFromInput("lsiKeywords");
  const sectionKeywords = getKeywordsFromInput("sectionKeywords");

  const outputArea = document.getElementById("output");
  let highlightedText = articleText;

  const allKeywords = [
    { keywords: tableKeywords, className: "highlight yellow" },
    { keywords: lsiKeywords, className: "highlight purple" },
    { keywords: sectionKeywords, className: "bolded" },
  ];

  allKeywords.forEach(({ keywords, className }) => {
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})\\b`, "gi");
      highlightedText = highlightedText.replace(regex, `<span class="${className}">$1</span>`);
    });
  });

  outputArea.innerHTML = highlightedText;
  generateSummary(articleText, tableKeywords, lsiKeywords, sectionKeywords);
}

function generateSummary(text, tableKWs, lsiKWs, sectionKWs) {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = "";

  const allTypes = [
    { name: "Table Keywords", keywords: tableKWs },
    { name: "LSI Keywords", keywords: lsiKWs },
    { name: "Section-Specific Keywords", keywords: sectionKWs },
  ];

  allTypes.forEach(({ name, keywords }) => {
    const counts = countKeywordOccurrences(text, keywords);
    const section = document.createElement("div");
    section.innerHTML = `<h4>${name}</h4>`;

    const list = document.createElement("ul");
    keywords.forEach((kw) => {
      const count = counts[kw];
      const density = ((count / text.split(" ").length) * 100).toFixed(2);
      const item = document.createElement("li");
      item.textContent = `${kw}: ${count} occurrence(s), Density: ${density}%`;
      list.appendChild(item);
    });

    section.appendChild(list);
    summaryDiv.appendChild(section);
  });
}

function copyFormattedText() {
  const output = document.getElementById("output");
  const range = document.createRange();
  range.selectNodeContents(output);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand("copy");
    alert("Formatted article copied to clipboard!");
  } catch (err) {
    alert("Failed to copy. Please try manually.");
  }

  selection.removeAllRanges();
}
