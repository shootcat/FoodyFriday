// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
});

// Firestore-Kommentarfunktionalität
document.addEventListener('DOMContentLoaded', function() {
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
