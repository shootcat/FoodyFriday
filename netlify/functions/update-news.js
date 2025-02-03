const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Nur POST-Anfragen akzeptieren
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { newsText, imageUrl } = JSON.parse(event.body);

  const owner = 'shootcat';
  const repo = 'FoodyFriday';
  const filePath = 'news.txt';
  const branch = 'main';
  const token = process.env.GITHUB_TOKEN; // GitHub Token aus Umgebungsvariablen

  // Hier fügst du den neuen Code ein
  if (!token) {
    console.error('GITHUB_TOKEN ist nicht definiert.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Serverfehler: GITHUB_TOKEN ist nicht definiert.' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  const content = `${newsText}\n[IMAGE_URL]\n${imageUrl}`;
  const encodedContent = Buffer.from(content, 'utf-8').toString('base64');

  try {
    // Aktuelle Datei abrufen, um die SHA zu erhalten
    const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to get file: ${getResponse.statusText}`);
    }

    const getData = await getResponse.json();
    const sha = getData.sha;

    // Datei aktualisieren
    const putResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update news.txt via Netlify Function',
        content: encodedContent,
        sha: sha,
        branch: branch,
      }),
    });

    if (!putResponse.ok) {
      const errorData = await putResponse.json();
      throw new Error(`Failed to update file: ${errorData.message}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Die News wurden erfolgreich gespeichert!' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Datei:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Serverfehler: ${error.message}` }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
