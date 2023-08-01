'use strict'
const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🥐'
const CHERRY = '🍒'
const FOOD_AMOUNT = 60

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gIntervalCherry
var gFoodCount

//TODO: FIX WINNING WAY

function onInit() {
    gFoodCount = FOOD_AMOUNT
    // console.log('hello')
    startSound()
    const elH2 = document.querySelector('.temp-h2')
    elH2.innerText = 'Score:'
    elH2.classList.remove('h2-color')
    resetScore()
    clearInterval(gIntervalCherry)
    gBoard = buildBoard()
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    hideModal()
    hideWinModal()
    gIntervalCherry = setInterval(() => spawnCherry(gBoard), 10000)
    // gIntervalCherry = setInterval(() => (console.log('foodcount:', gFoodCount)), 1000)
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }

    board[1][1] = SUPER_FOOD
    board[1][8] = SUPER_FOOD
    board[8][1] = SUPER_FOOD
    board[8][8] = SUPER_FOOD

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            if (cell === WALL) {
                strHTML += `<td class="${className} wall">${cell}</td>`
            } else {
                strHTML += `<td class="${className}">${cell}</td>`
            }
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

//location is an object like this - { i: 2 , j: 7 }
function renderCell(location, value) {
    //Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // DONE: update model and dom
    // update model
    gGame.score += diff
    //update dom
    document.querySelector('.score').innerText = gGame.score
}

function gameOver() {
    // console.log('Game Over')
    loseSound()
    const elH2 = document.querySelector('.temp-h2')
    elH2.classList.add('h2-color')
    elH2.innerText = 'Last Round Score:'
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, DEAD_PACMAN)
    gGame.isOn = false
    clearInterval(gIntervalCherry)
    showModal()
}


function resetScore() {
    gGame.score = 0
    document.querySelector('.score').innerText = gGame.score
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hidden')
}

function hideWinModal() {
    const elModal = document.querySelector('.modal2')
    elModal.classList.add('hidden')
}

function showWinModal() {
    const elModal = document.querySelector('.modal2')
    elModal.classList.remove('hidden')
}

function handleWin() {
    const elH2 = document.querySelector('.temp-h2')
    elH2.classList.add('h2-color')
    elH2.innerText = 'Winning! What a score:'
    winSound()
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, WINNER_PACMAN)
    gGame.isOn = false
    showWinModal()
}

function getEmptyCell(board) {
	const emptyPoses = []
    // console.log('board', board)
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
            // console.log('board[i][j]', board[i][j])
			if (board[i][j] === EMPTY) {
				emptyPoses.push({ i, j }) // { i: i, j: j }
			}
		}
	}
    // console.log('emptyPoses', emptyPoses)
    if (emptyPoses.length === 0) return null
    const randIdx = getRandomIntInclusive(0, emptyPoses.length - 1)
    return emptyPoses[randIdx]
}

function spawnCherry(board) {
    var emptyPos = getEmptyCell(board)
    console.log('emptyPos', emptyPos)

    if (!emptyPos) return
    //model
    board[emptyPos.i][emptyPos.j] = CHERRY
    //DOM
    renderCell(emptyPos, CHERRY)
}
////////////// Sound \\\\\\\\\\\\\\
function startSound() {
    const sound = new Audio('sound/start.mp3')
    sound.play()
}

function winSound() {
    const sound = new Audio('sound/win.mp3')
    sound.play()
}

function loseSound() {
    const sound = new Audio('sound/lose.mp3')
    sound.play()
}

function superPacmanSound() {
    const sound = new Audio('sound/waka-waka.mp3')
    sound.play()
}

function eatingPacmanSound() {
    const sound = new Audio('sound/eating.mp3')
    sound.play()
}