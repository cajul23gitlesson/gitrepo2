'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '*'
const CHERRY = '🍒'
const INITIAL_FOOD_COUNT = 60

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gFoodCount
var gIntervalCherry = -1

function onInit() {
    console.log('hello')
    gFoodCount = INITIAL_FOOD_COUNT
    gGame.isOn = true
    gGame.score = 0

    gBoard = buildBoard()

    clearInterval(gIntervalGhosts)
    clearInterval(gIntervalCherry)

    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    
    updateScore(0)
    // gIntervalCherry = setInterval(addCherry, 15000, gBoard, ...)
    gIntervalCherry = setInterval(() => addCherry(gBoard), 15000)
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

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function updateScore(diff) {
    // update model
    gGame.score += diff
    // update dom
    document.querySelector('.score').innerText = gGame.score
}

function gameOver(txt) {
    const elTitle = document.querySelector('.title')
    elTitle.innerText = txt
    console.log('Game Over')
    // TODO
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')
    clearInterval(gIntervalGhosts)
    clearInterval(gIntervalCherry)
    renderCell(gPacman.location, '🪦')
    gGame.isOn = false
}

function playAgain(){
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
    onInit()
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

function addCherry(board){
    var emptyPos = getEmptyCell(board)
    console.log('emptyPos', emptyPos)

    if (!emptyPos) return
    //model
    board[emptyPos.i][emptyPos.j] = CHERRY
    //DOM
    renderCell(emptyPos, CHERRY)
}