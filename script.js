// JavaScript for Keyword Tool by MK

// Utility function to escape regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update output and generate keyword summary
function analyzeText() {
  const article = document.getElementById("articleInput").value;
  const tableKeywords = document.getElementById("tableKeywords").value.split(',').map(kw => kw.trim()).filter(Boolean);
  const lsiKeywords = document.getElementById("lsiKeywords").value.split(',').map(kw => kw.trim()).filter(Boolean);
  const sectionKeywords = document.getElementById("sectionKeywords").value.split(',').map(kw => kw.trim()).filter(Boolean);

  let output = article;

  // Function to highlight keywords
  function highlightKeywords(keywords, className) {
    for (let keyword of keywords) {
      const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
      output = output.replace(regex, match => `<span class="highlight ${className}">${match}</span>`);
    }
  }

  highlightKeywords(tableKeywords, 'table');
  highlightKeywords(lsiKeywords, 'lsi');
  highlightKeywords(sectionKeywords, 'section');

  document.getElementById("output").innerHTML = output;

  // Generate keyword summary
  generateSummary(article, tableKeywords, lsiKeywords, sectionKeywords);
}

function generateSummary(article, tableKWs, lsiKWs, sectionKWs) {
  let summary = "<h3>Keyword Summary</h3>";
  const totalWords = article.trim().split(/\s+/).length;

  function countKeyword(keyword, text) {
    const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
    return (text.match(regex) || []).length;
  }

  function buildList(name, kws) {
    if (!kws.length) return "";
    let html = `<strong>${name}</strong><ul>`;
    for (let kw of kws) {
      const count = countKeyword(kw, article);
      const density = ((count / totalWords) * 100).toFixed(2);
      html += `<li>${kw} - Count: ${count}, Density: ${density}%</li>`;
    }
    html += "</ul>";
    return html;
  }

  summary += buildList("Table Keywords", tableKWs);
  summary += buildList("LSI Keywords", lsiKWs);
  summary += buildList("Section-Specific Keywords", sectionKWs);

  document.getElementById("summary").innerHTML = summary;
}

// Event listener
window.onload = () => {
  document.getElementById("analyzeBtn").addEventListener("click", analyzeText);
};
