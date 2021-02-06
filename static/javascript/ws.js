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

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let message = chatText.value;
    if(!message){
      return;
    }

    g_socket.send(
      JSON.stringify({ "message": message })
    );

    chatText.value = "";
});


const messages = document.getElementById("messages")

g_socket.onmessage = (event) => {
  let data = JSON.parse(event.data);

  const message = document.createElement('div');
  const messageUser = document.createElement('p');
  const messageText = document.createElement('p');

  message.setAttribute('class', 'message');
  messageUser.setAttribute('class', 'message-user');
  messageText.setAttribute('class', 'message-text');

  messageUser.innerText = data["username"];
  messageText.innerText = data["message"];

  message.append(messageUser);
  message.append(messageText);
  messages.append(message);
};