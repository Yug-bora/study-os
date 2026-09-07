/* =========================================
   STUDY OS — CLASS 11 JEE
========================================= */

const syllabus = {

    Physics: [
        "Units & Measurements",
        "Mathematical Tools",
        "Vectors",
        "Kinematics",
        "Laws of Motion",
        "Work, Energy & Power",
        "System of Particles & Centre of Mass",
        "Rotational Motion",
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
        "Atomic Structure",
        "States of Matter",
        "Thermodynamics",
        "Equilibrium",
        "Redox Reactions",
        "Periodic Classification",
        "Chemical Bonding",
        "Hydrogen",
        "s-Block Elements",
        "Some p-Block Elements",
        "Organic Chemistry — Basic Principles",
        "Hydrocarbons"
    ],

    Mathematics: [
        "Sets",
        "Relations & Functions",
        "Trigonometric Functions",
        "Complex Numbers",
        "Quadratic Equations",
        "Linear Inequalities",
        "Permutations & Combinations",
        "Binomial Theorem",
        "Sequences & Series",
        "Straight Lines",
        "Circles",
        "Conic Sections",
        "Introduction to 3D Geometry",
        "Limits & Derivatives",
        "Statistics",
        "Probability"
    ]
};


/* =========================================
   STATE
========================================= */

let progress = JSON.parse(
    localStorage.getItem("studyOSProgress")
) || {};

let practicedQuestions = Number(
    localStorage.getItem("studyOSQuestions") || 0
);

let studyMinutes = Number(
    localStorage.getItem("studyOSMinutes") || 0
);

let currentFilter = "All";


/* =========================================
   PAGE NAVIGATION
========================================= */

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(pageName);

    if (target) {
        target.classList.add("active");
    }

    navButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.page === pageName
        );
    });

    const titles = {
        dashboard: "Good morning, Warrior.",
        chapters: "Chapter Command Center",
        tests: "Practice Arena",
        analytics: "Your Analytics",
        timer: "Deep Work Mode"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageName] || "Study OS";
}

navButtons.forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});


/* =========================================
   OTHER NAVIGATION BUTTONS
========================================= */

document.querySelectorAll("[data-page-target]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.pageTarget);
    });

});

document.getElementById("continueBtn").addEventListener("click", () => {
    showPage("chapters");
});


document.querySelectorAll(".subject-btn").forEach(button => {

    button.addEventListener("click", () => {

        showPage("chapters");

        currentFilter = button.dataset.subject;

        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.toggle(
                "active",
                filter.dataset.filter === currentFilter
            );
        });

        renderChapters();
    });

});


/* =========================================
   CHAPTER RENDERING
========================================= */

function getChapterKey(subject, chapter) {
    return `${subject}::${chapter}`;
}


function renderChapters() {

    const list = document.getElementById("chapterList");

    const search =
        document.getElementById("chapterSearch")
        .value
        .toLowerCase()
        .trim();

    list.innerHTML = "";

    let number = 1;

    Object.entries(syllabus).forEach(([subject, chapters]) => {

        if (
            currentFilter !== "All" &&
            currentFilter !== subject
        ) {
            return;
        }

        chapters.forEach(chapter => {

            if (
                search &&
                !chapter.toLowerCase().includes(search)
            ) {
                return;
            }

            const key = getChapterKey(subject, chapter);
            const completed = progress[key] === true;

            const item = document.createElement("div");

            item.className = "chapter-item";

            item.innerHTML = `
                <div class="chapter-number">
                    ${String(number).padStart(2, "0")}
                </div>

                <div class="chapter-info">
                    <strong>${chapter}</strong>
                    <span>${subject} • Class 11 • JEE</span>
                </div>

                <button
                    class="complete-btn ${completed ? "completed" : ""}"
                    data-key="${encodeURIComponent(key)}"
                >
                    ${completed ? "✓ Completed" : "Mark complete"}
                </button>
            `;

            list.appendChild(item);

            number++;
        });

    });

    document.querySelectorAll(".complete-btn").forEach(button => {

        button.addEventListener("click", () => {

            const key =
                decodeURIComponent(button.dataset.key);

            progress[key] = !progress[key];

            localStorage.setItem(
                "studyOSProgress",
                JSON.stringify(progress)
            );

            renderChapters();
            updateDashboard();

            showToast(
                progress[key]
                    ? "Chapter completed ⚡"
                    : "Chapter marked incomplete"
            );
        });

    });
}


/* =========================================
   FILTERS
========================================= */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        renderChapters();
    });

});


document
    .getElementById("chapterSearch")
    .addEventListener("input", renderChapters);


/* =========================================
   DASHBOARD
========================================= */

function getStats() {

    let total = 0;
    let completed = 0;

    Object.entries(syllabus).forEach(([subject, chapters]) => {

        chapters.forEach(chapter => {

            total++;

            if (progress[getChapterKey(subject, chapter)]) {
                completed++;
            }

        });

    });

    return {
        total,
        completed,
        remaining: total - completed,
        percentage: total
            ? Math.round((completed / total) * 100)
            : 0
    };
}


function getSubjectStats(subject) {

    const chapters = syllabus[subject];

    let completed = 0;

    chapters.forEach(chapter => {

        if (progress[getChapterKey(subject, chapter)]) {
            completed++;
        }

    });

    return {
        total: chapters.length,
        completed,
        percentage: Math.round(
            (completed / chapters.length) * 100
        )
    };
}


function updateDashboard() {

    const stats = getStats();

    document.getElementById("overallProgress")
        .textContent = `${stats.percentage}%`;

    document.getElementById("completedCount")
        .textContent = stats.completed;

    document.getElementById("questionCount")
        .textContent = practicedQuestions;

    document.getElementById("studyTime")
        .textContent =
        `${Math.floor(studyMinutes / 60)}h`;

    document.getElementById("accuracy")
        .textContent =
        practicedQuestions
            ? "85%"
            : "0%";


    const subjects = [
        ["Physics", "physicsProgress", "physicsBar"],
        ["Chemistry", "chemistryProgress", "chemistryBar"],
        ["Mathematics", "mathsProgress", "mathsBar"]
    ];

    subjects.forEach(([subject, textId, barId]) => {

        const stats = getSubjectStats(subject);

        document.getElementById(textId).textContent =
            `${stats.completed} / ${stats.total} chapters`;

        document.getElementById(barId).style.width =
            `${stats.percentage}%`;
    });


    const orb =
        document.querySelector(".hero-orb");

    orb.style.background =
        `conic-gradient(
            var(--accent) ${stats.percentage * 3.6}deg,
            #20242e ${stats.percentage * 3.6}deg
        )`;


    updateAnalytics();
}


/* =========================================
   ANALYTICS
========================================= */

function updateAnalytics() {

    const stats = getStats();

    document.getElementById("analyticsProgress")
        .textContent = `${stats.percentage}%`;

    document.getElementById("analyticsCompleted")
        .textContent = stats.completed;

    document.getElementById("analyticsRemaining")
        .textContent = stats.remaining;

    document.getElementById("analyticsBar")
        .style.width = `${stats.percentage}%`;


    const subjects = [
        ["Physics", "analysisPhysics", "analysisPhysicsText"],
        ["Chemistry", "analysisChemistry", "analysisChemistryText"],
        ["Mathematics", "analysisMaths", "analysisMathsText"]
    ];

    subjects.forEach(([subject, barId, textId]) => {

        const stats = getSubjectStats(subject);

        document.getElementById(barId)
            .style.width = `${stats.percentage}%`;

        document.getElementById(textId)
            .textContent = `${stats.percentage}%`;
    });
}


/* =========================================
   TESTS
========================================= */

document.querySelectorAll(".start-test").forEach(button => {

    button.addEventListener("click", () => {

        practicedQuestions += 20;

        localStorage.setItem(
            "studyOSQuestions",
            practicedQuestions
        );

        updateDashboard();

        showToast(
            `${button.dataset.subject} test started 🚀`
        );

    });

});


document.getElementById("mockBtn").addEventListener("click", () => {
    showToast("Full JEE mock tests coming in the next module ⚡");
});


/* =========================================
   TIMER
========================================= */

let timerSeconds = 25 * 60;
let timerInterval = null;
let timerRunning = false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60)
            .toString()
            .padStart(2, "0");

    const seconds =
        (timerSeconds % 60)
            .toString()
            .padStart(2, "0");

    document.getElementById("timerDisplay")
        .textContent = `${minutes}:${seconds}`;
}


document.getElementById("timerStart").addEventListener("click", () => {

    if (timerRunning) {

        clearInterval(timerInterval);

        timerRunning = false;

        document.getElementById("timerStart")
            .textContent = "Start";

        return;
    }

    timerRunning = true;

    document.getElementById("timerStart")
        .textContent = "Pause";

    timerInterval = setInterval(() => {

        if (timerSeconds <= 0) {

            clearInterval(timerInterval);

            timerRunning = false;

            document.getElementById("timerStart")
                .textContent = "Start";

            showToast("Focus session complete 🎯");

            return;
        }

        timerSeconds--;

        studyMinutes += 1 / 60;

        localStorage.setItem(
            "studyOSMinutes",
            studyMinutes
        );

        updateTimerDisplay();

    }, 1000);

});


document.getElementById("timerReset").addEventListener("click", () => {

    clearInterval(timerInterval);

    timerRunning = false;
    timerSeconds = 25 * 60;

    document.getElementById("timerStart")
        .textContent = "Start";

    updateTimerDisplay();

});


document.querySelectorAll(".timer-presets button")
    .forEach(button => {

        button.addEventListener("click", () => {

            clearInterval(timerInterval);

            timerRunning = false;

            timerSeconds =
                Number(button.dataset.minutes) * 60;

            document.getElementById("timerStart")
                .textContent = "Start";

            updateTimerDisplay();
        });

    });


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


/* =========================================
   START
========================================= */

renderChapters();
updateDashboard();
updateTimerDisplay();
