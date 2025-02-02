const board = document.getElementById('chessboard');
let selectedPiece = null;
let moveHistory = [];
let currentPlayer = 'white'; // Pemain pertama selalu putih
let boardRotation = 0;

// Susunan awal bidak catur
const initialSetup = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

// Buat papan catur
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
        square.dataset.row = row;
        square.dataset.col = col;
        square.innerHTML = initialSetup[row][col];
        board.appendChild(square);
    }
}

// Event listener buat gerakin bidak dengan aturan catur
board.addEventListener('click', (e) => {
    const square = e.target;
    
    if (selectedPiece) {
        if (isValidMove(selectedPiece, square)) {
            saveMove(selectedPiece.dataset.row + selectedPiece.dataset.col, square.dataset.row + square.dataset.col);
            square.innerHTML = selectedPiece.innerHTML;
            selectedPiece.innerHTML = '';
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            switchPlayer();
        } else {
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        }
    } else if (square.innerHTML && isCurrentPlayerPiece(square)) {
        selectedPiece = square;
        selectedPiece.classList.add('selected');
    }
});

// Cek apakah bidak yang dipilih sesuai dengan giliran pemain
function isCurrentPlayerPiece(square) {
    const piece = square.innerHTML;
    return (currentPlayer === 'white' && '♙♖♘♗♕♔'.includes(piece)) || (currentPlayer === 'black' && '♟♜♞♝♛♚'.includes(piece));
}

// Ganti giliran pemain
function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// Validasi gerakan bidak
function isValidMove(fromSquare, toSquare) {
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);
    const piece = fromSquare.innerHTML;

    // Aturan bidak pion
    if (piece === '♙') {
        return fromCol === toCol && (toRow === fromRow - 1 || (fromRow === 6 && toRow === 4));
    }
    if (piece === '♟') {
        return fromCol === toCol && (toRow === fromRow + 1 || (fromRow === 1 && toRow === 3));
    }

    // Aturan bidak benteng
    if (piece === '♖' || piece === '♜') {
        return fromRow === toRow || fromCol === toCol;
    }

    // Aturan bidak kuda
    if (piece === '♘' || piece === '♞') {
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
               (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
    }

    // Aturan bidak gajah
    if (piece === '♗' || piece === '♝') {
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
    }

    // Aturan bidak menteri
    if (piece === '♕' || piece === '♛') {
        return (fromRow === toRow || fromCol === toCol) || (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol));
    }

    // Aturan bidak raja
    if (piece === '♔' || piece === '♚') {
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
    }

    return false;
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            alert("Waktu habis!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 300;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Simpan gerakan
function saveMove(from, to) {
    moveHistory.push({ from, to });
    updateMoveHistoryDisplay();
}

function updateMoveHistoryDisplay() {
    const historyElement = document.getElementById('move-history');
    historyElement.innerHTML = moveHistory.map((move, index) => 
        `<div>Gerakan ${index + 1}: ${move.from} ke ${move.to}</div>`
    ).join('');
}
