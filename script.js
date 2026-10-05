/* =========================================================
   AI STUDY BUDDY
   Complete JavaScript
========================================================= */


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });


    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }


    const nav = document.getElementById("navMenu");

    if (nav) {
        nav.classList.remove("show");
    }


    updateProgress();
}


function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("show");

}



/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    const name = localStorage.getItem("studyBuddyName") || "Student";

    document.getElementById("welcomeName").textContent = name;

    document.getElementById("profileDisplayName").textContent = name;

    document.getElementById("studentName").value =
        name === "Student" ? "" : name;

}


function saveProfile() {

    const input = document.getElementById("studentName");

    const name = input.value.trim();

    if (!name) {

        alert("Please enter your name.");

        return;
    }


    localStorage.setItem("studyBuddyName", name);

    document.getElementById("welcomeName").textContent = name;

    document.getElementById("profileDisplayName").textContent = name;

    alert("Profile saved successfully!");


    showSection("home");

}



/* =========================================================
   ASK AI
========================================================= */

function setQuestion(question) {

    document.getElementById("questionInput").value = question;

}


function askAI() {

    const input = document.getElementById("questionInput");

    const answerBox = document.getElementById("aiAnswer");

    const question = input.value.trim();


    if (!question) {

        alert("Please type a question first.");

        return;
    }


    let answer = "";


    const lowerQuestion = question.toLowerCase();


    if (
        lowerQuestion.includes("photosynthesis") ||
        lowerQuestion.includes("plant")
    ) {

        answer =
`Photosynthesis is the process by which green plants make their food.

Plants use sunlight, water and carbon dioxide to produce food and oxygen.

Simple formula:

Carbon dioxide + Water + Sunlight → Food + Oxygen

Think of a plant as a tiny food factory powered by sunlight.`;

    }

    else if (
        lowerQuestion.includes("newton") ||
        lowerQuestion.includes("motion")
    ) {

        answer =
`Newton's laws explain how objects move.

1. First Law: An object stays at rest or keeps moving unless a force changes it.

2. Second Law: A greater force produces greater acceleration.

3. Third Law: Every action has an equal and opposite reaction.

Example:
When you push a wall, you apply force to the wall and the wall pushes back.`;

    }

    else if (
        lowerQuestion.includes("water cycle") ||
        lowerQuestion.includes("water")
    ) {

        answer =
`The water cycle is the continuous movement of water on Earth.

The main steps are:

1. Evaporation
2. Condensation
3. Precipitation
4. Collection

Sunlight provides energy for evaporation, and clouds form during condensation.`;

    }

    else if (
        lowerQuestion.includes("fraction") ||
        lowerQuestion.includes("math")
    ) {

        answer =
`A fraction represents a part of a whole.

For example:

3/4 means 3 parts out of 4 equal parts.

3 = numerator
4 = denominator

If a pizza is divided into 4 equal pieces and you eat 3 pieces, you ate 3/4 of the pizza.`;

    }

    else {

        answer =
`Here is a simple way to study this topic:

1. Understand the definition.
2. Learn the important points.
3. Look at an example.
4. Try to explain it in your own words.
5. Practice a few questions.

Your question was:

"${question}"

This version is running in browser demo mode. A real AI model can be connected later through a secure backend.`;

    }


    answerBox.innerHTML = `
        <div class="answer-icon">✨</div>

        <div>
            <h3>AI Answer</h3>

            <p>${escapeHTML(answer)}</p>

            <button
                class="voice-btn"
                onclick="speakAnswer(${JSON.stringify(answer)})"
            >
                🔊 Read Answer
            </button>
        </div>
    `;

}



/* =========================================================
   TEXT TO SPEECH
========================================================= */

function speakAnswer(text) {

    if (!("speechSynthesis" in window)) {

        alert("Voice output is not supported in this browser.");

        return;
    }


    window.speechSynthesis.cancel();


    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";

    speech.rate = 0.95;

    speech.pitch = 1;


    window.speechSynthesis.speak(speech);

}



/* =========================================================
   VOICE QUESTION
========================================================= */

let recognition = null;


function startVoiceQuestion() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported here. Try Google Chrome."
        );

        return;
    }


    if (!recognition) {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";

        recognition.continuous = false;

        recognition.interimResults = false;


        recognition.onstart = function () {

            alert("🎤 Listening... Speak your question.");

        };


        recognition.onresult = function(event) {

            const text =
                event.results[0][0].transcript;

            document.getElementById(
                "questionInput"
            ).value = text;

        };


        recognition.onerror = function(event) {

            console.log("Voice error:", event.error);

        };

    }


    try {

        recognition.start();

    }

    catch (error) {

        console.log(error);

    }

}



/* =========================================================
   NOTES
========================================================= */

function getNotes() {

    return JSON.parse(
        localStorage.getItem("studyBuddyNotes") || "[]"
    );

}


function saveNote() {

    const title =
        document.getElementById("noteTitle").value.trim();

    const text =
        document.getElementById("noteText").value.trim();


    if (!title || !text) {

        alert("Please enter both a title and note.");

        return;
    }


    const notes = getNotes();


    notes.push({

        id: Date.now(),

        title: title,

        text: text,

        date: new Date().toLocaleDateString()

    });


    localStorage.setItem(
        "studyBuddyNotes",
        JSON.stringify(notes)
    );


    document.getElementById("noteTitle").value = "";

    document.getElementById("noteText").value = "";


    displayNotes();

    updateProgress();


    alert("Note saved successfully!");

}


function displayNotes() {

    const notes = getNotes();

    const list = document.getElementById("notesList");


    if (notes.length === 0) {

        list.innerHTML = `
            <div class="note-card">
                <h3>No notes yet</h3>
                <p>Create your first study note above.</p>
            </div>
        `;

        return;
    }


    list.innerHTML = notes.map(note => `

        <div class="note-card">

            <h3>${escapeHTML(note.title)}</h3>

            <p>${escapeHTML(note.text)}</p>

            <small>
                Saved: ${escapeHTML(note.date)}
            </small>

            <br>

            <button
                class="delete-note"
                onclick="deleteNote(${note.id})"
            >
                🗑 Delete
            </button>

        </div>

    `).join("");

}


function deleteNote(id) {

    const notes = getNotes();

    const filtered =
        notes.filter(note => note.id !== id);


    localStorage.setItem(
        "studyBuddyNotes",
        JSON.stringify(filtered)
    );


    displayNotes();

    updateProgress();

}



/* =========================================================
   QUIZ
========================================================= */

const quizQuestions = [

    {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: [
            "Mitochondria",
            "Nucleus",
            "Ribosome",
            "Cell wall"
        ],
        answer: 0
    },

    {
        question: "What is 12 × 5?",
        options: [
            "50",
            "60",
            "70",
            "55"
        ],
        answer: 1
    },

    {
        question: "What is the capital of India?",
        options: [
            "Mumbai",
            "Kolkata",
            "New Delhi",
            "Chennai"
        ],
        answer: 2
    },

    {
        question: "Which gas do plants mainly use during photosynthesis?",
        options: [
            "Oxygen",
            "Nitrogen",
            "Hydrogen",
            "Carbon dioxide"
        ],
        answer: 3
    },

    {
        question: "How many sides does a triangle have?",
        options: [
            "3",
            "4",
            "5",
            "6"
        ],
        answer: 0
    }

];


let currentQuestion = 0;

let currentScore = 0;

let selectedAnswer = null;



function startQuiz() {

    currentQuestion = 0;

    currentScore = 0;

    selectedAnswer = null;


    document.getElementById("quizStart")
        .classList.add("hidden");


    document.getElementById("quizResult")
        .classList.add("hidden");


    document.getElementById("quizArea")
        .classList.remove("hidden");


    loadQuestion();

}



function loadQuestion() {

    const question =
        quizQuestions[currentQuestion];


    document.getElementById("questionNumber")
        .textContent =
        `Question ${currentQuestion + 1} / ${quizQuestions.length}`;


    document.getElementById("scoreDisplay")
        .textContent =
        `Score: ${currentScore}`;


    document.getElementById("quizQuestion")
        .textContent =
        question.question;


    const options =
        document.getElementById("quizOptions");


    options.innerHTML = "";


    selectedAnswer = null;


    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");


        button.className = "option";

        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;


        button.onclick = function() {

            selectAnswer(index, button);

        };


        options.appendChild(button);

    });


    document.getElementById("nextQuestionBtn")
        .textContent =
        currentQuestion === quizQuestions.length - 1
            ? "Finish Quiz"
            : "Next Question →";

}



function selectAnswer(index, button) {

    selectedAnswer = index;


    document
        .querySelectorAll(".option")
        .forEach(option => {

            option.classList.remove("selected");

        });


    button.classList.add("selected");

}



function nextQuestion() {

    if (selectedAnswer === null) {

        alert("Please select an answer.");

        return;
    }


    if (
        selectedAnswer ===
        quizQuestions[currentQuestion].answer
    ) {

        currentScore++;

    }


    currentQuestion++;


    if (currentQuestion >= quizQuestions.length) {

        finishQuiz();

        return;

    }


    loadQuestion();

}



function finishQuiz() {

    const percentage =
        Math.round(
            (currentScore / quizQuestions.length) * 100
        );


    saveQuizResult(percentage);


    document.getElementById("quizArea")
        .classList.add("hidden");


    document.getElementById("quizResult")
        .classList.remove("hidden");


    document.getElementById("finalScore")
        .textContent =
        `You scored ${currentScore} out of ${quizQuestions.length} (${percentage}%).`;


    updateProgress();

}



/* =========================================================
   QUIZ RESULTS
========================================================= */

function getQuizResults() {

    return JSON.parse(
        localStorage.getItem("studyBuddyQuizResults") || "[]"
    );

}


function saveQuizResult(score) {

    const results = getQuizResults();


    results.push({

        score: score,

        date: new Date().toLocaleDateString()

    });


    localStorage.setItem(
        "studyBuddyQuizResults",
        JSON.stringify(results)
    );

}



/* =========================================================
   FLASHCARDS
========================================================= */

const flashcards = [

    {
        question: "What is photosynthesis?",
        answer:
        "Photosynthesis is the process by which green plants make food using sunlight, water and carbon dioxide."
    },

    {
        question: "What is the powerhouse of the cell?",
        answer:
        "The mitochondria are called the powerhouse of the cell because they produce usable energy for the cell."
    },

    {
        question: "What is 12 × 5?",
        answer:
        "12 × 5 = 60."
    },

    {
        question: "What is the capital of India?",
        answer:
        "New Delhi is the capital of India."
    },

    {
        question: "What is evaporation?",
        answer:
        "Evaporation is the process in which liquid water changes into water vapour."
    }

];


let currentFlashcard = 0;


function flipFlashcard() {

    document
        .getElementById("flashcardAnswer")
        .classList.toggle("hidden");


    document
        .querySelector(".flash-front")
        .classList.toggle("hidden");

}


function displayFlashcard() {

    const card =
        flashcards[currentFlashcard];


    document.getElementById(
        "flashcardQuestion"
    ).textContent = card.question;


    document.getElementById(
        "flashcardAnswer"
    ).innerHTML = `
        <span>ANSWER</span>
        <h2>${escapeHTML(card.answer)}</h2>
    `;


    document
        .getElementById("flashcardAnswer")
        .classList.add("hidden");


    document
        .querySelector(".flash-front")
        .classList.remove("hidden");

}


function nextFlashcard() {

    currentFlashcard++;


    if (currentFlashcard >= flashcards.length) {

        currentFlashcard = 0;

    }


    displayFlashcard();

}


function previousFlashcard() {

    currentFlashcard--;


    if (currentFlashcard < 0) {

        currentFlashcard =
            flashcards.length - 1;

    }


    displayFlashcard();

}



/* =========================================================
   STUDY TIMER
========================================================= */

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;


    document.getElementById("timerDisplay")
        .textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}



function startTimer() {

    if (timerRunning) {

        return;

    }


    timerRunning = true;


    document.getElementById("timerStatus")
        .textContent =
        "📚 Study session running...";


    timerInterval =
        setInterval(function() {

            if (timerSeconds <= 0) {

                clearInterval(timerInterval);

                timerRunning = false;

                document.getElementById("timerStatus")
                    .textContent =
                    "🎉 Study session completed!";


                addStudyMinutes();

                alert("🎉 Study session completed!");

                return;

            }


            timerSeconds--;

            updateTimerDisplay();

        }, 1000);

}



function pauseTimer() {

    clearInterval(timerInterval);

    timerRunning = false;


    document.getElementById("timerStatus")
        .textContent =
        "⏸ Timer paused.";

}



function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = 25 * 60;

    updateTimerDisplay();


    document.getElementById("timerStatus")
        .textContent =
        "Ready to study";

}



function setTimer(minutes) {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = minutes * 60;

    updateTimerDisplay();


    document.getElementById("timerStatus")
        .textContent =
        `${minutes} minute study session ready`;

}



function addStudyMinutes() {

    const oldMinutes =
        Number(
            localStorage.getItem("studyMinutes") || 0
        );


    localStorage.setItem(
        "studyMinutes",
        oldMinutes + 25
    );


    updateProgress();

}



/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

    const notes = getNotes();

    const quizResults = getQuizResults();


    document.getElementById("notesCount")
        .textContent =
        notes.length;


    document.getElementById("quizCount")
        .textContent =
        quizResults.length;


    const bestScore =
        quizResults.length
            ? Math.max(
                ...quizResults.map(result => result.score)
            )
            : 0;


    document.getElementById("bestScore")
        .textContent =
        `${bestScore}%`;


    const studyMinutes =
        Number(
            localStorage.getItem("studyMinutes") || 0
        );


    document.getElementById("studyMinutes")
        .textContent =
        studyMinutes;


    let progress = 0;


    if (notes.length > 0) {
        progress += 25;
    }


    if (quizResults.length > 0) {
        progress += 25;
    }


    if (studyMinutes >= 25) {
        progress += 25;
    }


    if (bestScore >= 70) {
        progress += 25;
    }


    document.getElementById("progressFill")
        .style.width =
        `${progress}%`;


    document.getElementById("progressText")
        .textContent =
        `${progress}% completed`;

}



/* =========================================================
   CERTIFICATE
========================================================= */

function generateCertificate() {

    const name =
        localStorage.getItem("studyBuddyName") ||
        "Student";


    const results = getQuizResults();


    const bestScore =
        results.length
            ? Math.max(
                ...results.map(result => result.score)
            )
            : 0;


    document.getElementById("certificateName")
        .textContent =
        name;


    document.getElementById("certificateScore")
        .textContent =
        `${bestScore}%`;


    document.getElementById("certificateDate")
        .textContent =
        `Date: ${new Date().toLocaleDateString()}`;


    showSection("certificate");

}



/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}



/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function() {

    loadProfile();

    displayNotes();

    displayFlashcard();

    updateTimerDisplay();

    updateProgress();

});