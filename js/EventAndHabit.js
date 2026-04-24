document.addEventListener("DOMContentLoaded", () => {
    const eventOption = document.getElementById("eventOption");
    const habitOption = document.getElementById("habitOption");
    const eventTitle = document.getElementById("EventTitle");
    const habitTitle = document.getElementById("HabitTitle");
    const eventInput = document.querySelector(".EventInput");
    const habitInput = document.querySelector(".HabitInput");

    const dailyOption = document.getElementById("daily");
    const weeklyOption = document.getElementById("weekly");
    const monthlyOption = document.getElementById("monthly");
    const dailyInput = document.querySelector(".Days");
    const weeklyInput = document.querySelector(".weeklyoptions");
    const monthlyInput = document.querySelector(".Monthly-date");

    const saveEventBtn = document.querySelector("button[name='saveEvent']");
    const saveHabitBtn = document.querySelector("button[name='saveHabit']");

    function updateEventHabitView() {
        if (!eventOption || !habitOption || !eventInput || !habitInput || !eventTitle || !habitTitle) return;
        if (eventOption.checked) {
            eventInput.style.display = "block";
            habitInput.style.display = "none";
            eventTitle.style.display = "block";
            habitTitle.style.display = "none";
        } else {
            eventInput.style.display = "none";
            habitInput.style.display = "block";
            eventTitle.style.display = "none";
            habitTitle.style.display = "block";
        }
    }

    function updateFrequencyView() {
        if (!dailyOption || !weeklyOption || !monthlyOption || !dailyInput || !weeklyInput || !monthlyInput) return;
        if (dailyOption.checked) {
            dailyInput.style.display = "block";
            weeklyInput.style.display = "none";
            monthlyInput.style.display = "none";
        } else if (weeklyOption.checked) {
            dailyInput.style.display = "none";
            weeklyInput.style.display = "block";
            monthlyInput.style.display = "none";
        } else {
            dailyInput.style.display = "none";
            weeklyInput.style.display = "none";
            monthlyInput.style.display = "block";
        }
    }

    function handlePrefillFromParams() {
        const params = new URLSearchParams(window.location.search);
        if (!params.get("date") && !params.get("start")) return;
        if (eventOption) {
            eventOption.checked = true;
            updateEventHabitView();
        }
        const dateField = document.getElementById("EventDate");
        const startField = document.getElementById("EventStartTime");
        const endField = document.getElementById("EventEndTime");
        if (dateField && params.get("date")) dateField.value = params.get("date");
        if (startField && params.get("start")) startField.value = params.get("start");
        if (endField && params.get("end")) endField.value = params.get("end");
    }

    function saveEvent(e) {
        e.preventDefault();
        const name = document.getElementById("EventName")?.value.trim() || "";
        const date = document.getElementById("EventDate")?.value || "";
        const startTime = document.getElementById("EventStartTime")?.value || "";
        const endTime = document.getElementById("EventEndTime")?.value || "";
        const category = document.querySelector("input[name='eventCategory']:checked")?.value || "";
        const color = document.querySelector("input[name='eventColor']:checked")?.value || "blue";
        const description = document.getElementById("EventDescription")?.value.trim() || "";

        if (!name || !date || !startTime || !endTime) {
            alert("Please fill in Event Name, Date, and Time.");
            return;
        }

        const event = { name, date, startTime, endTime, category, color, description };
        const events = JSON.parse(localStorage.getItem("mindtrack_events") || "[]");
        events.push(event);
        localStorage.setItem("mindtrack_events", JSON.stringify(events));

        const returnTo = document.referrer && document.referrer !== window.location.href
            ? document.referrer
            : "Dashboard.html";
        window.location.href = returnTo;
    }

    function saveHabit(e) {
        e.preventDefault();
        const name = document.getElementById("HabitName")?.value.trim() || "";
        const date = document.getElementById("HabitDate")?.value || "";
        const startTime = document.getElementById("HabitStartTime")?.value || "";
        const endTime = document.getElementById("HabitEndTime")?.value || "";
        const category = document.querySelector("input[name='habitCategory']:checked")?.value || "";
        const frequency = document.querySelector("input[name='habitFrequency']:checked")?.value || "daily";
        const days = Array.from(document.querySelectorAll("input[name='habitDays']:checked")).map((el) => el.value);
        const weeklyDate = document.getElementById("WeeklyDate")?.value || "";
        const monthlyDate = document.querySelector(".Monthly-date input[type='date']")?.value || "";
        const goal = document.getElementById("TargetGoal")?.value.trim() || "";
        const description = document.getElementById("HabitDescription")?.value.trim() || "";

        if (!name || !date || !startTime || !endTime) {
            alert("Please fill in Habit Name, Date, and Time.");
            return;
        }

        const habits = JSON.parse(localStorage.getItem("mindtrack_habits") || "[]");
        habits.push({
            id: "habit_" + Date.now(),
            name,
            date,
            startTime,
            endTime,
            category,
            frequency,
            days,
            weeklyDate,
            monthlyDate,
            goal,
            description,
            completedDates: []
        });
        localStorage.setItem("mindtrack_habits", JSON.stringify(habits));

        const returnTo = document.referrer && document.referrer !== window.location.href
            ? document.referrer
            : "Dashboard.html";
        window.location.href = returnTo;
    }

    function setupFileUpload() {
        const fileUpload = document.querySelector(".FileUpload");
        const fileInput = document.getElementById("FileInput");
        const uploadText = fileUpload?.querySelector("p");
        if (!fileUpload || !fileInput || !uploadText) return;

        function updateFileDisplay() {
            if (fileInput.files.length > 0) {
                uploadText.textContent = "File selected: " + fileInput.files[0].name;
                displayPDF(fileInput.files[0]);
            } else {
                uploadText.textContent = "Drag & Drop PDF here or Click to Upload";
                hidePDFViewer();
            }
        }

        function displayPDF(file) {
            const pdfEmbed = document.getElementById("pdfEmbed");
            const pdfViewer = document.getElementById("pdfViewer");
            if (!pdfEmbed || !pdfViewer) return;
            const url = URL.createObjectURL(file);
            pdfEmbed.src = url;
            pdfViewer.style.display = "block";
        }

        function hidePDFViewer() {
            const pdfViewer = document.getElementById("pdfViewer");
            if (pdfViewer) pdfViewer.style.display = "none";
        }

        fileUpload.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", updateFileDisplay);
        fileUpload.addEventListener("dragover", (ev) => {
            ev.preventDefault();
            fileUpload.classList.add("dragover");
        });
        fileUpload.addEventListener("dragleave", () => fileUpload.classList.remove("dragover"));
        fileUpload.addEventListener("drop", (ev) => {
            ev.preventDefault();
            fileUpload.classList.remove("dragover");
            const files = ev.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                updateFileDisplay();
            }
        });
    }

    if (eventOption) eventOption.addEventListener("change", updateEventHabitView);
    if (habitOption) habitOption.addEventListener("change", updateEventHabitView);
    if (dailyOption) dailyOption.addEventListener("change", updateFrequencyView);
    if (weeklyOption) weeklyOption.addEventListener("change", updateFrequencyView);
    if (monthlyOption) monthlyOption.addEventListener("change", updateFrequencyView);
    if (saveEventBtn) saveEventBtn.addEventListener("click", saveEvent);
    if (saveHabitBtn) saveHabitBtn.addEventListener("click", saveHabit);

    updateEventHabitView();
    updateFrequencyView();
    handlePrefillFromParams();
    setupFileUpload();
});
