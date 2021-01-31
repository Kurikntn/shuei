function newRoom() {
  const newRoomButton = document.getElementById("new-room-btn");
  const overlay = document.querySelector(".overlay");
  const newRoomModal = document.querySelector(".new-room-modal")
  const newRoomClose = document.querySelector(".new-room-close")

  // 部屋を作るモーダルを開く処理
  newRoomButton.addEventListener("click", () => {
    overlay.classList.add("open");
    newRoomModal.classList.add("open");
  });

  // 部屋を作るモーダルを閉じる処理
  newRoomClose.addEventListener("click", () => {
    overlay.classList.remove("open");
    newRoomModal.classList.remove("open");
  });
  overlay.addEventListener("click", () => {
    overlay.classList.remove("open");
    newRoomModal.classList.remove("open");
  });

  const joinRoom = document.querySelectorAll(".join-room");
  const joinRoomModal = document.querySelector(".join-room-modal");
  const joinRoomClose = document.querySelector(".join-room-close");

  // 部屋に入るモーダルを開く処理
  for(let i = 0; i < joinRoom.length; i++){
    joinRoom[i].addEventListener("click", () => {
      overlay.classList.add("open");
      joinRoomModal.classList.add("open");
    });
  }

  // 部屋に入るモーダルを閉じる処理
  joinRoomClose.addEventListener("click", () => {
    overlay.classList.remove("open");
    joinRoomModal.classList.remove("open");
  });
  overlay.addEventListener("click", () => {
    overlay.classList.remove("open");
    joinRoomModal.classList.remove("open");
  });
}

window.addEventListener("load", newRoom);