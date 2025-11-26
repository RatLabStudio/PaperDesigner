const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.letterSpacing = "1.75px";

const GxEPD_WHITE = "#dfdbd4";
const GxEPD_BLACK = "#000000";

const DejaVu_Sans_Condensed = new FontFace("DejaVu_Sans_Condensed", "url(src/fonts/DejaVuSansCondensed.ttf)");
document.fonts.add(DejaVu_Sans_Condensed);

const DSEG7 = new FontFace("DSEG7", "url(src/fonts/dseg7-classic-latin-700-normal.ttf)");
document.fonts.add(DSEG7);

let fontLoaded = false;

class Display {
  constructor() {
    this.cursor = {
      x: 0,
      y: 0,
    };
  }

  drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
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
}

let rtc = new RTC();

let display = new Display();
let tt;
let voltageSegments = 4;
let dateString;
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let tmp = 76;
let hum2 = 45;

DejaVu_Sans_Condensed.load()
  .then(function (font) {
    DSEG7.load()
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //LINE BELOW TIME
  display.fillRect(60, 137, 124, 5, GxEPD_BLACK);
  //display.fillRect(120, 82, 60, 2, GxEPD_BLACK);
  display.fillRect(10, 42, 3, 129, GxEPD_BLACK);

  //draw time
  display.setTextColor(GxEPD_BLACK);
  //display.setFont(&DSEG7_Classic_bold_36);
  display.setFont("bold 36px DSEG7");
  display.setCursor(18, 130);
  display.print(tt);

  // Battery
  display.drawRect(150, 8, 40, 16, GxEPD_BLACK);
  display.drawRect(151, 9, 38, 14, GxEPD_BLACK);
  display.fillRect(190, 12, 3, 7, GxEPD_BLACK);

  for (let i = 0; i < voltageSegments; i++) display.fillRect(154 + i * 7, 12, 4, 8, GxEPD_BLACK);

  // Date
  display.fillRoundRect(20, 48, 95, 35, 5, GxEPD_BLACK);

  //display.setFont(&DejaVu_Sans_Condensed_bold_15);
  display.setFont("bold 15px DejaVu_Sans_Condensed");
  display.setTextColor(GxEPD_WHITE);
  /*display.setCursor(27, 57);
    display.print("Date");*/

  //display.setFont(&DejaVu_Sans_Condensed_bold_18);
  display.setFont("bold 18px DejaVu_Sans_Condensed");
  display.setCursor(25, 73);
  display.print(dateString);

  // Weekday
  display.fillRoundRect(137, 63, 45, 22, 4, GxEPD_BLACK);

  display.setTextColor(GxEPD_WHITE);
  display.setCursor(142, 80);
  display.print(days[rtc.getWeekday()]);

  //SENSR READINGS temperature symbol
  display.fillRoundRect(35, 143, 15, 40, 8, GxEPD_BLACK);
  display.fillCircle(42, 173, 10, GxEPD_BLACK);
  display.fillRoundRect(37, 145, 11, 36, 8, GxEPD_WHITE);
  display.fillCircle(42, 173, 8, GxEPD_WHITE);
  display.fillRoundRect(40, 153, 5, 25, 2, GxEPD_BLACK);
  display.fillCircle(42, 173, 5, GxEPD_BLACK);

  //SENSR READINGS humidity symbol
  for (let i = 0; i < 6; i++) display.fillCircle(122, 170 - i * 3, 6 - i, GxEPD_BLACK);

  display.setTextColor(GxEPD_BLACK);
  display.setCursor(60, 161);
  //display.print("Temp");
  display.setCursor(60, 177);
  display.print(tmp);
  display.setCursor(135, 161);
  //display.print("Hum");
  display.setCursor(135, 177);
  display.print(hum2);
}

function update() {
  rtc.date = new Date();

  h = rtc.getHour();
  m = rtc.getMinute();
  if (h < 10) hourStr = "0" + String(h);
  else hourStr = String(h);
  if (m < 10) minStr = "0" + String(m);
  else minStr = String(m);
  let hour12, ampm;
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

function updateUI() {
  if (window.innerWidth < 800) {
    document.getElementById("sidebar").style.visibility = "hidden";
    document.getElementById("documentBody").style.width = "100%";
    canvas.style.width = "80%";
  } else {
    document.getElementById("sidebar").style.visibility = "visible";
    document.getElementById("documentBody").style.width = "80%";
    canvas.style.width = "50vh";
  }
}

window.addEventListener("resize", (e) => {
  updateUI();
});
updateUI();
