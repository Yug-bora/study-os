/* ==========================================
   STUDY OS
   CLEAN V4
========================================== */


/* ================= DATA ================= */

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
        "Organic Chemistry: Basic Principles and Techniques",
        "Hydrocarbons"
    ],

    Mathematics: [
        "Sets",
        "Relations and Functions",
        "Trigonometric Functions",
        "Complex Numbers and Quadratic Equations",
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


/* ================= STORAGE ================= */

let progress =
    JSON.parse(
        localStorage.getItem("studyOS_progress")
    ) || {};

let tasks =
    JSON.parse(
        localStorage.getItem("studyOS_tasks")
    ) || [];

let focusMinutes =
    Number(
        localStorage.getItem("studyOS_focus")
    ) || 0;

let streak =
    Number(
        localStorage.getItem("studyOS_streak")
    ) || 0;


/* ================= INIT ================= */

function initialize() {

    Object.keys(syllabus).forEach(subject => {

        if (!progress[subject]) {
            progress[subject] = {};
        }

        syllabus[subject].forEach(chapter => {

            if (
                typeof progress[subject][chapter]
                !== "boolean"
            ) {
                progress[subject][chapter] = false;
            }

        });

    });

    saveProgress();

}


/* ================= STORAGE ================= */

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


/* ================= NAVIGATION ================= */

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");


navItems.forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.page);

    });

});


function openPage(pageName) {

    /* Hide every page */
    pages.forEach(page => {

        page.classList.remove("active");

    });


    /* Remove active navigation */
    navItems.forEach(button => {

        button.classList.remove("active");

    });


    /* Show requested page */
    const page =
        document.getElementById(pageName);

    if (page) {
        page.classList.add("active");
    }


    /* Activate matching nav */
    const nav =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );

    if (nav) {
        nav.classList.add("active");
    }


    /* Close mobile sidebar */
    closeSidebar();


    /* Refresh data */
    updateUI();


    /* Start page at top */
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


/* ================= MOBILE SIDEBAR ================= */

const sidebar =
    document.getElementById("sidebar");

const menuButton =
    document.getElementById("menuButton");

const overlay =
    document.getElementById("overlay");


menuButton.addEventListener(
    "click",
    toggleSidebar
);

overlay.addEventListener(
    "click",
    closeSidebar
);


function toggleSidebar() {

    sidebar.classList.toggle("open");

    overlay.classList.toggle(
        "active"
    );

}


function closeSidebar() {

    sidebar.classList.remove("open");

    overlay.classList.remove(
        "active"
    );

}


/* ================= SUBJECTS ================= */

let selectedSubject = "Physics";


document
    .querySelectorAll(".subject-tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedSubject =
                    button.dataset.subject;

                document
                    .querySelectorAll(".subject-tab")
                    .forEach(tab =>
                        tab.classList.remove("active")
                    );

                button.classList.add("active");

                renderChapters();

            }
        );

    });


function renderChapters() {

    const container =
        document.getElementById("chapters");

    if (!container) return;


    container.innerHTML =
        syllabus[selectedSubject]
        .map((chapter, index) => {

            const done =
                progress[selectedSubject][chapter];

            return `

                <div class="chapter">

                    <div class="chapter-top">

                        <div class="chapter-name">
                            <b>
                                ${index + 1}. ${escapeHTML(chapter)}
                            </b>
                        </div>

                        <span class="chapter-status">
                            ${done ? "Completed" : "Pending"}
                        </span>

                        <button
                            class="chapter-button ${done ? "done" : ""}"
                            onclick="toggleChapter(${index})"
                        >
                            ${done ? "✓ Done" : "Complete"}
                        </button>

                    </div>

                </div>

            `;

        })
        .join("");

}


function toggleChapter(index) {

    const chapter =
        syllabus[selectedSubject][index];

    progress[selectedSubject][chapter] =
        !progress[selectedSubject][chapter];

    saveProgress();

    renderChapters();

    updateUI();

}


/* ================= CALCULATIONS ================= */

function totalChapters() {

    return Object.values(syllabus)
        .reduce(
            (total, chapters) =>
                total + chapters.length,
            0
        );

}


function completedChapters() {

    let total = 0;

    Object.keys(syllabus)
        .forEach(subject => {

            total +=
                syllabus[subject]
                .filter(
                    chapter =>
                        progress[subject][chapter]
                )
                .length;

        });

    return total;

}


function overallProgress() {

    const total =
        totalChapters();

    if (!total) return 0;

    return Math.round(
        completedChapters()
        / total
        * 100
    );

}


function subjectProgress(subject) {

    const total =
        syllabus[subject].length;

    const done =
        syllabus[subject]
        .filter(
            chapter =>
                progress[subject][chapter]
        )
        .length;

    return total
        ? Math.round(done / total * 100)
        : 0;

}


/* ================= SUBJECT UI ================= */

function subjectHTML(subject) {

    const percent =
        subjectProgress(subject);

    const done =
        syllabus[subject]
        .filter(
            chapter =>
                progress[subject][chapter]
        )
        .length;

    return `

        <div class="subject-row">

            <div class="subject-info">

                <b>${subject}</b>

                <span>
                    ${done}/${syllabus[subject].length}
                    · ${percent}%
                </span>

            </div>

            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width:${percent}%">
                </div>

            </div>

        </div>

    `;

}


function renderSubjectProgress(id) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.innerHTML =
        Object.keys(syllabus)
        .map(subjectHTML)
        .join("");

}


/* ================= TASKS ================= */

let taskFilter = "all";


document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                taskFilter =
                    button.dataset.filter;

                document
                    .querySelectorAll(".filter")
                    .forEach(x =>
                        x.classList.remove("active")
                    );

                button.classList.add("active");

                renderTasks();

            }
        );

    });


function createTask() {

    const text =
        prompt("What do you need to study?");

    if (!text || !text.trim()) return;

    tasks.unshift({

        id: Date.now(),

        title: text.trim(),

        completed: false,

        created:
            new Date().toISOString()

    });

    saveTasks();

    updateUI();

}


function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    if (!task) return;

    task.completed =
        !task.completed;

    saveTasks();

    updateUI();

}


function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();

    updateUI();

}


function taskHTML(task) {

    return `

        <div class="task">

            <div
                class="task-check ${task.completed ? "done" : ""}"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </div>

            <div
                class="task-name ${task.completed ? "done" : ""}"
            >
                ${escapeHTML(task.title)}
            </div>

            <button
                class="delete-task"
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


    let visible = tasks;


    if (taskFilter === "pending") {

        visible =
            tasks.filter(
                task => !task.completed
            );

    }


    if (taskFilter === "completed") {

        visible =
            tasks.filter(
                task => task.completed
            );

    }


    if (!visible.length) {

        container.innerHTML =
            `<div class="empty">No tasks here.</div>`;

        return;

    }


    container.innerHTML =
        visible.map(taskHTML).join("");

}


function renderDashboardTasks() {

    const container =
        document.getElementById(
            "dashboardTasks"
        );

    if (!container) return;


    const pending =
        tasks
        .filter(task => !task.completed)
        .slice(0, 4);


    if (!pending.length) {

        container.innerHTML =
            `<div class="empty">No pending tasks 🎉</div>`;

        return;

    }


    container.innerHTML =
        pending.map(taskHTML).join("");

}


/* ================= PLANNER ================= */

function renderPlanner() {

    const today =
        document.getElementById(
            "todayPlanner"
        );

    const upcoming =
        document.getElementById(
            "upcomingPlanner"
        );


    if (!today || !upcoming) return;


    const pending =
        tasks.filter(
            task => !task.completed
        );


    today.innerHTML =
        pending.length
            ? pending
                .slice(0, 3)
                .map(taskHTML)
                .join("")
            : `<div class="empty">
                    Nothing planned yet.
               </div>`;


    upcoming.innerHTML =
        pending.length > 3
            ? pending
                .slice(3, 8)
                .map(taskHTML)
                .join("")
            : `<div class="empty">
                    No upcoming tasks.
               </div>`;

}


/* ================= ANALYSIS ================= */

function renderAnalysis() {

    const percent =
        overallProgress();

    const completed =
        completedChapters();

    const total =
        totalChapters();

    const taskTotal =
        tasks.length;

    const taskDone =
        tasks.filter(
            task => task.completed
        ).length;

    const taskPercent =
        taskTotal
            ? Math.round(
                taskDone / taskTotal * 100
            )
            : 0;


    document.getElementById(
        "analysisPercent"
    ).textContent =
        percent + "%";


    document.getElementById(
        "analysisChapters"
    ).textContent =
        `${completed}/${total}`;


    document.getElementById(
        "analysisTasks"
    ).textContent =
        taskPercent + "%";


    document.getElementById(
        "analysisFocus"
    ).textContent =
        formatMinutes(focusMinutes);


    document.getElementById(
        "analysisStreak"
    ).textContent =
        streak;


    let title;
    let description;


    if (percent === 0) {

        title = "Let's begin.";
        description =
            "Complete your first chapter to start building your preparation.";

    } else if (percent < 25) {

        title = "Foundation phase.";
        description =
            "Keep building your Class 11 fundamentals.";

    } else if (percent < 50) {

        title = "Good progress.";
        description =
            "You're building momentum. Keep it consistent.";

    } else if (percent < 75) {

        title = "Strong progress.";
        description =
            "You're more than halfway through your tracked syllabus.";

    } else if (percent < 100) {

        title = "Almost there.";
        description =
            "Finish the remaining chapters and keep revising.";

    } else {

        title = "Class 11 complete! 🔥";
        description =
            "Great work. Focus on revision, practice and PYQs.";

    }


    document.getElementById(
        "analysisTitle"
    ).textContent = title;


    document.getElementById(
        "analysisDescription"
    ).textContent = description;


    renderSubjectProgress(
        "analysisSubjects"
    );


    renderInsights();

}


function renderInsights() {

    const container =
        document.getElementById("insights");

    if (!container) return;


    const subjects =
        Object.keys(syllabus);


    const weakest =
        subjects.reduce(
            (a, b) =>
                subjectProgress(a)
                <= subjectProgress(b)
                    ? a
                    : b
        );


    const strongest =
        subjects.reduce(
            (a, b) =>
                subjectProgress(a)
                >= subjectProgress(b)
                    ? a
                    : b
        );


    const messages = [];


    if (overallProgress() === 0) {

        messages.push(
            "Start with one chapter today. Small progress builds momentum."
        );

    } else {

        messages.push(
            `${strongest} is currently your strongest subject at ${subjectProgress(strongest)}%.`
        );

        messages.push(
            `${weakest} is currently your lowest-progress subject at ${subjectProgress(weakest)}%.`
        );

    }


    if (tasks.length === 0) {

        messages.push(
            "Add study tasks so your planner can track your daily workload."
        );

    } else if (getTaskPercent() >= 70) {

        messages.push(
            "Your task completion is strong. Keep your daily workload manageable."
        );

    } else {

        messages.push(
            "Try completing your pending tasks before adding too many new ones."
        );

    }


    if (focusMinutes === 0) {

        messages.push(
            "Try a 25-minute Focus session to start logging study time."
        );

    } else {

        messages.push(
            `You've completed ${formatMinutes(focusMinutes)} of Focus Mode time.`
        );

    }


    container.innerHTML =
        messages
        .map(
            message =>
                `<div class="insight">💡 ${message}</div>`
        )
        .join("");

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const percent =
        overallProgress();


    document.getElementById(
        "overallPercent"
    ).textContent =
        percent + "%";


    document.getElementById(
        "chapterCount"
    ).textContent =
        totalChapters();


    document.getElementById(
        "completedCount"
    ).textContent =
        completedChapters();


    document.getElementById(
        "taskCount"
    ).textContent =
        tasks.length;


    document.getElementById(
        "focusCount"
    ).textContent =
        formatMinutes(focusMinutes);


    renderSubjectProgress(
        "dashboardSubjects"
    );


    renderDashboardTasks();

}


/* ================= DATE ================= */

function renderDate() {

    const date =
        new Date();

    document.getElementById(
        "currentDate"
    ).textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


/* ================= STREAK ================= */

function updateStreak() {

    const today =
        new Date()
        .toISOString()
        .slice(0, 10);


    const last =
        localStorage.getItem(
            "studyOS_lastDate"
        );


    if (last !== today) {

        if (!last) {

            streak = 1;

        } else {

            const previous =
                new Date(last);

            const current =
                new Date(today);

            const days =
                Math.floor(
                    (current - previous)
                    /
                    (1000 * 60 * 60 * 24)
                );


            if (days === 1) {

                streak++;

            } else if (days > 1) {

                streak = 1;

            }

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
        "sidebarStreak"
    ).textContent =
        `${streak} day${streak === 1 ? "" : "s"}`;

}


/* ================= TIMER ================= */

let secondsLeft = 25 * 60;

let timerRunning = false;

let timerInterval = null;


function updateTimer() {

    const minutes =
        Math.floor(
            secondsLeft / 60
        );

    const seconds =
        secondsLeft % 60;


    document.getElementById(
        "timer"
    ).textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

    if (timerRunning) return;


    timerRunning = true;


    document.getElementById(
        "timerButton"
    ).textContent =
        "Pause";


    timerInterval =
        setInterval(() => {

            if (secondsLeft <= 0) {

                clearInterval(
                    timerInterval
                );

                timerInterval = null;

                timerRunning = false;

                focusMinutes +=
                    Math.round(
                        25
                    );

                localStorage.setItem(
                    "studyOS_focus",
                    focusMinutes
                );

                document.getElementById(
                    "timerButton"
                ).textContent =
                    "Start";

                alert(
                    "Focus session complete! 🔥"
                );

                updateUI();

                return;

            }


            secondsLeft--;

            updateTimer();

        }, 1000);

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval = null;

    timerRunning = false;

    document.getElementById(
        "timerButton"
    ).textContent =
        "Start";

}


function setTimer(minutes) {

    pauseTimer();

    secondsLeft =
        minutes * 60;

    updateTimer();

}


document.getElementById(
    "timerButton"
).addEventListener(
    "click",
    () => {

        if (timerRunning) {

            pauseTimer();

        } else {

            startTimer();

        }

    }
);


document.getElementById(
    "resetButton"
).addEventListener(
    "click",
    () => {

        setTimer(25);

    }
);


/* ================= HELPERS ================= */

function getTaskPercent() {

    if (!tasks.length) return 0;

    return Math.round(
        tasks.filter(
            task => task.completed
        ).length
        /
        tasks.length
        *
        100
    );

}


function formatMinutes(minutes) {

    if (minutes < 60) {

        return `${minutes}m`;

    }

    const hours =
        Math.floor(
            minutes / 60
        );

    const mins =
        minutes % 60;


    return mins
        ? `${hours}h ${mins}m`
        : `${hours}h`;

}


function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;

}


/* ================= UPDATE EVERYTHING ================= */

function updateUI() {

    renderDashboard();

    renderChapters();

    renderTasks();

    renderPlanner();

    renderAnalysis();

    updateStreak();

}


/* ================= START ================= */

initialize();

renderDate();

updateTimer();

updateUI();
