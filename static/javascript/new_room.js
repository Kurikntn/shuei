const roomNameInput = document.getElementById("room-name");
const newRoomSubmit = document.getElementById("new-room-submit");

roomNameInput.oninput = roomName;

function roomName(e) {
  if(e.target.value == ""){
    newRoomSubmit.disabled = true;
  } else {
    newRoomSubmit.disabled = false;
  }
}