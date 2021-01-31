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
}

window.addEventListener("load", newRoom);