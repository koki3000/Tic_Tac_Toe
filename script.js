const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let boardTab = [
    '','','',
    '','','',
    '','','',
]

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const aiElement = document.getElementById('AI')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const aiTextElement = document.querySelector('[data-ai-text]')
let aiDifficulty

startGame()
restartButton.addEventListener('click', startGame)

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function startGame() {
    boardTab = [
        '','','',
        '','','',
        '','','',
    ]
    cellElements.forEach(cell =>{
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
    // AI difficulty draw
    aiDifficulty = getRandomInt(3)
    // First player draw
    aiStart = getRandomInt(2)      
    if (aiDifficulty == 0) {
        aiTextElement.innerText = 'Hard AI'
        aiElement.classList.add('show')
        if (aiStart == 0) {
            bestMove()
        }            
    } else if (aiDifficulty == 1) {
        aiTextElement.innerText = 'Medium AI'
        aiElement.classList.add('show')
        if (aiStart == 0) {
            move()
        }            
    } else {
        aiTextElement.innerText = 'Easy AI'
        aiElement.classList.add('show')
        if (aiStart == 0) {
            badMove()
        }            
    }

}

function handleClick(e) {
    const cell = e.target
    cell.removeEventListener('click', handleClick)
    // Player's turn
    boardTab[whichCell(e.target)] = CIRCLE_CLASS
    placeMark(cell, CIRCLE_CLASS)
    if (endGameCheck()) {
        // AI Turn
        aiMove()
        endGameCheck()
    }
}

function aiMove() {
    if (aiDifficulty == 0) {
        bestMove()
    } else if (aiDifficulty == 1) {
        move()
    } else {
        badMove()
    }
}

function endGameCheck() {
    if (checkWin(X_CLASS)) { // check for win        
        winningMessageTextElement.innerText = 'X Wins!'
        winningMessageElement.classList.add('show')
    } else if (checkWin(CIRCLE_CLASS)) {
        winningMessageTextElement.innerText = 'O Wins!'
        winningMessageElement.classList.add('show')
        return false
    } else if (isDraw()) { // check for draw        
        winningMessageTextElement.innerText = 'Draw!'
        winningMessageElement.classList.add('show')
    } else {
        return true
    }    
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function setBoardHoverClass() {
    board.classList.add(CIRCLE_CLASS)
}

function checkWin(currentClass) {
    return WINNING_CONDITIONS.some(combination => {
        return combination.every(index => {
            return boardTab[index] == currentClass
        })
    })
}

function isDraw() {
    for (let cell = 0; cell < 9; cell++) {
        if (!(boardTab[cell] == X_CLASS || boardTab[cell] == CIRCLE_CLASS)) {
            return false
        }
    }
    return true
}

function randomPlay() {
    let shouldSkip = false
    while (!(shouldSkip)) {
        cell = getRandomInt(9)
        if (!(boardTab[cell] == X_CLASS || boardTab[cell] == CIRCLE_CLASS)) {
            boardTab[cell] = X_CLASS
            cellElements[cell].classList.add(X_CLASS)
            cellElements[cell].removeEventListener('click', handleClick)
            shouldSkip = true            
        }
    }
}

function whichCell(move) {
    let cell_num
    let i = 0
    cellElements.forEach(cell =>{
        if (cell == move) {
            cell_num = i
        }
        i++
    })
    return cell_num
}

function bestMove() {
    let bestScore = -Infinity
    let bestMove
    for (let cell = 0; cell < 9; cell++) {
        if (!(boardTab[cell] == X_CLASS || boardTab[cell] == CIRCLE_CLASS)) {
            
            boardTab[cell] = X_CLASS
            let score = minimax(0, false)
            if (score > bestScore) {
                bestScore = score
                bestMove = cell
            }
            boardTab[cell] = ''
        }
    }
    boardTab[bestMove] = X_CLASS
    cellElements[bestMove].classList.add(X_CLASS)
    cellElements[bestMove].removeEventListener('click', handleClick)
}

function minimax(depth, isMaximizing) {
    let result
    if (checkWin(X_CLASS)) {
        result = 1
        return result
    } else if (checkWin(CIRCLE_CLASS)) {
        result = -1
        return result
    } else if (isDraw()) {
        result = 0
        return result
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let cell = 0; cell < 9; cell++) {
            if (!(boardTab[cell] == X_CLASS || boardTab[cell] == CIRCLE_CLASS)) {                
                boardTab[cell] = X_CLASS
                let score = minimax(depth + 1, false)
                boardTab[cell] = ''
                if (score > bestScore) {
                    bestScore = score;
                }
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity;
        for (let cell = 0; cell < 9; cell++) {
            if (!(boardTab[cell] == X_CLASS || boardTab[cell] == CIRCLE_CLASS)) {                
                boardTab[cell] = CIRCLE_CLASS
                let score = minimax(depth + 1, true)
                boardTab[cell] = ''
                if (score < bestScore) {
                    bestScore = score;
                }
            }
        }
        return bestScore
    }    
}

function move() {
    if (getRandomInt(3)) {
        bestMove()
    } else {
        randomPlay()
    }
}

function badMove() {
    if (getRandomInt(3)) {
        randomPlay()
    } else {
        bestMove()
    }
}