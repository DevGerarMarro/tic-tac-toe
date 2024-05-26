document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("copyright-text").innerHTML =`&copy; ${new Date().getFullYear()} GerarMarros`;
    const cells = document.querySelectorAll(".cell");
    const selectPlayers = document.getElementById("players-count");
    const resetButton = document.getElementById("reset");
    
    let currentPlayer = "X";
    const gameState = Array(9).fill("");

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleClick = (e) => {
        const cell = e.target;
        const index = cell.id;

        gameState[index] = currentPlayer;
        cell.innerHTML = getValue("");

        cell.removeEventListener("click", handleClick);
        if(!checkWinner()){
            changeTurn();
            if(selectPlayers.value === "1"){
                setTimeout(() => {
                    computerMove();
                }, 500);
            }   
        }
    };

    const checkWinner = () => {
        for(condition of winningConditions){
            const [a, b, c] = condition;
            if(gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]){
                document.getElementById(a).classList.add("win");
                document.getElementById(b).classList.add("win");
                document.getElementById(c).classList.add("win");
                document.getElementById("turn-text").innerText = "WINNER!";
                cells.forEach(cell => cell.removeEventListener("click", handleClick));
                return true;
            }
        }
        return false;
    };

    const changeTurn = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("currentTurn").innerHTML = getValue("capital")
    };

    const getValue = (css) => {
        if(currentPlayer === "X") {
            return `<span class="x ${css}">X</span>`;
        }else{
            return `<span class="o ${css}">O</span>`;
        }
    };

    const computerMove = () => {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") availableCells.push(index);
        });
        if (availableCells.length === 0) {
            return;
        }
        const randomIndex = getNextIndex(availableCells);
        gameState[randomIndex] = currentPlayer;
        cells[randomIndex].innerHTML = getValue("");
        cells[randomIndex].removeEventListener("click", handleClick);
        if(!checkWinner()){
            changeTurn();
        }
    };

    const getNextIndex = (availableCells) => {
        // Intentar ganar
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") return c;
            if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") return b;
            if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") return a;
        }

        // Bloquear a X
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") return c;
            if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "") return b;
            if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "") return a;
        }

        // Movimiento aleatorio
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    };

    const resetGame = () => {
        currentPlayer = "X";
        gameState.fill("");
        document.getElementById("turn-text").innerText = "Current Turn";
        cells.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove("win");
            cell.addEventListener("click", handleClick);
        });
    };

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener("click", resetGame);

});