
// let a = [1,1];
// let b = ['1','1'];
// const c = b.map(item => parseInt(item));
// console.log(JSON.stringify(a) === JSON.stringify(c));

const nowTime = new Date();

const date = nowTime.getDate() + '-' + nowTime.getMonth() + '-' + nowTime.getFullYear();
const time = nowTime.getHours() + ':' + nowTime.getMinutes() + ':' + nowTime.getSeconds();

console.log(date);
console.log(time);