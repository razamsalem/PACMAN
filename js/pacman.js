'use strict'

const PACMAN = '<img src="img/pacman.png">'
const COOL_PACMAN = '<img src="img/cool-pacman.png">'
const WINNER_PACMAN = '<img src="img/winner-pacman.png">'
const DEAD_PACMAN = '<img src="img/dead-pacman.png">'
var gPacman

function createPacman(board) {
    // DONE: initialize gPacman...
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false
    }

    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    //DONE: use getNextLocation(), nextCell
    if (!gGame.isOn) return
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    //DONE: return if cannot move
    if (nextCell === WALL) return
    if (nextCell === SUPER_FOOD && gPacman.isSuper) return

    //DONE: hitting a ghost? call gameOver
    //TODO: check if the PACMAN is super...


    //DONE: moving from current location:
    //DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    //DONE: update the DOM
    renderCell(gPacman.location, EMPTY)

    //DONE: Move the pacman to new location:
    //DONE: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    //DONE: update the DOM
    if (gPacman.isSuper) {
        renderCell(nextLocation, PACMAN)
    } else {
        renderCell(nextLocation, COOL_PACMAN)
    }

    if (nextCell === GHOST && gPacman.isSuper) {
        eatingPacmanSound()
        removeGhost(nextLocation)
    } else if (nextCell === GHOST) {
        gameOver()
        return
    }
    if (nextCell === FOOD) {
        eatingPacmanSound()
        updateScore(1)
        if (--gFoodCount === 0) handleWin()
        // console.log(foodCount)
    } if (nextCell === CHERRY) {
        if (--gFoodCount === 0) handleWin()
        eatingPacmanSound()
        updateScore(10)
        console.log('YUM!')
        //TODO: Make Header that react to the game
    } if (nextCell === SUPER_FOOD && !gPacman.isSuper) {
        if (--gFoodCount === 0) handleWin()
        gPacman.isSuper = true
        renderGhosts()
        superPacmanSound()
        setTimeout(() => {
            gPacman.isSuper = false
            reviveGhosts()
        }, 4000);

    }
}

function getNextLocation(eventKeyBoard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    //DONE: figure out nextLocation
    switch (eventKeyBoard) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            nextLocation.i--
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            nextLocation.j++
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            nextLocation.i++
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            nextLocation.j--
            break;
    }
    return nextLocation
}

