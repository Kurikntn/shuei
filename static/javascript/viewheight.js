function viewHeight(){
  let vh = window.innerHeight;
  document.documentElement.style.setProperty("--vh", vh/100 + "px");
}

window.addEventListener("load", viewHeight);
window.addEventListener("resize", viewHeight);