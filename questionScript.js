document.getElementById('startButton').addEventListener('click', startQuiz);

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    // Reset the current state
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('iconContainer').innerHTML = '';
    document.getElementById('congratsMessage').classList.add('hidden');
    document.getElementById('wrongMessage').classList.add('hidden');
    document.getElementById('nextButton').classList.add('hidden');
    document.getElementById('finalMsg')?.classList.add('hidden');

    // Load new questions from the uploaded CSV file
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
        alert('Please upload a CSV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // Remove header row
        questions = rows.map(row => {
            const cols = row.split(',');
            return {
                question: cols[0],
                A: cols[1],
                B: cols[2],
                C: cols[3],
                D: cols[4],
                answer: cols[5]?.trim(),
                imageLink: cols[6]?.trim() || ""
            };
        }).filter(q => q.question); // Filter out empty questions

        questions = shuffleArray(questions).slice(0, 5);
        document.getElementById('quizContainer').classList.remove('hidden');
        displayQuestion();
    };
    reader.readAsText(fileInput);
}
function displayQuestion() {
    const questionData = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const answersContainer = document.getElementById('answersContainer');
    const questionImage = document.getElementById('questionImage');

    questionElement.textContent = questionData.question;

    answersContainer.innerHTML = '';
    ['A', 'B', 'C', 'D'].forEach(option => {
        const button = document.createElement('button');
        button.textContent = questionData[option];
        button.classList.add('bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded', 'mb-2', 'w-full');
        button.addEventListener('click', () => checkAnswer(option, button));
        answersContainer.appendChild(button);
    });

    if (questionData.imageLink) {
        questionImage.src = `${questionData.imageLink}`;
        questionImage.classList.remove('hidden');
    } else {
        questionImage.classList.add('hidden');
    }
}

function checkAnswer(selectedOption, selectedButton) {
    const questionData = questions[currentQuestionIndex];
    const congratsMessage = document.getElementById('congratsMessage');
    const wrongMessage = document.getElementById('wrongMessage');

    // Disable all buttons after selection
    const answerButtons = document.querySelectorAll('#answersContainer button');
    answerButtons.forEach(button => button.disabled = true);

    if (selectedOption === questionData.answer) {
        score += 2;
        showCongratsMessage();
        addIcon(true);
        selectedButton.classList.replace('bg-blue-500', 'bg-green-500');
    } else {
        showWrongMessage();
        addIcon(false);
        selectedButton.classList.replace('bg-blue-500', 'bg-red-500');
        // Highlight the correct answer
        answerButtons.forEach(button => {
            if (button.textContent === questionData[questionData.answer]) {
                button.classList.replace('bg-blue-500', 'bg-green-500');
            }
        });
    }

    document.getElementById('nextButton').classList.remove('hidden');
}

function displayResult() {
    const resultElement = document.getElementById('finalMsg');
    resultElement.textContent = `Điểm số của bạn là: ${score}`;
    resultElement.classList.remove('hidden');
    resultElement.classList.add('show');
    document.getElementById('nextButton').classList.add('hidden');
    document.getElementById('backGame').classList.remove('hidden');
    document.getElementById('backGame').classList.add('show');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('nextButton').addEventListener('click', () => {
    currentQuestionIndex++;
    const congratsMessage = document.getElementById('congratsMessage');
    const wrongMessage = document.getElementById('wrongMessage');
    congratsMessage.classList.add('hidden');
    wrongMessage.classList.add('hidden');
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        document.getElementById('nextButton').classList.add('hidden');
    }
    else {
        displayResult();
    }
});

function addIcon(isCorrect) {
    const iconContainer = document.getElementById('iconContainer');
    const icon = document.createElement('span');
    icon.classList.add('mx-1');
    if (isCorrect) {
        icon.innerHTML = '✅';
    } else {
        icon.innerHTML = '❌';
    }
    iconContainer.appendChild(icon);
}

function showCongratsMessage() {
    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.classList.remove('hidden');
    congratsMessage.classList.add('show');
}

function showWrongMessage() {
    const wrongMessage = document.getElementById('wrongMessage');
    wrongMessage.classList.remove('hidden');
    wrongMessage.classList.add('show');
}
