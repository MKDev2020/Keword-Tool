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

  // Sort keywords by length for more accurate highlighting
  const sortedKeywords = [...tableKeywords, ...lsiKeywords, ...sectionKeywords];

  const usedSpans = [];
  const keywordColors = {};
  const summary = {};

  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 80%)`;
  }

  let workingText = ` ${article} `;
  const placeholders = [];

  // Combine all keywords into one array
  const allKeywords = [...tableKeywords, ...lsiKeywords, ...sectionKeywords];

  for (let i = 0; i < allKeywords.length; i++) {
    const kw = allKeywords[i];
    const color = getRandomColor();
    keywordColors[kw] = color;

    const pattern = new RegExp(`(?<!\\w)${kw}(?!\\w)`, 'gi');
    let match;

    while ((match = pattern.exec(workingText)) !== null) {
      const placeholder = `{{kw${placeholders.length}}}`;
      placeholders.push({
        placeholder,
        keyword: match[0],
        color,
        original: match[0],
        start: match.index
      });

      workingText = workingText.substring(0, match.index) + placeholder + workingText.substring(match.index + match[0].length);
      pattern.lastIndex = match.index + placeholder.length;

      summary[kw] = (summary[kw] || 0) + 1;
    }
  }

  // Replace placeholders with spans for actual keyword highlighting
  placeholders.sort((a, b) => a.start - b.start);
  for (let p of placeholders) {
    workingText = workingText.replace(
      p.placeholder,
      `<span class="keyword" style="background-color:${p.color}">${p.original}</span>`
    );
  }

  document.getElementById('output').innerHTML = workingText.trim();

  // Build the summary table with keyword counts
  let tableHTML = "<tr><th>Keyword</th><th>Count</th><th>Color</th></tr>";
  for (let kw of sortedKeywords) {
    const count = summary[kw] || 0;
    const color = keywordColors[kw] || "#eee";
    tableHTML += `<tr><td>${kw}</td><td>${count}</td><td><span class="color-box" style="background:${color}"></span></td></tr>`;
  }

  document.getElementById('summary').innerHTML = tableHTML;
}
