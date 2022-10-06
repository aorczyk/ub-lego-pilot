radio.setGroup(1)

// --- Transmitter ---

let step = 800 / 7;
let x = 0;
let y = 0;
let isOn = false;

input.onButtonPressed(Button.A, function () {
    isOn = !isOn

    if (isOn) {
        led.plot(2, 2)
    } else {
        led.unplot(2, 2)
        radio.sendString([0,0].join(";"))
    }
})

basic.forever(function() {
    let acX = input.acceleration(Dimension.X)
    let outX = (acX / step);
    outX = outX > 0 ? Math.floor(outX) : Math.ceil(outX)

    let acY = input.acceleration(Dimension.Y)
    let outY = -1 * (acY / step);
    outY = outY > 0 ? Math.floor(outY) : Math.ceil(outY)

    if (!isOn){
        outX = 0
        outY = 0
    }

    if (outX != x || outY != y) {
        let toSend = [outX, outY].map(x => {
            if (x > 7) {
                x = 7
            } else if (x < -7) {
                x = -7
            }

            return x
        })

        radio.sendString(toSend.join(";"))

        x = outX
        y = outY

        soroban.showNumber(toSend[0], Align.C2, false)
        soroban.showNumber(toSend[1], Align.C5, false)
    }

    // basic.pause(100)
})


// --- Receiver ---

pfTransmitter.connectIrSenderLed(AnalogPin.P0)

let number2command: PfSingleOutput[] = [
    PfSingleOutput.Backward7,
    PfSingleOutput.Backward6,
    PfSingleOutput.Backward5,
    PfSingleOutput.Backward4,
    PfSingleOutput.Backward3,
    PfSingleOutput.Backward2,
    PfSingleOutput.Backward1,
    PfSingleOutput.Float,
    PfSingleOutput.Forward1,
    PfSingleOutput.Forward2,
    PfSingleOutput.Forward3,
    PfSingleOutput.Forward4,
    PfSingleOutput.Forward5,
    PfSingleOutput.Forward6,
    PfSingleOutput.Forward7,
];

let commands: number[][] = []

radio.onReceivedString(function(receivedString: string) {
    let speed = receivedString.split(";").map(x => +x);

    commands.push(speed)
})

let speedB = 0;
let speedR = 0;

basic.forever(function() {
    if (commands.length){
        let speed = commands.pop();
        commands = []
        if (speedB != speed[0]) {
            speedB = speed[0]
            // soroban.showNumber(speedB, Align.C2, false)
            pfTransmitter.singleOutputMode(PfChannel.Channel1, PfOutput.Blue, number2command[speedB + 7])
        }

        if (speedR != speed[1]) {
            speedR = speed[1]
            // soroban.showNumber(speedR, Align.C5, false)
            pfTransmitter.singleOutputMode(PfChannel.Channel1, PfOutput.Red, number2command[speedR + 7])
        }
    }
})