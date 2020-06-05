let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedMonth = document.getElementById("month");
let selectedYear = document.getElementById("year");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

yearList(currentYear);

showCalendar(currentMonth, currentYear);

function yearList(syear) {
    let yearList = document.getElementById("year");

    for (let i = (syear - 40); i < (syear + 20); i++) {
        let list = document.createElement("option");
        let listFill = document.createTextNode(`${i}`);
        list.appendChild(listFill);
        yearList.appendChild(list);
    }
}

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
    document.getElementById("event-update").style.display = "none";
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
    document.getElementById("event-update").style.display = "none";
}

function jump() {
    currentYear = parseInt(selectedYear.value);
    currentMonth = parseInt(selectedMonth.value);
    showCalendar(currentMonth, currentYear);
    document.getElementById("event-update").style.display = "none";
}

function daysInMonth(dMonth, dYear) {
    return 32 - new Date(dYear, dMonth, 32).getDate();
}

function showCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();

    let tableBody = document.getElementById("body-calendar");

    tableBody.innerHTML = "";

    selectedMonth.value = month;
    selectedYear.value = year;

    let date = 1;

    /*
      there will be 6 rows, to accomodate worse case
      where there are 31 days and the first row start at the last day of week.
    */

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        // each day of week
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                // handle first row empty cell
                let cell = document.createElement("td");
                let cellFill = document.createTextNode("");
                cell.appendChild(cellFill);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                /* if invalid date, we break the loop
		        we should probably fill empty cells as well */
                break;
            } else {
                // valid date of the year
                let cell = document.createElement("td");
                let cellFill = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    // highlight the cell if it is today
                    cell.classList.add("highlightedCell");
                }
                /* put consistent id for cells, even though sometimes it doesn't exists or it doesn't have ID */
                cell.id = `date${j + (i * 7)}`;

                cell.onclick = function hideAndShow() {
                    // we toggle visibility of form when we click a cell
                    let eventForm = document.getElementById("event-update");
                    if (eventForm.style.display === "none" || document.getElementById("event-input").className !== cell.id) {
                        eventForm.style.display = "block";
                        let theDate = getDate(`date${j + (i * 7)}`);
                        document.getElementById("event-label").innerHTML = `What happen on <b>${theDate} ${months[month]} ${year}</b>?`;
                        document.getElementById("event-input").className = (`date${j + (i * 7)}`);
                        
                    } else {
                        eventForm.style.display = "none";
                    }
                };
                cell.appendChild(cellFill);
                row.appendChild(cell);
                date++;
            }
        }
        tableBody.appendChild(row);
    }
}

function getDate(clicked_id) {
    let specificDate = document.getElementById(clicked_id).textContent;
    return specificDate;
}

/* return true if a character is a digit */
function isNumber(c) {
    return 0 <= c && c <= '9';
}

let eventID = 1;

function inputEvent() {
    let theDate = document.getElementById("event-input").className;

    let n = theDate.length;
    if (!isNumber(theDate[n - 2])) {
        // if the 2nd right element of theDate is not a number, we only take the last element
        theDate = theDate[n - 1];
    } else {
        // otherwise, we take both 2nd right and rightmost
        theDate = theDate[n - 2] + theDate[n - 1];
    }

    let theLists = document.createElement("LI");
    theLists.id = `event${eventID}`;
    eventID++;

    theLists.innerHTML = `<b>${theDate} ${months[currentMonth]} ${currentYear}</b>: ${document.getElementById("event-input").value} <button class="deleteButton" onclick="deleteEvent(${theLists.id})">X<button>`;

    if (document.getElementById("events-list").childNodes[1].textContent.length > 0) {
        document.getElementById("events-list").childNodes[1].textContent = '';
    } 

    document.getElementById("bullet-list").appendChild(theLists);

    document.getElementById(document.getElementById("event-input").className).style.backgroundColor = 'rgb(177, 247, 131)';

    return false;
}

function deleteEvent(eventId) {
    let list = document.getElementById("bullet-list");
    list.removeChild(eventId);
    if (document.getElementById("bullet-list").childNodes.length === 1) {
        document.getElementById("events-list").childNodes[1].textContent = 'There is no event yet';
    }
}

console.dir(document.getElementById("bullet-list").childNodes.length);
