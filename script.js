document.getElementById("analyzeBtn").addEventListener("click", function() {
    // Get the input article text and keywords
    let articleText = document.getElementById("articleInput").value;
    let tableKW = document.getElementById("tableKW").value.split("\n").filter(kw => kw.trim() !== "");
    let lsiKW = document.getElementById("lsiKW").value.split("\n").filter(kw => kw.trim() !== "");
    let sectionKW = document.getElementById("sectionKW").value.split("\n").filter(kw => kw.trim() !== "");

    // Function to count occurrences of a keyword (non-overlapping)
    function countOccurrences(text, keyword) {
        let regex = new RegExp("\\b" + keyword + "\\b", "gi");
        return (text.match(regex) || []).length;
    }

    // Results container
    let results = "";

    // Analyze for table keywords
    tableKW.forEach(kw => {
        let count = countOccurrences(articleText, kw);
        results += `<p><span class="highlight yellow">${kw}</span>: ${count} occurrences</p>`;
    });

    // Analyze for LSI keywords
    lsiKW.forEach(kw => {
        let count = countOccurrences(articleText, kw);
        results += `<p><span class="highlight purple">${kw}</span>: ${count} occurrences</p>`;
    });

    // Analyze for section-specific keywords
    sectionKW.forEach(kw => {
        let count = countOccurrences(articleText, kw);
        results += `<p><span class="highlight bold">${kw}</span>: ${count} occurrences</p>`;
    });

    // Display the results
    document.getElementById("kwResult").innerHTML = results;

    // Update the keyword density
    let totalWords = articleText.split(/\s+/).length;
    let totalKWCount = tableKW.concat(lsiKW, sectionKW).reduce((acc, kw) => acc + countOccurrences(articleText, kw), 0);
    let density = ((totalKWCount / totalWords) * 100).toFixed(2);
    document.getElementById("kwResult").innerHTML += `<p>Keyword Density: ${density}%</p>`;
});

// Copy to clipboard functionality
document.getElementById("copyToClipboard").addEventListener("click", function() {
    let textToCopy = document.getElementById("kwResult").innerText;
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Results copied to clipboard!");
});
