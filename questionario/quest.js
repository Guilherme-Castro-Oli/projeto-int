const answers = document.querySelectorAll(".answer");
const toast = document.querySelector("#toast");
const timer = document.querySelector("#timer");
const explainButton = document.querySelector(".explain-button");
const confirmButton = document.querySelector(".confirm-button");
const skipButton = document.querySelector(".skip-button");

let secondsLeft = 1800;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function setSelected(answer) {
  answers.forEach((item) => {
    const isCurrent = item === answer;
    item.classList.toggle("is-selected", isCurrent);
    item.setAttribute("aria-checked", String(isCurrent));
  });
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

answers.forEach((answer) => {
  answer.addEventListener("click", () => setSelected(answer));
});


skipButton.addEventListener("click", () => {
  showToast("Questão pulada. O laboratório avançaria para o próximo desafio.");
});

setInterval(() => {
  secondsLeft = Math.max(0, secondsLeft - 1);
  timer.textContent = formatTime(secondsLeft);
}, 1000);
