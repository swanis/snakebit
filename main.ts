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
function lastMicrobit () {
    for (let index = 0; index <= 5; index++) {
        radio.setGroup(123 + index)
        exists = 0
        radio.sendString("ping")
        basic.pause(100)
        if (!(exists)) {
            radio.setGroup(122 + id)
            return 122 + index
        }
    }
    radio.setGroup(122 + id)
    return -1
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "ping") {
        radio.sendString("pong")
    } else if (receivedString == "pong") {
        basic.clearScreen()
        exists = 1
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
    } else if (name == "tailL") {
    	
    } else if (name == "current") {
        current = value
    }
})
let last = 0
let current = 0
let exists = 0
let turned = 0
let started = 0
let dY = 0
let dX = 0
let snakeY = 0
let snakeX = 0
let id = 0
let asked = 0
radio.setGroup(121)
radio.sendNumber(0)
asked = 1
basic.pause(1000)
asked = 0
basic.showNumber(id)
let speed = 1000
if (id == 0) {
    snakeX = 2
    snakeY = 2
    dX = 1
    dY = 0
    basic.pause(1000)
}
basic.forever(function () {
    basic.clearScreen()
    if (current) {
        led.plotBrightness(snakeX, snakeY, 200)
    }
    while (current) {
        basic.pause(speed)
        snakeX += dX
        snakeY += dY
        if (snakeX > 4) {
            radio.setGroup(122 + (id + 1))
            exists = 0
            radio.sendString("ping")
            basic.pause(100)
            if (exists) {
                current = 0
                radio.sendValue("snakeX", 0)
                radio.sendValue("snakeY", snakeY)
                radio.sendValue("dX", dX)
                radio.sendValue("dY", dY)
                radio.sendValue("current", 1)
            } else {
                if (id == 0) {
                    snakeX = 0
                } else {
                    radio.setGroup(122)
                    current = 0
                    radio.sendValue("snakeX", 0)
                    radio.sendValue("snakeY", snakeY)
                    radio.sendValue("dX", dX)
                    radio.sendValue("dY", dY)
                    radio.sendValue("current", 1)
                }
            }
            radio.setGroup(122 + id)
        } else if (snakeX < 0) {
            if (id == 0) {
                last = lastMicrobit()
                if (last == 122) {
                    snakeX = 4
                } else {
                    radio.setGroup(last)
                    current = 0
                    radio.sendValue("snakeX", 4)
                    radio.sendValue("snakeY", snakeY)
                    radio.sendValue("dX", dX)
                    radio.sendValue("dY", dY)
                    radio.sendValue("tailL", 0)
                    radio.sendValue("current", 1)
                    radio.setGroup(122 + id)
                }
            } else {
                radio.setGroup(121 + id)
                current = 0
                radio.sendValue("snakeX", 4)
                radio.sendValue("snakeY", snakeY)
                radio.sendValue("dX", dX)
                radio.sendValue("dY", dY)
                radio.sendValue("tailL", 0)
                radio.sendValue("current", 1)
                radio.setGroup(122 + id)
            }
        } else if (snakeY > 4) {
            snakeY = 0
        } else if (snakeY < 0) {
            snakeY = 4
        }
        basic.clearScreen()
        led.plotBrightness(snakeX, snakeY, 200)
        turned = 0
    }
})
