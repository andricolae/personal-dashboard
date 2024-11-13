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

        const dayEvents = events.filter(e => e.date === dateStr);
        if (dayEvents.length > 0) {
            if (dayEvents.length === 1) {
                const eventDiv = document.createElement("div");
                eventDiv.classList.add("event");
                eventDiv.innerText = dayEvents[0].title;
                div.appendChild(eventDiv);
            } else {
                const dotDiv = document.createElement("div");
                dotDiv.classList.add("dot");
                dotDiv.innerHTML  = "&bull;";
                div.appendChild(dotDiv);
            }
        }

        div.addEventListener("click", () => {
            clicked = dateStr;
            initializeFormInputs();
            showModal();
            selected.innerHTML = `Selected Date: ${dateStr}`;
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

let selectedEvent = null;
function showModal() {
    const dayEvents = events.filter(e => e.date === clicked);
    const eventContainer = document.querySelector("#eventText");
    
    eventContainer.innerHTML = "";
    selectedEvent = null;
    if (dayEvents.length > 0) {
        dayEvents.forEach(event => {
            const eventDetails = document.createElement("div");
            eventDetails.classList.add("modal-event");
            eventDetails.innerHTML = `<strong>${event.title}</strong><br>${event.time}<br>${event.notes}`;
            
            eventDetails.addEventListener("click", () => {
                eventContainer.querySelectorAll(".modal-event").forEach(el => {
                    el.classList.remove("selected-event");
                });
                eventDetails.classList.add("selected-event");
                selectedEvent = event; 
                // console.log("selected event: " + selectedEvent.title);
            
            });
            eventContainer.appendChild(eventDetails);
        });

    } 
    else{
        const eventDetails = document.createElement("div");
        eventDetails.classList.add("modal-event");
        eventDetails.innerHTML = `Nothing planned for today!`;
        eventContainer.appendChild(eventDetails);
        btnDelete.style.display = "none";
    }
    initializeFormInputs();
    viewEventForm.style.display = "block";
    addEventForm.style.display = "block";
    modal.style.display = "flex";
}


function closeModal() {
    viewEventForm.style.display = "none";
    addEventForm.style.display = "none";
    modal.style.display = "none";
    btnDelete.style.display = "inline";
    clicked = null;
    selectedEvent = null;
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
        if (selectedEvent) {
        events = events.filter(event => event !== selectedEvent);
        localStorage.setItem("events", JSON.stringify(events));
        closeModal();
        displayCalendar(); 
    } else {
        alert("Please select an event to delete.");
    }
});

btnClose.forEach(btn => btn.addEventListener("click", closeModal));

function initializeFormInputs() {
    eventTitleInput.value = "";
    eventTimeInput.value = "";
    eventNotesInput.value = "";
}