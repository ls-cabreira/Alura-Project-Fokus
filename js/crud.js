const btnAdicionarTarefa = document.querySelector('.app__button--add-task'); //Selecionando o botão de adicionar tarefa.
const formTarefa = document.querySelector('.app__form-add-task'); //Seleconando o formulário que será exibido no momento do click.
const textarea = document.querySelector('.app__form-textarea'); //Selecionando a área de texto que recebrá o conteúdo que o usuário digitar.
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');//Botão que vai "Cancelar" a adição da tarefa.

let arrayTarefas = JSON.parse(localStorage.getItem('minhasTarefas')) || []; //Um array que, caso a localStorage esteja vazia, será iniciado sem nenhum dado
const ulTarefas = document.querySelector('.app__section-task-list'); //Lista HTML que vai receber as tags li a medida que forem criadas pela função.
let tarefaSelecionada = null; //Referência em escopo global da tarefa que o usuário selecionar.
let liTarefaSelecionada = null; //Referência em escopo global da li da tarefa que o usuário selecionar.
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description'); //Descrição da tarefa selecionada na área EM ANDAMENTO.

const classeTarefaAtiva = 'app__section-task-list-item-active'; //Referência a string da classe ativa para abreviar a passagem dela como parâmetro nos métodos.
const classeTarefaConcluida = 'app__section-task-list-item-complete'; //Referência a string da classe completa para a mesma finalidade.

const btnRemoverTarefasConcluidas = document.querySelector('#btn-remover-concluidas'); //Botão para remover somente tarefas concluídas.
const btnRemoverTudo = document.querySelector('#btn-remover-todas'); //Botão para remover todas as tarefas.

//Função específica para atualizar a localStorage.
function atualizarArmazenamento() {
    localStorage.setItem('minhasTarefas', JSON.stringify(arrayTarefas));
}

//Funçao específica para limpar a textarea e ocultar o formulário.
function ocultarFormulario() {
    textarea.value = '';
    formTarefa.classList.add('hidden');
}

//Função responsável por criar a estrutura HTML que vai exibir as tarefas na lista.
function adicionarTarefa(tarefa) {
    //Cada tag é crida baseada em um modelo existente disponibilizado no projeto e suas classes são devidamente adicionadas para a estilização no CSS.
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `
    svg.classList.add('app__section-task-icon-status');

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.conteudo;
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    const imgBotao = document.createElement('img');
    imgBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imgBotao);

    //Função que viabiliza a edição de tarefas, cada button criado recebe essa função como valor do onclick.
    botao.onclick = () => {
        const editTarefa = prompt('Insira a nova descrição da tarefa');
        //A tarefa do array recuperado da localStorage é acessível, pois foi passada como parâmetro da função de adicção de tarefas.
        if (editTarefa) {
            tarefa.conteudo = editTarefa;
            paragrafo.textContent = editTarefa;
            //Função de atualização chamada novamente, subindo o mesmo array, mas com a descrição atualizada.
            atualizarArmazenamento();
        }
    }

    //Os elementos filhos são devidadmente adicionados ao escopo da li, que é o elemento pai.
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add(classeTarefaConcluida);
        li.querySelector('button').setAttribute('disabled', 'disabled');
    } else {
        //Função que altera a estilização baseada na seleção do usuário.
        li.onclick = () => {
            //Ao clicar em qualquer card, o estilo de seleção é primeiramente removido do elemento que já foi selecionado previamente
            document.querySelectorAll('.app__section-task-list-item-active').forEach(element => {
                element.classList.remove(classeTarefaAtiva);
            })

            //Teste para identificar se o usuário clicou na mesma tarefa, nesse caso, os estilos e o valor das referências também são removidos.
            if (tarefaSelecionada == tarefa) {
                liTarefaSelecionada.classList.remove(classeTarefaAtiva);
                paragrafoDescricaoTarefa.textContent = '';
                liTarefaSelecionada = null;
                tarefaSelecionada = null;

                //Early return para interromper a execução da função.
                return
            }

            //Quando o usuário clica em uma nova tarefa, o objeto tarefa e a li da tarefa são armaezenadas em uma refrência em escopo global, pois será necessário testá-las em outra função.
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;

            //Estilo de seleção adicionado ao elemento li e a descrição do objeto tarefa é passada como o conteúdo de texto da área EM ANDAMENTO.
            li.classList.add(classeTarefaAtiva);
            paragrafoDescricaoTarefa.textContent = tarefa.conteudo;

        }
    }

    //A função retorna o elemento HTML criado.
    return li;
}

//Evento de click para abrir o formulário.
btnAdicionarTarefa.addEventListener('click', () => {
    //Alternância da classe que inicialmente oculta o formulário.
    formTarefa.classList.toggle('hidden');
})

//Evento de submissão do formuário
formTarefa.addEventListener('submit', (event) => {
    //Prevençao do recarregamento da página quando o usuário submeter o formulário, esse comportamento padrão deleta todos os dados gerados em tempo de execução.
    event.preventDefault();

    //Um objeto que representa a tarefa é gerado, tendo como atributo o conteúdo digitado na área de texto.
    const tarefa = {
        conteudo: textarea.value
    }

    //O objeto é armazenado no array declarado anteriormente.
    arrayTarefas.push(tarefa);

    //O array é convertido em string a partir do método stringfy(), presente na API JSON, e posteriormente é armazenado na localStorage, dessa forma, temos persistência em memória mesmo se a página for recarregada.
    atualizarArmazenamento();

    //Ao enviar o formulário, a função de adição de tarefa é chamada para incorporar a nova tarefa a ul da aplicação.
    ulTarefas.append(adicionarTarefa(tarefa));

    //O textarea volta a ficar vazio e o formulário fica oculto.
    ocultarFormulario();
})

//Ao iniciar a aplicação, o array de tarefas é percorrido e, para cada item, uma li é criada e exibida na ul.
arrayTarefas.forEach(element => {
    ulTarefas.append(adicionarTarefa(element));
});

//Evento de click no botão de "Cancelar" a adição da tarefa que chama a função que limpa o formulário.
btnCancelarTarefa.addEventListener('click', () => {
    ocultarFormulario();
})

// Listener para o evento customizado gerado no ourto script.
document.addEventListener('timeout', () => {
    //Caso exista uma tarefa selecionada, ela receberá a estilização de uma tarefa completa e o obejto terá o estado alterado.
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove(classeTarefaAtiva);
        liTarefaSelecionada.classList.add(classeTarefaConcluida);
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        paragrafoDescricaoTarefa.textContent = '';
        tarefaSelecionada.completa = true;
        atualizarArmazenamento();
    }
})

//Função que controla o tipo de remoção de tarefas baseada no argumento passado em cada ativação, que depende do botão que está sendo clicado.
const removerTarefas = (filtro) => {
    //IF ternário para simplifivcar o código.
    const seletor = filtro ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';

    //Remoção da estrutura HTML.
    document.querySelectorAll(seletor).forEach(element => {
        element.remove();
    })

    //Método filter para gerar uma cópia do array somente com os elementos que passaram no filtro, nesse caso, somente as tarefas não concluídas ficam.
    arrayTarefas = filtro ? arrayTarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarArmazenamento();
} 

//Função anômina no atributo onclick para manter o controle do tipo de argumento passado na chamada da função que foi criada.
btnRemoverTarefasConcluidas.onclick = () => removerTarefas(true);
btnRemoverTudo.onclick = () => removerTarefas(false);