"use strict";
const { ipcRenderer, dialog } = require("electron");
const btnSubmit = document.querySelector("#submit");
const register = document.querySelector("#register");
// const { Account } = require("../../model/account");
// const Datastore = require("nedb");
// const db = new Datastore({ filename: "../../database/Account.db" });
// db.loadDatabase();

//* click to submit
btnSubmit.addEventListener("click", async(e) => {
    e.preventDefault();
    const name = document.querySelector("#uname").value;
    const pass = document.querySelector("#pass").value;
    ipcRenderer.send("show-admin-user", { name: name, pass: pass });
});

//* click to dky
register.addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-register");
});


//* get account to from keyboard!
// function getAccount(username, password) {
//   return new Promise((resolve, reject) => {
//     db.find({ }, (err, data) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       }
//       resolve(data);
//     });
//   });
// }

// async function check() {
//   const name = "admin";
//   const pass = "123";
//   const acc = await getAccount(name, pass);
//   const t = acc[0];
//   console.log(acc);
//   console.log(t.name);
//   console.log(t.pass);
// }
// check();

// function checkInput(account) {
//     const userName = document.querySelector("uname").innerText;
//     const password = document.querySelector("pass").innerText;
//     //*check username password
//     if (!validateUserName(userName)) {
//         errName.innerText = "Username invalid, Re_Enter!!!";
//     } else if (userName !== account.name) {
//         errName.innerText = "Username does not exist!!!";
//     } else if (password !== account.password) {
//         errPass.innerText = "Password error, Re_enter!!!";
//     } else {
//         errName.innerText = "";
//         errPass.innerText = "";
//     }
// };