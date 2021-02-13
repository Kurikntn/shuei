const g_socket = new WebSocket( "ws://" + window.location.host + window.location.pathname );

const roomCapacity = document.getElementById("room-capacity");
const roomTime = parseInt(document.getElementById("room-time").innerText);

const nameForm = document.getElementById("name-form");
const inputName = document.getElementById("input-name");

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let userName = inputName.value;
  if(!userName){
    return;
  }
  
  g_socket.send(
    JSON.stringify({ "data_type": "join", "username": userName, "room_number": window.location.pathname.substr(6), "room_capacity": roomCapacity.innerText })
  );

  document.querySelector("#name-form").style.display = "none";
  document.querySelector("#your-name").style.display = "block";
  document.querySelector("#your-name-content").innerText = userName;
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


const messages = document.getElementById("messages");
const participants  = document.getElementById("participants_number");
let participants_count = 0;

g_socket.onmessage = (event) => {
  let data = JSON.parse(event.data);

  if('count' in data){
    participants_count = data["count"];
    participants.innerText = participants_count;
    if(participants_count == parseInt(roomCapacity.innerText)){
      timer(roomTime);
      document.querySelector(".waiting-overlay").classList.add("close");
      document.querySelector(".waiting-modal").classList.add("close");
      messages.style.display = "block";
      messages.innerHTML = null;
    }
  } else if('error' in data) {
    document.querySelector("#vacant-modal").style.display = "none";
    document.querySelector("#not-vacant-modal").style.display = "block";
    if(!document.querySelector(".waiting-modal").classList.contains("close")){
      messages.style.display = "none";
    }
  } else {
    const message = document.createElement('div');
    message.setAttribute('class', 'message');

    const messageUser = document.createElement('p');
    messageUser.setAttribute('class', 'message-user');
    messageUser.innerText = data["username"];
    message.append(messageUser);
    
    const messageText = document.createElement('p');
    messageText.setAttribute('class', 'message-text');
    messageText.innerText = data["message"];
    message.append(messageText);

    const messageImage = document.createElement('img');
    messageImage.setAttribute('class', 'message-image');
    messageImage.setAttribute('src', data["image"]);
    messageImage.setAttribute('height', '200px');
    message.append(messageImage); 

    messages.append(message);

    messages.scrollBy({
      top: message.clientHeight + 25 + 25, // 25はmargin分
      behavior: 'smooth'
    });
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
    document.getElementById("close-form").submit();
  }

  setInterval(countDown, 1000);

  setTimeout(roomClose, limitTime);
}
