let taskArray = JSON.parse(localStorage.getItem('Tasks')) || [];

const addTaskButton = document.querySelector('.app__button--add-task');
const taskForm = document.querySelector('.app__form-add-task');
const cancelButton = document.querySelector('.app__form-footer__button--cancel');
const clearTextButton = document.querySelector('.app__form-footer__button--delete');
const textarea = taskForm.querySelector('textarea');
const listTag = document.querySelector('.app__section-task-list');

const currentTaskTag = document.querySelector('.app__section-active-task-description');
let selectedTaskObject = null;
let selectedTaskLi = null;

const removeCompleteButton = document.getElementById('btn-remover-concluidas');
const removeAllButton = document.getElementById('btn-remover-todas');

export function initTaskList() {
    addTaskButton.addEventListener('click', () => {
        taskForm.classList.toggle('hidden');
    })

    cancelButton.addEventListener('click', clearForm);
    clearTextButton.addEventListener('click', () => textarea.value = '');

    taskArray.forEach(element => {
        displayTask(element);
    });

    submitForm();
    completeTaskListener();
    taskRemove();
}

function submitForm() {
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const task = {
            description: textarea.value,
            complete: false
        }

        taskArray.push(task);
        updateStorage();

        displayTask(task);
        clearForm();
    })

}

function updateStorage() {
    localStorage.setItem('Tasks', JSON.stringify(taskArray));
}

function displayTask(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('app__section-task-list-item');

    listItem.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const taskDescription = document.createElement('p');
    taskDescription.classList.add('app__section-task-list-item-description');
    taskDescription.textContent = task.description;
    listItem.append(taskDescription);

    const taskButton = document.createElement('button');
    taskButton.classList.add('app_button-edit');
    taskButton.innerHTML = `<img src="/imagens/edit.png">`;
    listItem.append(taskButton);

    if (task.complete) {
        listItem.classList.add('app__section-task-list-item-complete');
        taskButton.setAttribute('disabled', 'true');
    } else {
        listItem.addEventListener('click', () => {
            taskSelection(task, listItem);
        })

        taskButton.addEventListener('click', () => {
            editTask(taskDescription, task);
        })

    }
    listTag.append(listItem);
}

function editTask(displayDescription, objectTask) {
    const newDescription = prompt('Insira a nova descrição');

    if (newDescription) {
        displayDescription.textContent = newDescription;
        objectTask.description = newDescription;

        updateStorage();
    }
}

function taskSelection(object, li) {
    const allTasks = document.querySelectorAll('.app__section-task-list-item');
    allTasks.forEach(element => {
        element.classList.remove('app__section-task-list-item-active');
    });

    if (li.classList.contains('app__section-task-list-item-complete')) {
        return
    }

    if (selectedTaskObject == object) {
        currentTaskTag.textContent = '';
        selectedTaskObject = null;
        li.classList.remove('app__section-task-list-item-active');

        return
    }

    selectedTaskObject = object;
    selectedTaskLi = li;
    currentTaskTag.textContent = object.description;

    li.classList.add('app__section-task-list-item-active');
}

function completeTaskListener() {
    document.addEventListener('concluded', () => {
        if (selectedTaskLi && selectedTaskObject) {
            selectedTaskLi.classList.remove('app__section-task-list-item-active');
            selectedTaskLi.classList.add('app__section-task-list-item-complete');
            selectedTaskLi.querySelector('button').setAttribute('disabled', 'true');
            currentTaskTag.textContent = '';
            selectedTaskObject.complete = true;
            updateStorage();
        }
    });
}

function taskRemove() {
    removeCompleteButton.addEventListener('click', () => {
        clearUl('.app__section-task-list-item-complete');

        taskArray = taskArray.filter(element => !element.complete);
        updateStorage();
    })

    removeAllButton.addEventListener('click', () => {
        clearUl('.app__section-task-list-item');

        taskArray = [];
        updateStorage();
    })
}

function clearForm() {
    taskForm.classList.add('hidden');
    textarea.value = '';
}

function clearUl (selector) {
    document.querySelectorAll(selector)
    .forEach(element => {
        element.remove();
    })
}