input.onButtonPressed(Button.A, function () {
    if (!(turned)) {
        if (dX == 1) {
            dX = 0
            dY = -1
        } else if (dX == -1) {
            dX = 0
            dY = 1
        } else if (dY == -1) {
            dY = 0
            dX = -1
        } else if (dY == 1) {
            dY = 0
            dX = 1
        }
        turned = 1
    }
})
input.onButtonPressed(Button.B, function () {
    if (!(turned)) {
        if (dX == 1) {
            dX = 0
            dY = 1
        } else if (dX == -1) {
            dX = 0
            dY = -1
        } else if (dY == -1) {
            dY = 0
            dX = 1
        } else if (dY == 1) {
            dY = 0
            dX = -1
        }
        turned = 1
    }
})
let started = 0
let turned = 0
let dY = 0
let dX = 0
let speed = 1000
let snakeX = 2
let snakeY = 2
dX = 1
dY = 0
basic.forever(function () {
    basic.clearScreen()
    led.plot(snakeX, snakeY)
})
loops.everyInterval(speed, function () {
    if (started) {
        snakeX += dX
        snakeY += dY
        if (snakeX > 4) {
            snakeX = 0
        } else if (snakeX < 0) {
            snakeX = 4
        } else if (snakeY > 4) {
            snakeY = 0
        } else if (snakeY < 0) {
            snakeY = 4
        }
        turned = 0
    } else {
        started = 1
    }
})
