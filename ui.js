const sidebar = document.getElementById("sidebar");
const documentBody = document.getElementById("documentBody");

function updateUI() {
  if (window.innerWidth < 1200) {
    sidebar.style.visibility = "hidden";
    sidebar.style.width = "0%";
    documentBody.style.width = "100%";
    try {
      canvas.style.width = "80%";
    } catch {}
  } else {
    sidebar.style.visibility = "visible";
    sidebar.style.width = "15%";
    documentBody.style.width = "81%";
    try {
      canvas.style.width = "50vh";
    } catch {}
  }
}

window.addEventListener("resize", (e) => {
  updateUI();
});
updateUI();
