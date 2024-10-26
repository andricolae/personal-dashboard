const display = document.querySelector(".display");
const previous = document.querySelector(".left");
const next = document.querySelector(".right");
const days = document.querySelector(".days");
const selected = document.querySelector(".selected");

let dateToday = new Date();
console.log(dateToday);

console.log(dateToday.getFullYear());
console.log(dateToday.getMonth() + 1);  //date obj is 0 based -> Jan=0, Feb=1 etc so add one fo arctual month nr
console.log(dateToday.getDate());
console.log(dateToday.getHours() + ":" + dateToday.getMinutes() + ":" + dateToday.getSeconds());

let year = dateToday.getFullYear();
let month = dateToday.getMonth();


displayCalendar()

function displayCalendar() {
    //show the current month and year
    let formattedDate = dateToday.toLocaleString(
        "en-US", {
        month: "long",
        year: "numeric",
    });
    display.innerHTML =  `${formattedDate}`;

    //dosplay days
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay(); 
    const lastDay = new Date(year, month + 1, 0);
    const numberOfDays = lastDay.getDate(); 

    // add empty divs to calendar
    for (let x = 1; x <= firstDayIndex; x++) {
        let div = document.createElement("div");
        div.innerHTML += "";
        days.appendChild(div);
      }

    for (let i = 1; i <= numberOfDays; i++) {
        let div = document.createElement("div");
        let currentDate = new Date(year, month, i);
        div.dataset.date = currentDate.toDateString();
        div.innerHTML += i;
        days.appendChild(div);
        if (
          currentDate.getFullYear() === new Date().getFullYear() &&
          currentDate.getMonth() === new Date().getMonth() &&
          currentDate.getDate() === new Date().getDate()
        ) {
          div.classList.add("current-date");
        }
      }
}