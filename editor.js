// editor.js

// GitHub Repo Informationen
const owner = 'shootcat'; // Dein GitHub-Benutzername
const repo = 'FoodyFriday'; // Der Name deines Repositories
const filePath = 'news.txt'; // Pfad zur Datei im Repository
const branch = 'main'; // Oder dein spezifischer Branch
const token = 'DEIN_GITHUB_TOKEN';

document.getElementById('preview-button').addEventListener('click', () => {
    const newsText = document.getElementById('news-text').value;
    const imageUrl = document.getElementById('image-url').value;
    generatePreview(newsText, imageUrl);
});

document.getElementById('save-button').addEventListener('click', () => {
    const newsText = document.getElementById('news-text').value;
    const imageUrl = document.getElementById('image-url').value;
    saveToGitHub(newsText, imageUrl);
});

function generatePreview(text, imageUrl) {
    let formattedData = escapeHTML(text);

    formattedData = formattedData.replace(/^#(.*?)#$/gm, '<span style="font-size: larger;">$1</span>');
    formattedData = formattedData.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    formattedData = formattedData.replace(/\r?\n/g, '<br>');

    const imageHtml = `<img src="${escapeHTML(imageUrl)}" alt="News Bild" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">`;

    document.getElementById('preview').innerHTML = formattedData + '<br>' + imageHtml;
}

function saveToGitHub(text, imageUrl) {
    const content = text + '\n[IMAGE_URL]\n' + imageUrl;
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Aktuelle Datei abrufen, um die SHA zu erhalten
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const sha = data.sha;

        // Datei aktualisieren
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update news.txt via editor',
                content: encodedContent,
                sha: sha,
                branch: branch
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Die News wurden erfolgreich gespeichert!');
            } else {
                alert('Fehler beim Speichern der News.');
            }
        })
        .catch(error => {
            console.error('Fehler beim Speichern der Datei:', error);
        });
    })
    .catch(error => {
        console.error('Fehler beim Abrufen der Datei:', error);
    });
}

// Hilfsfunktion zum Escapen von HTML
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
}
