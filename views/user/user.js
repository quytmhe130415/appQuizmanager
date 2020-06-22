"use strict";
const { ipcRenderer, dialog } = require('electron');
const Datastore = require("nedb");
const dbQuizzes = new Datastore({ filename: "./database/quiz_nature.db" });
dbQuizzes.loadDatabase();

const divContent = document.querySelector('.content');
const divFooter = document.querySelector('.footer');

ipcRenderer.on('create-quiz', (_, quizzes) => {
    for(let i = 0; i < quizzes.length; i++){
        const btnQuestion = document.createElement('button');
    }
})




