// netlify/functions/update-news.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Nur POST-Anfragen erlauben
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Anfragedaten auslesen
    const { newsText, imageUrl } = JSON.parse(event.body);

    // GitHub Repo Informationen
    const owner = 'shootcat'; // Dein GitHub-Benutzername
    const repo = 'FoodyFriday'; // Der Name deines Repositories
    const filePath = 'news.txt'; // Pfad zur Datei im Repository
    const branch = 'main'; // Dein Branch-Name
    const token = process.env.GITHUB_TOKEN; // GitHub-Token aus Umgebungsvariablen

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

        if (putResponse.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Die News wurden erfolgreich aktualisiert.' }),
            };
        } else {
            const errorData = await putResponse.json();
            return {
                statusCode: putResponse.status,
                body: JSON.stringify({ error: errorData.message }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
