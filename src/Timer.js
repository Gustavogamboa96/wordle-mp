import { useEffect } from "react";

function startCountdown(duration, display) {
  let timer = duration,
    minutes,
    seconds;

  const countdownInterval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(countdownInterval);
      display.textContent = "00:00"; // Countdown finished, display 00:00 or handle the end action
    }
  }, 1000);
}

export function Timer() {
  useEffect(() => {
    const display = document.getElementById("timer");
    startCountdown(3 * 60, display);
  }, []);

  return (
    <div>
      <p id="timer"></p>
    </div>
  );
}
