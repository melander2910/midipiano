let hihat = new Tone.Player("./samples/CYCdh_K1close_ClHat-01.wav").toDestination();
let snare = new Tone.Player("./samples/CYCdh_K1close_Snr-01.wav").toDestination();
let rim = new Tone.Player("./samples/CYCdh_K1close_Rim-01.wav").toDestination();
let sdst = new Tone.Player("./samples/CYCdh_K1close_SdSt-01.wav").toDestination();
let kick = new Tone.Player("./samples/CYCdh_K1close_Kick-03.wav").toDestination();

function sequencer() {

    let checkbox = 0;
    Tone.Transport.bpm.value = 80;
    Tone.Master.volume.value = -10
    Tone.Transport.scheduleRepeat(repeat, "16n")
    Tone.Transport.start();

    function repeat(time) {
        let step = checkbox % 16;
        let selectedSound1 = document.querySelector(`.top input:nth-child(${step + 1})`);
        let selectedSound2 = document.querySelector(`.middle-1  input:nth-child(${step + 1})`);
        let selectedSound3 = document.querySelector(`.middle-2  input:nth-child(${step + 1})`);
        let selectedSound4 = document.querySelector(`.middle-3  input:nth-child(${step + 1})`);
        let selectedSound5 = document.querySelector(`.bottom  input:nth-child(${step + 1})`);

        if (selectedSound1.checked) {
            hihat.start(time).stop(time + 0.1);
        }
        if (selectedSound2.checked) {
            snare.start(time).stop(time + 0.1);
        }
        if (selectedSound3.checked) {
            rim.start(time).stop(time + 0.1);
        }
        if (selectedSound4.checked) {
            sdst.start(time).stop(time + 0.1);
        }
        if (selectedSound5.checked) {
            kick.start(time).stop(time + 0.1);
        }
        checkbox++
    }
}

sequencer();


// -- start/stop drum machine start --
let on = false;
document.getElementById("play").addEventListener("click", () => {
    if (!on) {
        Tone.Transport.start()
        Tone.start();
        on = true;
    } else {
        Tone.Transport.start().stop();
        on = false;
    }
})
// -- start/stop drum machine end --

if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    console.log('WebMIDI is not supported in this browser.');
}

navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);
    let inputs = midiAccess.inputs;
    let outputs = midiAccess.outputs;
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

function onMIDISuccess(midiAccess) {
    for (let input of midiAccess.inputs.values())
        input.onmidimessage = getMIDIMessage;
}

function getMIDIMessage(message) {
    let command = message.data[0];
    let noteNumber = message.data[1];
    let velocity = (message.data.length > 2) ? message.data[2] : 0;
    console.log(command, noteNumber, velocity);
    playMidi(noteNumber, command, sampler, sustain);
}

// Tone sampler laver et instrument ud fra disse samples
let sampler = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
    },
    release: 1,
    baseUrl: "/pianoNotes/",
}).toDestination();

// -- Sustain slider start --
let slider = document.getElementById("sustainpedal");
let output = document.getElementById("sustainlength");
let sustain = slider.value
output.innerHTML = slider.value;

slider.oninput = () => {
    sustain = slider.value
    output.innerHTML = sustain;
}
// -- Sustain slider end --

// -- BPM slider start --
let bpm = document.getElementById("bpm");
let bpmOutput = document.getElementById("bpmValue");
let bpmValue = bpm.value
bpmOutput.innerHTML = bpm.value;

bpm.oninput = () => {
    bpmValue = bpm.value
    bpmOutput.innerHTML = bpmValue;
    Tone.Transport.bpm.value = bpmValue;
}
// -- BPM slider end --

function piano() {
    // Clicking the piano to play
    const notes = document.querySelectorAll('.note')
    notes.forEach(note => {
        note.addEventListener("click", () => play(note, sampler, sustain))
    })
}


function play(note, sampler, sustain) {
    sampler.triggerAttackRelease(note.id, sustain, Tone.context.currentTime);
}

piano();

function playMidi(noteNumber, command, sampler, sustain) {
    let id = document.getElementsByName(noteNumber)[0].getAttribute("id");
    if (command == 144) {
        document.getElementById(id).classList.add("active");
        sampler.triggerAttackRelease(id, sustain, Tone.context.currentTime)
        console.log(sustain);
    }
    if (command == 128) {
        document.getElementById(id).classList.remove("active");
    }
}

function playKeyboard(sampler, sustain) {
    document.addEventListener("keydown", (event) => {
        console.log(event.key);
        if (event.key == "q") {
            sampler.triggerAttackRelease(["C3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "2") {
            sampler.triggerAttackRelease(["C#3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "w") {
            sampler.triggerAttackRelease(["D3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "3") {
            sampler.triggerAttackRelease(["D#3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "e") {
            sampler.triggerAttackRelease(["E3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "4") {
            sampler.triggerAttackRelease(["F3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "r") {
            sampler.triggerAttackRelease(["F#3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "5") {
            sampler.triggerAttackRelease(["G3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "t") {
            sampler.triggerAttackRelease(["G#3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "6") {
            sampler.triggerAttackRelease(["A3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "y") {
            sampler.triggerAttackRelease(["A#3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "7") {
            sampler.triggerAttackRelease(["B3"], sustain, Tone.context.currentTime);
        }
        if (event.key == "u") {
            sampler.triggerAttackRelease(["C4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "8") {
            sampler.triggerAttackRelease(["C#4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "i") {
            sampler.triggerAttackRelease(["D4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "9") {
            sampler.triggerAttackRelease(["D#4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "o") {
            sampler.triggerAttackRelease(["E4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "0") {
            sampler.triggerAttackRelease(["F4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "p") {
            sampler.triggerAttackRelease(["F#4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "z") {
            sampler.triggerAttackRelease(["G4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "s") {
            sampler.triggerAttackRelease(["G#4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "x") {
            sampler.triggerAttackRelease(["A4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "d") {
            sampler.triggerAttackRelease(["A#4"], sustain, Tone.context.currentTime);
        }
        if (event.key == "c") {
            sampler.triggerAttackRelease(["B4"], sustain, Tone.context.currentTime);
        }
    })
}

playKeyboard(sampler, sustain);

// -- change sound to saxophone start --
// document.getElementById("saxophoneSound").addEventListener("click", () => {
//     sampler = new Tone.Sampler({
//         urls: {
//             "C4": "C4.mp3",
//             "D#4": "Ds4.mp3",
//             "F#4": "Fs4.mp3",
//             "A4": "A4.mp3",
//         },
//         release: 1,
//         baseUrl: "/saxNotes/",
//     }).toDestination();
// })
// -- change sound to saxophone end --

// -- change sound to cello start --
// document.getElementById("celloSound").addEventListener("click", () => {
//     sampler = new Tone.Sampler({
//         urls: {
//             "C4": "C4.mp3",
//             "D#4": "Ds4.mp3",
//             "F#4": "Fs4.mp3",
//             "A4": "A4.mp3",
//         },
//         release: 1,
//         baseUrl: "/celloNotes/",
//     }).toDestination();
// })
// -- change sound to cello end --

function changeSound(id, url){
    document.getElementById(id).addEventListener("click", () => {
        sampler = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                "A4": "A4.mp3",
            },
            release: 1,
            baseUrl: url,
        }).toDestination();
    })
}

changeSound("celloSound", "/celloNotes/");
changeSound("pianoSound", "/pianoNotes/");
changeSound("saxophoneSound", "/saxNotes/");
changeSound("BassSound", "/bassNotes/");
changeSound("FluteSound", "/fluteNotes/");
changeSound("A-GuitarSound", "/aGuitarNotes/");
changeSound("E-GuitarSound", "/eGuitarNotes/");





