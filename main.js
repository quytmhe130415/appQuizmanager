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

  //   ipcMain.on("open-create", async (_) => {
  //     mainWindow.loadFile("../quizmanager/views/admin/addQuiz.html");
  //   });
  //   ipcMain.on("undo-list", (_) => {
  //     mainWindow.loadFile("../quizmanager/views/admin/admins.html");
  //   });

  //! exit program
  ipcMain.on("exit-program", (_) => {
    process.exit();
  });
  //* filter account
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

  //* getAll quizzes
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
  //* Update quiz
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

  //* delete quiz
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
//open-create
//add-newQuiz
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
    console.log(quiz);
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
    // mainCreate().hide();
  });

  //* insert quiz
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

app.whenReady().then(() => {
  createWindow();
});
