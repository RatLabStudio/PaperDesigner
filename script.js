const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.letterSpacing = "1.75px";

const bootButton = document.getElementById("bootButton");
const powerButton = document.getElementById("powerButton");

const GxEPD_WHITE = "#dfdbd4";
const GxEPD_BLACK = "#000000";

let color = GxEPD_BLACK;
let blankColor = GxEPD_WHITE;

const DejaVu_Sans_Condensed = new FontFace("DejaVu_Sans_Condensed", "url(src/fonts/DejaVuSansCondensed.ttf)");
document.fonts.add(DejaVu_Sans_Condensed);

const DSEG7 = new FontFace("DSEG7", "url(src/fonts/Orbitron-Regular.ttf)");
document.fonts.add(DSEG7);

const Meteocons = new FontFace("Meteocons", "url(src/fonts/meteocons.ttf)");
document.fonts.add(Meteocons);

let fontLoaded = false;

class Display {
  constructor() {
    this.cursor = {
      x: 0,
      y: 0,
    };
  }

  drawRect(x, y, width, height, color) {
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, width, height);
  }

  fillRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  fillRoundRect(x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }

  drawCircle(x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 360, false);
    ctx.stroke();
  }

  fillCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 360, false);
    ctx.fill();
  }

  setTextColor(color) {
    ctx.fillStyle = color;
  }

  setFont(font) {
    ctx.font = font;
  }

  setCursor(x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
  }

  print(text) {
    ctx.fillText(text, this.cursor.x, this.cursor.y);
  }
}

class RTC {
  constructor() {
    this.date = new Date();
  }

  getWeekday() {
    return this.date.getDay();
  }

  getHour() {
    return this.date.getHours();
  }

  getMinute() {
    return this.date.getMinutes();
  }

  getMonth() {
    return this.date.getMonth();
  }

  getDay() {
    return this.date.getDate();
  }

  getYear() {
    return this.date.getFullYear();
  }

  /*timerSet(source_clock, value, int_enable, int_pulse) {

  }

  checkTimerFlag() {

  }*/
}

let rtc = new RTC();

function millis() {
  return Date.now();
}

let display = new Display();
let tt, ampm;
let voltageSegments = 4;
let dateString;
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let tmp = 76;
let hum2 = 45;
let wTemp = "75";
let wHumidity = "71";
let wDesc = "Cloudy";
let cityName = "St. Petersburg";
let region = "FL";
let useFahrenheit = true;
let use12hr = true;

let weatherIcons = {
  Clear: "B",
  Cloudy: "H",
  Fog: "E",
  Drizzle: "Q",
  Rain: "R",
  Snow: "W",
  Thunder: "P",
};

function getWeatherIcon() {
  return weatherIcons.Cloudy;
}

DejaVu_Sans_Condensed.load()
  .then(function (font) {
    DSEG7.load()
      .then(function (font) {
        Meteocons.load()
          .then(function (font) {
            fontLoaded = true;
            update();
          })
          .catch(function (error) {
            console.error("Error loading font:", error);
          });
      })
      .catch(function (error) {
        console.error("Error loading font:", error);
      });
  })
  .catch(function (error) {
    console.error("Error loading font:", error);
  });

let page = 4;
function drawCurrentPage() {
  pages[page - 1]();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCurrentPage();
}

const BLACK = GxEPD_BLACK,
  WHITE = GxEPD_WHITE;

function colorSwap() {
  if (color == BLACK) {
    color = WHITE;
    blankColor = BLACK;
  } else {
    color = BLACK;
    blankColor = WHITE;
  }
}

function enableDarkMode(val) {
  if (val) {
    color = WHITE;
    blankColor = BLACK;
  } else {
    color = BLACK;
    blankColor = WHITE;
  }
}

function update() {
  rtc.date = new Date();

  h = rtc.getHour();
  m = rtc.getMinute();
  if (h < 10) hourStr = "0" + String(h);
  else hourStr = String(h);
  if (m < 10) minStr = "0" + String(m);
  else minStr = String(m);
  let hour12;
  if (h == 0) {
    hour12 = 12;
    ampm = "AM";
  } else if (h == 12) {
    hour12 = 12;
    ampm = "PM";
  } else if (h > 12) {
    hour12 = h - 12;
    ampm = "PM";
  } else {
    hour12 = h;
    ampm = "AM";
  }
  tt = String(hour12) + ":" + minStr;

  dateString = rtc.getMonth() + 1 + "/" + rtc.getDay() + "/" + (rtc.getYear() - 2000);

  draw();
}

setInterval(function () {
  update();
}, 1000);

let pixelation = false;
function togglePixelation() {
  if (!pixelation) {
    canvas.style.imageRendering = "pixelated";
    pixelation = true;
  } else {
    canvas.style.imageRendering = "auto";
    pixelation = false;
  }
}
document.togglePixelation = togglePixelation;

const colorModeButton = document.getElementById("colorModeButton");
function toggleColorMode() {
  if (colorModeButton.innerHTML == "Light Mode") {
    colorModeButton.innerHTML = "Dark Mode";
    enableDarkMode(true);
  } else {
    colorModeButton.innerHTML = "Light Mode";
    enableDarkMode(false);
  }
}
document.toggleColorMode = toggleColorMode;

// Draws the basic desktop to be used for several pages
function drawDesktop() {
  // Color Setup
  display.fillRect(0, 0, 200, 200, blankColor);
  display.setTextColor(color);

  display.setFont("bold 12px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_12);

  // Ribbon
  display.setCursor(6, 14);
  display.print("Rat Lab Studio");
  display.fillRect(0, 20, 200, 1, color);

  // Desktop File
  display.drawRect(5, 28, 30, 18, color);
  display.drawRect(5, 25, 12, 3, color);

  // Desktop File 2
  display.drawRect(5, 59, 30, 18, color);
  display.drawRect(5, 56, 12, 3, color);

  // Desktop File 3
  display.drawRect(5, 90, 30, 18, color);
  display.drawRect(5, 87, 12, 3, color);

  // Window
  display.fillRect(12, 35, 180, 155, color);
  display.fillRect(10, 33, 180, 155, blankColor);
  display.drawRect(10, 33, 180, 155, color);
  display.fillRect(10, 48, 180, 1, color);
  display.drawCircle(20, 41, 4, color);
  display.drawCircle(33, 41, 4, color);
  display.drawCircle(46, 41, 4, color);

  otherTimeDesign();
}

let pages = [
  function setupPage() {
    drawDesktop();

    // Content
    display.setCursor(20, 70);
    display.print("To set up your device,");
    display.setCursor(20, 90);
    display.print("connect to the WiFi:");
    display.setCursor(20, 110);
    display.print("  RatLabESP");
    display.setCursor(20, 175);
    display.print("ratlabstudio.com/help");
  },

  function addressPage() {
    drawDesktop();

    // Content
    display.setCursor(20, 70);
    display.print("Device Connected!");
    display.setCursor(20, 90);
    display.print("Go to the website:");
    display.setCursor(20, 110);
    display.print("  http://" + String("192.168.1.4"));
    display.setCursor(20, 175);
    display.print("ratlabstudio.com/help");
  },

  function connectedPage() {
    drawDesktop();

    // Content
    display.setCursor(20, 70);
    display.print("Connection success!");
    display.setCursor(20, 100);
    display.print("Continue setup in ");
    display.setCursor(22, 120);
    display.print("browser.");
    display.setCursor(20, 175);
    display.print("ratlabstudio.com/help");
  },

  function mainPage() {
    // Color Setup
    display.fillRect(0, 0, 200, 200, blankColor);
    display.setTextColor(color);

    // City Name
    display.setTextColor(color);
    display.setFont("bold 14px DejaVu_Sans_Condensed");
    //display.setFont(&DejaVu_Sans_Condensed_Bold_14);
    display.setCursor(15, 25);
    display.print(cityName);

    // Region
    display.fillRoundRect(155, 11, 30, 18, 2, color);
    display.setTextColor(blankColor);
    display.setCursor(161, 25);
    display.print(region);

    // Humidity Lines
    //display.fillRect(16, 160, 1, 30, color);
    //display.fillRect(183, 160, 1, 30, color);

    // Time Lines
    display.fillRect(15, 71, 170, 1, color);
    display.fillRect(15, 120, 170, 1, color);

    mainTimeDesign();
    dateDesign();
    weatherDesign();
    humidityDesign();
  },

  function settingsPage() {
    drawDesktop();

    // Content
    display.setCursor(20, 70);
    display.print("To configure, go to");
    display.setCursor(20, 100);
    display.print("http://" + String("") + "");
    display.setCursor(20, 130);
    display.print("in your browser.");
    display.setCursor(20, 175);
    display.print("ratlabstudio.com/help");
  },

  function timerPage() {
    drawDesktop();

    let radius = 55;
    let thickness = 5;
    let x = 100,
      y = 118;

    for (let i = 0 - Math.floor(thickness / 2); i < 1; i++) display.drawCircle(x, y, radius - i, color);
    for (let i = 1; i < Math.ceil(thickness / 2); i++) display.drawCircle(x, y, radius - i, color);

    percent = getTimerProgress();
    for (let i = 0; i < percent; i++) {
      let cords = getCoordsFromPercentage(i + 2, radius);
      display.fillCircle(x + cords.x, y + cords.y, thickness, blankColor);
    }

    display.drawCircle(x, y, radius - Math.ceil(thickness / 2), color);
    display.drawCircle(x, y, radius + Math.floor(thickness / 2), color);
    percent++;

    // Time
    display.setTextColor(color);
    display.setFont("bold 24px DSEG7");
    //display.setFont(&Orbitron_Medium_38);

    drawCenteredText(getTimeRemainingString(), 100, 136);
  },
];

function mainTimeDesign() {
  // Time
  display.setTextColor(color);
  display.setFont("bold 38px DSEG7");
  //display.setFont(&Orbitron_Medium_38);
  display.setCursor(15, 110);
  display.print(tt);

  // AM / PM
  if (use12hr) {
    display.setFont("bold 14px DejaVu_Sans_Condensed");
    //display.setFont(&DejaVu_Sans_Condensed_Bold_14);
    display.fillRoundRect(155, 82, 30, 18, 2, color);
    display.setTextColor(blankColor);
    display.setCursor(159, 96);
    display.print(ampm);
  }
}

function otherTimeDesign() {
  display.setFont("bold 12px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_12);
  display.setTextColor(color);
  display.setCursor(155, 14);
  display.print(tt);
}

function dateDesign() {
  display.setFont("bold 14px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_14);

  // Date
  display.setTextColor(color);
  display.setCursor(15, 145);
  display.print(dateString);

  // Weekday
  display.setCursor(90, 145);
  display.print(days[rtc.getWeekday()]);
}

function weatherDesign() {
  // Temperature
  display.setFont("bold 14px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_14);
  display.setTextColor(color);
  display.setCursor(15, 55);
  if (useFahrenheit) display.print(String(wTemp) + "*F, " + String(wDesc));
  else display.print(String(wTemp) + "*C, " + String(wDesc));

  // Weather Icon
  display.setFont("bold 22px Meteocons");
  //display.setFont(&Meteocons_Regular_22);
  display.setCursor(152, 60);
  //display.print(String(wIcon));
  display.print(String(getWeatherIcon(wDesc)));
}

function humidityDesign() {
  // Humidity Icon
  for (let i = 0; i < 6; i++) display.fillCircle(100, 180 - i * 3, 6 - i, color);
  //for (int i = 0; i < 6; i++) { display.fillCircle(100, 180 - i * 3, 6 - i, color); }

  // Humidity
  display.setFont("bold 14px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_14);
  display.setTextColor(color);
  display.setCursor(30, 182);
  display.print("O: " + String(wHumidity) + "%");
  display.setCursor(118, 182);
  display.print("I: " + String(hum2) + "%");
}

function drawCenteredText(text, x, y) {
  let metrics = ctx.measureText(text);
  let w = metrics.width;
  let h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  let left = Math.round((x * 2 - w) / 2);
  let top = Math.round((y * 2 - h) / 2);
  display.setCursor(left, top);
  display.print(text);
}

let percent = 0;
let timerAmount = 60 * 1000;
let startTime = 0;

function startTimer() {
  startTime = millis();
  percent = 0;
}

function getTimeRemaining() {
  let timeRemaining = timerAmount - (millis() - startTime);
  if (timeRemaining < 0) timeRemaining = timerAmount;
  return timeRemaining;
}

function getTimeRemainingString() {
  let ms = getTimeRemaining();
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  let parts = [];

  if (hours > 0) {
    // If we have hours, we must show HH, MM, and SS
    parts.push(String(hours).padStart(2, "0"));
    parts.push(String(minutes).padStart(2, "0"));
    //parts.push(String(seconds).padStart(2, "0"));
  } else if (minutes > 0) {
    // If no hours but we have minutes, show MM and SS
    parts.push(String(minutes).padStart(2, "0"));
    parts.push(String(seconds).padStart(2, "0"));
  } else {
    // Only seconds left
    if (seconds > 0) parts.push(String(seconds).padStart(2, "0"));
    else parts.push(String(seconds).padStart(1, "0"));
  }

  return parts.join(":");
}

function getTimerProgress() {
  if (startTime == 0) return 0;
  return Math.round(((millis() - startTime) / timerAmount) * 100);
}

function getCoordsFromPercentage(percentage, radius) {
  const angleInRadians = (percentage / 100) * (2 * Math.PI) - Math.PI / 2;
  const x = radius * Math.cos(angleInRadians);
  const y = radius * Math.sin(angleInRadians);

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}

let bootPressTime = 0,
  bootPressed = false,
  longPressed = false;
bootButton.addEventListener("mousedown", (e) => {
  bootPressTime = Date.now();
  bootPressed = true;
});

bootButton.addEventListener("mouseup", (e) => {
  bootPressed = false;
  if (!longPressed) bootShortPress();
  longPressed = false;
});

function bootShortPress() {
  if (page == 4) page = 5;
  else if (page == 6) {
    if (startTime == 0) startTimer();
    else startTime = 0;
  } else page = 4;
}

function bootLongPress() {
  if (page != 6) page = 6;
  else page = 4;
  bootPressed = false;
  longPressed = true;
}

setInterval(function () {
  if (bootPressed && Date.now() > bootPressTime + 1000) bootLongPress();
}, 10);
