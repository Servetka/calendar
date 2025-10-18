const form = document.getElementById("taskForm");
const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
let tasks = JSON.parse(localStorage.getItem("calendarTasks")) || [];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = document.getElementById("taskText").value.trim();
  const date = document.getElementById("taskDate").value;
  const marker = document.getElementById("taskMarker").value;

  if (text && date) {
    tasks.push({ text, date, marker });
    localStorage.setItem("calendarTasks", JSON.stringify(tasks));
    renderCalendar();
    form.reset();
  }
});

function renderCalendar() {
  calendar.innerHTML = "";
  monthLabel.textContent = new Date(currentYear, currentMonth).toLocaleString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    const dateLabel = document.createElement("div");
    dateLabel.className = "date";
    dateLabel.textContent = day;
    dayDiv.appendChild(dateLabel);

    const dayTasks = tasks
      .map((t, index) => ({ ...t, index }))
      .filter(t => t.date === dateStr);

    dayTasks.forEach(t => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.textContent = `${t.marker || ""} ${t.text}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.style.marginLeft = "5px";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.border = "none";
      deleteBtn.onclick = () => {
        tasks.splice(t.index, 1);
        localStorage.setItem("calendarTasks", JSON.stringify(tasks));
        renderCalendar();
      };

      taskDiv.appendChild(deleteBtn);
      dayDiv.appendChild(taskDiv);
    });

    calendar.appendChild(dayDiv);
  }
}

renderCalendar();
