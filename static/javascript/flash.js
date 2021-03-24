function flash(){
  document.getElementById("flash-close-btn").addEventListener("click", () => {
    document.querySelector("#flash").style.display = "none";
  });
}

window.addEventListener("load", flash);
