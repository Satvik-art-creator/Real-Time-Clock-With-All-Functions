const select = (selector) => document.querySelector(selector);

const hrElem = select(".hr");
const minElem = select(".min");
const secElem = select(".sec");
const time = select(".time");

let meridian;

var addZero;

const mess = select(".notification h2");
const alarmTime = select("#alarmTime");
const setAlarm = select("#setAlarm");
const stopAlarm = select("#stopAlarm");

let alarmValue;
let newTime;

const num = 0;
var audio;
var interval;

const watcher = select(".watcher");

let stopHr = 00;
let stopMin = 00;
let stopSec = 00;
let stopMilSec = 00;

var milliSec;

const strtBtn = select("#startBtn");
const rstBtn = select("#resetBtn");
const stpBtn = select("#stopBtn");
const lap = select("#lapBtn");

const allLaps = select(".allLaps");

var laps, index = 1;

addZero = (zeroes, value) => {
  if (value / 10 < 1) {
    return (value = `${zeroes}${value}`);
  } else {
    return value;
  }
};

setInterval(() => {
  d = new Date();
  hr = d.getHours();
  min = d.getMinutes();
  sec = d.getSeconds();

  hr = addZero(0, hr);
  min = addZero(0, min);
  sec = addZero(0, sec);

  if (hr >= 12 && hr < 24) {
    meridian = "PM";
    var reqTime = hr - 13;
    time.innerHTML = `${1 + reqTime}:${min}:${sec} ${meridian}`;
    newTime = `${hr}:${min} ${meridian}`;
  } else {
    meridian = "AM";
    time.innerHTML = `${hr}:${min}:${sec} ${meridian}`;
    newTime = `${hr}:${min} ${meridian}`;
  }

  hrRotation = 30 * hr + min / 2 + sec / 120;
  minRotation = 6 * min + sec / 10;
  secRotation = 6 * sec;

  hrElem.style.transform = `rotate(${hrRotation}deg)`;
  hrElem.style.top = `27%`;
  hrElem.style.right = `40.5%`;

  minElem.style.transform = `rotate(${minRotation}deg)`;
  secElem.style.transform = `rotate(${secRotation}deg)`;
}, 1000);

const display = (elem, value) => (elem.style.display = value);

setAlarm.addEventListener("click", () => {
  if (alarmTime.value != "") {
    display(alarmTime, "none");
    display(setAlarm, "none");
    mess.innerHTML = "";

    interval = setInterval(toSetAlarm, 1);
  } else {
    alert("Write a default Time to set the Alarm");
  }
});

audio = new Audio("beep.mp3");

var isPlaying =
  audio.currentTime > 0 &&
  !audio.paused &&
  !audio.ended &&
  audio.readyState > audio.HAVE_CURRENT_DATA;

var isPaused =
  audio.currentTime == 0 &&
  !audio.paused &&
  !audio.ended &&
  audio.readyState == audio.HAVE_CURRENT_DATA;

function toSetAlarm() {
  alarmValue = `${alarmTime.value} ${meridian}`;

  if (newTime < alarmValue) {
    mess.innerHTML = `Your alarm will beep at ${alarmValue}<br>`;
  } else if (newTime === alarmValue) {
    if (!isPlaying) {
      audio.play();
      audio.loop = true;
    }
    display(mess, "none");
    display(stopAlarm, "block");
  } else {
    toStopAlarm();
  }
}

stopAlarm.addEventListener("click", toStopAlarm);

function toStopAlarm() {
  clearInterval(interval);

  display(stopAlarm, "none");

  display(alarmTime, "block");
  display(setAlarm, "block");
  display(mess, "block");
  mess.innerHTML = "Set your Alarm";

  alarmTime.value = "";

  if (!isPaused) {
    audio.pause();
  }
}

let stpTime = true;

function startTime() {
  if (stpTime) {
    stpTime = false;
    timerCycle();
  }
}

function stopTime() {
  if (stopTime === false) {
    stopTime = true;
  }
}

function timerCycle() {
  if (stpTime === false) {
    display(strtBtn, "none");
    display(rstBtn, "none");

    display(stpBtn, "block");
    display(lap, "block");

    stopMilSec = parseInt(stopMilSec);
    stopSec = parseInt(stopSec);
    stopMin = parseInt(stopMin);
    stopHr = parseInt(stopHr);

    stopMilSec++;

    if (stopMilSec === 1000) {
      stopMilSec = 00;
      stopSec++;
    }
    if (stopSec === 60) {
      stopSec = 00;
      stopMin++;
    }
    if (stopMin === 60) {
      stopMin = 0;
      stopHr++;
    }

    if (stopMilSec < 10 || stopMilSec == 0) {
      stopMilSec = `00${stopMilSec}`;
    }
    if (stopSec < 10 || stopSec == 0) {
      stopSec = `0${stopSec}`;
    }
    if (stopMin < 10 || stopMin == 0) {
      stopMin = `0${stopMin}`;
    }
    if (stopHr < 10 || stopHr == 0) {
      stopHr = `0${stopHr}`;
    }

    watcher.innerHTML = `Time: ${stopHr} : ${stopMin} : ${stopSec}.${stopMilSec}`;

    inter = setInterval(timerCycle, 1);
  }
}

strtBtn.addEventListener("click", startTime);
stopTime();

stpBtn.addEventListener("click", () => {
  display(strtBtn, "block");
  display(rstBtn, "block");

  display(stpBtn, "none");
  display(lap, "none");

  stpTime = true;
  watcher.innerHTML = `Time: ${stopHr} : ${stopMin} : ${stopSec}.${stopMilSec}`;
});

lap.addEventListener("click", () => {
  laps = document.createElement("h4");
  laps.classList.add("laps");
  
  // index++;

  lapText = document.createTextNode(
    `${index++} - ${stopHr}:${stopMin}:${stopSec}.${stopMilSec}`
  );

  laps.appendChild(lapText);
  allLaps.appendChild(laps);

  display(allLaps, "block");
});

rstBtn.addEventListener("click", () => {
  stpTime = true;

  allLaps.innerHTML = "";
  display(allLaps, "none");
  
  index=1;

  stopMilSec = 000;
  stopSec = 00;
  stopMin = 00;
  stopHr = 00;
  watcher.innerHTML = `Time: 00 : 00 : 00.000`;
});