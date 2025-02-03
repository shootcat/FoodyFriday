const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const owner = 'shootcat';
  const repo = 'FoodyFriday';
  const filePath = 'news.txt';
  const branch = 'main';
  const token = process.env.GITHUB_TOKEN; // Stelle sicher, dass der Token in Netlify als Umgebungsvariable gesetzt ist

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Fehler beim Abrufen von news.txt: ${response.statusText}`
      };
    }

    const data = await response.text();

    return {
      statusCode: 200,
      body: data,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Serverfehler: ${error.message}`
    };
  }
};
