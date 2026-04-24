(function () {
    const habitsKey = "mindtrack_habits";
    const completionKey = "mindtrack_dashboard_checks";

    function todayIsoDate() {
        return new Date().toISOString().slice(0, 10);
    }

    function todayName() {
        return new Date().toLocaleDateString("en-US", { weekday: "long" });
    }

    function dayOfMonth() {
        return new Date().getDate();
    }

    function parseDateDay(dateStr) {
        if (!dateStr) return null;
        const day = Number(dateStr.split("-")[2]);
        return Number.isFinite(day) ? day : null;
    }

    function loadHabits() {
        return JSON.parse(localStorage.getItem(habitsKey) || "[]");
    }

    function saveHabits(habits) {
        localStorage.setItem(habitsKey, JSON.stringify(habits));
    }

    function loadFallbackChecks() {
        return JSON.parse(localStorage.getItem(completionKey) || "{}");
    }

    function saveFallbackChecks(obj) {
        localStorage.setItem(completionKey, JSON.stringify(obj));
    }

    function isDueToday(habit) {
        const frequency = (habit.frequency || "daily").toLowerCase();
        if (frequency === "weekly") {
            return (habit.weeklyDate || "") === todayName();
        }
        if (frequency === "monthly") {
            const monthlyDay = parseDateDay(habit.monthlyDate || habit.date);
            return monthlyDay === dayOfMonth();
        }
        if (Array.isArray(habit.days) && habit.days.length > 0) {
            return habit.days.includes(todayName());
        }
        return true;
    }

    function setCircleProgress(percent) {
        const circle = document.querySelector(".progress-circle");
        const fill = document.querySelector(".progress-circle-fill");
        const value = document.querySelector(".progress-circle-value");
        if (!circle || !fill || !value) return;

        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const safePercent = Math.max(0, Math.min(100, percent));
        const offset = circumference * (1 - safePercent / 100);

        fill.style.strokeDasharray = String(circumference);
        fill.style.strokeDashoffset = String(offset);
        value.textContent = Math.round(safePercent) + "%";
        circle.setAttribute("aria-valuenow", String(Math.round(safePercent)));
    }

    function renderFromSavedHabits() {
        const group = document.querySelector(".habit-checkbox-group ul");
        if (!group) return false;

        const allHabits = loadHabits();
        const dueHabits = allHabits.filter(isDueToday);
        if (dueHabits.length === 0) return false;

        const today = todayIsoDate();
        group.innerHTML = "";

        dueHabits.forEach((habit, index) => {
            const habitId = habit.id || ("habit_" + index);
            const isChecked = Array.isArray(habit.completedDates) && habit.completedDates.includes(today);

            const li = document.createElement("li");
            li.innerHTML =
                "<label>" +
                "<input type='checkbox' data-habit-id='" + habitId + "'" + (isChecked ? " checked" : "") + "> " +
                habit.name +
                "</label>";
            group.appendChild(li);
        });

        group.addEventListener("change", function (ev) {
            const target = ev.target;
            if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") return;
            const habitId = target.getAttribute("data-habit-id");
            if (!habitId) return;

            const habits = loadHabits();
            const idx = habits.findIndex((h) => (h.id || "") === habitId);
            if (idx === -1) return;

            const completed = Array.isArray(habits[idx].completedDates) ? habits[idx].completedDates : [];
            const datePos = completed.indexOf(today);
            if (target.checked && datePos === -1) completed.push(today);
            if (!target.checked && datePos !== -1) completed.splice(datePos, 1);
            habits[idx].completedDates = completed;
            saveHabits(habits);
            updateProgressFromDom();
        });

        updateProgressFromDom();
        return true;
    }

    function setupFallbackChecklist() {
        const checkboxes = Array.from(document.querySelectorAll(".habit-checkbox-group input[type='checkbox']"));
        if (checkboxes.length === 0) {
            setCircleProgress(0);
            return;
        }

        const today = todayIsoDate();
        const checks = loadFallbackChecks();
        const todayMap = checks[today] || {};

        checkboxes.forEach((cb) => {
            const key = cb.name || cb.value;
            cb.checked = Boolean(todayMap[key]);
            cb.addEventListener("change", () => {
                const store = loadFallbackChecks();
                if (!store[today]) store[today] = {};
                store[today][key] = cb.checked;
                saveFallbackChecks(store);
                updateProgressFromDom();
            });
        });

        updateProgressFromDom();
    }

    function updateProgressFromDom() {
        const checkboxes = Array.from(document.querySelectorAll(".habit-checkbox-group input[type='checkbox']"));
        const total = checkboxes.length;
        const checked = checkboxes.filter((cb) => cb.checked).length;
        const percent = total === 0 ? 0 : (checked / total) * 100;
        setCircleProgress(percent);
    }

    if (!renderFromSavedHabits()) {
        setupFallbackChecklist();
    }
})();
