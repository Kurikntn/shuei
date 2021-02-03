function timer() {
  let setLimitMinutes = 1;
  let limitTime = (setLimitMinutes * 60 + 1) * 1000;

  let minutes = document.getElementById("limit-minutes");
  let seconds = document.getElementById("limit-seconds");

  function countDown() {
    limitTime -= 1000;
    let limitTimeMinutes = Math.floor(limitTime / 1000 / 60);
    let limitTimeSeconds = limitTime / 1000 % 60;

    if(limitTime >= 60000){
      minutes.innerText = limitTimeMinutes + "分";
      seconds.innerText = limitTimeSeconds + "秒";
    } else if(limitTime > 0) {
      minutes.innerText = "";
      seconds.innerText = limitTimeSeconds + "秒";
    } else {
      minutes.innerText = "";
      seconds.innerText = "0秒";
    }

    if(limitTime == 0){
      console.log("終了処理");
    }
  }

  setInterval(countDown, 1000);
}

window.addEventListener("load", timer);