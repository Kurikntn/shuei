const roomNameInput = document.getElementById("room-name");
const newRoomSubmit = document.getElementById("new-room-submit");

roomNameInput.oninput = roomName;

function roomName(e) {
  if(e.target.value == ""){
    newRoomSubmit.disabled = true;
    newRoomSubmit.style.backgroundColor = "#aaa";
    newRoomSubmit.style.cursor = "default";
  } else {
    newRoomSubmit.disabled = false;
    newRoomSubmit.style.backgroundColor = "#1919fa";
    newRoomSubmit.style.cursor = "pointer";
  }
}
