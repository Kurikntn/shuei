function flash(){
  if(document.getElementById("flash-close-btn") != null){
    document.getElementById("flash-close-btn").addEventListener("click", () => {
      document.querySelector("#flash").style.display = "none";
    });
  }
}

window.addEventListener("load", flash);
