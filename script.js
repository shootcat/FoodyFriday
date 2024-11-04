// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
});

// Kommentare Funktionalität
const form = document.getElementById('comment-form');
if (form) {
    const commentsList = document.getElementById('comments-list');
    let comments = [];

    // Funktion zum Anzeigen der Kommentare
    function displayComments() {
        commentsList.innerHTML = '';
        const lastComments = comments.slice(-30);
        lastComments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.textContent = `${comment.date} - ${comment.name}: ${comment.text}`;
            const colors = ['red', 'blue', 'green', 'purple', 'orange'];
            commentDiv.style.color = colors[index % colors.length];
            commentsList.appendChild(commentDiv);
        });
    }

    // Event Listener für das Formular
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const commentText = document.getElementById('comment').value.trim();

        if (name && commentText) {
            const comment = {
                name: name,
                text: commentText,
                date: new Date().toLocaleString()
            };
            comments.push(comment);
            displayComments();
            form.reset();
        }
    });
}

// Essensliste Funktionalität
if (document.getElementById('essensliste')) {
    fetch('essensliste.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n');
            const tbody = document.querySelector('#essensliste tbody');
            rows.forEach((row, index) => {
                const cols = row.split(',');
                if (index === 0) return; // Überspringt die Kopfzeile, wenn vorhanden
                const tr = document.createElement('tr');
                cols.forEach((col, idx) => {
                    const td = document.createElement('td');
                    td.textContent = col.trim();
                    // Farbliche Anpassung in der "Gericht"-Spalte
                    if (idx === 2) {
                        if (td.textContent.includes("Sommerfest") || td.textContent.includes("Weihnachtsfeier")) {
                            td.classList.add('red');
                        } else if (td.textContent.includes("Feiertag") || td.textContent.includes("Brückentag") || td.textContent.includes("Ferien")) {
                            td.classList.add('blue');
                        }
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Fehler beim Laden der Essensliste:', error));
}

// Funktion zur Speicherung und Anzeige der Kommentare mit Like-Funktion
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    
    // Kommentare aus LocalStorage abrufen oder als leeres Array initialisieren
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // Funktion, um Kommentare in LocalStorage zu speichern
    function saveComments() {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Funktion zum Anzeigen der letzten 30 Kommentare
    function displayComments() {
        commentsList.innerHTML = ''; // Liste leeren
        const lastComments = comments.slice(-30); // Letzte 30 Kommentare
        lastComments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment-item');

            const commentContent = document.createElement('div');
            commentContent.classList.add('comment-content');
            commentContent.textContent = `${comment.date} - ${comment.name}: ${comment.text}`;
            
            const likeButton = document.createElement('button');
            likeButton.classList.add('like-button');
            likeButton.textContent = `Like (${comment.likes || 0})`;
            likeButton.addEventListener('click', function() {
                comment.likes = (comment.likes || 0) + 1;
                saveComments();
                displayComments();
            });

            commentDiv.appendChild(commentContent);
            commentDiv.appendChild(likeButton);
            commentsList.appendChild(commentDiv);
        });
    }

    // Event-Listener für Formular-Einreichung
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const commentText = document.getElementById('comment').value;
        
        const comment = {
            name: name,
            text: commentText,
            date: new Date().toLocaleString(),
            likes: 0
        };
        
        comments.push(comment);
        
        if (comments.length > 30) {
            comments = comments.slice(-30); // Auf die letzten 30 Kommentare begrenzen
        }
        
        saveComments();
        displayComments();
        form.reset(); // Formular zurücksetzen
    });

    displayComments(); // Kommentare beim Laden der Seite anzeigen
});
