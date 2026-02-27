const stopwatchDisplay = document.getElementById("stopwatch-display");
const startStopwatchBtn = document.getElementById("start-stopwatch");
const pauseStopwatchBtn = document.getElementById("pause-stopwatch");
const resetStopwatchBtn = document.getElementById("reset-stopwatch");
const lapStopwatchBtn = document.getElementById("lap-stopwatch");
const lapList = document.getElementById("lap-list");

let stopwatchStart = 0;
let stopwatchElapsed = 0;
let stopwatchTimerId = null;

function formatStopwatch(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const seconds = Math.floor(totalCentiseconds / 100) % 60;
  const minutes = Math.floor(totalCentiseconds / 6000) % 60;
  const hours = Math.floor(totalCentiseconds / 360000);

  return [hours, minutes, seconds].map((v) => String(v).padStart(2, "0")).join(":") + `.${String(centiseconds).padStart(2, "0")}`;
}

function renderStopwatch() {
  const now = stopwatchTimerId ? performance.now() - stopwatchStart + stopwatchElapsed : stopwatchElapsed;
  stopwatchDisplay.textContent = formatStopwatch(now);
}

startStopwatchBtn.addEventListener("click", () => {
  if (stopwatchTimerId) {
    return;
  }
  stopwatchStart = performance.now();
  stopwatchTimerId = setInterval(renderStopwatch, 10);
});

pauseStopwatchBtn.addEventListener("click", () => {
  if (!stopwatchTimerId) {
    return;
  }
  clearInterval(stopwatchTimerId);
  stopwatchTimerId = null;
  stopwatchElapsed += performance.now() - stopwatchStart;
  renderStopwatch();
});

resetStopwatchBtn.addEventListener("click", () => {
  if (stopwatchTimerId) {
    clearInterval(stopwatchTimerId);
    stopwatchTimerId = null;
  }
  stopwatchElapsed = 0;
  stopwatchStart = 0;
  lapList.innerHTML = "";
  renderStopwatch();
});

lapStopwatchBtn.addEventListener("click", () => {
  const lap = document.createElement("li");
  lap.textContent = `Lap ${lapList.children.length + 1}: ${stopwatchDisplay.textContent}`;
  lapList.prepend(lap);
});

renderStopwatch();
