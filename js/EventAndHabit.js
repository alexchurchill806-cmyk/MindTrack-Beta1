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

    updateFrequencyView();
});

document.addEventListener("DOMContentLoaded", () => {
    const fileUpload = document.querySelector(".FileUpload");
    const fileInput = document.getElementById("FileInput");
    const uploadText = fileUpload.querySelector("p");

    function updateFileDisplay() {
        if (fileInput.files.length > 0) {
            uploadText.textContent = `File selected: ${fileInput.files[0].name}`;
            displayPDF(fileInput.files[0]);
        } else {
            uploadText.textContent = "Drag & Drop PDF here or Click to Upload";
            hidePDFViewer();
        }
    }

    function displayPDF(file) {
        const pdfEmbed = document.getElementById('pdfEmbed');
        const pdfViewer = document.getElementById('pdfViewer');
        const url = URL.createObjectURL(file);
        pdfEmbed.src = url;
        pdfViewer.style.display = 'block';
    }

    function hidePDFViewer() {
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.style.display = 'none';
    }

    fileUpload.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", updateFileDisplay);

    fileUpload.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileUpload.classList.add("dragover");
    });

    fileUpload.addEventListener("dragleave", () => {
        fileUpload.classList.remove("dragover");
    });

    fileUpload.addEventListener("drop", (e) => {
        e.preventDefault();
        fileUpload.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFileDisplay();
        }
    });
});
