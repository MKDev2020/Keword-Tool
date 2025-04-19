function highlightKeywords() {
  // Get article content and keyword lists
  const article = document.getElementById("article").value.toLowerCase();
  const tableKeywords = document.getElementById("tableKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const lsiKeywords = document.getElementById("lsiKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const sectionKeywords = document.getElementById("sectionKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());

  const allKeywords = [...tableKeywords, ...lsiKeywords, ...sectionKeywords];
  
  let output = article;
  
  // Count and highlight keywords
  const keywordCounts = {};

  allKeywords.forEach(keyword => {
    if (keyword !== "") {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, "g");
      const count = (article.match(keywordRegex) || []).length;
      keywordCounts[keyword] = count;
      const highlightedKeyword = `<span class="keyword" style="background-color: ${getColorForKeyword(keyword)};">${keyword}</span>`;
      output = output.replace(new RegExp(`\\b${keyword}\\b`, "g"), highlightedKeyword);
    }
  });

  // Display the output with highlighted keywords
  document.getElementById("output").innerHTML = output;

  // Display summary
  const summaryTable = document.getElementById("summary");
  summaryTable.innerHTML = `
    <tr>
      <th>Keyword</th>
      <th>Count</th>
      <th>Color</th>
      <th>Type</th>
    </tr>
  `;
  allKeywords.forEach(keyword => {
    if (keywordCounts[keyword] > 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${keyword}</td>
        <td>${keywordCounts[keyword]}</td>
        <td><span class="color-box" style="background-color: ${getColorForKeyword(keyword)};"></span></td>
        <td>${getKeywordType(keyword)}</td>
      `;
      summaryTable.appendChild(row);
    }
  });
}

function getColorForKeyword(keyword) {
  const tableKeywords = document.getElementById("tableKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const lsiKeywords = document.getElementById("lsiKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const sectionKeywords = document.getElementById("sectionKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());

  if (tableKeywords.includes(keyword)) return "#FFD700"; // Yellow for Table Keywords
  if (lsiKeywords.includes(keyword)) return "#98C7E4"; // Light Blue for LSI Keywords
  if (sectionKeywords.includes(keyword)) return "#D1F7A1"; // Light Green for Section Keywords
  return "#FFFFFF"; // Default
}

function getKeywordType(keyword) {
  const tableKeywords = document.getElementById("tableKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const lsiKeywords = document.getElementById("lsiKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const sectionKeywords = document.getElementById("sectionKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());

  if (tableKeywords.includes(keyword)) return "Table Keyword";
  if (lsiKeywords.includes(keyword)) return "LSI Keyword";
  if (sectionKeywords.includes(keyword)) return "Section Keyword";
  return "Unknown";
}

function copyToClipboard() {
  const outputText = document.getElementById("output").innerText;
  const textarea = document.createElement("textarea");
  textarea.value = outputText;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
