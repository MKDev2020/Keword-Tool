// Initialize Quill editor
var quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'header': '4' }, { 'header': '5' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['color', 'background'],
            [{ 'font': [] }],
            ['clean']
        ]
    }
});

// Function to apply text formatting in the Quill editor
function applyFormatting(format, value) {
    quill.format(format, value);
}

// Function to get keyword count
function updateKeywordCount() {
    const articleText = document.getElementById('articleInput').value;
    const words = articleText.split(/\s+/);
    const kwCount = words.length;

    document.getElementById('kwCount').textContent = `Total Keywords: ${kwCount}`;
}

// Handle keyword highlighting
function highlightKeywords() {
    const articleText = document.getElementById('articleInput').value;
    const keywords = ['AI', 'automation', 'machine learning', 'big data']; // Example keywords, can be expanded
    const highlightedText = articleText.replace(/\b(?:AI|automation|machine learning|big data)\b/g, '<span class="highlight">$&</span>');
    document.getElementById('output').innerHTML = highlightedText;
    updateKeywordCount();
}

// Trigger on input change to update keyword count and highlight keywords
document.getElementById('articleInput').addEventListener('input', function() {
    highlightKeywords();
});

// Optional: Function to suggest missing keywords in the article
function suggestMissingKeywords() {
    const articleText = document.getElementById('articleInput').value;
    const allKeywords = ['AI', 'automation', 'machine learning', 'big data'];
    let missingKeywords = allKeywords.filter(keyword => !articleText.includes(keyword));

    if (missingKeywords.length > 0) {
        alert(`You might want to add the following keywords: ${missingKeywords.join(', ')}`);
    } else {
        alert('All suggested keywords are included.');
    }
}

// Adding button for keyword suggestion in toolbar
const suggestionButton = document.createElement('button');
suggestionButton.textContent = 'Suggest Missing Keywords';
suggestionButton.onclick = suggestMissingKeywords;
document.querySelector('.toolbar').appendChild(suggestionButton);

// Display the keyword summary section
document.getElementById('kwSummary').style.display = 'block';
