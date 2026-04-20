(function () {
    // Compute Mon-Fri dates for the current week
    function getWeekDates() {
        const today = new Date();
        const day = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            dates.push(d);
        }
        return dates;
    }

    const weekDates = getWeekDates();
    const today = new Date();

    // Update week label
    const label = document.querySelector(".week-label");
    if (label) {
        const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        label.textContent = fmt(weekDates[0]) + " - " + fmt(weekDates[4]);
    }

    // Update day headers with actual dates
    const dayIds = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    dayIds.forEach(function (id, i) {
        const th = document.getElementById(id);
        if (!th) return;
        const d = weekDates[i];
        const isToday = d.toDateString() === today.toDateString();
        th.className = "day-header" + (isToday ? " current-day" : "");
        th.innerHTML = dayNames[i] + "<br><small>" + (d.getMonth() + 1) + "/" + d.getDate() + "</small>" + (isToday ? "<span class='sr-only'> (Today)</span>" : "");
    });

    // Generate rows 8 AM - 8 PM
    const tbody = document.getElementById("weekly-body");
    for (let hour = 8; hour <= 20; hour++) {
        const tr = document.createElement("tr");
        const timeLabel = hour < 12 ? hour + " AM" : hour === 12 ? "12 PM" : (hour - 12) + " PM";
        const timeTd = document.createElement("td");
        timeTd.textContent = timeLabel;
        timeTd.className = "time-cell";
        tr.appendChild(timeTd);
        for (let col = 0; col < 5; col++) {
            const td = document.createElement("td");
            td.dataset.day = col;
            td.dataset.hour = hour;
            td.className = "clickable-cell";
            td.title = "Click to add event";
            td.addEventListener("click", function (e) {
                if (e.target !== td) return; // don't trigger when clicking event button
                const cellDate = weekDates[col];
                const yyyy = cellDate.getFullYear();
                const mm = String(cellDate.getMonth() + 1).padStart(2, "0");
                const dd = String(cellDate.getDate()).padStart(2, "0");
                const hh = String(hour).padStart(2, "0");
                const endHour = String(Math.min(hour + 1, 23)).padStart(2, "0");
                window.location.href = "Habit&Event.html?date=" + yyyy + "-" + mm + "-" + dd + "&start=" + hh + ":00&end=" + endHour + ":00";
            });
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    // Render saved events
    const colorMap = { blue: "#3b82f6", green: "#22c55e", red: "#ef4444", purple: "#a855f7", orange: "#f97316" };
    const events = JSON.parse(localStorage.getItem("mindtrack_events") || "[]");
    events.forEach(function (ev) {
        const evDate = new Date(ev.date + "T00:00:00");
        const colIdx = weekDates.findIndex(function (d) { return d.toDateString() === evDate.toDateString(); });
        if (colIdx === -1) return;
        const startHour = parseInt(ev.startTime.split(":")[0]);
        if (startHour < 8 || startHour > 20) return;
        const td = tbody.querySelector("td[data-day='" + colIdx + "'][data-hour='" + startHour + "']");
        if (!td) return;
        const btn = document.createElement("button");
        btn.className = "event-btn";
        btn.textContent = ev.name;
        btn.style.background = colorMap[ev.color] || "#3b82f6";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "0.4rem";
        btn.style.padding = "0.2rem 0.5rem";
        btn.style.fontSize = "0.8rem";
        btn.style.cursor = "pointer";
        btn.style.width = "100%";
        btn.title = ev.startTime + " - " + ev.endTime + (ev.description ? "\n" + ev.description : "");
        td.appendChild(btn);
    });
})();
