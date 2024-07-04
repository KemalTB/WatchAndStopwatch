document.addEventListener("DOMContentLoaded", () => {
    // Dijital saat
    function updateClock() {
        const clockElement = document.getElementById("clock");
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        clockElement.textContent = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Kronometre
    let stopwatchInterval;
    let elapsedTime = 0;
    let lastUpdateTime = Date.now();

    const timeDisplay = document.getElementById("timeDisplay");
    const startStopBtn = document.getElementById("startStopBtn");
    const resetBtn = document.getElementById("resetBtn");
    const results = document.getElementById("results");

    startStopBtn.addEventListener("click", () => {
        if (startStopBtn.textContent === "Başlat") {
            startStop();
        } else {
            stopStopwatch();
        }
    });

    resetBtn.addEventListener("click", resetStopwatch);

    function startStop() {
        const personName = document.getElementById("personName").value;
        const taskName = document.getElementById("taskName").value;
        if (personName && taskName) {
            startStopBtn.textContent = "Durdur";
            lastUpdateTime = Date.now();
            stopwatchInterval = setInterval(() => {
                const now = Date.now();
                elapsedTime += now - lastUpdateTime;
                lastUpdateTime = now;
                timeDisplay.textContent = formatTime(elapsedTime);
            }, 10);
        } else {
            alert("Lütfen kimin için ve görev adını doldurun.");
        }
    }

    function stopStopwatch() {
        clearInterval(stopwatchInterval);
        startStopBtn.textContent = "Başlat";

        const personName = document.getElementById("personName").value;
        const taskName = document.getElementById("taskName").value;
        const resultTime = formatTime(elapsedTime);

        const resultDiv = document.createElement("div");
        resultDiv.textContent = `${personName} - ${taskName} - ${resultTime}`;
        
        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = "Sil";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", () => {
            resultDiv.remove();
            saveResults();
        });

        resultDiv.appendChild(deleteBtn);
        results.appendChild(resultDiv);

        saveResults();
    }

    function resetStopwatch() {
        clearInterval(stopwatchInterval);
        elapsedTime = 0;
        timeDisplay.textContent = "00:00:00.000";
        startStopBtn.textContent = "Başlat";
    }

    function formatTime(ms) {
        const totalMilliseconds = ms % 1000;
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${totalMilliseconds.toString().padStart(3, '0')}`;
    }

    function saveResults() {
        const resultsArray = Array.from(results.children).map(div => div.textContent.replace("Sil", "").trim());
        localStorage.setItem("stopwatchResults", JSON.stringify(resultsArray));
    }

    function loadResults() {
        const storedResults = JSON.parse(localStorage.getItem("stopwatchResults")) || [];
        storedResults.forEach(result => {
            const resultDiv = document.createElement("div");
            resultDiv.textContent = result;
            
            const deleteBtn = document.createElement("span");
            deleteBtn.textContent = "Sil";
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.addEventListener("click", () => {
                resultDiv.remove();
                saveResults();
            });

            resultDiv.appendChild(deleteBtn);
            results.appendChild(resultDiv);
        });
    }

    loadResults();
});