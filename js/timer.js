import { contextButtons } from "./themes.js";

let seconds = 1500;
let idInterval = null;
const timerScreen = document.getElementById('timer');
const startAudio = new Audio('/sons/play.wav');
const pauseAudio = new Audio('/sons/pause.mp3');
const alertAudio = new Audio('/sons/time-alert.mp3');
const timerButton = document.getElementById('start-pause');
const buttonText = timerButton.querySelector('span');
const buttonIcon = timerButton.querySelector('img');

export function appTimer() {
    timeDisplay();
    timerSwitch();

    timerButton.addEventListener('click', () => {
        initialize();
    });
}

function initialize() {
    if (idInterval != null) {
        stop();
        pauseAudio.play();
        buttonText.textContent = 'Começar';
        buttonIcon.setAttribute('src', '/imagens/play_arrow.png');
    } else {
        startAudio.play();
        buttonText.textContent = 'Pausar';
        buttonIcon.setAttribute('src', '/imagens/pause.png');
        timerController();
    }
}

function timerController() {
    idInterval = setInterval(() => {
        if (seconds == 0) {
            stop();
            alertAudio.play();
            return
        }
        seconds--;

        timeDisplay();
    }, 1000);
}

function stop() {
    clearInterval(idInterval);
    idInterval = null;
}

function timeDisplay() {
    const timeframe = new Date(seconds * 1000);
    const formattedTime = timeframe.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });

    timerScreen.textContent = formattedTime;
}

function timerSwitch() {
    contextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const context = button.getAttribute('data-contexto');

            if (context == 'descanso-curto') {
                seconds = 300;
            } else if (context == 'descanso-longo') {
                seconds = 900;
            } else {
                seconds = 1500;
            }

            timeDisplay();
        })
    })
}