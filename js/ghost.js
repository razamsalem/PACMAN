'use strict'

const GHOST = '༼•̫͡•༽'
const SCARED_GHOST = '<img src="img/scared-ghost.png">'
const gEatenGhosts = []

var gRemovedGhosts = []
var gIsGhostEdible = false
var gGhosts = []
var gIntervalGhosts

function createGhosts(board) {
    //DONE: 3 ghosts and an interval
    gGhosts = []
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 500)
}

function createGhost(board) {
    //DONE
    const ghost = {
        location: {
            i: 2,
            j: 6
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    // console.log(gGhosts)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function removeGhost(location) {
    var ghostIdx = -1

    for (var i = 0; i < gGhosts.length; i++) {
        const currGhost = gGhosts[i]
        if (location.i === currGhost.location.i &&
            location.j === currGhost.location.j) {
            ghostIdx = i
            break
        }
    }
    if (ghostIdx === -1) return
    var removedGhosts = gGhosts.splice(ghostIdx, 1)
    gRemovedGhosts.push(removedGhosts[0])
    if (removedGhosts[0].currCellContent === FOOD) {
        updateScore(1)
        if (!gFoodCount--) {
            handleWin()
        }
    }
}

function renderGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        const currGhost = gGhosts[i]
        renderCell(currGhost.location, getGhostHTML(currGhost))
    }
}

function reviveGhosts() {
    gGhosts.push(...gRemovedGhosts)
    gRemovedGhosts = []
}



function moveGhosts() {
    //DONE: loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    //DONE: figure out moveDiff, nextLocation, nextCell
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    //TODO: Make the ghost to try another attempt if his next cell === WALL
    //TODO: Render ghost every moment (not every move)
    //DONE: return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === SUPER_FOOD) return
    //DONE: hitting a pacman? call gameOver

    //DONE: moving from current location:
    //DONE: update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    //DONE: update DOM
    renderCell(ghost.location, ghost.currCellContent)

    //DONE: Move the ghost to new location:
    //DONE: update the model (save cell contents)
    ghost.currCellContent = nextCell
    ghost.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j] = GHOST
    //DONE: update DOM
    renderCell(nextLocation, getGhostHTML(ghost))
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) {
            removeGhost(ghost.location)
            console.log('YUM!')
            return
        } else {
            gameOver()
            return
        }
    }

}
function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const icon = (gPacman.isSuper) ? SCARED_GHOST : GHOST
    var color = ghost.color
    return `<span style="color:${color}">${icon}</span>`
}