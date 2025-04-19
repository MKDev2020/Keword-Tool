let keywordCounts = {};  // Declare global variable for keyword counts

// Highlight keywords and display counts when "Run" button is clicked
function highlightKeywords() {
  const article = document.getElementById('article').value;
  const tableKeywords = document.getElementById('tableKeywords').value.split('\n').map(kw => kw.trim());
  const lsiKeywords = document.getElementById('lsiKeywords').value.split('\n').map(kw => kw.trim());
  const sectionKeywords = document.getElementById('sectionKeywords').value.split('\n').map(kw => kw.trim());

  keywordCounts = {};  // Reset keyword counts

  // Count occurrences of each keyword in the article
  function countKeywordOccurrences(keywords) {
    keywords.forEach(keyword => {
      if (keyword) {
        const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
        const matches = article.match(regex); // Find all occurrences of the keyword
        const count = matches ? matches.length : 0;
        if (count > 0) {
          keywordCounts[keyword] = count;
        }
      }
    });
  }

  countKeywordOccurrences(tableKeywords);
  countKeywordOccurrences(lsiKeywords);
  countKeywordOccurrences(sectionKeywords);

  // After counting, display the keyword counts and summary
  displaySummary();
}

// Helper function to escape special characters in the regex
function escapeRegExp(str) {
  return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

// Display the keyword counts in the table
function displaySummary() {
  const summaryTable = document.getElementById('summary');
  summaryTable.innerHTML = `
    <tr>
      <th>Keyword</th>
      <th>Count</th>
      <th>Color</th>
      <th>Type</th>
    </tr>
  `;

  // Iterate over all the counted keywords and display them in the table
  for (const keyword in keywordCounts) {
    const count = keywordCounts[keyword];
    let color = '';

    if (tableKeywords.includes(keyword)) {
      color = 'yellow';
    } else if (lsiKeywords.includes(keyword)) {
      color = 'lightblue';
    } else if (sectionKeywords.includes(keyword)) {
      color = 'lightgreen';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="color-box" style="background-color:${color};"></span>${keyword}</td>
      <td>${count}</td>
      <td>${color}</td>
      <td>${color ? color.charAt(0).toUpperCase() + color.slice(1) : 'None'}</td>
    `;
    summaryTable.appendChild(row);
  }
}

// Add event listener to the Run button for triggering the highlightKeywords function
document.getElementById('runButton').addEventListener('click', highlightKeywords);

// For the copy button functionality:
function copyToClipboard() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Text copied to clipboard!');
  });
}
