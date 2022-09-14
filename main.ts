enum RadioMessage {
    message1 = 49434,
    start = 56380
}
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 0) {
        radio.sendNumber(1)
    } else if (receivedNumber == 1) {
        if (asked) {
            id += 1
        }
    } else if (receivedNumber == 2) {
        radio.setGroup(122 + id)
        started = 1
    }
})
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
        exists = 0
        radio.sendString("ping")
        basic.pause(100)
        if (!(exists)) {
            radio.setGroup(122 + id)
            return 122 + id - index
        }
    }
    radio.setGroup(122 + id)
    return 122
}
function lastMicrobit () {
    for (let index2 = 0; index2 <= 128 - (122 + id + 1); index2++) {
        radio.setGroup(123 + id + index2)
        exists = 0
        radio.sendString("ping")
        basic.pause(100)
        if (!(exists)) {
            radio.setGroup(122 + id)
            return 122 + id + index2
        }
    }
    radio.setGroup(122 + id)
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
        if (input.lightLevel() != 0) {
            radio.sendString("pong")
        }
    } else if (receivedString == "pong") {
        exists = 1
    } else if (receivedString == "apple") {
        createApple()
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
        started = 1
        current = 1
    }
})
radio.onReceivedValue(function (name, value) {
    if (name == "snakeX") {
        snakeX = value
    } else if (name == "snakeY") {
        snakeY = value
    } else if (name == "dX") {
        dX = value
    } else if (name == "dY") {
        dY = value
    } else if (name == "score") {
        score = value
    } else if (name == "current") {
        current = value
    }
})
let last = 0
let first = 0
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
let tailLength = 2
tailX.shift()
tailY.shift()
snakeX = 2
snakeY = 2
dX = 1
dY = 0
basic.forever(function () {
    if (started) {
        basic.clearScreen()
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
                led.plotBrightness(tailX[index4], tailY[index4], 99)
            }
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
                exists = 0
                radio.sendString("ping")
                basic.pause(100)
                if (exists) {
                    while (tailX.length > 0 || tailY.length > 0) {
                        tailX.pop()
                        tailY.pop()
                    }
                    current = 0
                    radio.sendValue("snakeX", 0)
                    radio.sendValue("snakeY", snakeY)
                    radio.sendValue("dX", dX)
                    radio.sendValue("dY", dY)
                    radio.sendValue("score", score)
                    radio.sendString("apple")
                    appleX = -1
                    appleY = -1
                    tailLength = 2
                    radio.sendValue("current", 1)
                } else {
                    first = firstMicrobit()
                    if (122 + id == first) {
                        snakeX = 0
                    } else {
                        while (tailX.length > 0 || tailY.length > 0) {
                            tailX.pop()
                            tailY.pop()
                        }
                        current = 0
                        radio.setGroup(first)
                        radio.sendValue("snakeX", 0)
                        radio.sendValue("snakeY", snakeY)
                        radio.sendValue("dX", dX)
                        radio.sendValue("dY", dY)
                        radio.sendValue("score", score)
                        radio.sendString("apple")
                        appleX = -1
                        appleY = -1
                        tailLength = 2
                        radio.sendValue("current", 1)
                    }
                }
                radio.setGroup(122 + id)
            } else if (snakeX < 0) {
                first = firstMicrobit()
                if (122 + id == first) {
                    last = lastMicrobit()
                    if (first == last) {
                        snakeX = 4
                    } else {
                        while (tailX.length > 0 || tailY.length > 0) {
                            tailX.pop()
                            tailY.pop()
                        }
                        current = 0
                        radio.setGroup(last)
                        radio.sendValue("snakeX", 4)
                        radio.sendValue("snakeY", snakeY)
                        radio.sendValue("dX", dX)
                        radio.sendValue("dY", dY)
                        radio.sendValue("score", score)
                        radio.sendString("apple")
                        appleX = -1
                        appleY = -1
                        tailLength = 2
                        radio.sendValue("current", 1)
                        radio.setGroup(122 + id)
                    }
                } else {
                    while (tailX.length > 0 || tailY.length > 0) {
                        tailX.pop()
                        tailY.pop()
                    }
                    current = 0
                    radio.setGroup(121 + id)
                    radio.sendValue("snakeX", 4)
                    radio.sendValue("snakeY", snakeY)
                    radio.sendValue("dX", dX)
                    radio.sendValue("dY", dY)
                    radio.sendValue("score", score)
                    radio.sendString("apple")
                    appleX = -1
                    appleY = -1
                    tailLength = 2
                    radio.sendValue("current", 1)
                    radio.setGroup(122 + id)
                }
            } else if (snakeY > 4) {
                snakeY = 0
            } else if (snakeY < 0) {
                snakeY = 4
            }
            turned = 0
        }
    }
})
