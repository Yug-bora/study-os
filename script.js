/* ==========================================
   STUDY OS V3
   JEE CLASS 11
   Lightweight + LocalStorage
========================================== */


/* ---------- JEE SYLLABUS ---------- */

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
        "Organic Chemistry: Basic Principles",
        "Hydrocarbons",
        "Solutions",
        "Chemical Kinetics",
        "Surface Chemistry",
        "s-Block Elements",
        "p-Block Elements",
        "Hydrogen",
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


/* ---------- STORAGE ---------- */

const savedProgress =
    JSON.parse(localStorage.getItem("studyOS_progress")) || {};

const savedTasks =
    JSON.parse(localStorage.getItem("studyOS_tasks")) || [];

let progress = savedProgress;
let tasks = savedTasks;

let focusMinutes =
    Number(localStorage.getItem("studyOS_focus")) || 0;

let streak =
    Number(localStorage.getItem("studyOS_streak")) || 0;


/* ---------- INITIALIZE PROGRESS ---------- */

function initializeProgress() {

    Object.keys(syllabus).forEach(subject => {

        if (!progress[subject]) {
            progress[subject] = {};
        }

        syllabus[subject].forEach(chapter => {

            if (typeof progress[subject][chapter] !== "boolean") {
                progress[subject][chapter] = false;
            }

        });

    });

    saveProgress();
}


/* ---------- STORAGE FUNCTIONS ---------- */

function saveProgress() {
    localStorage.setItem(
        "studyOS_progress",
        JSON.stringify(progress)
    );
}

function saveTasks() {
    localStorage.setItem(
        "studyOS_tasks",
        JSON.stringify(tasks)
    );
}


/* ---------- NAVIGATION ---------- */

document.querySelectorAll(".nav-btn").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


function showPage(pageName) {

    document.querySelectorAll(".page")
        .forEach(page => page.classList.remove("active"));

    document.querySelectorAll(".nav-btn")
        .forEach(button => button.classList.remove("active"));

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active");
    }

    const nav = document.querySelector(
        `.nav-btn[data-page="${pageName}"]`
    );

    if (nav) {
        nav.classList.add("active");
    }

    updateAll();
}


/* ---------- SUBJECT TABS ---------- */

let currentSubject = "Physics";

document.querySelectorAll(".subject-tab").forEach(tab => {

    tab.addEventListener("click", () => {

        currentSubject = tab.dataset.subject;

        document.querySelectorAll(".subject-tab")
            .forEach(x => x.classList.remove("active"));

        tab.classList.add("active");

        renderChapters();

    });

});


/* ---------- CHAPTER CALCULATIONS ---------- */

function getSubjectCompleted(subject) {

    return syllabus[subject]
        .filter(chapter => progress[subject][chapter])
        .length;

}

function getSubjectTotal(subject) {

    return syllabus[subject].length;

}

function getSubjectPercent(subject) {

    const total = getSubjectTotal(subject);

    if (!total) return 0;

    return Math.round(
        getSubjectCompleted(subject) / total * 100
    );

}


function getTotalChapters() {

    return Object.values(syllabus)
        .reduce((sum, chapters) => sum + chapters.length, 0);

}


function getCompletedChapters() {

    return Object.keys(syllabus)
        .reduce(
            (sum, subject) =>
                sum + getSubjectCompleted(subject),
            0
        );

}


function getOverallPercent() {

    const total = getTotalChapters();

    if (!total) return 0;

    return Math.round(
        getCompletedChapters() / total * 100
    );

}


/* ---------- CHAPTER UI ---------- */

function renderChapters() {

    const container =
        document.getElementById("chapterList");

    if (!container) return;

    const chapters = syllabus[currentSubject];

    container.innerHTML = chapters.map((chapter, index) => {

        const completed =
            progress[currentSubject][chapter];

        return `
            <div class="chapter">

                <div class="chapter-top">

                    <div class="chapter-name">
                        <strong>${index + 1}. ${chapter}</strong>
                    </div>

                    <span class="chapter-status">
                        ${completed ? "Completed" : "Not started"}
                    </span>

                    <button
                        class="chapter-btn ${completed ? "completed" : ""}"
                        onclick="toggleChapter('${escapeQuotes(currentSubject)}','${escapeQuotes(chapter)}')"
                    >
                        ${completed ? "✓ Done" : "Complete"}
                    </button>

                </div>

            </div>
        `;

    }).join("");

}


function escapeQuotes(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


function toggleChapter(subject, chapter) {

    progress[subject][chapter] =
        !progress[subject][chapter];

    saveProgress();

    renderChapters();
    updateAll();

}


/* ---------- SUBJECT PROGRESS UI ---------- */

function renderSubjectProgress(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML =
        Object.keys(syllabus).map(subject => {

            const percent =
                getSubjectPercent(subject);

            return `
                <div class="subject-row">

                    <div class="subject-info">
                        <strong>${subject}</strong>
                        <span>
                            ${getSubjectCompleted(subject)}
                            / ${getSubjectTotal(subject)}
                            · ${percent}%
                        </span>
                    </div>

                    <div class="progress-track">
                        <div
                            class="progress-fill"
                            style="width:${percent}%"
                        ></div>
                    </div>

                </div>
            `;

        }).join("");

}


/* ---------- TASK SYSTEM ---------- */

function addTask() {

    const name =
        prompt("Enter your study task:");

    if (!name || !name.trim()) {
        return;
    }

    tasks.unshift({
        id: Date.now(),
        name: name.trim(),
        completed: false,
        date: new Date().toISOString()
    });

    saveTasks();

    updateAll();

}


function toggleTask(id) {

    const task =
        tasks.find(t => t.id === id);

    if (!task) return;

    task.completed =
        !task.completed;

    saveTasks();

    updateAll();

}


function deleteTask(id) {

    tasks =
        tasks.filter(task => task.id !== id);

    saveTasks();

    updateAll();

}


let currentTaskFilter = "all";

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        currentTaskFilter =
            button.dataset.filter;

        document.querySelectorAll(".filter")
            .forEach(x => x.classList.remove("active"));

        button.classList.add("active");

        renderTasks();

    });

});


function getFilteredTasks() {

    if (currentTaskFilter === "pending") {

        return tasks.filter(
            task => !task.completed
        );

    }

    if (currentTaskFilter === "completed") {

        return tasks.filter(
            task => task.completed
        );

    }

    return tasks;

}


function taskHTML(task) {

    return `
        <div class="task-item">

            <div
                class="task-check ${task.completed ? "done" : ""}"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </div>

            <div class="task-name ${task.completed ? "done" : ""}">
                ${escapeHTML(task.name)}
            </div>

            <button
                class="task-delete"
                onclick="deleteTask(${task.id})"
            >
                ✕
            </button>

        </div>
    `;

}


function renderTasks() {

    const container =
        document.getElementById("taskList");

    if (!container) return;

    const filtered =
        getFilteredTasks();

    if (!filtered.length) {

        container.innerHTML =
            `<div class="empty">No tasks here.</div>`;

        return;
    }

    container.innerHTML =
        filtered.map(taskHTML).join("");

}


function renderDashboardTasks() {

    const container =
        document.getElementById("dashboardTasks");

    if (!container) return;

    const pending =
        tasks.filter(task => !task.completed)
             .slice(0, 5);

    if (!pending.length) {

        container.innerHTML =
            `<div class="empty">No pending tasks 🎉</div>`;

        return;
    }

    container.innerHTML =
        pending.map(taskHTML).join("");

}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ---------- TASK STATS ---------- */

function getTaskPercent() {

    if (!tasks.length) return 0;

    const completed =
        tasks.filter(task => task.completed).length;

    return Math.round(
        completed / tasks.length * 100
    );

}


/* ---------- ANALYSIS ---------- */

function renderAnalysis() {

    const overall =
        getOverallPercent();

    const completed =
        getCompletedChapters();

    const total =
        getTotalChapters();

    const taskPercent =
        getTaskPercent();

    document.getElementById(
        "analysisPercent"
    ).textContent = `${overall}%`;

    document.getElementById(
        "analysisChapters"
    ).textContent = `${completed} / ${total}`;

    document.getElementById(
        "analysisTasks"
    ).textContent = `${taskPercent}%`;

    document.getElementById(
        "analysisFocus"
    ).textContent = formatMinutes(focusMinutes);

    document.getElementById(
        "analysisStreak"
    ).textContent = streak;

    let message = "";
    let sub = "";

    if (overall === 0) {

        message = "Let's get started.";
        sub = "Complete your first chapter to begin tracking progress.";

    } else if (overall < 25) {

        message = "Foundation phase.";
        sub = "Keep building your Class 11 base.";

    } else if (overall < 50) {

        message = "Good progress.";
        sub = "You're building momentum. Keep going.";

    } else if (overall < 75) {

        message = "You're getting strong.";
        sub = "More than half the syllabus is within reach.";

    } else if (overall < 100) {

        message = "Almost there.";
        sub = "Finish the remaining chapters.";

    } else {

        message = "Class 11 complete! 🔥";
        sub = "Amazing work. Time to strengthen with revision and PYQs.";

    }

    document.getElementById(
        "analysisMessage"
    ).textContent = message;

    document.getElementById(
        "analysisSub"
    ).textContent = sub;


    renderSubjectProgress("analysisSubjects");

    renderInsights();

}


function renderInsights() {

    const container =
        document.getElementById("insights");

    if (!container) return;

    const insights = [];

    const subjects =
        Object.keys(syllabus);

    const percentages =
        subjects.map(subject => ({
            subject,
            percent: getSubjectPercent(subject)
        }));

    const weakest =
        percentages.reduce(
            (a, b) =>
                a.percent <= b.percent ? a : b
        );

    const strongest =
        percentages.reduce(
            (a, b) =>
                a.percent >= b.percent ? a : b
        );


    if (getOverallPercent() === 0) {

        insights.push(
            "Start by completing one chapter in the subject you're currently studying."
        );

    } else {

        insights.push(
            `${strongest.subject} is currently your strongest subject at ${strongest.percent}%.`
        );

        insights.push(
            `${weakest.subject} needs the most attention at ${weakest.percent}%.`
        );

    }


    if (getTaskPercent() < 50 && tasks.length > 0) {

        insights.push(
            "Your task completion is below 50%. Try finishing your highest-priority tasks first."
        );

    } else if (tasks.length > 0) {

        insights.push(
            "Your task completion is looking good. Keep your daily workload realistic."
        );

    } else {

        insights.push(
            "Add a few study tasks to make your daily plan more useful."
        );

    }


    if (focusMinutes === 0) {

        insights.push(
            "You haven't logged any Focus Mode time yet. Try a 25-minute session."
        );

    } else {

        insights.push(
            `You've logged ${formatMinutes(focusMinutes)} of Focus Mode time.`
        );

    }


    container.innerHTML =
        insights.map(text =>
            `<div class="insight">💡 ${text}</div>`
        ).join("");

}


/* ---------- DASHBOARD ---------- */

function renderDashboard() {

    const overall =
        getOverallPercent();

    document.getElementById(
        "heroProgress"
    ).textContent = `${overall}%`;

    document.getElementById(
        "totalChapters"
    ).textContent = getTotalChapters();

    document.getElementById(
        "completedChapters"
    ).textContent = getCompletedChapters();

    document.getElementById(
        "totalTasks"
    ).textContent = tasks.length;

    document.getElementById(
        "focusTime"
    ).textContent =
        formatMinutes(focusMinutes);

    renderSubjectProgress(
        "dashboardSubjects"
    );

    renderDashboardTasks();

}


/* ---------- PLANNER ---------- */

function renderPlanner() {

    const today =
        document.getElementById("todayPlan");

    const upcoming =
        document.getElementById("upcomingPlan");

    if (!today || !upcoming) return;

    const pending =
        tasks.filter(task => !task.completed);

    today.innerHTML =
        pending.slice(0, 3).length
            ? pending.slice(0, 3).map(taskHTML).join("")
            : `<div class="empty">Nothing planned.</div>`;

    upcoming.innerHTML =
        pending.slice(3, 8).length
            ? pending.slice(3, 8).map(taskHTML).join("")
            : `<div class="empty">No upcoming tasks.</div>`;

}


/* ---------- FOCUS TIMER ---------- */

let timerSeconds = 25 * 60;
let timerRunning = false;
let timerInterval = null;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;

    document.getElementById(
        "timer"
    ).textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function setTimer(minutes) {

    stopTimer();

    timerSeconds =
        minutes * 60;

    updateTimerDisplay();

}


function startTimer() {

    if (timerRunning) return;

    timerRunning = true;

    document.getElementById(
        "startTimer"
    ).textContent = "Pause";

    timerInterval =
        setInterval(() => {

            if (timerSeconds <= 0) {

                stopTimer();

                focusMinutes += 25;

                localStorage.setItem(
                    "studyOS_focus",
                    focusMinutes
                );

                updateAll();

                alert("Focus session complete! 🔥");

                setTimer(25);

                return;
            }

            timerSeconds--;

            updateTimerDisplay();

        }, 1000);

}


function stopTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    timerInterval = null;

    const button =
        document.getElementById("startTimer");

    if (button) {
        button.textContent = "Start";
    }

}


document.getElementById(
    "startTimer"
).addEventListener("click", () => {

    if (timerRunning) {

        stopTimer();

    } else {

        startTimer();

    }

});


document.getElementById(
    "resetTimer"
).addEventListener("click", () => {

    setTimer(25);

});


/* ---------- DATE ---------- */

function renderDate() {

    const now = new Date();

    document.getElementById(
        "todayDate"
    ).textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


/* ---------- STREAK ---------- */

function updateStreak() {

    const today =
        new Date().toISOString().slice(0, 10);

    const lastDate =
        localStorage.getItem("studyOS_lastDate");

    if (lastDate !== today) {

        if (lastDate) {

            const last =
                new Date(lastDate);

            const current =
                new Date(today);

            const difference =
                Math.floor(
                    (current - last) /
                    (1000 * 60 * 60 * 24)
                );

            if (difference === 1) {

                streak++;

            } else if (difference > 1) {

                streak = 1;

            }

        } else {

            streak = 1;

        }

        localStorage.setItem(
            "studyOS_lastDate",
            today
        );

        localStorage.setItem(
            "studyOS_streak",
            streak
        );

    }

    document.getElementById(
        "sideStreak"
    ).textContent =
        `${streak} day${streak === 1 ? "" : "s"}`;

}


/* ---------- FORMAT ---------- */

function formatMinutes(minutes) {

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


/* ---------- GLOBAL UPDATE ---------- */

function updateAll() {

    renderDashboard();

    renderTasks();

    renderPlanner();

    renderChapters();

    renderAnalysis();

    updateStreak();

}


/* ---------- START ---------- */

initializeProgress();

renderDate();

updateTimerDisplay();

updateAll();
