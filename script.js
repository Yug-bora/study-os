/* =========================================
   STUDY OS — JEE CLASS 11
========================================= */

const syllabus = {
  Physics: [
    "Units and Measurements",
    "Motion in a Straight Line",
    "Motion in a Plane",
    "Laws of Motion",
    "Work, Energy and Power",
    "System of Particles and Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory",
    "Oscillations",
    "Waves"
  ],

  Chemistry: [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements and Periodicity",
    "Chemical Bonding and Molecular Structure",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "Organic Chemistry — Basic Principles",
    "Hydrocarbons",
    "States of Matter",
    "Hydrogen",
    "s-Block Elements",
    "Environmental Chemistry"
  ],

  Mathematics: [
    "Sets",
    "Relations and Functions",
    "Trigonometric Functions",
    "Complex Numbers",
    "Quadratic Equations",
    "Linear Inequalities",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequences and Series",
    "Straight Lines",
    "Conic Sections",
    "Introduction to Three Dimensional Geometry",
    "Limits and Derivatives",
    "Statistics",
    "Probability"
  ]
};


/* =========================================
   STORAGE
========================================= */

let tasks = JSON.parse(localStorage.getItem("studyOS_tasks")) || [];

let chapters = JSON.parse(localStorage.getItem("studyOS_chapters")) || {};

let planner = JSON.parse(localStorage.getItem("studyOS_planner")) || [];

let focusMinutes = Number(
  localStorage.getItem("studyOS_focusMinutes") || 0
);

let streak = Number(
  localStorage.getItem("studyOS_streak") || 0
);

let lastStudyDate =
  localStorage.getItem("studyOS_lastDate") || "";


/* =========================================
   NAVIGATION
========================================= */

document.querySelectorAll(".nav-btn").forEach(button => {

  button.addEventListener("click", () => {

    const page = button.dataset.page;

    showPage(page);

  });

});


function showPage(pageName) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const target = document.getElementById(pageName);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  if (pageName === "dashboard") renderDashboard();
  if (pageName === "subjects") renderSubjects();
  if (pageName === "planner") renderPlanner();
  if (pageName === "tasks") renderTasks();
  if (pageName === "analysis") renderAnalysis();
}


/* =========================================
   DATE
========================================= */

function updateDate() {

  const date = new Date();

  const formatted = date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

  const el = document.getElementById("todayDate");

  if (el) el.textContent = formatted;
}


/* =========================================
   CHAPTER HELPERS
========================================= */

function chapterKey(subject, chapter) {
  return `${subject}::${chapter}`;
}


function isChapterDone(subject, chapter) {
  return chapters[chapterKey(subject, chapter)] === true;
}


function toggleChapter(subject, chapter) {

  const key = chapterKey(subject, chapter);

  chapters[key] = !chapters[key];

  saveData();

  renderSubjects();
  renderDashboard();
  renderAnalysis();

}


/* =========================================
   SUBJECTS
========================================= */

function renderSubjects(filter = "all", clickedButton = null) {

  const container =
    document.getElementById("subjectsContainer");

  if (!container) return;

  if (clickedButton) {

    document.querySelectorAll(".subject-tab")
      .forEach(btn => btn.classList.remove("active"));

    clickedButton.classList.add("active");

  }

  container.innerHTML = "";

  const subjects =
    filter === "all"
      ? Object.keys(syllabus)
      : [filter];


  subjects.forEach(subject => {

    const chapterArray = syllabus[subject];

    const completed =
      chapterArray.filter(chapter =>
        isChapterDone(subject, chapter)
      ).length;

    const percent =
      Math.round(
        completed / chapterArray.length * 100
      );

    const section =
      document.createElement("div");

    section.className = "panel subject-section";

    section.innerHTML = `
      <div class="subject-header">

        <div class="subject-title">
          <div class="subject-dot"></div>

          <div>
            <h3>${subject}</h3>
            <small class="muted">
              ${chapterArray.length} chapters
            </small>
          </div>
        </div>

        <div class="subject-progress">
          ${completed}/${chapterArray.length} • ${percent}%
        </div>

      </div>

      <div class="progress">
        <div style="width:${percent}%"></div>
      </div>

      <div class="chapter-list" style="margin-top:15px">

        ${chapterArray.map(chapter => {

          const done =
            isChapterDone(subject, chapter);

          return `
            <label class="chapter ${done ? "done" : ""}">

              <input
                type="checkbox"
                ${done ? "checked" : ""}
                onchange="toggleChapter(
                  '${escapeQuotes(subject)}',
                  '${escapeQuotes(chapter)}'
                )"
              >

              <span>${chapter}</span>

            </label>
          `;

        }).join("")}

      </div>
    `;

    container.appendChild(section);

  });

}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(task => task.done).length;

  let totalChapters = 0;
  let completedChapters = 0;

  Object.keys(syllabus).forEach(subject => {

    totalChapters += syllabus[subject].length;

    syllabus[subject].forEach(chapter => {

      if (isChapterDone(subject, chapter)) {
        completedChapters++;
      }

    });

  });


  document.getElementById("statTasks").textContent =
    completedTasks;

  document.getElementById("statChapters").textContent =
    `${completedChapters}/${totalChapters}`;

  document.getElementById("statFocus").textContent =
    formatHours(focusMinutes);

  document.getElementById("statStreak").textContent =
    `${streak} days`;


  const prep =
    Math.round(
      completedChapters / totalChapters * 100
    );


  document.getElementById("jeeMiniProgress").style.width =
    `${prep}%`;

  document.getElementById("jeeMiniText").textContent =
    `${prep}% prepared`;


  renderDashboardTasks();
  renderDashboardSubjects();

}


function renderDashboardTasks() {

  const container =
    document.getElementById("dashboardTasks");

  if (!container) return;

  const pending =
    tasks.filter(task => !task.done).slice(0, 5);

  if (!pending.length) {

    container.innerHTML = `
      <div class="empty">
        <p class="muted">
          No pending tasks 🎉
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    pending.map(task => taskHTML(task)).join("");

}


function renderDashboardSubjects() {

  const container =
    document.getElementById("dashboardSubjects");

  if (!container) return;

  container.innerHTML =
    Object.keys(syllabus).map(subject => {

      const total = syllabus[subject].length;

      const done =
        syllabus[subject].filter(ch =>
          isChapterDone(subject, ch)
        ).length;

      const percent =
        Math.round(done / total * 100);

      return `
        <div class="analysis-subject">

          <div class="analysis-subject-head">
            <span>${subject}</span>
            <span class="muted">${percent}%</span>
          </div>

          <div class="progress">
            <div style="width:${percent}%"></div>
          </div>

        </div>
      `;

    }).join("");

}


/* =========================================
   TASKS
========================================= */

let currentTaskFilter = "all";


function addTask() {

  const title = prompt("Enter your task:");

  if (!title || !title.trim()) return;

  tasks.unshift({
    id: Date.now(),
    title: title.trim(),
    subject: "General",
    done: false,
    created: new Date().toISOString()
  });

  saveData();

  renderTasks();
  renderDashboard();
  renderAnalysis();

}


function toggleTask(id) {

  const task =
    tasks.find(task => task.id === id);

  if (!task) return;

  task.done = !task.done;

  if (task.done) updateStreak();

  saveData();

  renderTasks();
  renderDashboard();
  renderAnalysis();

}


function deleteTask(id) {

  tasks =
    tasks.filter(task => task.id !== id);

  saveData();

  renderTasks();
  renderDashboard();
  renderAnalysis();

}


function filterTasks(filter, button) {

  currentTaskFilter = filter;

  document.querySelectorAll(".task-filter")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");

  renderTasks();

}


function renderTasks() {

  const container =
    document.getElementById("tasksContainer");

  if (!container) return;

  let filtered = [...tasks];

  if (currentTaskFilter === "pending") {
    filtered = filtered.filter(task => !task.done);
  }

  if (currentTaskFilter === "done") {
    filtered = filtered.filter(task => task.done);
  }


  if (!filtered.length) {

    container.innerHTML = `
      <div style="padding:30px;text-align:center">
        <p class="muted">
          No tasks here.
        </p>
      </div>
    `;

    return;
  }


  container.innerHTML =
    filtered.map(task => taskHTML(task)).join("");

}


function taskHTML(task) {

  return `
    <div class="task-item">

      <button
        class="check ${task.done ? "done" : ""}"
        onclick="toggleTask(${task.id})"
      >
        ${task.done ? "✓" : ""}
      </button>

      <div class="task-title ${task.done ? "done" : ""}">
        ${escapeHTML(task.title)}
      </div>

      <span class="task-meta">
        ${task.subject || "General"}
      </span>

      <button
        class="delete-task"
        onclick="deleteTask(${task.id})"
      >
        ×
      </button>

    </div>
  `;

}


/* =========================================
   PLANNER
========================================= */

function createPlan() {

  const subject =
    document.getElementById("planSubject").value;

  const topic =
    document.getElementById("planTopic").value.trim();

  const duration =
    Number(
      document.getElementById("planDuration").value
    );

  if (!topic) {

    alert("Enter a topic first.");

    return;

  }


  planner.push({
    id: Date.now(),
    subject,
    topic,
    duration
  });

  saveData();

  document.getElementById("planTopic").value = "";

  renderPlanner();

}


function deletePlan(id) {

  planner =
    planner.filter(item => item.id !== id);

  saveData();

  renderPlanner();

}


function renderPlanner() {

  const container =
    document.getElementById("plannerList");

  if (!container) return;

  if (!planner.length) {

    container.innerHTML = `
      <div style="padding:30px;text-align:center">
        <p class="muted">
          No study sessions planned yet.
        </p>
      </div>
    `;

    return;
  }


  container.innerHTML =
    planner.map(item => {

      return `
        <div class="session">

          <div class="session-time">
            ${item.duration}m
          </div>

          <div class="session-info">

            <strong>${escapeHTML(item.topic)}</strong>

            <small>
              ${item.subject}
            </small>

          </div>

          <button
            class="delete-task"
            onclick="deletePlan(${item.id})"
          >
            ×
          </button>

        </div>
      `;

    }).join("");

}


/* =========================================
   ANALYSIS
========================================= */

function renderAnalysis() {

  let totalChapters = 0;
  let completedChapters = 0;

  Object.keys(syllabus).forEach(subject => {

    totalChapters += syllabus[subject].length;

    syllabus[subject].forEach(chapter => {

      if (isChapterDone(subject, chapter)) {
        completedChapters++;
      }

    });

  });


  const chapterPercent =
    Math.round(
      completedChapters / totalChapters * 100
    );


  const completedTasks =
    tasks.filter(task => task.done).length;

  const taskPercent =
    tasks.length
      ? Math.round(completedTasks / tasks.length * 100)
      : 0;


  const overall =
    Math.round(
      (chapterPercent + taskPercent) / 2
    );


  document.getElementById("overallPercent")
    .textContent = `${overall}%`;

  document.getElementById("chapterPercent")
    .textContent = `${chapterPercent}%`;

  document.getElementById("taskPercent")
    .textContent = `${taskPercent}%`;

  document.getElementById("chapterProgress")
    .style.width = `${chapterPercent}%`;

  document.getElementById("taskProgress")
    .style.width = `${taskPercent}%`;


  const circle =
    document.querySelector(".analysis-circle");

  if (circle) {

    circle.style.background =
      `conic-gradient(
        var(--purple) ${overall * 3.6}deg,
        rgba(255,255,255,.06) ${overall * 3.6}deg
      )`;

  }


  document.getElementById("chapterAnalysisText")
    .textContent =
      `${completedChapters} of ${totalChapters} chapters completed.`;

  document.getElementById("taskAnalysisText")
    .textContent =
      tasks.length
        ? `${completedTasks} of ${tasks.length} tasks completed.`
        : "Start adding tasks to track your productivity.";


  renderAnalysisSubjects();

  renderInsights(overall, chapterPercent, taskPercent);

  renderReadiness(overall);

}


function renderAnalysisSubjects() {

  const container =
    document.getElementById("analysisSubjects");

  if (!container) return;

  container.innerHTML =
    Object.keys(syllabus).map(subject => {

      const total =
        syllabus[subject].length;

      const done =
        syllabus[subject].filter(ch =>
          isChapterDone(subject, ch)
        ).length;

      const percent =
        Math.round(done / total * 100);

      return `
        <div class="analysis-subject">

          <div class="analysis-subject-head">
            <strong>${subject}</strong>
            <span class="muted">
              ${done}/${total} • ${percent}%
            </span>
          </div>

          <div class="progress">
            <div style="width:${percent}%"></div>
          </div>

        </div>
      `;

    }).join("");

}


function renderInsights(overall, chaptersPercent, taskPercent) {

  const container =
    document.getElementById("insights");

  const insights = [];


  if (overall === 0) {

    insights.push(
      "🚀 Start by completing your first chapter and creating a few study tasks."
    );

  } else {

    if (chaptersPercent < 25) {

      insights.push(
        "📚 Focus on building your chapter foundation. Try completing chapters consistently."
      );

    } else if (chaptersPercent < 60) {

      insights.push(
        "🔥 You're building momentum. Keep pushing your chapter completion rate."
      );

    } else {

      insights.push(
        "💪 Strong syllabus progress. Start giving more attention to revision and PYQs."
      );

    }


    if (taskPercent < 50) {

      insights.push(
        "🎯 Your task completion is below 50%. Keep your daily task list small and achievable."
      );

    } else {

      insights.push(
        "⚡ Good task discipline. Keep maintaining your consistency."
      );

    }

  }


  if (focusMinutes === 0) {

    insights.push(
      "⏱️ Try Focus Mode to start tracking your deep-work time."
    );

  } else {

    insights.push(
      `🧠 You've logged ${formatHours(focusMinutes)} of focus time so far.`
    );

  }


  container.innerHTML =
    insights.map(text =>
      `<div class="insight">${text}</div>`
    ).join("");

}


function renderReadiness(overall) {

  const readiness =
    Math.min(
      100,
      Math.round(
        overall * .8 +
        Math.min(focusMinutes / 10, 20)
      )
    );


  document.getElementById("readinessNumber")
    .textContent = `${readiness}%`;

  document.getElementById("readinessProgress")
    .style.width = `${readiness}%`;


  let text = "";

  if (readiness < 25) {

    text =
      "You're just getting started. Build a consistent routine.";

  } else if (readiness < 50) {

    text =
      "Foundation phase. Keep strengthening your concepts.";

  } else if (readiness < 75) {

    text =
      "Good progress. Increase revision and problem solving.";

  } else {

    text =
      "Excellent progress. Focus on advanced problems and mock tests.";

  }


  document.getElementById("readinessText")
    .textContent = text;

}


/* =========================================
   FOCUS TIMER
========================================= */

let timerSeconds = 25 * 60;
let timerInterval = null;
let focusRunning = false;


function setTimer(minutes) {

  clearInterval(timerInterval);

  focusRunning = false;

  timerSeconds = minutes * 60;

  updateTimer();

  document.getElementById("startFocus")
    .textContent = "Start Focus";

}


function toggleFocus() {

  if (focusRunning) {

    clearInterval(timerInterval);

    focusRunning = false;

    document.getElementById("startFocus")
      .textContent = "Resume Focus";

    return;

  }


  focusRunning = true;

  document.getElementById("startFocus")
    .textContent = "Pause Focus";


  timerInterval =
    setInterval(() => {

      timerSeconds--;

      updateTimer();


      if (timerSeconds <= 0) {

        clearInterval(timerInterval);

        focusRunning = false;

        const sessionMinutes = 25;

        focusMinutes += sessionMinutes;

        localStorage.setItem(
          "studyOS_focusMinutes",
          focusMinutes
        );

        alert("Focus session complete! 🔥");

        document.getElementById("startFocus")
          .textContent = "Start Focus";

        renderDashboard();
        renderAnalysis();

      }

    }, 1000);

}


function resetFocus() {

  clearInterval(timerInterval);

  focusRunning = false;

  timerSeconds = 25 * 60;

  updateTimer();

  document.getElementById("startFocus")
    .textContent = "Start Focus";

}


function updateTimer() {

  const minutes =
    Math.floor(timerSeconds / 60);

  const seconds =
    timerSeconds % 60;

  document.getElementById("timer")
    .textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =========================================
   STREAK
========================================= */

function updateStreak() {

  const today =
    new Date().toISOString().split("T")[0];


  if (lastStudyDate === today) {
    return;
  }


  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );


  const yesterdayString =
    yesterday.toISOString().split("T")[0];


  if (lastStudyDate === yesterdayString) {

    streak++;

  } else {

    streak = 1;

  }


  lastStudyDate = today;

  localStorage.setItem(
    "studyOS_streak",
    streak
  );

  localStorage.setItem(
    "studyOS_lastDate",
    lastStudyDate
  );

}


/* =========================================
   HELPERS
========================================= */

function saveData() {

  localStorage.setItem(
    "studyOS_tasks",
    JSON.stringify(tasks)
  );

  localStorage.setItem(
    "studyOS_chapters",
    JSON.stringify(chapters)
  );

  localStorage.setItem(
    "studyOS_planner",
    JSON.stringify(planner)
  );

}


function formatHours(minutes) {

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(minutes / 60);

  const mins =
    minutes % 60;

  return mins
    ? `${hours}h ${mins}m`
    : `${hours}h`;

}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


function escapeQuotes(text) {

  return text
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  updateDate();

  renderDashboard();

  renderSubjects();

  renderPlanner();

  renderTasks();

  renderAnalysis();

  updateTimer();

});
