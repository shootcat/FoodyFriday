// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
});

// Kommentare Funktionalität mit Like-Button und Speicherung in LocalStorage
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
        
        const name = document.getElementById('name').value.trim();
        const commentText = document.getElementById('comment').value.trim();

        if (name && commentText) {
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
        }
    });

    displayComments(); // Kommentare beim Laden der Seite anzeigen
});

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

// Formular und Kommentarliste referenzieren
const form = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');

// Funktion zum Anzeigen der Kommentare
function displayComments() {
    commentsList.innerHTML = ''; // Liste leeren

    // Kommentare aus Firestore abrufen und anzeigen
    db.collection("comments")
        .orderBy("timestamp", "desc")
        .limit(30)
        .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                const commentData = doc.data();

                // Kommentar-Elemente erstellen
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item');

                const commentContent = document.createElement('div');
                commentContent.classList.add('comment-content');
                commentContent.textContent = `${commentData.date} - ${commentData.name}: ${commentData.text}`;
                
                commentDiv.appendChild(commentContent);
                commentsList.appendChild(commentDiv);
            });
        });
}

// Event-Listener für Formular-Einreichung
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Formulardaten abrufen
    const name = document.getElementById('name').value.trim();
    const commentText = document.getElementById('comment').value.trim();

    if (name && commentText) {
        // Kommentar-Daten mit Timestamp speichern
        db.collection("comments").add({
            name: name,
            text: commentText,
            date: new Date().toLocaleString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            form.reset(); // Formular zurücksetzen
        }).catch((error) => {
            console.error("Fehler beim Hinzufügen des Kommentars: ", error);
        });
    }
});

// Kommentare beim Laden der Seite anzeigen
displayComments();
