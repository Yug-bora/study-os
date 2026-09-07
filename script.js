// ==========================================
// STUDY OS V2
// JEE CLASS 11
// ==========================================


// ==========================================
// SUBJECT DATA
// ==========================================

const subjects = [

  {
    name: "Physics",
    icon: "⚡",
    description:
      "Mechanics, waves, thermodynamics & more",

    chapters: [
      "Units & Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work, Energy & Power",
      "System of Particles",
      "Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves"
    ]
  },


  {
    name: "Chemistry",
    icon: "🧪",
    description:
      "Physical, inorganic & organic chemistry",

    chapters: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements",
      "Chemical Bonding",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry Basics",
      "Hydrocarbons"
    ]
  },


  {
    name: "Mathematics",
    icon: "📐",
    description:
      "Algebra, calculus, coordinate geometry",

    chapters: [
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
      "Conic Sections",
      "Introduction to 3D Geometry",
      "Limits & Derivatives",
      "Statistics",
      "Probability"
    ]
  }

];


// ==========================================
// LOCAL STORAGE
// ==========================================

let tasks =
  JSON.parse(
    localStorage.getItem("studyTasks")
  ) || [

    {
      name:
        "Physics — Units & Measurements",

      subject:
        "Physics",

      done:
        false
    },

    {
      name:
        "Chemistry — Structure of Atom",

      subject:
        "Chemistry",

      done:
        false
    },

    {
      name:
        "Maths — Trigonometric Functions",

      subject:
        "Mathematics",

      done:
        false
    }

  ];


let chapterProgress =
  JSON.parse(
    localStorage.getItem("chapterProgress")
  ) || {};


let focusMinutes =
  Number(
    localStorage.getItem("focusMinutes")
  ) || 0;


// ==========================================
// TIMER
// ==========================================

let timerSeconds =
  25 * 60;

let timerInterval =
  null;


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupNavigation();

    updateDate();

    renderSubjects();

    renderTasks();

    updateDashboard();

    updateTimerDisplay();

  }
);


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

  document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          showPage(
            button.dataset.page
          );

        }
      );

    });

}


function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

      button.classList.remove(
        "active"
      );

    });


  const page =
    document.getElementById(
      pageName
    );


  if (page) {

    page.classList.add(
      "active"
    );

  }


  const button =
    document.querySelector(
      `.nav-btn[data-page="${pageName}"]`
    );


  if (button) {

    button.classList.add(
      "active"
    );

  }


  const titles = {

    dashboard:
      "Dashboard",

    subjects:
      "Subjects",

    planner:
      "Study Planner",

    tasks:
      "Tasks",

    analysis:
      "Analysis",

    focus:
      "Focus Mode"

  };


  document.getElementById(
    "pageTitle"
  ).textContent =
    titles[pageName] ||
    "Dashboard";


  if (
    pageName ===
    "analysis"
  ) {

    setTimeout(
      renderAnalysis,
      100
    );

  }


  if (
    pageName ===
    "planner"
  ) {

    renderPlanner();

  }

}


// ==========================================
// DATE
// ==========================================

function updateDate() {

  const now =
    new Date();


  const formatted =
    now.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );


  document.getElementById(
    "dateBox"
  ).textContent =
    formatted;


  document.getElementById(
    "plannerDate"
  ).textContent =
    formatted;

}


// ==========================================
// SUBJECTS
// ==========================================

function renderSubjects() {

  const container =
    document.getElementById(
      "subjectCards"
    );


  container.innerHTML =
    "";


  subjects.forEach(
    (subject, subjectIndex) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "subject-card";


      let chaptersHTML =
        "";


      subject.chapters.forEach(
        (chapter, chapterIndex) => {

          const key =
            `${subjectIndex}-${chapterIndex}`;


          const checked =
            chapterProgress[key]
              ? "checked"
              : "";


          chaptersHTML += `

            <label class="chapter">

              <input
                type="checkbox"
                ${checked}
                onchange="toggleChapter('${key}')"
              >

              <span>
                ${chapter}
              </span>

            </label>

          `;

        }
      );


      card.innerHTML = `

        <div class="subject-icon">
          ${subject.icon}
        </div>

        <h3>
          ${subject.name}
        </h3>

        <p>
          ${subject.description}
        </p>

        <div class="chapter-list">
          ${chaptersHTML}
        </div>

      `;


      container.appendChild(
        card
      );

    }
  );

}


// ==========================================
// CHAPTER TOGGLE
// ==========================================

function toggleChapter(key) {

  chapterProgress[key] =
    !chapterProgress[key];


  localStorage.setItem(
    "chapterProgress",
    JSON.stringify(
      chapterProgress
    )
  );


  updateDashboard();


  showToast(
    chapterProgress[key]
      ? "Chapter completed 🎯"
      : "Chapter marked incomplete"
  );

}


// ==========================================
// PROGRESS CALCULATIONS
// ==========================================

function calculateProgress() {

  let total =
    0;

  let completed =
    0;


  subjects.forEach(
    (subject, subjectIndex) => {

      subject.chapters.forEach(
        (chapter, chapterIndex) => {

          total++;


          const key =
            `${subjectIndex}-${chapterIndex}`;


          if (
            chapterProgress[key]
          ) {

            completed++;

          }

        }
      );

    }
  );


  return total === 0
    ? 0
    : Math.round(
        (completed / total) * 100
      );

}


function getSubjectProgress(
  subjectIndex
) {

  const subject =
    subjects[subjectIndex];


  let completed =
    0;


  subject.chapters.forEach(
    (chapter, chapterIndex) => {

      const key =
        `${subjectIndex}-${chapterIndex}`;


      if (
        chapterProgress[key]
      ) {

        completed++;

      }

    }
  );


  return Math.round(
    (completed /
      subject.chapters.length) *
      100
  );

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

  const progress =
    calculateProgress();


  document.getElementById(
    "overallPercent"
  ).textContent =
    progress + "%";


  document.getElementById(
    "chaptersDone"
  ).textContent =
    Object.values(
      chapterProgress
    ).filter(Boolean).length;


  const completedTasks =
    tasks.filter(
      task => task.done
    ).length;


  document.getElementById(
    "tasksDone"
  ).textContent =
    `${completedTasks} / ${tasks.length}`;


  const hours =
    Math.floor(
      focusMinutes / 60
    );


  const minutes =
    focusMinutes % 60;


  document.getElementById(
    "focusTime"
  ).textContent =
    `${hours}h ${minutes
      .toString()
      .padStart(2, "0")}m`;


  document.getElementById(
    "miniProgress"
  ).style.width =
    progress + "%";


  document.getElementById(
    "goalText"
  ).textContent =
    `${progress}% completed`;


  renderDashboardTasks();

  renderSubjectProgress();

}


// ==========================================
// SUBJECT PROGRESS
// ==========================================

function renderSubjectProgress() {

  const container =
    document.getElementById(
      "subjectProgress"
    );


  container.innerHTML =
    "";


  subjects.forEach(
    (subject, index) => {

      const progress =
        getSubjectProgress(
          index
        );


      container.innerHTML += `

        <div class="subject-progress">

          <div class="subject-line">

            <strong>
              ${subject.icon}
              ${subject.name}
            </strong>

            <span>
              ${progress}%
            </span>

          </div>


          <div class="progress-bar">

            <div
              style="width:${progress}%"
            ></div>

          </div>

        </div>

      `;

    }
  );

}


// ==========================================
// TASKS
// ==========================================

function renderTasks() {

  renderDashboardTasks();

  renderAllTasks();

  renderPlanner();

}


function renderDashboardTasks() {

  const container =
    document.getElementById(
      "dashboardTasks"
    );


  container.innerHTML =
    "";


  tasks
    .slice(0,5)
    .forEach(
      (task,index) => {

        container.innerHTML +=
          taskHTML(
            task,
            index
          );

      }
    );

}


function renderAllTasks() {

  const container =
    document.getElementById(
      "allTasks"
    );


  container.innerHTML =
    "";


  if (
    tasks.length === 0
  ) {

    container.innerHTML =
      `<p style="color:#8993a7">
        No tasks yet. Add one!
      </p>`;

    return;

  }


  tasks.forEach(
    (task,index) => {

      container.innerHTML +=
        taskHTML(
          task,
          index
        );

    }
  );

}


function taskHTML(
  task,
  index
) {

  return `

    <div
      class="task ${task.done ? "done" : ""}"
      onclick="toggleTask(${index})"
    >

      <div class="task-check">

        ${
          task.done
            ? "✓"
            : ""
        }

      </div>


      <span class="task-name">
        ${task.name}
      </span>


      <span class="task-subject">
        ${task.subject}
      </span>

    </div>

  `;

}


function toggleTask(index) {

  tasks[index].done =
    !tasks[index].done;


  localStorage.setItem(
    "studyTasks",
    JSON.stringify(
      tasks
    )
  );


  renderTasks();

  updateDashboard();


  showToast(
    tasks[index].done
      ? "Task completed 🔥"
      : "Task reopened"
  );

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

  const name =
    prompt(
      "What do you want to study?"
    );


  if (
    !name ||
    !name.trim()
  ) {

    return;

  }


  const subject =
    prompt(
      "Subject? Physics / Chemistry / Mathematics"
    ) ||
    "General";


  tasks.push({

    name:
      name.trim(),

    subject:
      subject,

    done:
      false

  });


  localStorage.setItem(
    "studyTasks",
    JSON.stringify(
      tasks
    )
  );


  renderTasks();

  updateDashboard();


  showToast(
    "Task added ✅"
  );

}


// ==========================================
// PLANNER
// ==========================================

function renderPlanner() {

  const container =
    document.getElementById(
      "plannerTasks"
    );


  container.innerHTML =
    "";


  tasks.forEach(
    (task,index) => {

      container.innerHTML +=
        taskHTML(
          task,
          index
        );

    }
  );

}


// ==========================================
// ANALYSIS ENGINE
// ==========================================

function renderAnalysis() {

  const overall =
    calculateProgress();


  const totalTasks =
    tasks.length;


  const completedTasks =
    tasks.filter(
      task => task.done
    ).length;


  const taskPercent =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );


  const chapterPercent =
    overall;


  // Overall

  animateNumber(
    "analysisOverall",
    overall,
    "%"
  );


  setTimeout(() => {

    document.getElementById(
      "analysisOverallBar"
    ).style.width =
      overall + "%";

  },100);


  // Tasks

  animateNumber(
    "taskPercentage",
    taskPercent,
    "%"
  );


  setTimeout(() => {

    document.getElementById(
      "taskRing"
    ).style.width =
      taskPercent + "%";

  },150);


  // Chapters

  animateNumber(
    "chapterPercentage",
    chapterPercent,
    "%"
  );


  // Messages

  updateAnalysisMessages(
    overall,
    taskPercent
  );


  renderAnalysisSubjects();


  renderInsights();


  renderReadiness(
    overall,
    taskPercent
  );

}


// ==========================================
// ANIMATED NUMBER
// ==========================================

function animateNumber(
  elementId,
  target,
  suffix = ""
) {

  const element =
    document.getElementById(
      elementId
    );


  if (!element) return;


  const duration =
    900;


  const startTime =
    performance.now();


  function update(
    currentTime
  ) {

    const elapsed =
      currentTime -
      startTime;


    const progress =
      Math.min(
        elapsed /
          duration,
        1
      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    const value =
      Math.round(
        target * eased
      );


    element.textContent =
      value + suffix;


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        update
      );

    }

  }


  requestAnimationFrame(
    update
  );

}


// ==========================================
// ANALYSIS MESSAGES
// ==========================================

function updateAnalysisMessages(
  overall,
  taskPercent
) {

  const overallMessage =
    document.getElementById(
      "analysisMessage"
    );


  const taskMessage =
    document.getElementById(
      "taskAnalysis"
    );


  const chapterMessage =
    document.getElementById(
      "chapterAnalysis"
    );


  if (
    overall === 0
  ) {

    overallMessage.textContent =
      "Start completing chapters to generate your analysis.";

  }

  else if (
    overall < 25
  ) {

    overallMessage.textContent =
      "You're getting started. Build consistency before increasing intensity.";

  }

  else if (
    overall < 50
  ) {

    overallMessage.textContent =
      "Good progress. Your foundation is beginning to take shape.";

  }

  else if (
    overall < 75
  ) {

    overallMessage.textContent =
      "Strong progress. Keep the momentum going.";

  }

  else {

    overallMessage.textContent =
      "Excellent coverage. Focus on revision and problem solving.";

  }


  if (
    taskPercent === 0
  ) {

    taskMessage.textContent =
      "No tasks completed yet.";

  }

  else if (
    taskPercent < 50
  ) {

    taskMessage.textContent =
      "Try completing more of today's planned work.";

  }

  else {

    taskMessage.textContent =
      "Great execution. You're turning plans into action.";

  }


  if (
    overall < 40
  ) {

    chapterMessage.textContent =
      "Prioritize completing your core chapters.";

  }

  else if (
    overall < 70
  ) {

    chapterMessage.textContent =
      "Your syllabus coverage is developing well.";

  }

  else {

    chapterMessage.textContent =
      "Excellent chapter coverage. Start strengthening weak areas.";

  }

}


// ==========================================
// SUBJECT ANALYSIS
// ==========================================

function renderAnalysisSubjects() {

  const container =
    document.getElementById(
      "analysisSubjects"
    );


  container.innerHTML =
    "";


  subjects.forEach(
    (subject,index) => {

      const percentage =
        getSubjectProgress(
          index
        );


      let status =
        "Needs Attention";


      if (
        percentage >= 75
      ) {

        status =
          "Strong";

      }

      else if (
        percentage >= 40
      ) {

        status =
          "Developing";

      }


      const card =
        document.createElement(
          "div"
        );


      card.className =
        "analysis-subject";


      card.innerHTML = `

        <div class="analysis-subject-top">

          <span class="analysis-subject-name">
            ${subject.icon}
            ${subject.name}
          </span>

          <span class="analysis-percent">
            ${percentage}%
          </span>

        </div>


        <div class="progress-bar">

          <div
            style="width:0%"
            data-target="${percentage}"
          ></div>

        </div>


        <span class="analysis-status">
          ${status}
        </span>

      `;


      container.appendChild(
        card
      );


      setTimeout(() => {

        const bar =
          card.querySelector(
            ".progress-bar div"
          );


        bar.style.width =
          percentage + "%";

      },100);

    }
  );

}


// ==========================================
// INSIGHTS
// ==========================================

function renderInsights() {

  const container =
    document.getElementById(
      "insightsList"
    );


  container.innerHTML =
    "";


  const overall =
    calculateProgress();


  const physics =
    getSubjectProgress(0);


  const chemistry =
    getSubjectProgress(1);


  const maths =
    getSubjectProgress(2);


  const subjectsData = [

    {
      name:
        "Physics",

      value:
        physics

    },

    {
      name:
        "Chemistry",

      value:
        chemistry

    },

    {
      name:
        "Mathematics",

      value:
        maths

    }

  ];


  const weakest =
    [...subjectsData]
      .sort(
        (a,b) =>
          a.value -
          b.value
      )[0];


  const strongest =
    [...subjectsData]
      .sort(
        (a,b) =>
          b.value -
          a.value
      )[0];


  const insights = [];


  if (
    overall === 0
  ) {

    insights.push({
      icon:
        "🚀",

      text:
        "Your journey is ready to begin. Complete your first chapter to start generating meaningful performance data."
    });

  }


  if (
    overall > 0
  ) {

    insights.push({

      icon:
        "📚",

      text:
        `${strongest.name} is currently your strongest subject at ${strongest.value}%.`

    });


    insights.push({

      icon:
        "🎯",

      text:
        `${weakest.name} currently has the most room for improvement at ${weakest.value}%.`

    });

  }


  const completedTasks =
    tasks.filter(
      task => task.done
    ).length;


  if (
    tasks.length > 0 &&
    completedTasks === tasks.length
  ) {

    insights.push({

      icon:
        "🔥",

      text:
        "You've completed every task currently on your planner. Excellent execution."

    });

  }

  else if (
    tasks.length > 0
  ) {

    insights.push({

      icon:
        "⚡",

      text:
        `${completedTasks} of ${tasks.length} planned tasks are complete. Finish the remaining tasks to improve consistency.`

    });

  }


  insights.forEach(
    (insight,index) => {

      const element =
        document.createElement(
          "div"
        );


      element.className =
        "insight";


      element.style.animationDelay =
        `${index * 120}ms`;


      element.innerHTML = `

        <span class="insight-icon">
          ${insight.icon}
        </span>

        <span class="insight-text">
          ${insight.text}
        </span>

      `;


      container.appendChild(
        element
      );

    }
  );

}


// ==========================================
// JEE READINESS
// ==========================================

function renderReadiness(
  overall,
  taskPercent
) {

  /*
    Current V2 readiness model:

    70% syllabus coverage
    30% task execution

    Later we can add:
    mock test scores
    revision
    PYQs
    accuracy
  */

  const readiness =
    Math.round(
      overall * 0.7 +
      taskPercent * 0.3
    );


  setTimeout(() => {

    document.getElementById(
      "readinessBar"
    ).style.width =
      readiness + "%";

  },200);


  animateNumber(
    "readinessPercent",
    readiness,
    "%"
  );


  const text =
    document.getElementById(
      "readinessText"
    );


  if (
    readiness < 25
  ) {

    text.textContent =
      "You're in the foundation stage. Focus on building daily consistency.";

  }

  else if (
    readiness < 50
  ) {

    text.textContent =
      "You're building momentum. Keep increasing chapter coverage.";

  }

  else if (
    readiness < 75
  ) {

    text.textContent =
      "Solid preparation. Start combining chapters with regular problem practice.";

  }

  else {

    text.textContent =
      "Excellent progress. Prioritize revision, PYQs and mock tests.";

  }

}


// ==========================================
// REFRESH ANALYSIS
// ==========================================

function refreshAnalysis() {

  const button =
    document.querySelector(
      ".analysis-header .secondary-btn"
    );


  button.textContent =
    "Analyzing...";


  setTimeout(() => {

    renderAnalysis();

    button.textContent =
      "↻ Refresh Analysis";


    showToast(
      "Analysis updated 📊"
    );

  },700);

}


// ==========================================
// FOCUS TIMER
// ==========================================

function updateTimerDisplay() {

  const minutes =
    Math.floor(
      timerSeconds / 60
    )
      .toString()
      .padStart(2,"0");


  const seconds =
    (
      timerSeconds % 60
    )
      .toString()
      .padStart(2,"0");


  document.getElementById(
    "timerDisplay"
  ).textContent =
    `${minutes}:${seconds}`;

}


function startTimer() {

  if (
    timerInterval
  ) {

    return;

  }


  timerInterval =
    setInterval(
      () => {

        if (
          timerSeconds <= 0
        ) {

          clearInterval(
            timerInterval
          );

          timerInterval =
            null;


          showToast(
            "Focus session complete 🎉"
          );


          return;

        }


        timerSeconds--;

        updateTimerDisplay();

      },
      1000
    );


  showToast(
    "Focus mode started 🚀"
  );

}


function pauseTimer() {

  clearInterval(
    timerInterval
  );


  timerInterval =
    null;


  showToast(
    "Timer paused"
  );

}


function resetTimer() {

  pauseTimer();


  timerSeconds =
    25 * 60;


  updateTimerDisplay();

}


function setTimer(minutes) {

  pauseTimer();


  timerSeconds =
    minutes * 60;


  updateTimerDisplay();


  showToast(
    `${minutes}-minute session selected`
  );

}


// ==========================================
// TOAST
// ==========================================

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2200
  );

}
