export const contextButtons = document.querySelectorAll('.app__card-button');
const html = document.querySelector('html');
const appImage = document.querySelector('.app__image');
const title = document.querySelector('.app__title');

export function changeTheme() {
    contextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            clearStyle(contextButtons);
            button.classList.add('active');

            const context = button.getAttribute('data-contexto');
            html.setAttribute('data-contexto', context);
            appImage.setAttribute('src', `/imagens/${context}.png`);
            displayText(context, title);
        })
    })
}

function clearStyle(list) {
    list.forEach((element) => {
        element.classList.remove('active');
    })
}

function displayText(context, title) {
    if (context == 'descanso-curto') {
        title.innerHTML = `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>`;
    } else if (context == 'descanso-longo') {
        title.innerHTML = `Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>`;
    } else {
        title.innerHTML = `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>`;
    }
}