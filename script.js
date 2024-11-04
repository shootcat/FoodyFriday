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
