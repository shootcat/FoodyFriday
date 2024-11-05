// Service Worker Registrierung
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function() {
      console.log('Service Worker registriert');
    })
    .catch(function(error) {
      console.error('Service Worker Registrierung fehlgeschlagen:', error);
    });
}

// Variablen für die Installationsaufforderung
let deferredPrompt;
const installButton = document.getElementById('install-button');

// Event Listener für 'beforeinstallprompt' hinzufügen (Android)
window.addEventListener('beforeinstallprompt', (e) => {
  // Standardaufforderung verhindern
  e.preventDefault();
  // Ereignis speichern
  deferredPrompt = e;
  // Installationsbutton anzeigen
  installButton.style.display = 'block';
});

// Event Listener für den Installationsbutton (Android)
installButton.addEventListener('click', (e) => {
  // Installationsbutton ausblenden
  installButton.style.display = 'none';
  // Installationsaufforderung anzeigen
  deferredPrompt.prompt();
  // Benutzerentscheidung behandeln
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Benutzer hat die Installation akzeptiert');
    } else {
      console.log('Benutzer hat die Installation abgelehnt');
    }
    deferredPrompt = null;
  });
});

// iOS Installationshinweis
function isIos() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}

if (isIos() && !isInStandaloneMode()) {
  // Installationshinweis anzeigen
  const iosPrompt = document.getElementById('ios-prompt');
  iosPrompt.style.display = 'block';
}

// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
  document.getElementById("sidebar").classList.toggle("active");
});

// Firestore-Kommentarfunktionalität
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

  // Echtzeit-Listener für die Kommentare (nur einmal registriert)
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
