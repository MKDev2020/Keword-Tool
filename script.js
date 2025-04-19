document.getElementById("runButton").addEventListener("click", highlightKeywords);

function highlightKeywords() {
  const article = document.getElementById("article").value.toLowerCase();
  
  // Split keywords and clean them up
  const tableKeywords = cleanKeywords(document.getElementById("tableKeywords").value);
  const lsiKeywords = cleanKeywords(document.getElementById("lsiKeywords").value);
  const sectionKeywords = cleanKeywords(document.getElementById("sectionKeywords").value);

  const allKeywords = [...tableKeywords, ...lsiKeywords, ...sectionKeywords];
  
  let output = article;
  const keywordCounts = {}; // To keep track of counts for each keyword

  // Clear previous summary
  const summaryTable = document.getElementById("summary");
  summaryTable.innerHTML = `
    <tr>
      <th>Keyword</th>
      <th>Count</th>
      <th>Color</th>
      <th>Type</th>
    </tr>
  `;

  // Process each keyword and highlight
  allKeywords.forEach(keyword => {
    if (keyword !== "") {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, "g");
      let count = 0;

      output = output.replace(keywordRegex, (match) => {
        count++;
        return `<span class="keyword" style="background-color: ${getColorForKeyword(keyword)};">${match}</span>`;
      });

      if (count > 0) {
        keywordCounts[keyword] = count;
      }
    }
  });

  // Display the highlighted article
  document.getElementById("output").innerHTML = output;

  // Update summary table with keyword counts
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

function cleanKeywords(input) {
  return input.split("\n")
    .map(keyword => keyword.trim().toLowerCase())
    .filter(keyword => keyword !== ""); // Remove empty lines
}

function getColorForKeyword(keyword) {
  const tableKeywords = document.getElementById("tableKeywords").value.split("\n").map(k => k.trim().toLowerCase());
  const lsiKeywords = document.getElementById("lsiKeywords").value.split("\n").map(k => k.trim().toLowerCase());
  const sectionKeywords = document.getElementById("sectionKeywords").value.split("\n").map(k => k.trim().toLowerCase());

  if (tableKeywords.includes(keyword)) {
    return '#FFD700'; // Yellow for table-related keywords
  } else if (lsiKeywords.includes(keyword)) {
    return '#98C7E4'; // Light Blue for LSI keywords
  } else if (sectionKeywords.includes(keyword)) {
    return '#D1F7A1'; // Light Green for section-specific keywords
  }
  return '#FFFFFF'; // Default color
}

function getKeywordType(keyword) {
  const tableKeywords = document.getElementById("tableKeywords").value.split("\n").map(k => k.trim().toLowerCase());
  const lsiKeywords = document.getElementById("lsiKeywords").value.split("\n").map(k => k.trim().toLowerCase());
  const sectionKeywords = document.getElementById("sectionKeywords").value.split("\n").map(k => k.trim().toLowerCase());

  if (tableKeywords.includes(keyword)) {
    return "Table";
  } else if (lsiKeywords.includes(keyword)) {
    return "LSI";
  } else if (sectionKeywords.includes(keyword)) {
    return "Section";
  }
  return "Unknown";
}
