"use strict";
const { ipcRenderer, dialog } = require("electron");

const displayQuestion = document.querySelector(".displayQuestion");
const displayAnswer = document.querySelector(".answers");
const buttonQuestion = document.querySelector(".buttonQuestion");
const pTimer = document.querySelector(".timeDown");
const cbFinishTest = document.querySelector('#finishTest');
const btnFinish = document.querySelector('#finish');
const Minute_Default = 60;
const Second_Default = 60;
const nowDate = new Date();
let duration = 0;

ipcRenderer.send("get-all-quiz");
ipcRenderer.on("list-quiz", (_, quizzes) => {
  let Total_Time = quizzes.length * Second_Default;
  let hour = parseInt(Total_Time / (Minute_Default * Second_Default));
  let minute = (Total_Time % (Minute_Default * Second_Default)) / Second_Default;
  let second = (Total_Time % (Minute_Default * Second_Default)) % Second_Default;
  duration = Total_Time / Second_Default;

  const time = setInterval(() => {
    Total_Time -= 1;
    pTimer.textContent = `${hour}:${minute}:${second}`;
    second -= 1;
    if (second <= 0) {
      minute -= 1;
      second = Second_Default;
    }
    if (minute <= 0 && hour != 0) {
      hour -= 1;
      minute = Minute_Default;
    }
    if (Total_Time < Second_Default) {
      // pTimer.style.color = "#747d8c";
      pTimer.textContent = `0:00:00`;
    }
    if (Total_Time < 0) {
      pTimer.textContent = `0:00:00`;
      const date = `${nowDate.getDate()}/${nowDate.getMonth() + 1}/${nowDate.getFullYear()}`;
      ipcRenderer.send("finish-test", date);
      clearInterval(time);
    }
  }, 100);

  for (let i = 0; i < quizzes.length; i++) {
    generateBtnQuestion(i + 1, quizzes[i]);
  }
  checkFinish();
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
    inputEl.checked = quizzes.userChoices.some(
      (choice) => choice === currentAnswer
    );

    const inputAns = document.createElement("inputAns");
    inputAns.innerText = currentAnswer;

    inputEl.addEventListener("change", (e) => {
      document.querySelector(`#_${quizzes._id}`).style.backgroundColor =
        document.querySelectorAll("input:checked").length > 0 ? "green" : "red";

      if (e.target.checked) {
        quizzes.userChoices.push(currentAnswer);
      } else {
        quizzes.userChoices = quizzes.userChoices.filter(
          (choice) => choice !== currentAnswer
        );
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
  btnQuiz.setAttribute("id", `_${quiz._id}`);
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
//* check finish
function checkFinish(){
  if(cbFinishTest.checked){
    console.log('haahh');
    btnFinish.disabled = false;
    btnFinish.addEventListener('click', (e) => {
      preventDefault();
      ipcRenderer.send('exam-online-screen');
    })
  }else{
    console.log('noooo');
    btnFinish.disabled = true;
  }
}

// checkFinish();