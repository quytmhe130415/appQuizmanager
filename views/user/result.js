"use strict";
const { ipcRenderer, dialog } = require("electron");

const nameUser = document.querySelector('#name');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const correct = document.querySelector('#correct');

ipcRenderer.send('infor-user');
ipcRenderer.send('name-user');
ipcRenderer,send('record-result');

ipcRenderer.on('return-name-user',(event,name) => {
    nameUser.innerText = name;
})
ipcRenderer.on('total-correct', async(event, resultUsers) => {
    
    

})