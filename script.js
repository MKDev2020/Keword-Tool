function highlightKeywords() {
  // Get article content and keyword lists
  const article = document.getElementById("article").value.toLowerCase();
  const tableKeywords = document.getElementById("tableKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const lsiKeywords = document.getElementById("lsiKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());
  const sectionKeywords = document.getElementById("sectionKeywords").value.split("\n").map(keyword => keyword.trim().toLowerCase());

  const allKeywords = [...tableKeywords, ...lsiKeywords, ...sectionKeywords];
  
  let output = article; // The text will be modified here to highlight keywords
  const keywordCounts = {}; // To keep track of counts for each keyword

  // Clear previous summary in the table
  const summaryTable = document.getElementById("summary");
  summaryTable.innerHTML = `
    <tr>
      <th>Keyword</th>
      <th>Count</th>
      <th>Color</th>
      <th>Type</th>
    </tr>
  `;

  // Process each keyword
  allKeywords.forEach(keyword => {
    if (keyword !== "") {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, "g"); // Match whole words only
      let count = 0;

      // Highlight and count keywords
      output = output.replace(keywordRegex, (match) => {
        count++; // Increment count for each match
        return `<span class="keyword" style="background-color: ${getColorForKeyword(keyword)};">${match}</span>`;
      });

      if (count > 0) {
        keywordCounts[keyword] = count; // Save the count for the keyword
      }
    }
  });

  // Display the output with highlighted keywords
  document.getElementById("output").innerHTML = output;

  // Update the summary table with the keyword counts
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

// Helper function to get a color for a keyword
function getColorForKeyword(keyword) {
  // You can define your own color logic here based on the keyword
  if (tableKeywords.includes(keyword)) {
    return "#FFD700"; // Yellow for table-related keywords
  } else if (lsiKeywords.includes(keyword)) {
    return "#98C7E4"; // Light Blue for LSI keywords
  } else if (sectionKeywords.includes(keyword)) {
    return "#D1F7A1"; // Light Green for section-related keywords
  }
  return "#C0C0C0"; // Default color for other keywords
}

// Helper function to get the type of keyword
function getKeywordType(keyword) {
  if (tableKeywords.includes(keyword)) {
    return "Table Keyword";
  } else if (lsiKeywords.includes(keyword)) {
    return "LSI Keyword";
  } else if (sectionKeywords.includes(keyword)) {
    return "Section Keyword";
  }
  return "Unknown Type";
}
