const display = document.querySelector(".display");
const previous = document.querySelector(".left");
const next = document.querySelector(".right");
const days = document.querySelector(".days");
const selected = document.querySelector(".selected");
const modal = document.querySelector("#modal");
const viewEventForm = document.querySelector("#viewEvent");
const addEventForm = document.querySelector("#addEvent");
const eventTitleInput = document.querySelector("#txtTitle");
const eventTimeInput = document.querySelector("#event-time");
const eventNotesInput = document.querySelector("#event-notes");
const btnSave = document.querySelector("#btnSave");
const btnDelete = document.querySelector("#btnDelete");
const btnClose = document.querySelectorAll(".btnClose");

let clicked = null;
let events = JSON.parse(localStorage.getItem("events")) || [];
let holidays = [];

async function fetchHolidays() {
    try {
        const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2024/RO");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        holidays = data.map(item => ({
            hdate: new Date(item.date).toLocaleDateString("en-GB"),
            holiday: item.localName.split('/')[0]
        }));

       // console.log("Holidays:", holidays);
    } catch (error) {
        console.error("Failed to fetch holidays:", error);
    }
}

fetchHolidays();

let dateToday = new Date();
let year = dateToday.getFullYear();
let month = dateToday.getMonth();

displayCalendar();
displaySelected();

function displayCalendar() {
    const formattedDate = dateToday.toLocaleString("en-US", { month: "long", year: "numeric" });
    display.innerHTML = formattedDate;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    days.innerHTML = "";

    for (let x = 1; x < firstDay; x++) {
        const emptyDiv = document.createElement("div");
        days.appendChild(emptyDiv);
    }

    for (let i = 1; i <= lastDay; i++) {
        const div = document.createElement("div");
        const currentDate = new Date(year, month, i);
        const dateStr = `${i.toString().padStart(2, "0")}-${(month + 1).toString().padStart(2, "0")}-${year}`;
        div.classList.add("day");
        div.dataset.date = dateStr;
        div.innerHTML = i;

        if (currentDate.toDateString() === new Date().toDateString()) {
            div.classList.add("current-date");
        }

        const holidayToday = holidays.find(holiday => holiday.hdate === currentDate.toLocaleDateString("en-GB"));
        if (holidayToday) {
            const holidayDiv = document.createElement("div");
            holidayDiv.classList.add("holiday");
            holidayDiv.innerText = holidayToday.holiday;
            div.appendChild(holidayDiv);
        }

        const event = events.find(e => e.date === dateStr);
        if (event) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.innerText = event.title;
            div.appendChild(eventDiv);
        }

        div.addEventListener("click", () => {
            clicked = dateStr;
            showModal();
        });

        days.appendChild(div);
    }

    displaySelected();
}

function displaySelected() {
    const dayElements = document.querySelectorAll(".days div");
    dayElements.forEach(day => {
        day.addEventListener("click", e => {
            selected.innerHTML = `Selected Date: ${e.target.dataset.date}`;
        });
    });
}

previous.addEventListener("click", () => {
    month = month === 0 ? 11 : month - 1;
    if (month == 11) year -= 1;
    dateToday.setFullYear(year);
    dateToday.setMonth(month);
    displayCalendar();
    displaySelected();
});

next.addEventListener("click", () => {
    month = month === 11 ? 0 : month + 1;
    if (month == 0) year += 1;
    dateToday.setMonth(month);
    dateToday.setFullYear(year);
    displayCalendar();
    displaySelected();
});

function showModal() {
    const event = events.find(e => e.date === clicked);
    if (event) {
        document.querySelector("#eventText").innerText = `${event.title}\n${event.time}\n${event.notes}`;
        viewEventForm.style.display = "block";
    } else {
        initializeFormInputs();
        addEventForm.style.display = "block";
    }
    modal.style.display = "block";
}

function closeModal() {
    viewEventForm.style.display = "none";
    addEventForm.style.display = "none";
    modal.style.display = "none";
    clicked = null;
    displayCalendar();
}

btnSave.addEventListener("click", () => {
    const title = eventTitleInput.value.trim();
    const time = eventTimeInput.value.trim();
    const notes = eventNotesInput.value.trim();

    if (title && time) {
        events.push({ date: clicked, title, time, notes });
        localStorage.setItem("events", JSON.stringify(events));
        closeModal();
    }
});

btnDelete.addEventListener("click", () => {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
});

btnClose.forEach(btn => btn.addEventListener("click", closeModal));

function initializeFormInputs() {
    eventTitleInput.value = "";
    eventTimeInput.value = "";
    eventNotesInput.value = "";
}
initializeFormInputs();
