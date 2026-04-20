document.addEventListener("DOMContentLoaded", () => {
    const eventOption = document.getElementById("eventOption");
    const habitOption = document.getElementById("habitOption");

    const eventTitle = document.getElementById("EventTitle");
    const habitTitle = document.getElementById("HabitTitle");

    const eventInput = document.querySelector(".EventInput");
    const habitInput = document.querySelector(".HabitInput");

    function updateEventHabitView() {
        if (eventOption.checked) {
            eventInput.style.display = "block";
            habitInput.style.display = "none";

            eventTitle.style.display = "block";
            habitTitle.style.display = "none";
        } 
        else if (habitOption.checked) {
            eventInput.style.display = "none";
            habitInput.style.display = "block";

            eventTitle.style.display = "none";
            habitTitle.style.display = "block";
        }
    }

    eventOption.addEventListener("change", updateEventHabitView);
    habitOption.addEventListener("change", updateEventHabitView);

    updateEventHabitView();
});




// Pre-fill event form from URL params (e.g. when clicking a cell in WeeklyView)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("date") || params.get("start")) {
        // Switch to event tab
        const eventOption = document.getElementById("eventOption");
        if (eventOption) { eventOption.checked = true; eventOption.dispatchEvent(new Event("change")); }

        if (params.get("date")) {
            const dateField = document.getElementById("EventDate");
            if (dateField) dateField.value = params.get("date");
        }
        if (params.get("start")) {
            const startField = document.getElementById("EventStartTime");
            if (startField) startField.value = params.get("start");
        }
        if (params.get("end")) {
            const endField = document.getElementById("EventEndTime");
            if (endField) endField.value = params.get("end");
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const dailyOption = document.getElementById("daily");
    const weeklyOption = document.getElementById("weekly");
    const monthlyOption = document.getElementById("monthly");

    const dailyInput = document.querySelector(".Days");
    const weeklyInput = document.querySelector(".weeklyoptions");
    const monthlyInput = document.querySelector(".Monthly-date");

    function updateFrequencyView() {
        if (dailyOption.checked) {
            dailyInput.style.display = "block";
            weeklyInput.style.display = "none";
            monthlyInput.style.display = "none";
        } 
        else if (weeklyOption.checked) {
            dailyInput.style.display = "none";
            weeklyInput.style.display = "block";
            monthlyInput.style.display = "none";
        } 
        else if (monthlyOption.checked) {
            dailyInput.style.display = "none";
            weeklyInput.style.display = "none";
            monthlyInput.style.display = "block";
        }
    }

    dailyOption.addEventListener("change", updateFrequencyView);
    weeklyOption.addEventListener("change", updateFrequencyView);
    monthlyOption.addEventListener("change", updateFrequencyView);

    updateFrequencyView(); // run once on load
});

// Save event to localStorage on submit
document.addEventListener("DOMContentLoaded", () => {
    const saveEventBtn = document.querySelector("button[name='saveEvent']");
    if (!saveEventBtn) return;

    saveEventBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.getElementById("EventName").value.trim();
        const date = document.getElementById("EventDate").value;
        const startTime = document.getElementById("EventStartTime").value;
        const endTime = document.getElementById("EventEndTime").value;
        const category = document.querySelector("input[name='eventCategory']:checked")?.value || "";
        const color = document.querySelector("input[name='eventColor']:checked")?.value || "blue";
        const description = document.getElementById("EventDescription").value.trim();

        if (!name || !date || !startTime || !endTime) {
            alert("Please fill in Event Name, Date, and Time.");
            return;
        }

        const event = { name, date, startTime, endTime, category, color, description };
        const events = JSON.parse(localStorage.getItem("mindtrack_events") || "[]");
        events.push(event);
        localStorage.setItem("mindtrack_events", JSON.stringify(events));

        // Go back to the page that opened this form
        const returnTo = document.referrer && document.referrer !== window.location.href
            ? document.referrer
            : "Dashboard.html";
        window.location.href = returnTo;
    });
});

