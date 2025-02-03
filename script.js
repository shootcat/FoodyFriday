// Hamburger Menü Funktionalität
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
});

// Firebase SDKs importieren (falls nicht bereits im HTML eingebunden)
// Falls sie im HTML eingebunden sind, diesen Schritt überspringen
/*
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';
*/

// Firebase initialisieren
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "DEIN_AUTH_DOMAIN",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_STORAGE_BUCKET",
  messagingSenderId: "DEIN_MESSAGING_SENDER_ID",
  appId: "DEINE_APP_ID"
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

    // Sudoku-Setup
    // ... (Rest deines Codes bleibt unverändert)
});


    // Sudoku-Setup
    const sudokuBoard = [
        [5, 3, "", "", 7, "", "", "", ""],
        [6, "", "", 1, 9, 5, "", "", ""],
        ["", 9, 8, "", "", "", "", 6, ""],
        [8, "", "", "", 6, "", "", "", 3],
        [4, "", "", 8, "", 3, "", "", 1],
        [7, "", "", "", 2, "", "", "", 6],
        ["", 6, "", "", "", "", 2, 8, ""],
        ["", "", "", 4, 1, 9, "", "", 5],
        ["", "", "", "", 8, "", "", 7, 9]
    ];

    const sudokuContainer = document.getElementById("sudoku-board");

    function createSudokuBoard() {
        sudokuContainer.innerHTML = "";
        sudokuBoard.forEach((row, i) => {
            const tr = document.createElement("tr");
            row.forEach((cell, j) => {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "number";
                input.min = 1;
                input.max = 9;
                input.value = cell ? cell : "";
                input.disabled = cell !== "";
                td.appendChild(input);
                tr.appendChild(td);
            });
            sudokuContainer.appendChild(tr);
        });
    }

    function checkSudoku() {
        const rows = sudokuContainer.getElementsByTagName("tr");
        let isCorrect = true;

        for (let i = 0; i < 9; i++) {
            const rowSet = new Set();
            const colSet = new Set();
            for (let j = 0; j < 9; j++) {
                const rowVal = rows[i].cells[j].querySelector("input").value;
                const colVal = rows[j].cells[i].querySelector("input").value;

                if (rowVal) rowSet.add(rowVal);
                if (colVal) colSet.add(colVal);

                if (rowSet.size !== i + 1 || colSet.size !== i + 1) {
                    isCorrect = false;
                }
            }
        }

        alert(isCorrect ? "Sudoku korrekt!" : "Noch nicht richtig!");
    }

    createSudokuBoard();

    // Minigame "Fang den Ball"
    const canvas = document.getElementById("minigame-canvas");
    const ctx = canvas.getContext("2d");
    let ball = { x: 150, y: 150, radius: 15 };
    let score = 0;

    canvas.addEventListener("click", function (e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (Math.hypot(ball.x - x, ball.y - y) < ball.radius) {
            score++;
            moveBall();
        }
    });

    function moveBall() {
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
        ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
        drawBall();
    }

    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    moveBall();

    // Schachrätsel-Setup
    const chessboard = document.getElementById("chessboard");
    chessboard.style.display = "grid";
    chessboard.style.gridTemplateColumns = "repeat(8, 50px)";
    chessboard.style.gridTemplateRows = "repeat(8, 50px)";
    chessboard.style.width = "400px";
    chessboard.style.height = "400px";
    chessboard.style.border = "2px solid black";

    const chessPuzzle = [
        ["r", "", "", "", "k", "", "", "r"],
        ["", "", "", "", "p", "", "", ""],
        ["", "", "", "", "", "P", "", ""],
        ["", "", "", "K", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["R", "", "", "", "", "", "", "R"]
    ];

    chessPuzzle.forEach((row, i) => {
        row.forEach((piece, j) => {
            const cell = document.createElement("div");
            cell.style.width = "50px";
            cell.style.height = "50px";
            cell.style.display = "flex";
            cell.style.alignItems = "center";
            cell.style.justifyContent = "center";
            cell.style.fontSize = "24px";
            cell.style.backgroundColor = (i + j) % 2 === 0 ? "#f0d9b5" : "#b58863";
            cell.textContent = piece.toUpperCase();
            chessboard.appendChild(cell);
        });
    });
});
