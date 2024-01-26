const html = document.querySelector('html');
const listaBotoes = document.querySelectorAll('.app__card-button');
const banner = document.querySelector('.app__image');
const atributo = 'data-contexto';
const titulo = document.querySelector('.app__title');
const inputAudio = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;

const botaoStartPause = document.querySelector('#start-pause');
const textoStartPause = document.querySelector('#start-pause span');
const iconeStartPause = document.querySelector('#start-pause img');
const tempoTela = document.querySelector('#timer');
let tempoSegundos = 15;
let intervalo = null;
const audioStart = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioTimeout = new Audio('/sons/time-alert.mp3');


function alterarContexto(contexto, lista) {
    lista.forEach((button) => {
        button.classList.remove('active');
    })

    if (contexto === 'foco') {
        html.setAttribute(atributo, 'foco');
        banner.setAttribute('src', '/imagens/foco.png');
        titulo.innerHTML = `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>`;
        tempoSegundos = 1500;
    } else if (contexto === 'short') {
        html.setAttribute(atributo, 'descanso-curto');
        banner.setAttribute('src', '/imagens/descanso-curto.png');
        titulo.innerHTML = `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>`;
        tempoSegundos = 300;
        estadoDescanso();
    } else {
        html.setAttribute(atributo, 'descanso-longo')
        banner.setAttribute('src', '/imagens/descanso-longo.png')
        titulo.innerHTML = `Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>`;
        tempoSegundos = 900;
        estadoDescanso();
    }
}

listaBotoes.forEach((button) => {
    let valorAtributo = button.getAttribute(atributo);

    button.addEventListener('click', () => {
        alterarContexto(valorAtributo, listaBotoes);
        button.classList.add('active');
        exibirTempo();
    })
})

inputAudio.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

const contagemRegressiva = () => {
    if (tempoSegundos <= 0) {
        zerarIntervalo();
        audioTimeout.play();
        comunicarConclusao();
        return
    }
    tempoSegundos--;
    exibirTempo();
}

function zerarIntervalo() {
    clearInterval(intervalo);
    iconeStartPause.setAttribute('src', '/imagens/play_arrow.png');
    textoStartPause.textContent = "Começar";
    intervalo = null;
}

function controleTemporizador() {
    if (intervalo) {
        audioPause.play();
        zerarIntervalo();
        return;
    }

    audioStart.play();
    textoStartPause.textContent = 'Pausar';
    iconeStartPause.setAttribute('src', '/imagens/pause.png');
    intervalo = setInterval(contagemRegressiva, 1000);
}

botaoStartPause.addEventListener('click', controleTemporizador);

function exibirTempo() {
    const tempo = new Date(tempoSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });
    tempoTela.innerHTML = `${tempoFormatado}`;
}

exibirTempo();

function comunicarConclusao() {
    const atributoFoco = html.getAttribute('data-contexto') == 'foco';

    if (atributoFoco) {
        const eventoConclusao = new CustomEvent('timeout');
        document.dispatchEvent(eventoConclusao);
    }
}