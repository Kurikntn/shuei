let g_socket;

if(window.location.protocol == "https:"){
  g_socket = new WebSocket( "wss://" + window.location.host + window.location.pathname );
} else {
  g_socket = new WebSocket( "ws://" + window.location.host + window.location.pathname );
}

const nameForm = document.getElementById("name-form");
const inputName = document.getElementById("input-name");
const nameSubmit = document.getElementById("name-submit");
const beforeJoin = document.querySelectorAll(".before-join");
const afterJoin = document.querySelectorAll(".after-join");

inputName.oninput = userName;

function userName(e) {
  if(e.target.value == ""){
    nameSubmit.disabled = true;
    nameSubmit.style.backgroundColor = "#aaa";
    nameSubmit.style.cursor = "default";
  } else {
    nameSubmit.disabled = false;
    nameSubmit.style.backgroundColor = "#1919fa";
    nameSubmit.style.cursor = "pointer";
  }
}

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let userName = inputName.value;
  if(!userName){
    return;
  }
  
  g_socket.send(
    JSON.stringify({ "data_type": "join", "username": userName, "room_number": window.location.pathname.substr(6), "room_capacity": roomCapacity })
  );

  document.querySelector("#your-name-content").innerText = userName;

  for(let i = 0; i < beforeJoin.length; i++){
    beforeJoin[i].style.display = "none";
    afterJoin[i].style.display = "block";
  }
});


const closeRoom = document.getElementById("close-room");

closeRoom.addEventListener("click", () => {
  g_socket.send(
    JSON.stringify({ "data_type": "leave" })
  );
});


const chatForm = document.getElementById("chat-form");
const chatText = document.getElementById("chat-text");
const chatImage = document.getElementById("image-input");
let imageBase64 = "";

chatImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const imageURL = window.URL.createObjectURL(file);

  const imageElement = new Image();
  imageElement.src = imageURL;

  imageElement.onload = function() {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = imageElement.width;
    canvasElement.height = imageElement.height;
    const canvasContext = canvasElement.getContext('2d');
    canvasContext.drawImage(imageElement, 0, 0);
    imageBase64 = canvasElement.toDataURL("image/png");
  };
});

document.getElementById('preview-close').addEventListener('click', () => {
  imageBase64 = "";
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let message = chatText.value;

  if(message == "" && imageBase64 == ""){
    return;
  }
  
  g_socket.send(
    JSON.stringify({ "message": message, "image": imageBase64 })
  );

  chatText.value = "";
  chatImage.value = "";
  imageBase64 = "";
  document.getElementById('image-preview').classList.remove("open");
});


const waitingModal = document.querySelector(".waiting-modal");
const messages = document.getElementById("messages");
const participants  = document.getElementById("participants_number");
let participants_count = 0;

g_socket.onmessage = (event) => {
  let data = JSON.parse(event.data);

  if('count' in data){
    participants_count = data["count"];
    participants.innerText = participants_count;
    if(participants_count == parseInt(roomCapacity)){
      timer(roomTime);
      document.querySelector(".waiting-overlay").classList.add("close");
      waitingModal.classList.add("close");
      chatText.disabled = false;
      chatImage.disabled = false;
    }
  } else if('error' in data) {
    document.querySelector("#vacant-modal").style.display = "none";
    document.querySelector("#not-vacant-modal").style.display = "block";
    if(!waitingModal.classList.contains("close")){
      messages.remove();
    }
  } else if('leave' in data){
    participants_count = data["minus_count"];
    participants.innerText = participants_count;
    if(data["leave"] == "定員割れ" && waitingModal.classList.contains("close")){
      closeRoom.click();
    }
  } else {
    const message = document.createElement('div');
    message.setAttribute('class', 'message');

    const messageUser = document.createElement('p');
    messageUser.setAttribute('class', 'message-user');
    messageUser.innerText = data["username"];
    message.append(messageUser);
    
    if(!data["message"] == ""){
      const messageText = document.createElement('p');
      messageText.setAttribute('class', 'message-text');
      messageText.innerText = data["message"];
      message.append(messageText);
    }

    if(!data["image"] == ""){
      const messageImage = document.createElement('img');
      messageImage.setAttribute('class', 'message-image');
      messageImage.setAttribute('src', data["image"]);
      message.append(messageImage); 
    }

    messages.append(message);

    function scroll(){
      messages.scrollBy({
        top: message.clientHeight,
        behavior: 'smooth'
      });
    }

    setTimeout(scroll, 10);
  }
};


// タイマー
function timer(time) {
  let setLimitMinutes = time;
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
  }

  function roomClose(){
    closeRoom.click();
  }

  setInterval(countDown, 1000);

  setTimeout(roomClose, limitTime);
}
