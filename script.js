const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.letterSpacing = "1.75px";

const GxEPD_WHITE = "#dfdbd4";
const GxEPD_BLACK = "#000000";

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

  drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
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
}

let rtc = new RTC();

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  page7();
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

function page1() {
  //LINE BELOW TIME
  display.fillRect(60, 137, 124, 5, GxEPD_BLACK);
  display.fillRect(10, 42, 3, 129, GxEPD_BLACK);

  // Time
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
  display.setCursor(60, 177);
  display.print(tmp);
  display.setCursor(135, 161);
  display.setCursor(135, 177);
  display.print(hum2);
}

function page2() {
  // Time
  display.setFont("bold 12px DejaVu_Sans_Condensed");
  display.setCursor(160, 14);
  display.print(tt);

  // Ribbon
  display.setCursor(6, 14);
  display.print("Rat Lab Studio");
  display.fillRect(0, 20, 200, 1, GxEPD_BLACK);

  // Desktop File
  display.drawRect(5, 28, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 25, 12, 3, GxEPD_BLACK);

  // Window
  display.fillRect(12, 35, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 33, 180, 155, GxEPD_WHITE);
  display.drawRect(10, 33, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 48, 180, 1, GxEPD_BLACK);
  for (let i = 0; i < 3; i++) display.drawCircle(20 + 13 * i, 41, 4, GxEPD_BLACK);

  // Content
  display.setCursor(30, 80);
  display.print("Today is " + String(dateString) + ",");
  display.setCursor(30, 100);
  display.print("a " + String(days[rtc.getWeekday()]) + ".");

  display.fillRoundRect(30, 112, 6, 20, 4, GxEPD_BLACK);
  display.fillCircle(33, 127, 5, GxEPD_BLACK);
  display.fillRoundRect(31, 113, 4, 18, 4, GxEPD_WHITE);
  display.fillCircle(33, 127, 4, GxEPD_WHITE);
  display.fillRoundRect(32, 117, 2, 13, 1, GxEPD_BLACK);
  display.fillCircle(33, 127, 3, GxEPD_BLACK);

  display.setCursor(45, 128);
  display.print("It's " + String(tmp) + " degrees.");
}

function page3() {
  // Time
  display.setFont("bold 12px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_12);
  display.setCursor(155, 14);
  display.print(tt);

  // Ribbon
  display.setCursor(6, 14);
  display.print("Rat Lab Studio");
  display.fillRect(0, 20, 200, 1, GxEPD_BLACK);

  // Desktop File
  display.drawRect(5, 28, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 25, 12, 3, GxEPD_BLACK);

  // Desktop File 2
  display.drawRect(5, 59, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 56, 12, 3, GxEPD_BLACK);

  // Desktop File 3
  display.drawRect(5, 90, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 87, 12, 3, GxEPD_BLACK);

  // Window
  display.fillRect(12, 35, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 33, 180, 155, GxEPD_WHITE);
  display.drawRect(10, 33, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 48, 180, 1, GxEPD_BLACK);
  display.drawCircle(20, 41, 4, GxEPD_BLACK);
  display.drawCircle(33, 41, 4, GxEPD_BLACK);
  display.drawCircle(46, 41, 4, GxEPD_BLACK);

  // Content
  display.setCursor(20, 70);
  display.print("To set up your device,");
  display.setCursor(20, 90);
  display.print("connect to the WiFi:");
  display.setCursor(20, 110);
  display.print("  RatLabESP");
  display.setCursor(20, 175);
  display.print("ratlabstudio.com/help");
}

function page4() {
  // Time
  display.setFont("bold 12px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_12);
  display.setCursor(155, 14);
  display.print(tt);

  // Ribbon
  display.setCursor(6, 14);
  display.print("Rat Lab Studio");
  display.fillRect(0, 20, 200, 1, GxEPD_BLACK);

  // Desktop File
  display.drawRect(5, 28, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 25, 12, 3, GxEPD_BLACK);

  // Desktop File 2
  display.drawRect(5, 59, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 56, 12, 3, GxEPD_BLACK);

  // Desktop File 3
  display.drawRect(5, 90, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 87, 12, 3, GxEPD_BLACK);

  // Window
  display.fillRect(12, 35, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 33, 180, 155, GxEPD_WHITE);
  display.drawRect(10, 33, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 48, 180, 1, GxEPD_BLACK);
  display.drawCircle(20, 41, 4, GxEPD_BLACK);
  display.drawCircle(33, 41, 4, GxEPD_BLACK);
  display.drawCircle(46, 41, 4, GxEPD_BLACK);

  // Content
  display.setCursor(20, 70);
  display.print("Device Connected!");
  display.setCursor(20, 90);
  display.print("Go to the website:");
  display.setCursor(20, 110);
  display.print("  http://" + String("192.168.1.4"));
  display.setCursor(20, 175);
  display.print("ratlabstudio.com/help");
}

function page5() {
  // Time
  display.setFont("bold 12px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_12);
  display.setCursor(155, 14);
  display.print(tt);

  // Ribbon
  display.setCursor(6, 14);
  display.print("Rat Lab Studio");
  display.fillRect(0, 20, 200, 1, GxEPD_BLACK);

  // Desktop File
  display.drawRect(5, 28, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 25, 12, 3, GxEPD_BLACK);

  // Desktop File 2
  display.drawRect(5, 59, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 56, 12, 3, GxEPD_BLACK);

  // Desktop File 3
  display.drawRect(5, 90, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 87, 12, 3, GxEPD_BLACK);

  // Window
  display.fillRect(12, 35, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 33, 180, 155, GxEPD_WHITE);
  display.drawRect(10, 33, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 48, 180, 1, GxEPD_BLACK);
  display.drawCircle(20, 41, 4, GxEPD_BLACK);
  display.drawCircle(33, 41, 4, GxEPD_BLACK);
  display.drawCircle(46, 41, 4, GxEPD_BLACK);

  // Content
  display.setCursor(20, 70);
  display.print("Connection success!");
  display.setCursor(20, 100);
  display.print("Continue setup in ");
  display.setCursor(22, 120);
  display.print("browser.");
  display.setCursor(20, 175);
  display.print("ratlabstudio.com/help");
}

function page6() {
  // City Name
  display.setFont("bold 14px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_14);
  display.setCursor(15, 25);
  display.print(cityName);

  // Region
  display.fillRoundRect(155, 11, 30, 18, 2, GxEPD_BLACK);
  display.setTextColor(GxEPD_WHITE);
  display.setCursor(161, 25);
  display.print(region);

  // Date
  display.setTextColor(GxEPD_BLACK);
  display.setCursor(15, 145);
  display.print(dateString);

  // Weekday
  display.setCursor(90, 145);
  display.print(days[rtc.getWeekday()]);

  // AM / PM
  if (use12hr) {
    display.fillRoundRect(155, 82, 30, 18, 2, GxEPD_BLACK);
    display.setTextColor(GxEPD_WHITE);
    display.setCursor(159, 96);
    display.print(ampm);
  }

  // Temperature
  display.setTextColor(GxEPD_BLACK);
  display.setCursor(15, 55);
  if (useFahrenheit) display.print(String(wTemp) + "*F, " + String(wDesc));
  else display.print(String(wTemp) + "*C, " + String(wDesc));

  // Humidity Icon
  for (let i = 0; i < 6; i++) display.fillCircle(100, 180 - i * 3, 6 - i, GxEPD_BLACK);
  //for (int i = 0; i < 6; i++) { display.fillCircle(100, 180 - i * 3, 6 - i, GxEPD_BLACK); }

  // Humidity
  display.setFont("bold 14px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_14);
  display.setCursor(30, 182);
  display.print("O: " + String(wHumidity) + "%");
  display.setCursor(118, 182);
  display.print("I: " + String(hum2) + "%");

  // Humidity Lines
  display.fillRect(16, 160, 1, 30, GxEPD_BLACK);
  display.fillRect(183, 160, 1, 30, GxEPD_BLACK);

  // Time Lines
  display.fillRect(15, 71, 170, 1, GxEPD_BLACK);
  display.fillRect(15, 120, 170, 1, GxEPD_BLACK);

  // Time
  display.setFont("bold 38px DSEG7");
  //display.setFont(&Orbitron_Medium_38);
  display.setCursor(15, 110);
  display.print(tt);

  // Weather Icon
  display.setFont("bold 22px Meteocons");
  //display.setFont(&Meteocons_Regular_22);
  display.setCursor(152, 60);
  display.print(String(getWeatherIcon(wDesc)));
}

function page7() {
  // Time
  display.setFont("bold 12px DejaVu_Sans_Condensed");
  //display.setFont(&DejaVu_Sans_Condensed_Bold_12);
  display.setCursor(155, 14);
  display.print(tt);

  // Ribbon
  display.setCursor(6, 14);
  display.print("Rat Lab Studio");
  display.fillRect(0, 20, 200, 1, GxEPD_BLACK);

  // Desktop File
  display.drawRect(5, 28, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 25, 12, 3, GxEPD_BLACK);

  // Desktop File 2
  display.drawRect(5, 59, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 56, 12, 3, GxEPD_BLACK);

  // Desktop File 3
  display.drawRect(5, 90, 30, 18, GxEPD_BLACK);
  display.drawRect(5, 87, 12, 3, GxEPD_BLACK);

  // Window
  display.fillRect(12, 35, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 33, 180, 155, GxEPD_WHITE);
  display.drawRect(10, 33, 180, 155, GxEPD_BLACK);
  display.fillRect(10, 48, 180, 1, GxEPD_BLACK);
  display.drawCircle(20, 41, 4, GxEPD_BLACK);
  display.drawCircle(33, 41, 4, GxEPD_BLACK);
  display.drawCircle(46, 41, 4, GxEPD_BLACK);

  // Content
  display.setCursor(20, 70);
  display.print("To configure, go to");
  display.setCursor(20, 100);
  display.print("http://" + String("") + "");
  display.setCursor(20, 130);
  display.print("in your browser.");
  display.setCursor(20, 175);
  display.print("ratlabstudio.com/help");
}
