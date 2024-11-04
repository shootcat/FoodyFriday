// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active"); // Sidebar ein- und ausblenden
});

// Kommentar-Funktionalität
const form = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');

// Array zum Speichern der Kommentare
let comments = [];

// Funktion, um die Kommentare anzuzeigen
function displayComments() {
    commentsList.innerHTML = ''; // Liste leeren
    const lastComments = comments.slice(-30); // Letzte 30 Kommentare
    lastComments.forEach((comment, index) => {
        const commentDiv = document.createElement('div');
        commentDiv.textContent = `${comment.date}: ${comment.name} sagt: ${comment.text}`;
        
        // Farben für unterschiedliche Kommentare
        const colors = ['red', 'blue', 'green', 'purple', 'orange'];
        commentDiv.style.color = colors[index % colors.length];
        
        commentsList.appendChild(commentDiv);
    });
}

// Formular-Submit-Event für Kommentare
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Standard-Formularverhalten verhindern
        
        const name = document.getElementById('name').value;
        const commentText = document.getElementById('comment').value;

        // Kommentar mit Datum speichern
        const comment = {
            name: name,
            text: commentText,
            date: new Date().toLocaleString() // Datum formatieren
        };

        comments.push(comment); // Kommentar zum Array hinzufügen
        displayComments(); // Kommentare anzeigen
        form.reset(); // Formular zurücksetzen
    });
}
