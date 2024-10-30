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
displaySelected();

function displayCalendar() {
    //show the current month and year
    let formattedDate = dateToday.toLocaleString(
        "en-US", {
        month: "long",
        year: "numeric",
    });
    display.innerHTML = `${formattedDate}`;

    // dosplay days
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay();  // indexul e intre 0-6 (de unde incepe sapt)
    const lastDay = new Date(year, month + 1, 0);
    const numberOfDays = lastDay.getDate();

    // empty divs pt zile inainte
    for (let x = 1; x <= firstDayIndex - 1; x++) {  // pana la x-1 ca incepi cu luni nu duminica
        let div = document.createElement("div");
        // div.innerHTML += "";
        days.appendChild(div);
    }

    // zilele de dupa current
    for (let i = 1; i <= numberOfDays; i++) {
        let div = document.createElement("div");
        let currentDate = new Date(year, month, i);
        div.dataset.date = currentDate.toDateString();
        div.innerHTML += i;
        days.appendChild(div);
        // ziua curenta marcata
        if (
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getDate() === new Date().getDate()
        ) {
            div.classList.add("current-date");
        }
    }
}

//select a date
function displaySelected() {
    const dayElements = document.querySelectorAll(".days div");
    dayElements.forEach((day) => {
        day.addEventListener("click", (e) => {
            const selectedDate = e.target.dataset.date;
            console.log(`Selected Date: ${selectedDate}`);
            selected.innerHTML = `Selected Date: ${selectedDate}`;
        });
    });
}


previous.addEventListener("click", () => {
    days.innerHTML = "";
    selected.innerHTML = "";
    if (month < 0) {  // de la Jan(0) la Dec(11)
        month = 11;
        year = year - 1;
    }
    month = month - 1;
    console.log(month);
    dateToday.setMonth(month);
    displayCalendar();
    displaySelected();
});

next.addEventListener("click", () => {
    days.innerHTML = "";
    selected.innerHTML = "";
    if (month > 11) {
        month = 0;
        year = year + 1;
    }
    month = month + 1;
    dateToday.setMonth(month);
    displayCalendar();
    displaySelected();
});