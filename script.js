function highlightKeywords() {
  const article = document.getElementById('article').value;

  const tableKeywords = document.getElementById('tableKeywords').value
    .split('\n')
    .map(k => k.trim().toLowerCase())
    .filter(k => k);

  const lsiKeywords = document.getElementById('lsiKeywords').value
    .split('\n')
    .map(k => k.trim().toLowerCase())
    .filter(k => k);

  const sectionKeywords = document.getElementById('sectionKeywords').value
    .split('\n')
    .map(k => k.trim().toLowerCase())
    .filter(k => k);

  // Define specific colors for each type of keyword list
  const keywordColors = {
    table: '#FFD700',  // Gold for Table Keywords
    lsi: '#98C7E4',    // Light Blue for LSI Keywords
    section: '#D1F7A1' // Light Green for Section Keywords
  };

  const summary = {
    table: {},
    lsi: {},
    section: {}
  };

  function highlightKeyword(kw, color) {
    const pattern = new RegExp(`(?<!\\w)${kw}(?!\\w)`, 'gi');
    return (text) => {
      return text.replace(pattern, `<span class="keyword" style="background-color:${color}">${kw}</span>`);
    };
  }

  let workingText = ` ${article} `;
  let highlightedText = workingText;

  // Highlight table keywords
  tableKeywords.forEach(kw => {
    highlightedText = highlightKeyword(kw, keywordColors.table)(highlightedText);
    summary.table[kw] = (summary.table[kw] || 0) + 1;
  });

  // Highlight LSI keywords
  lsiKeywords.forEach(kw => {
    highlightedText = highlightKeyword(kw, keywordColors.lsi)(highlightedText);
    summary.lsi[kw] = (summary.lsi[kw] || 0) + 1;
  });

  // Highlight section-specific keywords
  sectionKeywords.forEach(kw => {
    highlightedText = highlightKeyword(kw, keywordColors.section)(highlightedText);
    summary.section[kw] = (summary.section[kw] || 0) + 1;
  });

  // Display highlighted article
  document.getElementById('output').innerHTML = highlightedText.trim();

  // Build the summary table
  let tableHTML = "<tr><th>Keyword</th><th>Count</th><th>Color</th><th>Type</th></tr>";

  function buildSummaryRow(kw, count, color, type) {
    return `<tr>
              <td>${kw}</td>
              <td>${count}</td>
              <td><span class="color-box" style="background:${color}"></span></td>
              <td>${type}</td>
            </tr>`;
  }

  // Add table keyword rows
  for (let kw in summary.table) {
    tableHTML += buildSummaryRow(kw, summary.table[kw], keywordColors.table, 'Table Keyword');
  }

  // Add LSI keyword rows
  for (let kw in summary.lsi) {
    tableHTML += buildSummaryRow(kw, summary.lsi[kw], keywordColors.lsi, 'LSI Keyword');
  }

  // Add section keyword rows
  for (let kw in summary.section) {
    tableHTML += buildSummaryRow(kw, summary.section[kw], keywordColors.section, 'Section Keyword');
  }

  document.getElementById('summary').innerHTML = tableHTML;
}
