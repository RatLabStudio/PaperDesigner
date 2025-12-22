const sidebar = document.getElementById("sidebar");
const documentBody = document.getElementById("documentBody");

function updateUI() {
  if (window.innerWidth < 1200) {
    sidebar.classList.remove("animate");
    sidebar.style.visibility = "hidden";
    sidebar.style.width = "0%";
    documentBody.style.width = "100%";
    sidebarButton.style.visibility = "visible";
    //ribbon.style.visibility = "hidden";
    //mobileRibbon.style.visibility = "visible";
    try {
      //canvas.style.width = "80%";
    } catch {}
  } else {
    sidebar.style.visibility = "visible";
    sidebar.style.width = "15%";
    sidebar.classList.add("animate");
    documentBody.style.width = "80%";
    sidebarButton.style.visibility = "hidden";
    //ribbon.style.visibility = "visible";
    //mobileRibbon.style.visibility = "hidden";
    try {
      //canvas.style.width = "50vh";
    } catch {}
  }
}

window.addEventListener("resize", (e) => {
  updateUI();
});
updateUI();

function toggleSidebar() {
  if (sidebar.style.visibility == "hidden") {
    sidebar.style.visibility = "visible";
    sidebar.style.width = "75%";
    sidebar.classList.add("animate");
  } else {
    sidebar.classList.remove("animate");
    sidebar.style.visibility = "hidden";
    sidebar.style.width = "0%";
  }
}
