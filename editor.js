document.getElementById('preview-button').addEventListener('click', () => {
  const newsText = document.getElementById('news-text').value;
  const imageUrl = document.getElementById('image-url').value;
  generatePreview(newsText, imageUrl);
});

document.getElementById('save-button').addEventListener('click', () => {
  const newsText = document.getElementById('news-text').value;
  const imageUrl = document.getElementById('image-url').value;
  saveToServer(newsText, imageUrl);
});

function generatePreview(text, imageUrl) {
  let formattedData = escapeHTML(text);

  formattedData = formattedData.replace(/^#(.*?)#$/gm, '<span style="font-size: larger;">$1</span>');
  formattedData = formattedData.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  formattedData = formattedData.replace(/\r?\n/g, '<br>');

  const imageHtml = `<img src="${escapeHTML(imageUrl)}" alt="News Bild" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">`;

  document.getElementById('preview').innerHTML = formattedData + '<br>' + imageHtml;
}

function saveToServer(newsText, imageUrl) {
  fetch('/.netlify/functions/update-news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newsText: newsText,
      imageUrl: imageUrl
    })
  })
  .then(response => response.json())
  .then(data => {
    if (response.ok) {
      alert('Die News wurden erfolgreich gespeichert!');
    } else {
      alert('Fehler beim Speichern der News: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Fehler beim Speichern der News:', error);
    alert('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
  });
}

// Hilfsfunktion zum Escapen von HTML
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}
