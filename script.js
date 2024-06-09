document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('loadButton').addEventListener('click', loadGame);

function loadGame() {
    const winnerDiv = document.getElementById('winner');
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a CSV file.');
        return;
    }
    winnerDiv.classList.remove('show');
    winnerDiv.classList.add('hidden');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const csvData = event.target.result;
        const students = parseCSV(csvData);
        setupRace(students);
    };
    reader.readAsText(file);
}

function startGame() {
    const winnerDiv = document.getElementById('winner');
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a CSV file.');
        return;
    }
    winnerDiv.classList.remove('show');
    winnerDiv.classList.add('hidden');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;
        const students = parseCSV(csvData);
        setupRace(students);
        startRace(students);
    };

    reader.readAsText(file);
}

function parseCSV(data) {
    const lines = data.split('\n');
    return lines.map(line => line.trim()).filter(line => line.length > 0);
}

function setupRace(students) {
    const raceTrack = document.getElementById('raceTrack');
    raceTrack.innerHTML = ''; // Clear previous boats if any

    students.forEach((student, index) => {
        const boat = document.createElement('div');
        boat.className = 'boat';
        boat.style.top = `${Math.random() * (raceTrack.offsetHeight - 50)}px`; // Random vertical position
        boat.style.backgroundImage = `url('images/thuyen/boat${Math.floor(Math.random() * 13) + 1}.png')`; // Random boat image
        boat.setAttribute('data-name', student); // Set student name as data attribute
        raceTrack.appendChild(boat);
    });
}

function startRace(students) {
    const boats = document.querySelectorAll('.boat');
    const raceTrackWidth = document.getElementById('raceTrack').offsetWidth;
    let raceFinished = false;

    boats.forEach(boat => {
        let position = 0;
        const speed = Math.random() * 6 + Math.random() * 2; // Random speed between 1 and 3

        function moveBoat() {
            if (raceFinished) return;

            position += speed;
            boat.style.left = `${position}px`;

            if (!boat.classList.contains('moving')) {
                boat.classList.add('moving');
            }

            if (position >= raceTrackWidth - boat.offsetWidth && !raceFinished) {
                raceFinished = true;
                const winner = boat.getAttribute('data-name');
                displayWinner(winner);
            } else {
                requestAnimationFrame(moveBoat);
            }
        }

        moveBoat();
    });
}

function displayWinner(winner) {
    const winnerDiv = document.getElementById('winner');
    winnerDiv.textContent = `Chúc mừng bạn: ${winner}`;
    winnerDiv.classList.remove('hidden');
    winnerDiv.classList.add('show');
}