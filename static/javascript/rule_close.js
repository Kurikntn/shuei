function ruleClose(){
  document.querySelector(".rule-close-btn").addEventListener("click", () => {
    window.close();
  });
}

window.addEventListener("load", ruleClose);
