const display = document.querySelector(".display");
const previous = document.querySelector(".left");
const next = document.querySelector(".right");
const days = document.querySelector(".days");
const selected = document.querySelector(".selected");

let dateToday = new Date();
console.log(dateToday);

console.log(dateToday.getFullYear());
console.log(dateToday.getMonth()+ 1);  //date obj is 0 based -> Jan=0, Feb=1 etc so add one fo arctual month nr
console.log(dateToday.getDate());
console.log(dateToday.getHours() + ":" + dateToday.getMinutes() + ":" + dateToday.getSeconds());

let year = dateToday.getFullYear();
let month = dateToday.getMonth();