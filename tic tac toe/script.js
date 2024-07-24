// script.js
document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const modeButtons = document.querySelectorAll('input[name="mode"]');
    
    let currentPlayer = 'x'; // 'x' starts the game
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let aiMode = false;

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        for (const [a, b, c] of winPatterns) {
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a];
            }
        }
        
        return boardState.includes('') ? null : 'draw';
    }

    function minimax(boardState, depth, isMaximizing) {
        const winner = checkWinner();
        if (winner === 'x') return -10;
        if (winner === 'o') return 10;
        if (winner === 'draw') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < boardState.length; i++) {
                if (boardState[i] === '') {
                    boardState[i] = 'o';
                    const score = minimax(boardState, depth + 1, false);
                    boardState[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < boardState.length; i++) {
                if (boardState[i] === '') {
                    boardState[i] = 'x';
                    const score = minimax(boardState, depth + 1, true);
                    boardState[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function bestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'o';
                const score = minimax(boardState, 0, false);
                boardState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function handleClick(e) {
        if (!gameActive || (currentPlayer === 'o' && aiMode)) return; // AI's turn in AI mode

        const cellIndex = e.target.getAttribute('data-index');
        
        if (boardState[cellIndex] === '') {
            boardState[cellIndex] = currentPlayer;
            e.target.classList.add(currentPlayer);
            e.target.textContent = currentPlayer.toUpperCase();
            
            const winner = checkWinner();
            
            if (winner) {
                gameActive = false;
                status.textContent = winner === 'draw' ? "It's a Draw!" : `${winner.toUpperCase()} Wins!`;
            } else {
                currentPlayer = aiMode ? 'o' : (currentPlayer === 'x' ? 'o' : 'x'); // Switch player or AI
                if (aiMode && currentPlayer === 'o') {
                    setTimeout(aiMove, 200); // Delay AI move for realism
                }
            }
        }
    }
    
    function aiMove() {
        const move = bestMove();
        if (move !== undefined) {
            boardState[move] = 'o';
            cells[move].classList.add('o');
            cells[move].textContent = 'O';
            
            const winner = checkWinner();
            
            if (winner) {
                gameActive = false;
                status.textContent = winner === 'draw' ? "It's a Draw!" : `${winner.toUpperCase()} Wins!`;
            } else {
                currentPlayer = 'x'; // Switch back to player
            }
        }
    }
    
    function resetGame() {
        boardState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        status.textContent = '';
        gameActive = true;
        currentPlayer = 'x'; // Player starts first
    }

    function updateGameMode() {
        aiMode = document.querySelector('input[name="mode"]:checked').value === 'ai';
        resetGame();
    }
    
    board.addEventListener('click', handleClick);
    resetButton.addEventListener('click', resetGame);
    modeButtons.forEach(button => button.addEventListener('change', updateGameMode));

    // Initialize game mode
    updateGameMode();
});
