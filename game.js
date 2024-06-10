let currentQuestionIndex = 0;
let questions = [];
document.getElementById('loadFile').addEventListener('click', function () {
    questions = [];
    const fileInput = document.getElementById('csvFile').files[0];
    currentQuestionIndex = 0;
    if (fileInput) {
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
                    dapan: cols[5]?.trim(),
                    imageLink: cols[6]?.trim() || ""
                };
            }).filter(q => q.question); // Filter out empty questions
            startGame(questions);
        };
        reader.readAsText(fileInput);
    }
});



function startGame(data) {
    questions = data;

    document.getElementById('gamemsgwin').classList.remove('show');
    document.getElementById('gamemsgwin').classList.add('hidden');
    document.getElementById('gamemsg').classList.remove('hidden');
    document.getElementById('gamemsg').classList.add('show');
    renderMeteors();
    showQuestion();
    document.getElementById('questionContainer').classList.remove('hidden');
}

function getRandomTopOffset() {
    return Math.random() * 10 + 10; // Random từ 10 đến 20px
}

function renderMeteors() {
    // Get the element with the class 'game-background'
    var gameBackgroundElement = document.querySelector('.game-background');

    // Get the computed height of the element
    var computedHeight = window.getComputedStyle(gameBackgroundElement).height;

    // Parse the height to get a numeric value
    var heightValue = parseFloat(computedHeight);

    // Calculate half the height
    var halfHeight = heightValue / 2;
    const gameContainer = document.getElementById('gameContainer');
    const startPositionTop = halfHeight; // Vị trí bắt đầu top

    questions.forEach((question, index) => {
        const meteor = document.createElement('div');
        meteor.className = 'meteor absolute';

        // Tính toán vị trí left
        let leftPosition;
        if (index === 0) {
            leftPosition = 0;
            meteor.style.backgroundImage = `url('images/gameontap/planet.png')`;
            meteor.style.width = `100px`;
            meteor.style.height = `80px`;
        } else if (index === questions.length - 1) {
            leftPosition = window.innerWidth - 120; // Sát bên phải
            meteor.style.backgroundImage = `url('images/gameontap/traidat.png')`;
            meteor.style.width = `100px`;
            meteor.style.height = `100px`;
        } else {
            leftPosition = (window.innerWidth - 120) * index / (questions.length - 1) + 60; // Phân bổ đều các thiên thạch ở giữa
            meteor.style.backgroundImage = `url('images/gameontap/thienthach-03.png')`;
            meteor.style.width = `100px`;
            meteor.style.height = `50px`;
        }

        const topOffset = index % 2 === 0 ? getRandomTopOffset() : -getRandomTopOffset(); // Thay đổi vị trí top trong phạm vi 10-20px

        meteor.style.top = `${startPositionTop + topOffset}px`;
        meteor.style.left = `${leftPosition}px`;
        meteor.id = `meteor-${index}`;

        // Đặt vị trí ban đầu cho phi thuyền ở thiên thạch đầu tiên
        if (index === 0) {
            const spaceship = document.getElementById('spaceship');
            // spaceship.style.top = meteor.style.top;
            spaceship.style.left = meteor.style.left;
            spaceship.classList.remove('hidden');
            spaceship.classList.add('show');
            let meteorTop = parseFloat(meteor.style.top);
            let newSpaceshipTop = meteorTop - 50;
            spaceship.style.top = `${newSpaceshipTop}px`;
        }
        gameContainer.appendChild(meteor);

    });
}

function showQuestion() {
    if (currentQuestionIndex + 1 < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('question').innerText = currentQuestion.question;
        const answersContainer = document.getElementById('answers');
        const questionImage = document.getElementById('questionImage');
        answersContainer.innerHTML = '';
        ['A', 'B', 'C', 'D'].forEach(option => {
            const button = document.createElement('button');
            button.innerText = currentQuestion[option];
            // button.classList.add('bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded', 'mb-2', 'w-full');
            button.className = 'w-80 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2';
            button.onclick = () => checkAnswer(option);
            answersContainer.appendChild(button);
        });
        if (currentQuestion.imageLink) {
            questionImage.src = `${currentQuestion.imageLink}`;
            questionImage.classList.remove('hidden');
        } else {
            questionImage.classList.add('hidden');
        }
    } else {
        document.getElementById('gamemsgwin').classList.remove('hidden');
        document.getElementById('gamemsgwin').classList.add('show');
        document.getElementById('gamemsg').classList.remove('show');
        document.getElementById('gamemsg').classList.add('hidden');
        document.getElementById('questionContainer').classList.add('hidden');
        // alert('Congratulations! You have completed all questions.');

    }
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.dapan === selectedOption) {
        moveSpaceship();
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert('Incorrect answer. Try again.');
    }
}

function moveSpaceship() {
    const spaceship = document.getElementById('spaceship');
    const nextMeteor = document.getElementById(`meteor-${currentQuestionIndex + 1}`);
    // spaceship.style.top = nextMeteor.style.top;
    var nextMeteorTop = window.getComputedStyle(nextMeteor).top;
    var nextMeteorTopValue = parseFloat(nextMeteorTop);
    var newSpaceshipTop = nextMeteorTopValue - 50;
    spaceship.style.top = newSpaceshipTop + 'px';
    spaceship.style.left = nextMeteor.style.left;
}
