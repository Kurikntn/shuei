function modal() {
  const overlay = document.querySelector(".overlay");


  if(!document.URL.match(/room/)){
    // 部屋を作るモーダル
    const newRoomButton = document.getElementById("new-room-btn");
    const newRoomModal = document.querySelector(".new-room-modal");
    const newRoomClose = document.querySelector(".new-room-close");

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


    // 部屋に入るモーダル
    const joinRoom = document.querySelectorAll(".join-room");
    const joinRoomModal = document.querySelector(".join-room-modal");
    const joinRoomClose = document.querySelector(".join-room-close");
    const joinRoomInfo = document.querySelectorAll(".join-room-info");

    // 部屋に入るモーダルを開く処理
    for(let i = 0; i < joinRoom.length; i++){
      joinRoom[i].addEventListener("click", () => {
        overlay.classList.add("open");
        joinRoomModal.classList.add("open");

        // 部屋に入るモーダルの表示内容を決める処理
        let joinRoomId = joinRoom[i].dataset.roomId;
        joinRoomInfo.forEach((room) => {
          if(room.dataset.roomId == joinRoomId){
            room.style.display = "block";
          } else {
            room.style.display = "none";
          }
        });
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


  // 部屋を閉めるモーダル
  if(document.URL.match(/room/)){
    const closeRoomButton = document.getElementById("chat-room-close");
    const closeRoomModal = document.querySelector(".close-room-modal");
    const closeRoomClose = document.querySelector(".close-room-close");

    // 部屋を閉めるモーダルを開く処理
    closeRoomButton.addEventListener("click", () => {
      overlay.classList.add("open");
      closeRoomModal.classList.add("open");
    });

    // 部屋を閉めるモーダルを閉じる処理
    closeRoomClose.addEventListener("click", () => {
      overlay.classList.remove("open");
      closeRoomModal.classList.remove("open");
    });
    overlay.addEventListener("click", () => {
      overlay.classList.remove("open");
      closeRoomModal.classList.remove("open");
    });
  }
}

window.addEventListener("load", modal);