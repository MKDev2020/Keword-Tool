function highlightKeywords() {
  const article = document.getElementById('article').value;
  const tableKeywords = document.getElementById('tableKeywords').value.split('\n').map(kw => kw.trim());
  const lsiKeywords = document.getElementById('lsiKeywords').value.split('\n').map(kw => kw.trim());
  const sectionKeywords = document.getElementById('sectionKeywords').value.split('\n').map(kw => kw.trim());

  let keywordCounts = {};

  // Count occurrences of each keyword in the article
  function countKeywordOccurrences(keywords) {
    keywords.forEach(keyword => {
      if (keyword) {
        const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
        const matches = article.match(regex);
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

  displaySummary();
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

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

function copyToClipboard() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Text copied to clipboard!');
  });
}
