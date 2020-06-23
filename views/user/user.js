"use strict";
const { ipcRenderer, dialog } = require("electron");

const displayQuestion = document.querySelector(".displayQuestion");
const displayAnswer = document.querySelector(".answers");
const buttonQuestion = document.querySelector(".buttonQuestion");

ipcRenderer.send("get-all-quiz");
ipcRenderer.on("list-quiz", (_, quizzes) => {
  for (let i = 0; i < quizzes.length; i++) {
    generateBtnQuestion(i + 1, quizzes[i]);
  }
});

const createQuizFrame = (quizzes) => {
  displayQuestion.innerHTML = "";
  displayAnswer.innerHTML = "";
  const divQuestion = document.createElement("div");
  const question = document.createElement("textarea");
  question.setAttribute("class", "textareaQuestion");
  question.readOnly = true;
  question.value = `Question: ${quizzes.question}`;
  divQuestion.appendChild(question);
  displayQuestion.appendChild(divQuestion);
  const lblAns = document.createElement("label");
  lblAns.setAttribute("class", "lblAns");
  lblAns.textContent = "Choose the correct answer below: ";
  displayAnswer.appendChild(lblAns);
  // const txtAnswers = [];

  for (let i = 0; i < quizzes.answer.length; i++) {
    quizzes.userChoices = quizzes.userChoices || [];
    // console.log(quizzes.userChoices);
    const currentAnswer = quizzes.answer[i];
    const answerElement = document.createElement("div");
    answerElement.setAttribute("class", "answerEl");

    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "checkbox");
    inputEl.setAttribute("id", i);
    inputEl.setAttribute("class", "cbCorrect");
    inputEl.checked = quizzes.userChoices.some(choice => choice === currentAnswer);
    
    const inputAns = document.createElement("inputAns");
    inputAns.innerText = currentAnswer;

    inputEl.addEventListener('change', (e) => {
      document.querySelector(`#_${quizzes._id}`).style.backgroundColor =
        document.querySelectorAll("input:checked").length > 0
          ? "green"
          : "red";

      if (e.target.checked) {
        quizzes.userChoices.push(currentAnswer);
      } else {
        quizzes.userChoices = quizzes.userChoices.filter(choice => choice !== currentAnswer);
      }
    });

    answerElement.appendChild(inputEl);
    answerElement.appendChild(inputAns);
    displayAnswer.appendChild(answerElement);
  }
};

//* generate button question
const generateBtnQuestion = (i, quiz) => {
  const btnQuiz = document.createElement("button");
  btnQuiz.textContent = i;
  btnQuiz.setAttribute("id",`_${quiz._id}`);
  btnQuiz.setAttribute("class", "btnQues");
  btnQuiz.addEventListener("click", (e) => {
    e.preventDefault();
    createQuizFrame(quiz);
  });
  buttonQuestion.appendChild(btnQuiz);
  if (i === 1) {
    btnQuiz.click();
  }
};
