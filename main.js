"use strict";
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs-extra");
// const path = require("path");
// const { type } = require("process");
const Datastore = require("nedb");
//* db Account...!
const db = new Datastore({ filename: "./database/Account.db" });
db.loadDatabase();
//* db quizzes...!
const dbQuizzes = new Datastore({ filename: "./database/quiz_nature.db" });
dbQuizzes.loadDatabase();

let mainWindow = null;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("./views/login/login.html");
  //! show admin or user!
  ipcMain.on("show-admin-user", async (_, account) => {
    const accounts = await getAccount(account.name, account.pass);
    if (accounts.length === 0) {
      dialog.showMessageBox({
        title: "Message",
        message: "Account does not exist!",
      });
    } else {
      const acc = accounts[0];
      if (acc.type === 1) {
        mainWindow.loadFile("../quizmanager/views/admin/admins.html");
      } else {
        mainWindow.loadFile("../quizmanager/views/user/user.html");
      }
    }
  });
  //! logout tab
  ipcMain.on("logout-tab", async () => {
    mainWindow.loadFile("../quizmanager/views/login/login.html");
  });

  //! get quizzes
  ipcMain.on("get-quizzes", async (event) => {
    const quizzes = await getQuiz();
    event.reply("create-quiz", quizzes);
  });

  //! send list quiz for user.js to display
  ipcMain.on("get-all-quiz", async (e) => {
    const quizzes = await getQuiz();
    e.reply("list-quiz", quizzes);
  });

  //! update quiz
  ipcMain.on("update-quiz", async (_, dataQuiz) => {
    const myQuiz = dataQuiz.quiz;
    const _id = dataQuiz._id;
    if (updateQuiz(myQuiz, _id)) {
      dialog.showMessageBox({
        title: "Message",
        message: "Update Sucessfull!!!",
      });
    } else {
      dialog.showMessageBox({
        title: "Message",
        message: "Update Fail!!!",
      });
    }
  });

  //! delete quiz
  ipcMain.on("delete-quiz", async (_, idQuiz) => {
    const _id = idQuiz;
    if (deleteQuiz(_id)) {
      dialog.showMessageBox({
        title: "Message",
        message: "Delete Successfull!!!",
      });
    } else {
      dialog.showMessageBox({
        title: "Message",
        message: "Delete Fail!!!",
      });
    }
  });
  //! exit program
  ipcMain.on("exit-program", (_) => {
    process.exit();
  });
  //*  function filter account
  function getAccount(username, password) {
    return new Promise((resolve, reject) => {
      db.find({ name: username, pass: password }, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      });
    });
  }
  //* function getAll quizzes
  function getQuiz() {
    return new Promise((res, reject) => {
      dbQuizzes
        .find({})
        .sort({ time: 1 })
        .exec(function (err, data) {
          if (err) {
            reject(err);
          }
          res(data);
        });
    });
  }
  //* function update quiz
  function updateQuiz(quiz, _id) {
    let checkUpdate = true;
    console.log(quiz);
    dbQuizzes.update({ _id: _id }, quiz, {}, function (err) {
      if (err) {
        console.log(err);
        checkUpdate = false;
      } else {
        checkUpdate = true;
        console.log("Update success!!!");
      }
    });
    return checkUpdate;
  }
  //* function delete quiz
  function deleteQuiz(_id) {
    let checkDelete = true;
    dbQuizzes.remove({ _id: _id }, {}, function (err, numberRemoved) {
      if (err) {
        console.log(err);
        checkDelete = false;
      } else {
        checkDelete = true;
        console.log(`Remove success with ${numberRemoved} record!!!`);
      }
    });
    return checkDelete;
  }
};
let mainCreate = null;
//! add new quiz
ipcMain.on("open-create", async (_) => {
  mainCreate = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    height: 700,
    width: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainCreate.loadFile("../quizmanager/views/admin/addQuiz.html");
  ipcMain.on("add-newQuiz", (event, quiz) => {
    // console.log(quiz);
    if (quiz.question === "") {
      dialog
        .showMessageBox({
          type: "error",
          message: "Question can't blank!",
        })
        .catch(console.log);
    } else if (quiz.answer.length === 0) {
      dialog
        .showMessageBox({
          type: "error",
          message: "Answers can't blank!",
        })
        .catch(console.log);
    } else if (quiz.correct.length === 0) {
      dialog
        .showMessageBox({
          type: "error",
          message: "Checkbox correct answer can't blank!!!!!!",
        })
        .catch(console.log);
    } else {
      if (addQuiz(quiz)) {
        dialog.showMessageBox({
          title: "Message",
          message: "Add quiz Successfull!!!",
        });
      } else {
        dialog.showMessageBox({
          title: "Message",
          message: "Add quiz Fail!!!",
        });
      }
    }
  });
  ipcMain.on("undo-list", (_) => {
    mainWindow.loadFile("../quizmanager/views/admin/admins.html");
  });
  //* function insert quiz
  function addQuiz(quiz) {
    let checkAddQuiz = true;
    dbQuizzes.insert(quiz, (err) => {
      if (err) {
        console.log(err);
        checkAddQuiz = false;
      } else {
        console.log("Insert success!!!");
        checkAddQuiz = true;
      }
    });
    return checkAddQuiz;
  }
  createWindow.on("close", () => {
    mainCreate.hide();
    mainWindow.show();
  });
});

//! screen exam online
let examOnline = null;
ipcMain.on("open-examsoftware", async (_) => {
  examOnline = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    height: 800,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  examOnline.loadFile("../quizmanager/views/user/makeQuiz.html");
  examOnline.on("close", () => {
      examOnline.hide();
      mainWindow.show();
  });
});

ipcMain.on("comeback-login", (e) => {
  mainWindow.loadFile("../quizmanager/views/login/login.html");
});

ipcMain.on('exam-online-screen', (e) => {
  examOnline.quit();
})
app.whenReady().then(() => {
  createWindow();
});
