
//! Ben nay chi de test !!!
const Datastore = require("nedb");
const dbQuizzes = new Datastore({ filename: "../quizmanager/database/quiz_nature.db" });
dbQuizzes.loadDatabase();
const { Quiz } = require("./model/quiz");

// const a ='1. a a a a?';
// const b = a.split('.');
// console.log(b[1]);
// const id = "092wtheKxOo5t9us";
// const doc = {
//       question: "Which country has tulips?",
//       answer: ["Netherlands", "Vn", "Laos", "Russia"],
//       correct: [0],
//     };
// var doc = {
//     question: "where do sharks live??",
//     answer: ["Sea", "Lake", "River", "Moutain"],
//     correct: [0],
// };

// const quiz = new Quiz();
// const arrAns = ['ok', 'no', 'never', 'yupp'];
// const arrCorrect = [0];

// quiz.question = 'You like me???';
// quiz.answer = arrAns;
// quiz.correct = arrCorrect;


// dbQuizzes.insert(quiz, function(err, newDoc) {
//     console.log('aa');
//     if (err) throw new Error(err);
//     console.log('s');
// });

// dbQuizzes.remove({ _id: "ZV8cweyvkghoHhwV" }, {}, function (err, numRemoved) {
//   // numRemoved = 1
// });
// dbQuizzes.update({ _id: id }, doc,{},
// function (err,num,) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(num);
// });