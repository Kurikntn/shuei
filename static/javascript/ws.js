const g_socket = new WebSocket( "ws://" + window.location.host + window.location.pathname );

const nameForm = document.getElementById("name-form");
const inputName = document.getElementById("input-name");
const roomCapacity = document.getElementById("room-capacity");

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let userName = inputName.value;
  if(!userName){
    return;
  }
  
  g_socket.send(
    JSON.stringify({ "data_type": "join", "username": userName, "room_number": window.location.pathname.substr(6), "room_capacity": roomCapacity.innerText })
  );

  document.querySelector(".waiting-overlay").classList.add("close");
  document.querySelector(".waiting-modal").classList.add("close");
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

g_socket.onmessage = (event) => {
  let data = JSON.parse(event.data);

  const message = document.createElement('div');
  message.setAttribute('class', 'message');

  const messageUser = document.createElement('p');
  messageUser.setAttribute('class', 'message-user');
  messageUser.innerText = data["username"];
  message.append(messageUser);
  
  if(data["message"] != "" && data["image"] != ""){
    const messageText = document.createElement('p');
    messageText.setAttribute('class', 'message-text');
    messageText.innerText = data["message"];
    message.append(messageText);
    const messageImage = document.createElement('img');
    messageImage.setAttribute('class', 'message-image');
    messageImage.setAttribute('src', data["image"]);
    messageImage.setAttribute('height', '200px');
    message.append(messageImage); 
  } else if(data["message"] != "")  {  
    const messageText = document.createElement('p');
    messageText.setAttribute('class', 'message-text');
    messageText.innerText = data["message"];
    message.append(messageText);
  } else {
    const messageImage = document.createElement('img');
    messageImage.setAttribute('class', 'message-image');
    messageImage.setAttribute('src', data["image"]);
    messageImage.setAttribute('height', '200px');
    message.append(messageImage); 
  }

  messages.append(message);

  messages.scrollBy({
    top: message.clientHeight + 50, //投稿分スクロール
    // top: messages.clientHeight, //最下部までスクロール
    behavior: 'smooth'
  });
};