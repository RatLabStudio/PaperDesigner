const sidebar = document.getElementById("sidebar");
const documentBody = document.getElementById("documentBody");

function updateUI() {
  if (window.innerWidth < 1000) {
    sidebar.style.visibility = "hidden";
    documentBody.style.width = "100%";
    try {
      canvas.style.width = "80%";
    } catch {}
  } else {
    sidebar.style.visibility = "visible";
    documentBody.style.width = "80%";
    try {
      canvas.style.width = "50vh";
    } catch {}
  }
}

window.addEventListener("resize", (e) => {
  updateUI();
});
updateUI();
