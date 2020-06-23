"use strict";
const { ipcRenderer, dialog } = require('electron');
const divContent = document.querySelector('.content');
const divFooter = document.querySelector('.footer');
const displayQuestion = document.querySelector('.displayQuestion');
const displayAnswer = document.querySelector('.answers');
const buttonQuestion = document.querySelector('.buttonQuestion');

ipcRenderer.send('getAllQuizzes');

ipcRenderer.on('list-quiz', (_, quizzes) => {
    let count = 1;
    let countQues = 1;
    for (let i = 0; i < quizzes.length; i++) {
        console.log(Object.values(quizzes[i]));
        //* div footer
        const btnQuestion = document.createElement('button');
        btnQuestion.setAttribute('class', 'btnQues');
        btnQuestion.setAttribute('id', count);
        btnQuestion.innerText = count;
        count++;
        divFooter.appendChild(btnQuestion);
        //* div content
        const lblQuestion = document.createElement('label');
        btnQuestion.addEventListener('click', e => {
            lblQuestion.remove();
            e.preventDefault();
            lblQuestion.setAttribute('class', 'lblQues');
            lblQuestion.innerText = `${countQues}. ${quizzes[i].question}`;
            divContent.appendChild(lblQuestion);
            countQues++;
        })
    }
});

const createQuizFrame = (quiz) => {
    displayQuestion.innerHTML = '';
    displayAnswer.innerHTML = '';
    const divQuestion = document.createElement('div');
    const question = document.createElement('textarea');
    question.setAttribute('class', 'textareaQuestion');
    question.readOnly = true;
    question.value = `Question: ${quiz.question}`;
    divQuestion.appendChild(question);
    displayQuestion.appendChild(divQuestion);

    for (let i = 0; i < quiz.answer.length; i++) {

        const answerElement = document.createElement('div');
        answerElement.setAttribute('class', 'answerEl');
        const inputAns = document.createElement('input');

        inputAns.addEventListener('change', e => {
            e.preventDefault();
            let txtAnswers = [];
            if (inputAns.checked === true) {
                const inputChecked = displayAnswer.querySelectorAll('input:checked');
                if (inputChecked.length !== 0) {
                    document.querySelector(`#${quiz._id}`).style.backgroundColor = "green";

                }
            } else {
                const inputChecked = displayAnswer.querySelectorAll('input:checked');
                if (inputChecked.length === 0) {
                    document.querySelector(`#${quiz._id}`).style.backgroundColor = '';
                }
            }

        })

    }

}

const generateBtnQuestion = (i, quiz) => {
    const btnQuiz = document.createElement('button');
    btnQuiz.textContent = i;
    btnQuiz.setAttribute('id', quiz._id);
    btnQuiz.setAttribute('class', 'btnQues');
    btnQuiz.addEventListener('click', e => {
        e.preventDefault();

    })
};