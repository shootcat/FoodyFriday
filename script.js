// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
});

// Firebase initialisieren
const firebaseConfig = {
  apiKey: "AIzaSyCnJByYr-O4k174w1IXRz1QcrS1b-TVPow",
            authDomain: "ff-komentare.firebaseapp.com",
            projectId: "ff-komentare",
            storageBucket: "ff-komentare.firebasestorage.app",
            messagingSenderId: "1007258832780",
            appId: "1:1007258832780:web:779e56da27b0948f5350a9"
};

// Firebase App initialisieren
firebase.initializeApp(firebaseConfig);
// Firestore initialisieren
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    
    // Funktion zum Anzeigen der Kommentare
    function renderComments(snapshot) {
        commentsList.innerHTML = ''; // Liste leeren, um doppelte Einträge zu vermeiden

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
    }

    // Echtzeit-Listener für die Kommentare
    db.collection("comments")
        .orderBy("timestamp", "desc")
        .limit(30)
        .onSnapshot(renderComments);

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
});
