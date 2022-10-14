radio.setGroup(1)

// --- Transmitter ---

let step = 800 / 7;
let x = 0;
let y = 0;
let isOn = false;
let directionX = 1;
let directionY = 1;

led.plot(0, 0)
led.plot(4, 0)

input.onLogoEvent(TouchButtonEvent.Touched, function() {
    isOn = !isOn

    if (isOn) {
        led.plot(2, 2)
        radio.sendString("on")
    } else {
        led.unplot(2, 2)
        radio.sendString([0,0].join(";"))
        radio.sendString("off")
    }
})

input.onButtonPressed(Button.A, function () {
    directionX *= -1

    if (directionX == 1) {
        led.unplot(0, 4)
        led.plot(0, 0)
    } else {
        led.unplot(0, 0)
        led.plot(0, 4)
    }
})

input.onButtonPressed(Button.B, function () {
    directionY *= -1

    if (directionY == 1) {
        led.unplot(4, 4)
        led.plot(4, 0)
    } else {
        led.unplot(4, 0)
        led.plot(4, 4)
    }
})

function getSpeed(acceleration: number, step: number, direction: number) {
    let out = (acceleration / step);
    out = out > 0 ? Math.floor(out) : Math.ceil(out)

    if (out > 7) {
        x = 7
    } else if (out < -7) {
        out = -7
    }

    return out * direction
}

basic.forever(function() {
    let acX = input.acceleration(Dimension.X)
    let outX = getSpeed(acX, step, directionX);

    let acY = input.acceleration(Dimension.Y)
    let outY = getSpeed(acY, step, directionY);

    if (!isOn){
        outX = 0
        outY = 0
    }

    if (outX != x || outY != y) {
        radio.sendString([outX, outY].join(";"))

        x = outX
        y = outY
    }

    // basic.pause(100)
})


// --- Receiver ---

// pfTransmitter.connectIrSenderLed(AnalogPin.P0)

// let number2command: PfSingleOutput[] = [
//     PfSingleOutput.Backward7,
//     PfSingleOutput.Backward6,
//     PfSingleOutput.Backward5,
//     PfSingleOutput.Backward4,
//     PfSingleOutput.Backward3,
//     PfSingleOutput.Backward2,
//     PfSingleOutput.Backward1,
//     PfSingleOutput.Float,
//     PfSingleOutput.Forward1,
//     PfSingleOutput.Forward2,
//     PfSingleOutput.Forward3,
//     PfSingleOutput.Forward4,
//     PfSingleOutput.Forward5,
//     PfSingleOutput.Forward6,
//     PfSingleOutput.Forward7,
// ];

// let commands: number[][] = []

// radio.onReceivedString(function(receivedString: string) {
//     if (receivedString == 'on'){
//         led.plot(2, 2)
//     } else if (receivedString == 'off') {
//         led.unplot(2, 2)
//     } else {
//         let speed = receivedString.split(";").map(x => +x);

//         commands.push(speed)
//     }
// })

// let speedBlue = 0;
// let speedRed = 0;

// basic.forever(function() {
//     if (commands.length){
//         let speed = commands.pop();
//         commands = []
//         if (speedBlue != speed[0]) {
//             speedBlue = speed[0]
//             pfTransmitter.singleOutputMode(PfChannel.Channel1, PfOutput.Blue, number2command[speedBlue + 7])
//         }

//         if (speedRed != speed[1]) {
//             speedRed = speed[1]
//             pfTransmitter.singleOutputMode(PfChannel.Channel1, PfOutput.Red, number2command[speedRed + 7])
//         }
//     }
// })