radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 0) {
        radio.sendNumber(1)
    } else if (receivedNumber == 1) {
        if (asked) {
            id += 1
        }
    } else if (receivedNumber == 2) {
        radio.setGroup(122 + id)
        basic.pause(50)
        started = 1
    }
})
function changeCurrent (x: number) {
    radio.sendString("" + x + ":" + snakeY + ":" + dX + ":" + dY + ":" + score)
}
input.onButtonPressed(Button.A, function () {
    if (started) {
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
    }
})
function firstMicrobit () {
    for (let index = 0; index <= id; index++) {
        radio.setGroup(122 + id - (index + 1))
        basic.pause(50)
        exists = 0
        radio.sendString("ping")
        basic.pause(100)
        if (!(exists)) {
            radio.setGroup(122 + id)
            basic.pause(50)
            return 122 + id - index
        }
    }
    radio.setGroup(122 + id)
    basic.pause(50)
    return 122
}
function resetCurrent () {
    while (tailX.length > 0 || tailY.length > 0) {
        tailX.pop()
        tailY.pop()
    }
    appleX = -1
    appleY = -1
    tailLength = 2
    current = 0
}
function lastMicrobit () {
    for (let index2 = 0; index2 <= 128 - (122 + id + 1); index2++) {
        radio.setGroup(123 + id + index2)
        basic.pause(50)
        exists = 0
        radio.sendString("ping")
        basic.pause(100)
        if (!(exists)) {
            radio.setGroup(122 + id)
            basic.pause(50)
            return 122 + id + index2
        }
    }
    radio.setGroup(122 + id)
    basic.pause(50)
    return 128
}
function inTail (x: number, y: number) {
    for (let index3 = 0; index3 <= tailX.length - 1; index3++) {
        if (tailX[index3] == x && tailY[index3] == y) {
            return true
        }
    }
    return false
}
function createApple () {
    appleX = randint(0, 4)
    appleY = randint(0, 4)
    while (appleX == snakeX && appleY == snakeY || inTail(appleX, appleY)) {
        appleX = randint(0, 4)
        appleY = randint(0, 4)
    }
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "ping") {
        if (started && !(blocked)) {
            radio.sendString("pong")
        }
    } else if (receivedString == "pong") {
        exists = 1
    } else if (receivedString == "apple") {
        createApple()
    } else {
        arr = receivedString.split(":")
        snakeX = parseInt(arr[0])
        snakeY = parseInt(arr[1])
        dX = parseInt(arr[2])
        dY = parseInt(arr[3])
        score = parseInt(arr[4])
        createApple()
        current = 1
    }
})
input.onButtonPressed(Button.B, function () {
    if (started) {
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
    }
})
input.onGesture(Gesture.Shake, function () {
    if (!(started)) {
        createApple()
        radio.sendNumber(2)
        radio.setGroup(122 + id)
        basic.pause(50)
        started = 1
        current = 1
    }
})
let last = 0
let first = 0
let arr: string[] = []
let blocked = 0
let current = 0
let exists = 0
let turned = 0
let started = 0
let dY = 0
let dX = 0
let snakeY = 0
let snakeX = 0
let tailY: number[] = []
let tailX: number[] = []
let tailLength = 0
let appleY = 0
let appleX = 0
let id = 0
let asked = 0
let score = 0
score = 0
basic.showIcon(IconNames.Happy)
radio.setGroup(121)
basic.pause(100)
radio.sendNumber(0)
asked = 1
basic.pause(1000)
asked = 0
basic.showNumber(id)
let speed = 1000
appleX = -1
appleY = -1
tailLength = 2
tailX.shift()
tailY.shift()
snakeX = 2
snakeY = 2
dX = 1
dY = 0
basic.forever(function () {
    if (started) {
        basic.clearScreen()
        if (input.lightLevel() > 200) {
            blocked = 1
        } else {
            blocked = 0
        }
        while (current) {
            basic.clearScreen()
            if (inTail(snakeX, snakeY)) {
                started = 0
                basic.showNumber(score)
                continue;
            }
            if (appleX != -1) {
                if (snakeX == appleX && snakeY == appleY) {
                    score += tailLength - 1
                    tailLength += 1
                    createApple()
                }
                led.plot(appleX, appleY)
            }
            for (let index4 = 0; index4 <= tailX.length - 1; index4++) {
                basic.pause(50)
                led.plotBrightness(tailX[index4], tailY[index4], 99)
            }
            basic.pause(50)
            led.plotBrightness(snakeX, snakeY, 200)
            basic.pause(speed)
            tailX.push(snakeX)
            tailY.push(snakeY)
            if (tailX.length > tailLength) {
                tailX.shift()
                tailY.shift()
            }
            snakeX += dX
            snakeY += dY
            if (snakeX > 4) {
                radio.setGroup(122 + (id + 1))
                basic.pause(50)
                exists = 0
                radio.sendString("ping")
                basic.pause(100)
                if (exists) {
                    resetCurrent()
                    changeCurrent(0)
                } else {
                    first = firstMicrobit()
                    if (122 + id == first) {
                        snakeX = 0
                    } else {
                        resetCurrent()
                        radio.setGroup(first)
                        basic.pause(50)
                        changeCurrent(0)
                    }
                }
                radio.setGroup(122 + id)
                basic.pause(50)
            } else if (snakeX < 0) {
                radio.setGroup(122 + (id - 1))
                basic.pause(50)
                exists = 0
                radio.sendString("ping")
                basic.pause(100)
                if (exists) {
                    resetCurrent()
                    changeCurrent(4)
                } else {
                    last = lastMicrobit()
                    if (122 + id == last) {
                        snakeX = 4
                    } else {
                        resetCurrent()
                        radio.setGroup(last)
                        changeCurrent(4)
                    }
                }
                radio.setGroup(122 + id)
                basic.pause(50)
            } else if (snakeY > 4) {
                snakeY = 0
            } else if (snakeY < 0) {
                snakeY = 4
            }
            turned = 0
        }
    }
})
